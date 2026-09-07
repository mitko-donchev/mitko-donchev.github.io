import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import useReducedMotion from "../../hooks/useReducedMotion";
import Motes from "./Motes";

/* The page's weather. Four fixed layers over the base sky (body::before):

     mist    two slow, huge, blurred banks that drift against each other
     grain   a static film grain, so the dark never looks like flat #000
     motes   ash coming down the whole page, driven by the scroll
     vignette corners pulled down, keeping the eye centre-screen

   The mist also leans a few pixels against the pointer. It is deliberately
   under-powered — you should feel depth without being able to point at what
   moved. Written straight to a CSS variable through a rAF so the pointer
   never drives a React render. */
export default function Atmosphere() {
  const mistRef = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return undefined;

    const node = mistRef.current;
    if (!node) return undefined;

    let frame = 0;
    let running = false;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    /* Below this the lerp is writing sub-pixel changes nobody can see. */
    const SETTLED = 0.01;

    const tick = () => {
      // Critically damped enough to feel like weight rather than lag.
      currentX += (targetX - currentX) * 0.045;
      currentY += (targetY - currentY) * 0.045;
      node.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;

      /* Stop once it has caught up, rather than rescheduling forever. The
         loop used to run for the life of the page writing an identical
         transform 60 times a second — and on a touch device, where
         pointermove never fires at all, that was the entire lifetime. */
      if (
        Math.abs(targetX - currentX) < SETTLED &&
        Math.abs(targetY - currentY) < SETTLED
      ) {
        running = false;
        return;
      }
      frame = window.requestAnimationFrame(tick);
    };

    const wake = () => {
      if (running) return;
      running = true;
      frame = window.requestAnimationFrame(tick);
    };

    const onPointerMove = (event) => {
      // -1..1 from the centre of the viewport, scaled to a few pixels.
      targetX = (event.clientX / window.innerWidth - 0.5) * 26;
      targetY = (event.clientY / window.innerHeight - 0.5) * 18;
      wake();
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.cancelAnimationFrame(frame);
    };
  }, [reduced]);

  return (
    <>
      <Mist ref={mistRef} aria-hidden="true" $still={reduced} />
      <Grain aria-hidden="true" />
      <Motes />
      <Vignette aria-hidden="true" />
    </>
  );
}

const Layer = styled.div`
  position: fixed;
  inset: -12%;
  pointer-events: none;
  z-index: -2;
`;

/* Two banks at different speeds and directions. The parallax transform is
   written to the element itself, so the drift lives on a child to keep the
   two from fighting over `transform`. */
const Mist = styled(Layer)`
  will-change: transform;

  &::before,
  &::after {
    content: "";
    position: absolute;
    inset: -20%;
    background-repeat: no-repeat;
  }

  &::before {
    background-image:
      radial-gradient(38% 26% at 22% 32%, rgba(95, 182, 168, 0.11), transparent 70%),
      radial-gradient(46% 30% at 74% 62%, rgba(232, 163, 61, 0.10), transparent 72%);
    animation: ${(props) => (props.$still ? "none" : "mistA 46s ease-in-out infinite alternate")};
  }

  &::after {
    background-image:
      radial-gradient(52% 34% at 60% 20%, rgba(76, 92, 148, 0.13), transparent 74%),
      radial-gradient(40% 28% at 30% 82%, rgba(232, 163, 61, 0.07), transparent 70%);
    animation: ${(props) => (props.$still ? "none" : "mistB 64s ease-in-out infinite alternate")};
  }

  @keyframes mistA {
    from { transform: translate3d(-3%, 1%, 0) scale(1); }
    to   { transform: translate3d(4%, -2%, 0) scale(1.08); }
  }

  @keyframes mistB {
    from { transform: translate3d(2%, -1%, 0) scale(1.06); }
    to   { transform: translate3d(-4%, 3%, 0) scale(1); }
  }
`;

/* Film grain. Fractal noise baked into a data URI — no request, no library,
   and it is what stops the dark areas reading as dead flat fill. */
const Grain = styled(Layer)`
  z-index: -1;
  opacity: 0.05;
  mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)'/%3E%3C/svg%3E");
`;

const Vignette = styled(Layer)`
  z-index: -1;
  background: radial-gradient(120% 84% at 50% 44%, transparent 42%, rgba(4, 6, 10, 0.5) 84%, rgba(4, 6, 10, 0.78) 100%);
`;
