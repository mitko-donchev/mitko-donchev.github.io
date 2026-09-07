import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import useReducedMotion from "../../hooks/useReducedMotion";

/* Embers lifting off an unseen fire below the fold.

   Each mote carries a depth in 0..1 that drives its size, speed, blur and
   opacity together — that single correlation is what reads as distance
   rather than as scattered dots. They rise, wander on a slow sine, flicker,
   and are recycled off the top.

   Costs are kept honest: the canvas is sized to devicePixelRatio (capped at
   2), the loop is suspended while the section is off-screen or the tab is
   hidden, and the whole component renders nothing at all under
   prefers-reduced-motion. */
export default function EmberField({ density = 1, className }) {
  const canvasRef = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return undefined;

    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const context = canvas.getContext("2d");
    if (!context) return undefined;

    let width = 0;
    let height = 0;
    let ratio = 1;
    let motes = [];
    let frame = 0;
    let running = true;
    let lastTime = performance.now();

    const random = (min, max) => min + Math.random() * (max - min);

    const spawn = (seedAnywhere) => {
      const depth = Math.random();
      return {
        depth,
        x: random(0, width),
        // Start spread through the field on first fill, at the base after.
        y: seedAnywhere ? random(0, height) : height + random(0, 60),
        radius: 0.4 + depth * 1.45,
        speed: 7 + depth * 26,
        drift: random(-9, 9),
        // Phase keeps the sine wander from syncing across the field.
        phase: random(0, Math.PI * 2),
        wobble: random(0.15, 0.5),
        flicker: random(0.6, 1.5),
        warmth: Math.random() < 0.14 ? "verdigris" : "ember",
      };
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const nextRatio = Math.min(window.devicePixelRatio || 1, 2);

      /* Bail on a no-op. The ResizeObserver below fires for changes that do
         not move these numbers, and re-seeding on each one would restart the
         field in front of the user. */
      if (
        Math.abs(rect.width - width) < 1 &&
        Math.abs(rect.height - height) < 1 &&
        nextRatio === ratio
      ) {
        return;
      }

      ratio = nextRatio;
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);

      // Tie the count to area so a phone is not asked to draw a desktop field.
      const count = Math.round((width * height) / 26000 * density);
      const target = Math.max(10, Math.min(64, count));
      motes = Array.from({ length: target }, () => spawn(true));
    };

    const draw = (now) => {
      const delta = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      context.clearRect(0, 0, width, height);
      context.globalCompositeOperation = "lighter";

      for (let index = 0; index < motes.length; index += 1) {
        const mote = motes[index];

        mote.y -= mote.speed * delta;
        mote.phase += mote.wobble * delta;
        mote.x += (mote.drift * delta) + Math.sin(mote.phase) * 0.35;

        if (mote.y < -20) {
          motes[index] = spawn(false);
          continue;
        }

        // Fade in off the base and out at the top, so nothing pops.
        const riseIn = Math.min(1, (height - mote.y) / 90);
        const fadeOut = Math.min(1, mote.y / (height * 0.55));
        const flicker = 0.72 + Math.sin(mote.phase * mote.flicker * 3) * 0.28;
        const alpha = (0.1 + mote.depth * 0.34) * riseIn * fadeOut * flicker;

        if (alpha <= 0.004) continue;

        const glow = context.createRadialGradient(
          mote.x, mote.y, 0,
          mote.x, mote.y, mote.radius * 6
        );
        const core = mote.warmth === "ember" ? "247, 206, 132" : "143, 216, 204";
        const halo = mote.warmth === "ember" ? "232, 163, 61" : "95, 182, 168";
        glow.addColorStop(0, `rgba(${core}, ${alpha})`);
        glow.addColorStop(0.32, `rgba(${halo}, ${alpha * 0.55})`);
        glow.addColorStop(1, `rgba(${halo}, 0)`);

        context.fillStyle = glow;
        context.beginPath();
        context.arc(mote.x, mote.y, mote.radius * 6, 0, Math.PI * 2);
        context.fill();
      }

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

    resize();
    frame = window.requestAnimationFrame(draw);

    const onResize = () => resize();
    const onVisibility = () => (document.hidden ? stop() : start());

    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);

    /* The element can change size without the window doing so — the hero grows
       a hundred pixels taller once the display face has loaded and the
       entrance transforms have settled. Watching only `window.resize` left the
       backing store measured against the old height, and the canvas was
       stretched to fit: the hero's embers were rendering 11.7% too tall,
       which on a circular mote is visible as an oval. */
    let sizeObserver;
    if (typeof ResizeObserver !== "undefined") {
      sizeObserver = new ResizeObserver(() => resize());
      sizeObserver.observe(canvas);
    }

    // Suspend entirely once the field scrolls away.
    let observer;
    if (typeof IntersectionObserver !== "undefined") {
      observer = new IntersectionObserver(
        ([entry]) => (entry.isIntersecting ? start() : stop()),
        { threshold: 0 }
      );
      observer.observe(canvas);
    }

    return () => {
      stop();
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      if (sizeObserver) sizeObserver.disconnect();
      if (observer) observer.disconnect();
    };
  }, [density, reduced]);

  if (reduced) return null;

  return <Canvas ref={canvasRef} className={className} aria-hidden="true" />;
}

const Canvas = styled.canvas`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  display: block;
`;
