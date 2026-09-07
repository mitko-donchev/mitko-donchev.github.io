import React from "react";
import styled from "styled-components";
import { Link } from "react-scroll";
// Hooks
import useReducedMotion from "../../hooks/useReducedMotion";

/* A label and a line that keeps falling toward whatever is below.

   Two places on the page tell you to keep going — the bottom of the hero and
   the bottom of the gate — and both were carrying their own copy of the label,
   the line, the gradient and the keyframes. The one thing they disagreed about
   was the length of the line, so that is the one thing that is a prop.

   Placement stays with the caller: the hero pins its cue to the bottom of a
   full-height section, the gate stacks it under the copy. Only the cue itself
   lives here. */
export default function ScrollCue({ to, label, ariaLabel, length = 54 }) {
  const reduced = useReducedMotion();

  /* The href is what makes it a link. react-scroll renders a bare <a> without
     one unless it is passed, and an <a> with no href is not focusable — so the
     cue that exists to let you skip the scene could not be reached by anyone
     who was not scrolling. The nav does it this way too; react-scroll swallows
     the click and smooth-scrolls instead of jumping. */
  return (
    <Link
      to={to}
      href={`#${to}`}
      smooth
      offset={-80}
      className="pointer"
      aria-label={ariaLabel}
    >
      <Label>{label}</Label>
      <Line $length={length} $still={reduced} />
    </Link>
  );
}

const Label = styled.span`
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

const Line = styled.span`
  display: block;
  width: 1px;
  height: ${(props) => props.$length}px;
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
    animation: ${(props) => (props.$still ? "none" : "cueFall 2.6s ease-in-out infinite")};
  }

  @keyframes cueFall {
    0% { transform: translateY(-100%); opacity: 0; }
    30% { opacity: 1; }
    100% { transform: translateY(250%); opacity: 0; }
  }
`;
