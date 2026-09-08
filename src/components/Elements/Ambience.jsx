import React, { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import useReducedMotion from "../../hooks/useReducedMotion";
import { SOUND_ON_LABEL, SOUND_OFF_LABEL } from "../../config/links";

/* Wind, generated rather than downloaded.
 *
 * There is no audio file: a few seconds of brown noise built at runtime,
 * pushed through a low-pass with a very slow gust on the gain. That is the
 * whole graph. It costs no request, no bytes in the bundle beyond this file,
 * and nothing on the main thread — Web Audio runs its own thread, so this
 * cannot make the page scroll worse, which was the bar for anything new here.
 *
 * Off by default, always. It only ever starts from a click, and if the tab is
 * not being looked at the context is suspended, so it never plays to nobody.
 *
 * The preference is remembered, but a remembered "on" does NOT autoplay on
 * the next visit: browsers block that, and they are right to. It arms
 * instead, and starts on the first click or keypress — see `arm`.
 */

/* Quiet. This is a bed you notice when it stops, not a soundtrack. */
const LEVEL = 0.11;
const FADE_IN = 1.6;
const FADE_OUT = 0.6;
const LOOP_SECONDS = 6;
const SEAM = 0.25;

const KEY = "em.ambience.v1";

const readPref = () => {
  try {
    return window.localStorage.getItem(KEY) === "on";
  } catch (error) {
    return false;
  }
};

const writePref = (on) => {
  try {
    window.localStorage.setItem(KEY, on ? "on" : "off");
  } catch (error) {
    /* Nothing here depends on it sticking. */
  }
};

/* Brown noise, with the tail crossfaded into the head so the loop point is
   not an audible click. Built once per switch-on and thrown away with the
   context. */
function windBuffer(context) {
  const rate = context.sampleRate;
  const length = Math.floor(rate * LOOP_SECONDS);
  const seam = Math.floor(rate * SEAM);
  const raw = new Float32Array(length + seam);

  let last = 0;
  for (let i = 0; i < raw.length; i += 1) {
    const white = Math.random() * 2 - 1;
    last = (last + 0.02 * white) / 1.02;
    raw[i] = last * 3.4;
  }
  for (let i = 0; i < seam; i += 1) {
    const t = i / seam;
    raw[i] = raw[i] * t + raw[length + i] * (1 - t);
  }

  const buffer = context.createBuffer(1, length, rate);
  buffer.getChannelData(0).set(raw.subarray(0, length));
  return buffer;
}

export default function Ambience() {
  const [on, setOn] = useState(false);
  const reduced = useReducedMotion();
  const rig = useRef(null);

  const teardown = useCallback(() => {
    const current = rig.current;
    if (!current) return;
    rig.current = null;
    const { context, master, source, lfo } = current;
    const now = context.currentTime;
    master.gain.cancelScheduledValues(now);
    master.gain.setValueAtTime(master.gain.value, now);
    master.gain.linearRampToValueAtTime(0, now + FADE_OUT);
    window.setTimeout(() => {
      try {
        source.stop();
        lfo.stop();
        context.close();
      } catch (error) {
        /* Already gone. */
      }
    }, FADE_OUT * 1000 + 80);
  }, []);

  const build = useCallback(() => {
    if (rig.current) return;
    const Ctor = window.AudioContext || window.webkitAudioContext;
    if (!Ctor) return;
    const context = new Ctor();

    const source = context.createBufferSource();
    source.buffer = windBuffer(context);
    source.loop = true;

    // Most of the noise taken off the top: this should sit under the page,
    // not hiss on top of it.
    const shape = context.createBiquadFilter();
    shape.type = "lowpass";
    shape.frequency.value = 420;
    shape.Q.value = 0.7;

    // The gust. One very slow sine on the gain is the whole weather system.
    const gust = context.createGain();
    gust.gain.value = 0.62;
    const lfo = context.createOscillator();
    lfo.frequency.value = 0.055;
    const lfoDepth = context.createGain();
    lfoDepth.gain.value = 0.34;
    lfo.connect(lfoDepth).connect(gust.gain);

    const master = context.createGain();
    master.gain.value = 0;

    source.connect(shape).connect(gust).connect(master).connect(context.destination);
    source.start();
    lfo.start();

    /* setValueAtTime first: a linear ramp with no preceding event has to
       infer where it is ramping from, and browsers do not agree on the
       answer. And resume() because a context can still come up suspended
       even when it was built inside a gesture — Safari does this. */
    const now = context.currentTime;
    master.gain.setValueAtTime(0, now);
    master.gain.linearRampToValueAtTime(LEVEL, now + FADE_IN);
    if (context.state === "suspended") context.resume();

    rig.current = { context, master, source, lfo };
  }, []);

  /* A remembered "on" arms rather than plays. The listeners are one-shot and
     removed either way, so an armed page that is never clicked costs nothing
     but two idle listeners. */
  useEffect(() => {
    if (reduced) return undefined;
    if (!readPref()) return undefined;
    setOn(true);

    let armed = true;
    const fire = () => {
      if (!armed) return;
      armed = false;
      build();
      window.removeEventListener("pointerdown", fire);
      window.removeEventListener("keydown", fire);
    };
    window.addEventListener("pointerdown", fire, { once: true, passive: true });
    window.addEventListener("keydown", fire, { once: true });
    return () => {
      armed = false;
      window.removeEventListener("pointerdown", fire);
      window.removeEventListener("keydown", fire);
    };
  }, [reduced, build]);

  /* Nothing should be playing to a tab nobody is looking at. */
  useEffect(() => {
    const onVisibility = () => {
      const current = rig.current;
      if (!current) return;
      if (document.hidden) current.context.suspend();
      else current.context.resume();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  useEffect(() => teardown, [teardown]);

  const toggle = () => {
    const next = !on;
    setOn(next);
    writePref(next);
    if (next) build();
    else teardown();
  };

  // Reduced motion is also a request for a calmer page. Nothing to switch on.
  if (reduced) return null;

  return (
    <Button
      type="button"
      onClick={toggle}
      aria-pressed={on}
      aria-label={on ? SOUND_OFF_LABEL : SOUND_ON_LABEL}
      title={on ? SOUND_OFF_LABEL : SOUND_ON_LABEL}
      $on={on}
    >
      <svg viewBox="0 0 22 22" aria-hidden="true">
        {/* Three arcs of wind. They lift when it is on. */}
        <path d="M2,8 C6,5 10,5 14,8" />
        <path d="M2,13 C7,9.5 12,9.5 17,13" />
        <path d="M2,18 C6,15.5 10,15.5 14,18" />
      </svg>
    </Button>
  );
}

const Button = styled.button`
  position: fixed;
  right: 18px;
  bottom: 18px;
  z-index: 60;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  background: rgba(11, 14, 20, 0.86);
  border: 1px solid var(--hairline);
  border-radius: 50%;
  color: ${(props) => (props.$on ? "var(--ember)" : "var(--bone-faint)")};
  cursor: pointer;
  opacity: ${(props) => (props.$on ? 1 : 0.55)};
  transition: opacity 260ms var(--ease-soft), color 260ms var(--ease-soft),
    border-color 260ms var(--ease-soft);

  &:hover,
  &:focus-visible {
    opacity: 1;
    border-color: var(--hairline-strong);
  }

  svg {
    width: 20px;
    height: 20px;
    fill: none;
    stroke: currentColor;
    stroke-width: 1.6;
    stroke-linecap: round;
  }

  /* The middle arc runs when the wind is on, and only then. */
  svg path:nth-child(2) {
    animation: ${(props) => (props.$on ? "gustLine 4.5s ease-in-out infinite" : "none")};
  }

  @keyframes gustLine {
    0%, 100% { transform: translateX(0); opacity: 1; }
    50% { transform: translateX(1.4px); opacity: 0.72; }
  }

  @media (max-width: 560px) {
    right: 14px;
    bottom: 14px;
  }
`;
