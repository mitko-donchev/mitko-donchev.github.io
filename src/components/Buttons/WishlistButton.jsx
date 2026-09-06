import React from "react";
import styled from "styled-components";
// Config
import { STEAM_URL, CTA_WISHLIST } from "../../config/links";

/* The one thing on the page we actually want pressed.

   It is the only filled surface on the site, so it does not need to shout —
   it needs to look like it is worth something. The face is struck gold: a
   gradient wide enough that moving it reads as light travelling across metal
   rather than as a colour change, with a narrow specular band that crosses
   every few seconds and an engraved bevel around the inside edge. The corner
   ticks are the same hand as the section brackets, and they open outward when
   the pointer arrives.

   It is an anchor, not a button with a click handler: it goes somewhere, so
   middle-click, ctrl-click and "copy link address" all do the obvious thing. */
export default function WishlistButton({ label = CTA_WISHLIST, href = STEAM_URL }) {
  return (
    <Frame>
      <Halo aria-hidden="true" />
      <Plate href={href} target="_blank" rel="noopener noreferrer">
        <Tick $corner="tl" aria-hidden="true" />
        <Tick $corner="tr" aria-hidden="true" />
        <Tick $corner="bl" aria-hidden="true" />
        <Tick $corner="br" aria-hidden="true" />
        <Sheen aria-hidden="true" />
        <Content>
          <SteamMark />
          <Label>{label}</Label>
        </Content>
      </Plate>
    </Frame>
  );
}

/* Drawn in the same thin line-work as the waypoint glyphs rather than dropped
   in as an image, so it sits in the page's hand: the planet, the valve wheel,
   and the thing on the end of the lever. */
export function SteamMark({ size = 18 }) {
  return (
    <Mark
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      aria-hidden="true"
    >
      {/* The planet */}
      <circle cx="11.6" cy="12.4" r="9.9" strokeWidth="1.5" />
      {/* The lever, drawn only where it shows between the two ends */}
      <line x1="9.4" y1="14.6" x2="13.2" y2="10.9" strokeWidth="1.5" />
      {/* The valve wheel — big enough to read, and it breaks the planet's rim */}
      <circle cx="16.5" cy="7.7" r="4.5" strokeWidth="1.9" />
      {/* And the thing on the other end */}
      <circle cx="7.4" cy="16.6" r="3" fill="currentColor" stroke="none" />
    </Mark>
  );
}

/* --- styles --------------------------------------------------------------- */

/* Ember pooling under the plate. It breathes slowly so the button is never
   quite still, and blooms when the pointer is on it. */
const Halo = styled.span`
  position: absolute;
  left: 8%;
  right: 8%;
  top: 20%;
  bottom: -30%;
  background: radial-gradient(60% 70% at 50% 50%, rgba(232, 163, 61, 0.5), transparent 70%);
  filter: blur(16px);
  opacity: 0.45;
  pointer-events: none;

  /* Breathes on transform, not opacity — opacity is what hover changes, and
     a running animation would win over it. */
  animation: haloBreathe 5.5s ease-in-out infinite;
  transition: opacity 0.4s var(--ease-soft);

  @keyframes haloBreathe {
    0%, 100% { transform: scale(0.92); }
    50% { transform: scale(1.06); }
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

/* The specular band. Idle it crosses every six and a half seconds; the rest of
   the cycle it is parked off the left edge doing nothing. */
const Sheen = styled.span`
  position: absolute;
  top: 0;
  bottom: 0;
  left: -35%;
  width: 26%;
  background: linear-gradient(100deg, transparent, rgba(255, 253, 244, 0.6), transparent);
  transform: skewX(-16deg);
  pointer-events: none;
  animation: sheenPass 6.5s ease-in-out infinite;

  @keyframes sheenPass {
    0%, 64% { left: -35%; }
    90%, 100% { left: 125%; }
  }

  @media (prefers-reduced-motion: reduce) {
    display: none;
  }
`;

/* Four ticks engraved into the gold. --tick is set on the frame so all four
   open outward together. */
const Tick = styled.span`
  position: absolute;
  width: 9px;
  height: 9px;
  border: 1px solid rgba(30, 17, 3, 0.42);
  opacity: 0.7;
  pointer-events: none;
  transition: top 0.4s var(--ease-out), bottom 0.4s var(--ease-out),
    left 0.4s var(--ease-out), right 0.4s var(--ease-out),
    opacity 0.4s var(--ease-soft);

  ${(props) => props.$corner === "tl" && `
    top: var(--tick); left: var(--tick);
    border-right: 0; border-bottom: 0;
  `}
  ${(props) => props.$corner === "tr" && `
    top: var(--tick); right: var(--tick);
    border-left: 0; border-bottom: 0;
  `}
  ${(props) => props.$corner === "bl" && `
    bottom: var(--tick); left: var(--tick);
    border-right: 0; border-top: 0;
  `}
  ${(props) => props.$corner === "br" && `
    bottom: var(--tick); right: var(--tick);
    border-left: 0; border-top: 0;
  `}
`;

const Mark = styled.svg`
  flex: none;
  display: block;
`;

const Label = styled.span`
  font-family: 'Inter', sans-serif;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  white-space: nowrap;
`;

const Content = styled.span`
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 11px;
`;

const Plate = styled.a`
  position: relative;
  display: block;
  width: 100%;
  padding: 17px 22px;
  overflow: hidden;
  text-align: center;
  color: #16110A !important;

  /* Wide enough that shifting the position reads as light moving across a
     struck face rather than as the colour changing. */
  background-image: linear-gradient(
    102deg,
    #B9741F 0%,
    #E8A33D 14%,
    #FBE7BC 30%,
    #EFAF53 44%,
    #B9741F 56%,
    #E8A33D 72%,
    #FDEED0 88%,
    #D89232 100%
  );
  background-size: 250% 100%;
  /* Parked so the bright core sits mid-face; hover walks the second highlight
     across from the right. */
  background-position: 12% 50%;

  /* An engraved bevel: light along the top edge, shadow along the bottom. */
  box-shadow:
    inset 0 1px 0 rgba(255, 250, 236, 0.55),
    inset 0 -1px 0 rgba(74, 42, 6, 0.35),
    inset 0 0 0 1px rgba(45, 26, 4, 0.28),
    0 8px 30px rgba(232, 163, 61, 0.24);

  transition:
    background-position 0.9s var(--ease-out),
    box-shadow 0.4s var(--ease-soft),
    transform 0.35s var(--ease-out);

  &:focus-visible {
    /* The global ring is ember, which is invisible against this. */
    outline: 2px solid var(--bone);
    outline-offset: 3px;
  }

  &:active {
    transform: translateY(0);
    box-shadow:
      inset 0 2px 5px rgba(74, 42, 6, 0.4),
      inset 0 0 0 1px rgba(45, 26, 4, 0.34),
      0 4px 16px rgba(232, 163, 61, 0.26);
  }

  @media (max-width: 420px) {
    padding: 16px 14px;

    ${Label} {
      font-size: 0.66rem;
      letter-spacing: 0.14em;
    }
  }
`;

const Frame = styled.div`
  --tick: 7px;

  position: relative;
  width: 100%;

  &:hover {
    --tick: 4px;
  }

  &:hover ${Halo} {
    opacity: 0.85;
  }

  &:hover ${Tick} {
    opacity: 1;
  }

  &:hover ${Plate} {
    background-position: 88% 50%;
    transform: translateY(-2px);
    box-shadow:
      inset 0 1px 0 rgba(255, 250, 236, 0.7),
      inset 0 -1px 0 rgba(74, 42, 6, 0.35),
      inset 0 0 0 1px rgba(45, 26, 4, 0.32),
      0 12px 42px rgba(232, 163, 61, 0.45);
  }

  @media (prefers-reduced-motion: reduce) {
    &:hover ${Plate} {
      transform: none;
      background-position: 12% 50%;
    }
  }
`;
