import React from "react";
import styled from "styled-components";

/* The hem of the gate — the first screen's light, continuing past its edge.
 *
 * The hero has to clip itself: the sky sits at inset -4% and the ridge runs
 * from -3% to 103% so neither shows a border when the pointer parallax leans
 * them, and without `overflow: hidden` that overhang becomes horizontal
 * scroll. The cost is that everything the hero paints stops on one straight
 * line the full width of the page. Measured at 1440x900 the left edge went
 * #03050A to #0B0E14 across a single pixel row, and the village bloom is
 * `radial-gradient(... at 50% 100%)`, so its hottest point lands exactly on
 * the cut. You could see the line.
 *
 * Rather than lighten the hero to meet the page, this carries the hero down
 * into it: the ridge's dark and the village's warmth both decay over the top
 * of section 01, so you walk off the ridge into the dark with the fire still
 * behind you.
 *
 * Two details that matter:
 *
 *   It is a zero-height marker between the two sections rather than a band
 *   inside either of them. That welds it to the seam whatever the hero's
 *   height resolves to — 100svh, the short-laptop rule, or a phone with the
 *   URL bar open — with nothing to keep in sync.
 *
 *   The bloom is flatter than the one it continues, and about 60px wider on
 *   each side. The hero's version rides the ridge parallax and so slides up
 *   to 23px sideways under the pointer, which a soft continuation absorbs
 *   and a mirror image of it would show as a kink on the seam. Only 60px,
 *   though: at the first attempt this was 68% of the viewport against the
 *   hero's effective 49%, and the overhang put 0.03 of ember at x=200 where
 *   the hero has none — a 7/255 step in the opposite direction to the one
 *   being fixed.
 *
 *   z-index -2 puts it under the weather rather than over it. This is
 *   scenery — the same ridge and the same village as the hero — whereas the
 *   grain, the ash and the vignette at -1 are the lens the whole page is seen
 *   through. At -1 it measured right and looked wrong: the band buried the
 *   falling ash for the 340px below the seam, which is the one place a layer
 *   whose whole job is ash down the whole page must not go quiet. Nothing
 *   between these two and the root creates a stacking context — #root, body,
 *   html and main are all position:static or z-index:auto with no transform,
 *   filter, opacity or containment — so -2 under -1 is the paint order, not a
 *   coincidence of document order.
 *
 * All of this lives out here rather than in the template below because CSS
 * comments inside a styled template are string data: terser strips JS
 * comments but leaves those, and every visitor downloads them.
 */
export default function Horizon() {
  return <Band aria-hidden="true" />;
}

const Band = styled.div`
  position: relative;
  height: 0;
  z-index: -2;
  pointer-events: none;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 340px;
    background:
      radial-gradient(52% 100% at 50% 0%,
        rgba(232, 163, 61, 0.15),
        rgba(232, 163, 61, 0.04) 48%,
        transparent 76%),
      linear-gradient(180deg,
        rgba(3, 5, 10, 0.92) 0%,
        rgba(3, 5, 10, 0.5) 34%,
        rgba(3, 5, 10, 0) 100%);
  }
`;
