import React, { useEffect, useRef } from "react";
import styled from "styled-components";

/* A hairline of ember across the top of the page, filling as you go. It is
   also the loop's own progress bar — by the time it reaches the right edge
   you are at the studio, having walked back to where you started.

   Scroll is read inside a rAF and written straight to the element's transform,
   so a fast scroll never queues a render per frame. */
export default function ScrollProgress() {
  const barRef = useRef(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return undefined;

    let frame = 0;
    let queued = false;

    const update = () => {
      queued = false;
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
      bar.style.transform = `scaleX(${Math.min(1, Math.max(0, progress))})`;
    };

    const onScroll = () => {
      if (queued) return;
      queued = true;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <Track aria-hidden="true">
      <Bar ref={barRef} />
    </Track>
  );
}

const Track = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 2px;
  z-index: 1000;
  pointer-events: none;
  background: rgba(237, 230, 216, 0.05);
`;

const Bar = styled.div`
  height: 100%;
  width: 100%;
  transform: scaleX(0);
  transform-origin: 0 50%;
  background: linear-gradient(90deg, var(--ember-deep), var(--ember) 45%, var(--ember-hot));
  box-shadow: 0 0 12px var(--ember-glow);
`;
