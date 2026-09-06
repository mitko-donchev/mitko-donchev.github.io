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

/* The official Steam mark, unaltered.

   This used to be a redraw in the site's thin line-work, which was the nicer
   idea and the wrong call twice over. It did not read — the valve wheel broke
   the outer rim, so at 14-18px it came out as two overlapping bubbles and the
   word STEAM in the label was doing all the work. And Valve's brand guidelines
   ask for the logo to be used as supplied, which a hand redraw is not.

   So: the real geometry, filled rather than stroked, taking `currentColor` so
   it still sits on ink for the gold plate and on ember for the navbar. The
   path is the shape as published; do not tidy it. */
export function SteamMark({ size = 18 }) {
  return (
    <Mark
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658c.545-.371 1.203-.59 1.912-.59.063 0 .125.004.188.006l2.861-4.142V8.91c0-2.495 2.028-4.524 4.524-4.524 2.494 0 4.524 2.031 4.524 4.527s-2.03 4.525-4.524 4.525h-.105l-4.076 2.911c0 .052.004.105.004.159 0 1.875-1.515 3.396-3.39 3.396-1.635 0-3.016-1.173-3.331-2.727L.436 15.27C1.862 20.307 6.486 24 11.979 24c6.627 0 11.999-5.373 11.999-12S18.605 0 11.979 0zM7.54 18.21l-1.473-.61c.262.543.714.999 1.314 1.25 1.297.539 2.793-.076 3.332-1.375.263-.63.264-1.319.005-1.949s-.75-1.121-1.377-1.383c-.624-.26-1.29-.249-1.878-.03l1.523.63c.956.4 1.409 1.5 1.009 2.455-.397.957-1.497 1.41-2.454 1.012H7.54zm11.415-9.303c0-1.662-1.353-3.015-3.015-3.015-1.665 0-3.015 1.353-3.015 3.015 0 1.665 1.35 3.015 3.015 3.015 1.663 0 3.015-1.35 3.015-3.015zm-5.273-.005c0-1.252 1.013-2.266 2.265-2.266 1.249 0 2.266 1.014 2.266 2.266 0 1.251-1.017 2.265-2.266 2.265-1.253 0-2.265-1.014-2.265-2.265z" />
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
