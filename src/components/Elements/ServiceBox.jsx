import React from "react";
import styled from "styled-components";

/* Custom line-vector icons — thin strokes, geometric HUD style, all currentColor
   so they inherit the cyan accent + glow. No external assets. */
const ICONS = {
  worlds: (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.6"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="24" cy="24" r="17" />
      <path d="M7 24h34M24 7c5 4.5 5 29.5 0 34M24 7c-5 4.5-5 29.5 0 34" />
      <path d="M11 15c4 2.4 22 2.4 26 0M11 33c4-2.4 22-2.4 26 0" />
    </svg>
  ),
  combat: (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.6"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M38 6l-18 18M14 22l4 4M22 14l4 4" />
      <path d="M6 38l7-2 22-22 3-8-8 3-22 22-2 7z" />
      <path d="M10 30l8 8" />
    </svg>
  ),
  choices: (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.6"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="10" r="4" />
      <path d="M12 14v9c0 3 2 5 5 5h9" />
      <circle cx="31" cy="28" r="4" />
      <path d="M12 24c0 6 3 10 8 12" />
      <circle cx="26" cy="38" r="4" />
    </svg>
  ),
  community: (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.6"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="24" cy="16" r="6" />
      <path d="M13 39c0-6 5-11 11-11s11 5 11 11" />
      <circle cx="9" cy="20" r="4" />
      <circle cx="39" cy="20" r="4" />
      <path d="M3 34c0-4 3-7 6-7M45 34c0-4-3-7-6-7" />
    </svg>
  ),
};

export default function ServiceBox({ icon, title, subtitle }) {
  const getIcon = ICONS[icon] || ICONS.worlds;

  return (
    <Wrapper className="flex flexColumn">
      <IconStyle className="flexCenter">{getIcon}</IconStyle>
      <TitleStyle className="font20 extraBold displayFont">{title}</TitleStyle>
      <SubtitleStyle className="font14">{subtitle}</SubtitleStyle>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
`;

const IconStyle = styled.div`
  width: 56px;
  height: 56px;
  color: var(--accent-2);
  filter: drop-shadow(0 0 10px var(--accent-glow));
  svg {
    width: 100%;
    height: 100%;
  }
  @media (max-width: 560px) {
    margin: 0 auto;
  }
`;

const TitleStyle = styled.h2`
  width: 100%;
  margin: 0;
  padding: 22px 0 12px 0;
  color: var(--text);
`;

const SubtitleStyle = styled.p`
  width: 100%;
  color: var(--text-muted);
  line-height: 1.6rem;
`;
