import React from "react";
import styled from "styled-components";
import EmberField from "./EmberField";
import useReducedMotion from "../../hooks/useReducedMotion";

/* The gate, seen head-on.

   It is the one image the whole game hangs on, so it is drawn rather than
   photographed: a stone arch cut as a single even-odd path, with the opening
   holding a warm veil, a road receding to a vanishing point, and a shimmer
   that crosses it every few seconds. Embers drift behind the whole thing and
   show through the hole.

   The road inside runs *toward* the viewer. You are always arriving. */
/* Chosen to sit between the road rungs behind them (288, 321, 361, 410, 470),
   so the eye never joins a course to a rung across the opening. */
const COURSES = [214, 262, 306, 344, 388, 438];

export default function Gate() {
  const reduced = useReducedMotion();

  return (
    <Frame>
      <Embers>
        <EmberField density={0.55} />
      </Embers>

      <Svg viewBox="0 0 400 500" role="img" aria-label="The village gate, standing open">
        <defs>
          <linearGradient id="gateVeil" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#E8A33D" stopOpacity="0.17" />
            <stop offset="42%" stopColor="#B9741F" stopOpacity="0.09" />
            <stop offset="100%" stopColor="#0B0E14" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="gateStone" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#1A2130" />
            <stop offset="52%" stopColor="#111722" />
            <stop offset="100%" stopColor="#080B12" />
          </linearGradient>

          {/* Darkens the outer rim so the arch has no hard silhouette against
              the page — it falls off into the same dark it stands in. */}
          <radialGradient id="gateFalloff" cx="0.5" cy="0.68" r="0.58">
            <stop offset="45%" stopColor="#05070B" stopOpacity="0" />
            <stop offset="100%" stopColor="#05070B" stopOpacity="0.85" />
          </radialGradient>

          <clipPath id="gateStoneShape">
            <path d="M46,486 L46,196 A154,154 0 0 1 354,196 L354,486 Z" />
          </clipPath>

          <linearGradient id="gateRim" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#5FB6A8" stopOpacity="0.5" />
            <stop offset="35%" stopColor="#5FB6A8" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#E8A33D" stopOpacity="0.22" />
          </linearGradient>

          <radialGradient id="gateHalo" cx="0.5" cy="0.66" r="0.55">
            <stop offset="0%" stopColor="#E8A33D" stopOpacity="0.36" />
            <stop offset="100%" stopColor="#E8A33D" stopOpacity="0" />
          </radialGradient>

          <clipPath id="gateOpening">
            <path d="M112,486 L112,206 A88,88 0 0 1 288,206 L288,486 Z" />
          </clipPath>
        </defs>

        {/* Light spilling out around the arch */}
        <ellipse cx="200" cy="330" rx="188" ry="182" fill="url(#gateHalo)" />

        {/* What is on the other side */}
        <g clipPath="url(#gateOpening)">
          <rect x="100" y="110" width="200" height="380" fill="url(#gateVeil)" />

          {/* The road, running out of the gate toward you. Perspective only —
              two edges to a vanishing point, and rungs that widen as they
              approach. */}
          <g stroke="rgba(247, 206, 132, 0.13)" strokeWidth="1" fill="none">
            <path d="M200,250 L128,486" />
            <path d="M200,250 L272,486" />
          </g>
          {[0.16, 0.3, 0.47, 0.68, 0.93].map((step) => {
            const y = 250 + step * 236;
            const halfWidth = step * 72;
            return (
              <line
                key={step}
                x1={200 - halfWidth}
                y1={y}
                x2={200 + halfWidth}
                y2={y}
                stroke="rgba(247, 206, 132, 0.1)"
                strokeWidth="1"
              />
            );
          })}

          {/* Horizon, and the vanishing point sitting on it */}
          <line x1="100" y1="250" x2="300" y2="250" stroke="rgba(247,206,132,0.12)" strokeWidth="1" />
          <VanishingPoint cx="200" cy="250" r="3" $still={reduced} />

          {/* A slow shimmer crossing the veil */}
          {!reduced && <Shimmer x="60" y="110" width="70" height="380" />}
        </g>

        {/* The stone. One path, even-odd, so the opening is a genuine hole
            rather than a shape painted over the veil. */}
        <path
          fillRule="evenodd"
          fill="url(#gateStone)"
          d="M46,486 L46,196 A154,154 0 0 1 354,196 L354,486 Z
             M112,486 L112,206 A88,88 0 0 1 288,206 L288,486 Z"
        />

        {/* Rim light down the inner edges */}
        <path
          fill="none"
          stroke="url(#gateRim)"
          strokeWidth="1.5"
          d="M112,486 L112,206 A88,88 0 0 1 288,206 L288,486"
        />

        {/* Courses in the stone. Dim, and broken by staggered joints — a run
            of unbroken lines reads as a chart, not as a wall. */}
        <g stroke="rgba(237,230,216,0.055)" strokeWidth="1">
          {COURSES.map((y, row) => (
            <React.Fragment key={y}>
              <line x1="46" y1={y} x2="112" y2={y} />
              <line x1="288" y1={y} x2="354" y2={y} />
              {/* Joints alternate each row, the way courses are laid. */}
              <line x1={row % 2 ? 79 : 62} y1={y} x2={row % 2 ? 79 : 62} y2={y + 34} />
              <line x1={row % 2 ? 321 : 338} y1={y} x2={row % 2 ? 321 : 338} y2={y + 34} />
            </React.Fragment>
          ))}
        </g>

        {/* Falloff, last so it sits over the stone and the courses. */}
        <g clipPath="url(#gateStoneShape)">
          <rect x="0" y="0" width="400" height="500" fill="url(#gateFalloff)" />
        </g>

        {/* Keystone */}
        <path
          d="M186,60 L214,60 L219,96 L181,96 Z"
          fill="#141A26"
          stroke="rgba(232,163,61,0.3)"
          strokeWidth="1"
        />
        <Rune
          d="M200,66 L210,76 L200,86 L190,76 Z M200,86 L192,96 M200,86 L208,96"
          $still={reduced}
        />

        {/* Ground */}
        <line x1="10" y1="486" x2="390" y2="486" stroke="rgba(237,230,216,0.1)" strokeWidth="1" />
      </Svg>
    </Frame>
  );
}

const Frame = styled.div`
  position: relative;
  width: 100%;
  max-width: 440px;
  margin: 0 auto;
`;

const Embers = styled.div`
  position: absolute;
  inset: -6% -12% 0 -12%;
  pointer-events: none;

  /* The bleed is there to keep embers from starting on a visible edge. Once
     the gate has the full column it would carry that bleed off the page, so
     below the breakpoint it stays inside its own box. */
  @media (max-width: 960px) {
    inset: -6% 0 0 0;
  }
`;

const Svg = styled.svg`
  position: relative;
  display: block;
  width: 100%;
  height: auto;
  overflow: visible;
  filter: drop-shadow(0 30px 60px rgba(0, 0, 0, 0.55));
`;

/* The far end of the road, pulsing like something is standing there. */
const VanishingPoint = styled.circle`
  fill: #FFF6E4;
  animation: ${(props) => (props.$still ? "none" : "vpBreathe 4.2s ease-in-out infinite")};

  @keyframes vpBreathe {
    0%, 100% { opacity: 0.35; r: 2.5; }
    50% { opacity: 1; r: 4.5; }
  }
`;

const Shimmer = styled.rect`
  fill: rgba(247, 206, 132, 0.09);
  filter: blur(9px);
  animation: sweep 7.5s ease-in-out infinite;

  @keyframes sweep {
    0%, 12% { transform: translateX(0); opacity: 0; }
    30% { opacity: 1; }
    70% { opacity: 1; }
    88%, 100% { transform: translateX(280px); opacity: 0; }
  }
`;

const Rune = styled.path`
  fill: none;
  stroke: var(--ember);
  stroke-width: 1.4;
  stroke-linecap: round;
  stroke-linejoin: round;
  animation: ${(props) => (props.$still ? "none" : "runeGlow 5.5s ease-in-out infinite")};

  @keyframes runeGlow {
    0%, 100% { opacity: 0.42; }
    50% { opacity: 0.95; }
  }
`;
