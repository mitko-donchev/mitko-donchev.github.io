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

const Shell = styled.div`
  opacity: ${(props) => (props.$in ? 1 : 0)};
  transform: translate3d(0, ${(props) => (props.$in ? 0 : props.$y)}px, 0);
  filter: ${(props) => (props.$blur && !props.$in ? "blur(6px)" : "blur(0px)")};
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
