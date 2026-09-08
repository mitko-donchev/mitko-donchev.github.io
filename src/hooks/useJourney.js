import { useEffect } from "react";

/* The page's light follows the road.
 *
 * The village is warm, the road out is not, and it warms again when you get
 * to the studio at the bottom. Nothing says so — you just arrive at the end
 * feeling like you went somewhere and came back.
 *
 * Written to one custom property on the root and read by the two atmosphere
 * layers that already exist, so this adds no element and no compositing
 * layer: it is an opacity crossfade on layers the compositor is already
 * holding. It fires about four times per page rather than per frame.
 *
 * Skipped entirely under reduced motion. A slow change in brightness is not
 * vestibular, but making it instant instead would be worse than leaving the
 * page at its normal light, which is what happens here. */
const STOPS = [
  ["home", 1],
  ["game", 0.45],
  ["features", 0.6],
  ["studio", 0.95],
];

export default function useJourney(enabled = true) {
  useEffect(() => {
    if (!enabled) return undefined;
    if (typeof IntersectionObserver === "undefined") return undefined;

    const root = document.documentElement;
    const warmth = new Map();
    const sections = [];

    for (const [id, value] of STOPS) {
      const node = document.getElementById(id);
      if (!node) continue;
      warmth.set(node, value);
      sections.push(node);
    }
    if (!sections.length) return undefined;

    /* A band across the middle of the viewport, so the section that owns the
       light is the one you are actually looking at — not whichever happens to
       have a pixel on screen. Between sections nothing intersects and the
       last value simply stays, which is the behaviour we want at the seams. */
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          root.style.setProperty("--warmth", String(warmth.get(entry.target)));
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );

    sections.forEach((node) => observer.observe(node));
    return () => {
      observer.disconnect();
      root.style.removeProperty("--warmth");
    };
  }, [enabled]);
}
