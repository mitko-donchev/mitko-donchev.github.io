import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import useReducedMotion from "../../hooks/useReducedMotion";

/* Ash and dust coming down the whole page.
 *
 * Deliberately NOT <EmberField />, and not worth merging with it: that one is
 * absolutely positioned inside the gate, rises off an unseen fire, and
 * suspends the moment it scrolls away. This is fixed to the viewport, falls,
 * is alive for the entire page, and is coupled to the scroll. Folding the two
 * together would mean branching on direction, positioning and lifecycle
 * inside a per-frame loop to save a canvas-sizing helper.
 *
 * Three things give it a sense of weather rather than of falling dots:
 *
 *   depth    one 0..1 value drives size, speed, brightness and drift together.
 *            That single correlation is what reads as distance.
 *   jitter   a per-mote speed multiplier, plus a slow sine on top, so a mote
 *            visibly quickens and eases as it comes down instead of tracking a
 *            constant. Neighbours are never in step.
 *   gust     the scroll pushes them down and then decays, so a flick leaves
 *            the air still settling for about a second afterwards. Deep motes
 *            take more of the push than distant ones.
 *
 * Cost is the whole design constraint here, because unlike the gate's embers
 * this layer is on screen the entire time:
 *
 *   - Each mote is one pre-rendered sprite drawn with drawImage, NOT a
 *     createRadialGradient per mote per frame. At ~65 motes that is the
 *     difference between 65 gradient allocations every frame and zero.
 *   - The backing store is capped at 1.5x rather than 2x. These are soft
 *     glows with no edge to sharpen, and full-viewport fill at 2x on a
 *     1440x900 screen means clearing 5.2M pixels a frame for nothing.
 *   - It stops dead when the tab is hidden.
 *   - Under prefers-reduced-motion it renders nothing at all.
 */

/* Sprite is drawn once at this size and scaled down per mote. 64 is enough
   that the largest mote never shows the sprite's own pixels. */
const SPRITE = 64;

/* px/s. The spread is wide on purpose — a narrow range reads as a single
   sheet of particles sliding down, which is the thing to avoid. */
const FALL_MIN = 8;
const FALL_RANGE = 44;

/* How hard the scroll drives the fall, and how fast that decays back to
   still. 0.35 puts a hard flick at roughly 150px/s of extra fall, against a
   base of 8-52 — clearly felt, still weather rather than a wind tunnel. */
const GUST_GAIN = 0.35;
const GUST_DECAY = 0.92;
const GUST_LIMIT = 600;

const random = (min, max) => min + Math.random() * (max - min);

/* One radial glow, baked. Two of these exist: warm ash and the cold
   counterweight. */
function makeSprite(core, halo) {
  const canvas = document.createElement("canvas");
  canvas.width = SPRITE;
  canvas.height = SPRITE;
  const context = canvas.getContext("2d");
  if (!context) return canvas;

  const middle = SPRITE / 2;
  const glow = context.createRadialGradient(middle, middle, 0, middle, middle, middle);
  glow.addColorStop(0, `rgba(${core}, 1)`);
  glow.addColorStop(0.3, `rgba(${halo}, 0.5)`);
  glow.addColorStop(1, `rgba(${halo}, 0)`);
  context.fillStyle = glow;
  context.fillRect(0, 0, SPRITE, SPRITE);
  return canvas;
}

export default function Motes({ density = 1 }) {
  const canvasRef = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return undefined;

    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const context = canvas.getContext("2d");
    if (!context) return undefined;

    const sprites = {
      ember: makeSprite("247, 206, 132", "232, 163, 61"),
      verdigris: makeSprite("143, 216, 204", "95, 182, 168"),
    };

    let width = 0;
    let height = 0;
    let motes = [];
    let frame = 0;
    let running = false;
    let lastTime = performance.now();

    let scrollY = window.scrollY;
    let pendingScroll = 0;
    let gust = 0;

    const spawn = (seedAnywhere) => {
      const depth = Math.random();
      return {
        depth,
        x: random(0, width),
        // Spread through the field on the first fill, above the top after.
        y: seedAnywhere ? random(0, height) : random(-80, -10),
        radius: 0.5 + depth * 1.7,
        speed: FALL_MIN + depth * FALL_RANGE,
        // The "randomly faster and slower" the effect is named for.
        jitter: random(0.55, 1.5),
        drift: random(-7, 7),
        phase: random(0, Math.PI * 2),
        wobble: random(0.12, 0.42),
        warmth: Math.random() < 0.12 ? "verdigris" : "ember",
      };
    };

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);

      // Tied to area, so a phone is never asked to draw a desktop field.
      const count = Math.round(((width * height) / 20000) * density);
      const target = Math.max(14, Math.min(80, count));
      motes = Array.from({ length: target }, () => spawn(true));
    };

    const draw = (now) => {
      // Clamped so a long frame (or a backgrounded tab) cannot teleport the
      // field the moment it comes back.
      const delta = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      gust += pendingScroll * GUST_GAIN;
      pendingScroll = 0;
      gust *= GUST_DECAY;
      if (gust > GUST_LIMIT) gust = GUST_LIMIT;
      if (gust < -GUST_LIMIT) gust = -GUST_LIMIT;

      context.clearRect(0, 0, width, height);
      context.globalCompositeOperation = "lighter";

      for (let index = 0; index < motes.length; index += 1) {
        const mote = motes[index];

        mote.phase += mote.wobble * delta;

        // Base fall, eased by its own slow sine, then the scroll's push —
        // weighted by depth so the near air moves more than the far air.
        const eased = mote.speed * mote.jitter * (1 + Math.sin(mote.phase * 0.7) * 0.35);
        mote.y += (eased + gust * (0.25 + mote.depth * 0.75)) * delta;
        mote.x += mote.drift * delta + Math.sin(mote.phase) * 0.3;

        if (mote.y > height + 40 || mote.y < -160) {
          motes[index] = spawn(false);
          continue;
        }
        // Wrap sideways rather than respawn: a mote vanishing mid-air reads
        // as a glitch, whereas drifting in from the other edge does not.
        if (mote.x < -20) mote.x = width + 20;
        else if (mote.x > width + 20) mote.x = -20;

        // Fade in from the top and out at the floor so nothing pops.
        const fadeIn = Math.min(1, (mote.y + 80) / 120);
        const fadeOut = Math.min(1, (height + 40 - mote.y) / 140);
        const alpha = (0.07 + mote.depth * 0.2) * fadeIn * fadeOut;
        if (alpha <= 0.006) continue;

        const size = mote.radius * 7;
        context.globalAlpha = alpha;
        context.drawImage(sprites[mote.warmth], mote.x - size, mote.y - size, size * 2, size * 2);
      }

      context.globalAlpha = 1;
      context.globalCompositeOperation = "source-over";
      frame = window.requestAnimationFrame(draw);
    };

    const start = () => {
      if (running) return;
      running = true;
      lastTime = performance.now();
      frame = window.requestAnimationFrame(draw);
    };

    const stop = () => {
      running = false;
      window.cancelAnimationFrame(frame);
    };

    /* The delta is banked here and consumed in the tick. Doing the arithmetic
       in the listener would run it several times per frame on a trackpad for
       a value only the frame can use. */
    const onScroll = () => {
      const next = window.scrollY;
      pendingScroll += next - scrollY;
      scrollY = next;
    };

    const onResize = () => resize();
    const onVisibility = () => (document.hidden ? stop() : start());

    resize();
    start();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [density, reduced]);

  if (reduced) return null;

  return <Canvas ref={canvasRef} aria-hidden="true" />;
}

/* Fixed rather than tall: one viewport of canvas serves the whole page, so
   the cost does not grow with the document. Sits with the grain, under the
   vignette, so the corners pull the motes down with everything else. */
const Canvas = styled.canvas`
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  pointer-events: none;
  display: block;
`;
