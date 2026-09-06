import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import { Link } from "react-scroll";
// Components
import Gate from "../Elements/Gate";
import EmberField from "../Elements/EmberField";
// Hooks
import useMediaQuery from "../../hooks/useMediaQuery";
import useReducedMotion from "../../hooks/useReducedMotion";
// Config
import { STACKED } from "../../config/breakpoints";
import { GATE_KICKER, GATE_BEATS, GATE_CUE } from "../../config/links";

/* The second beat of the page: you scroll, the doors open, and the site walks
   you in.

   A tall track with one pinned stage inside it. How far the page has travelled
   through the track is the only input, and everything below is a curve read off
   it — the doors, how fast the frame comes at you, how fast the village does
   not, which line is being said. Nothing is hijacked: the page scrolls at
   exactly the rate the user scrolls it, and the scene is just what is on screen
   while it does.

   The gate never knows any of this. It exposes paint() and this owns the
   choreography, which is the line between "how a hinge works" (artwork) and
   "when it opens" (page). */

/* Windows on the progress, as [start, end]. They overlap on purpose: the doors
   are still swinging when the camera starts moving, because a scene that waits
   for each beat to finish reads as a slideshow. */
const OPEN = [0.07, 0.52];
const PUSH = [0.34, 1];
const OPENING_OUT = [0.7, 0.92];
const EXIT = [0.86, 1];

/* Scale added by the far end of the push. The gap between the two is the whole
   illusion: at these rates the frame passes you at four times the rate the
   village grows, which is what walking through a gate does. A single rate — any
   single rate — is a zoom on a photograph. */
const FRAME_TRAVEL = 2.9;
const VILLAGE_TRAVEL = 0.42;

/* One window per line, padded past the ends so the first line is already up at
   rest and the last one leaves before the hand-off. The gaps between them are
   wider than two fades on purpose: three lines cross-fading in the same slot
   spend the overlap as one unreadable line on top of another. */
const BEAT_WINDOWS = [[-1, 0.28], [0.36, 0.56], [0.64, 0.92]];
const BEAT_FADE = 0.04;

/* Where the still frame sits for anyone who has asked the page to hold still:
   open, arrived, nothing moving. */
const AT_REST = {
  open: 0.66,
  gateScale: 1,
  gateFade: 1,
  villageScale: 1,
  villageFade: 1,
  openingFade: 0,
  driftX: 0,
  driftY: 0,
};

const clamp01 = (value) => (value < 0 ? 0 : value > 1 ? 1 : value);
const span = (value, from, to) => clamp01((value - from) / (to - from));
const ease = (t) => t * t * (3 - 2 * t);

export default function Threshold() {
  const reduced = useReducedMotion();
  const narrow = useMediaQuery(STACKED);

  const trackRef = useRef(null);
  const gateRef = useRef(null);
  const kickerRef = useRef(null);
  const cueRef = useRef(null);
  const veilRef = useRef(null);
  const beatRefs = useRef([]);

  useEffect(() => {
    const track = trackRef.current;
    const gate = gateRef.current;
    if (!track || !gate) return undefined;

    const paintCopy = (progress) => {
      beatRefs.current.forEach((node, index) => {
        if (!node) return;
        const [from, to] = BEAT_WINDOWS[index];
        node.style.opacity = String(
          Math.min(
            span(progress, from - BEAT_FADE, from + BEAT_FADE),
            1 - span(progress, to - BEAT_FADE, to + BEAT_FADE)
          )
        );
      });
      if (kickerRef.current) {
        kickerRef.current.style.opacity = String(1 - ease(span(progress, 0.02, 0.16)));
      }
      if (cueRef.current) {
        cueRef.current.style.opacity = String(1 - ease(span(progress, 0, 0.12)));
      }
      if (veilRef.current) {
        veilRef.current.style.opacity = String(ease(span(progress, EXIT[0], EXIT[1])) * 0.94);
      }
    };

    if (reduced) {
      gate.paint(AT_REST);
      /* One line, held. The kicker, the cue and the veil keep their resting
         CSS: running them through paintCopy would fade the cue out, and an
         invisible link that still takes focus is worse than no cue at all. */
      beatRefs.current.forEach((node, index) => {
        if (node) node.style.opacity = index === GATE_BEATS.length - 1 ? "1" : "0";
      });
      return undefined;
    }

    let frame = 0;
    let running = false;
    let pointerX = 0;
    let pointerY = 0;
    let driftX = 0;
    let driftY = 0;

    const paint = () => {
      const rect = track.getBoundingClientRect();
      // The stage is pinned for exactly (track - viewport) pixels, so that
      // travel is the whole of 0..1 and the scene lands at 1 as it unpins.
      const travel = rect.height - window.innerHeight;
      const progress = travel <= 0 ? 0 : clamp01(-rect.top / travel);

      const open = ease(span(progress, OPEN[0], OPEN[1]));
      const push = ease(span(progress, PUSH[0], PUSH[1]));
      const exit = ease(span(progress, EXIT[0], EXIT[1]));

      gate.paint({
        open,
        gateScale: 1 + push * FRAME_TRAVEL,
        gateFade: 1 - exit * 0.92,
        villageScale: 1 + push * VILLAGE_TRAVEL,
        // Barely there behind shut doors, and all the way up once they are not.
        villageFade: 0.16 + 0.84 * open,
        // Only once the posts have gone past the edge of the screen — before
        // that, lifting the mask spills the village around the outside.
        openingFade: ease(span(progress, OPENING_OUT[0], OPENING_OUT[1])),
        driftX,
        driftY,
      });
      paintCopy(progress);
    };

    const tick = () => {
      driftX += (pointerX - driftX) * 0.06;
      driftY += (pointerY - driftY) * 0.06;
      paint();
      frame = window.requestAnimationFrame(tick);
    };

    const start = () => {
      if (running) return;
      running = true;
      frame = window.requestAnimationFrame(tick);
    };

    const stop = () => {
      if (!running) return;
      running = false;
      window.cancelAnimationFrame(frame);
    };

    const onPointerMove = (event) => {
      pointerX = event.clientX / window.innerWidth - 0.5;
      pointerY = event.clientY / window.innerHeight - 0.5;
    };

    paint();
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    /* The scene is the most expensive thing on the page, so it only runs while
       it is on screen — and it is off screen for most of the page. */
    let observer;
    if (typeof IntersectionObserver === "undefined") {
      start();
    } else {
      observer = new IntersectionObserver(
        ([entry]) => (entry.isIntersecting ? start() : stop()),
        { threshold: 0 }
      );
      observer.observe(track);
    }

    return () => {
      stop();
      window.removeEventListener("pointermove", onPointerMove);
      if (observer) observer.disconnect();
    };
  }, [reduced, narrow]);

  return (
    <Track ref={trackRef} id="gate">
      <Stage>
        <Embers aria-hidden="true">
          <EmberField density={0.5} />
        </Embers>

        <Gate ref={gateRef} narrow={narrow} />

        <Veil ref={veilRef} aria-hidden="true" />

        <Copy className="container">
          <Kicker ref={kickerRef}>
            <span className="hudLabel">{GATE_KICKER}</span>
          </Kicker>

          <Foot>
            <Beats>
              {GATE_BEATS.map((line, index) => (
                <Beat
                  key={line}
                  className="loreFont"
                  ref={(node) => {
                    beatRefs.current[index] = node;
                  }}
                >
                  {line}
                </Beat>
              ))}
            </Beats>

            <Cue ref={cueRef}>
              <Link to="game" smooth offset={-80} className="pointer">
                <CueLabel>{GATE_CUE}</CueLabel>
                <CueLine />
              </Link>
            </Cue>
          </Foot>
        </Copy>
      </Stage>
    </Track>
  );
}

/* --- styles --------------------------------------------------------------- */

/* The track's only job is to be taller than the viewport. Everything past the
   first screenful is the scene's runtime. */
const Track = styled.div`
  position: relative;
  height: 250vh;

  @media (max-width: 860px) {
    height: 210vh;
  }

  /* Nothing is driven by scroll here, so there is nothing to give scroll room
     to. The stage becomes an ordinary block with the gate standing open. */
  @media (prefers-reduced-motion: reduce) {
    height: auto;
  }
`;

const Stage = styled.div`
  position: sticky;
  top: 0;
  height: 100vh;
  height: 100svh;
  overflow: hidden;

  @media (prefers-reduced-motion: reduce) {
    position: relative;
    height: 88vh;
    min-height: 520px;
  }
`;

const Embers = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
`;

/* The hand-off. Without it the stage unpins on a full-brightness village and
   the next section slides over the top of it like a dropped cut. */
const Veil = styled.div`
  position: absolute;
  inset: 0;
  background: var(--ink);
  opacity: 0;
  pointer-events: none;
  will-change: opacity;
`;

const Copy = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-top: clamp(96px, 13vh, 148px);
  padding-bottom: clamp(30px, 5vh, 56px);
  pointer-events: none;

  a {
    pointer-events: auto;
  }
`;

/* Top left, where the sky is: centred it would land on the roof. */
const Kicker = styled.div`
  will-change: opacity;
`;

const Foot = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 22px;
  text-align: center;

  /* The ground and the props are the busiest part of the picture, so the copy
     over them gets something to sit on. It paints before the text and after
     the gate, which is exactly where a scrim belongs — no z-index needed.

     Pulled out to the full viewport: its containing block is the copy column,
     which is a 1240px container, and a scrim that stops at the gutters shows
     its own two vertical edges across the artwork. */
  &::before {
    content: "";
    position: absolute;
    left: calc(50% - 50vw);
    right: calc(50% - 50vw);
    bottom: 0;
    height: 40%;
    background: linear-gradient(180deg, transparent, rgba(6, 8, 13, 0.6) 80%);
    pointer-events: none;
  }
`;

/* The three lines share one slot and cross-fade through it, so the block never
   changes height and nothing below it moves. */
const Beats = styled.div`
  position: relative;
  width: 100%;
  min-height: 5rem;
`;

const Beat = styled.p`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  max-width: 24ch;
  margin: 0 auto;
  font-size: clamp(1.5rem, 4.6vw, 2.3rem);
  line-height: 1.4;
  color: var(--bone);
  text-shadow: 0 0 44px rgba(232, 163, 61, 0.22), 0 2px 26px rgba(0, 0, 0, 0.7);
  opacity: 0;
  will-change: opacity;
`;

const Cue = styled.div`
  will-change: opacity;

  a {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }
`;

const CueLabel = styled.span`
  font-size: 0.62rem;
  font-weight: 500;
  letter-spacing: 0.32em;
  text-transform: uppercase;
  color: var(--bone-faint);
  transition: color 0.3s var(--ease-soft);

  a:hover & {
    color: var(--ember);
  }
`;

/* A line that keeps falling toward the road. */
const CueLine = styled.span`
  display: block;
  width: 1px;
  height: 44px;
  background: linear-gradient(180deg, transparent, var(--ember));
  position: relative;
  overflow: hidden;

  &::after {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 40%;
    background: linear-gradient(180deg, transparent, var(--ember-hot));
    animation: cueFall 2.6s ease-in-out infinite;
  }

  @keyframes cueFall {
    0% { transform: translateY(-100%); opacity: 0; }
    30% { opacity: 1; }
    100% { transform: translateY(250%); opacity: 0; }
  }
`;
