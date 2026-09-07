import React from "react";
import styled from "styled-components";
import useInView from "../../hooks/useInView";

/* The page's entrance. Content rises and fades the first time it is scrolled
   into view; `delay` staggers siblings so a row arrives as a sequence rather
   than as a block.

   One-shot on purpose — content that re-animates every time you scroll past
   reads as a gimmick rather than as the page arriving. The still frame is the
   finished state, so reduced-motion users and no-JS crawlers see everything. */
export default function Reveal({
  children,
  delay = 0,
  y = 24,
  blur = true,
  as,
  className,
  style,
  id,
}) {
  const [ref, inView] = useInView();

  return (
    <Shell
      ref={ref}
      as={as}
      id={id}
      className={className}
      style={style}
      $in={inView}
      $delay={delay}
      $y={y}
      $blur={blur}
    >
      {children}
    </Shell>
  );
}

/* `none`, not the zero-valued function.
 *
 * `filter: blur(0px)` and `transform: translate3d(0, 0, 0)` both look like
 * "off" and are not: a filter of any value forces a filter pass, and a 3D
 * transform of any value promotes the element to its own compositing layer.
 * Because this component is one-shot, every element it has ever revealed kept
 * both, for the life of the page. Counted on the live site after one scroll
 * to the bottom: 33 elements holding a no-op filter over 2.65 million CSS
 * pixels, which is ~10MB of layer memory at 2x and 33 filter passes a frame
 * that could not change anything.
 *
 * Both properties still animate. Interpolating to `none` is defined as
 * interpolating to the identity for that function, so the blur still eases
 * out and the rise still lands — the layer is simply dropped at the end
 * instead of being kept forever. */
const Shell = styled.div`
  opacity: ${(props) => (props.$in ? 1 : 0)};
  transform: ${(props) => (props.$in ? "none" : `translate3d(0, ${props.$y}px, 0)`)};
  filter: ${(props) => (props.$blur && !props.$in ? "blur(6px)" : "none")};
  transition:
    opacity 0.9s var(--ease-out) ${(props) => props.$delay}ms,
    transform 1.05s var(--ease-out) ${(props) => props.$delay}ms,
    filter 0.9s var(--ease-out) ${(props) => props.$delay}ms;

  @media (prefers-reduced-motion: reduce) {
    opacity: 1;
    transform: none;
    filter: none;
    transition: none;
  }
`;
