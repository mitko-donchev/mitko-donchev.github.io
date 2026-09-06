import React from "react";
import styled from "styled-components";
import EmberField from "./EmberField";
import useReducedMotion from "../../hooks/useReducedMotion";

/* The village gate, seen head-on.

   It was a smooth round arch before, which read as a portal — a shape with no
   walls, no thickness and nothing behind it. A village gate is a building:
   two towers, a lower span between them, battlements along the top, a pointed
   arch cut through the middle, a portcullis raised into the head of it, and
   timber doors standing open against the jambs. A palisade runs off both
   sides into the dark, and two braziers burn on the road, because somebody
   down there is still keeping a light on.

   The road inside runs *toward* the viewer. You are always arriving. */

const GROUND = 470;

/* The stone, as one even-odd path: outer silhouette first, then the opening,
   so the arch is a genuine hole and not a shape painted over the veil. The
   outline steps — tower, lower span, tower — which is the whole difference
   between a gatehouse and a doorway. */
const BODY =
  "M34,470 L34,150 L134,150 L134,196 L306,196 L306,150 L406,150 L406,470 Z " +
  "M160,470 L160,320 Q160,252 220,232 Q280,252 280,320 L280,470 Z";

/* Merlons sit on top of the wall instead of being cut into the outline. The
   stone gradient is in user space, so they take the same light as the mass
   underneath and leave no seam where they meet it. */
const MERLONS = [
  ...[34, 62, 90, 118].map((x) => ({ x, y: 132 })),
  ...[306, 334, 362, 390].map((x) => ({ x, y: 132 })),
  ...[142, 170, 198, 226, 254, 282].map((x) => ({ x, y: 178 })),
];

const COURSES = [188, 226, 264, 302, 340, 378, 416];
const PORTCULLIS_BARS = [172, 190, 208, 226, 244, 262];
const BRAZIERS = [145, 295];

/* Stakes marching off both sides and thinning out, so the gate belongs to
   something rather than standing alone in the dark. */
const PALISADE = [
  ...[22, 10, -2, -14].map((x, index) => ({ x, top: 402 + (index % 2) * 7, fade: 0.5 - index * 0.11 })),
  ...[412, 424, 436, 448].map((x, index) => ({ x, top: 400 + (index % 2) * 8, fade: 0.5 - index * 0.11 })),
];

export default function Gate() {
  const reduced = useReducedMotion();

  return (
    <Frame>
      <Embers>
        <EmberField density={0.55} />
      </Embers>

      <Svg viewBox="0 0 440 500" role="img" aria-label="The village gate, standing open">
        <defs>
          <linearGradient id="gateVeil" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#E8A33D" stopOpacity="0.19" />
            <stop offset="45%" stopColor="#B9741F" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#0B0E14" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="gateStone" gradientUnits="userSpaceOnUse"
            x1="34" y1="130" x2="406" y2="470">
            <stop offset="0%" stopColor="#1C2433" />
            <stop offset="48%" stopColor="#121824" />
            <stop offset="100%" stopColor="#080B12" />
          </linearGradient>

          <linearGradient id="gateTimber" gradientUnits="userSpaceOnUse"
            x1="160" y1="0" x2="280" y2="0">
            <stop offset="0%" stopColor="#33251A" />
            <stop offset="100%" stopColor="#1A130D" />
          </linearGradient>

          <linearGradient id="gateRim" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#5FB6A8" stopOpacity="0.45" />
            <stop offset="38%" stopColor="#5FB6A8" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#E8A33D" stopOpacity="0.24" />
          </linearGradient>

          <radialGradient id="gateHalo" cx="0.5" cy="0.66" r="0.55">
            <stop offset="0%" stopColor="#E8A33D" stopOpacity="0.32" />
            <stop offset="100%" stopColor="#E8A33D" stopOpacity="0" />
          </radialGradient>

          {/* Falls the outer rim off into the dark rather than cutting a hard
              silhouette against the page. */}
          <radialGradient id="gateFalloff" cx="0.5" cy="0.66" r="0.6">
            <stop offset="42%" stopColor="#05070B" stopOpacity="0" />
            <stop offset="100%" stopColor="#05070B" stopOpacity="0.8" />
          </radialGradient>

          <radialGradient id="fireGlow">
            <stop offset="0%" stopColor="#F7CE84" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#E8A33D" stopOpacity="0" />
          </radialGradient>

          <clipPath id="gateOpening">
            <path d="M160,470 L160,320 Q160,252 220,232 Q280,252 280,320 L280,470 Z" />
          </clipPath>

          <clipPath id="gateBodyBox">
            <path d="M20,470 L20,120 L420,120 L420,470 Z" />
          </clipPath>
        </defs>

        {/* Light spilling out around the gatehouse */}
        <ellipse cx="220" cy="340" rx="212" ry="190" fill="url(#gateHalo)" />

        {/* --- The palisade, behind everything ------------------------------ */}
        <g stroke="rgba(237,230,216,0.16)" strokeWidth="1" fill="#0A0E16">
          {PALISADE.map((post) => (
            <path
              key={post.x}
              opacity={Math.max(0.12, post.fade)}
              d={`M${post.x},${GROUND} L${post.x},${post.top + 9}
                  L${post.x + 4},${post.top} L${post.x + 8},${post.top + 9}
                  L${post.x + 8},${GROUND} Z`}
            />
          ))}
        </g>

        {/* --- What is on the other side ------------------------------------ */}
        <g clipPath="url(#gateOpening)">
          <rect x="150" y="200" width="140" height="280" fill="url(#gateVeil)" />

          {/* The road, running out of the gate toward you. Perspective only:
              two edges to a vanishing point, and rungs widening as they come. */}
          <g stroke="rgba(247, 206, 132, 0.13)" strokeWidth="1" fill="none">
            <path d="M220,308 L176,470" />
            <path d="M220,308 L264,470" />
          </g>
          {[0.18, 0.33, 0.5, 0.7, 0.92].map((step) => {
            const y = 308 + step * 162;
            const halfWidth = step * 44;
            return (
              <line key={step} x1={220 - halfWidth} y1={y} x2={220 + halfWidth} y2={y}
                stroke="rgba(247, 206, 132, 0.1)" strokeWidth="1" />
            );
          })}

          <line x1="150" y1="308" x2="290" y2="308" stroke="rgba(247,206,132,0.12)" strokeWidth="1" />
          <VanishingPoint cx="220" cy="308" r="3" $still={reduced} />

          {/* The portcullis, raised into the head of the arch and left there. */}
          <g stroke="#2A2119" strokeWidth="3.4" strokeLinecap="square">
            {PORTCULLIS_BARS.map((x) => (
              <line key={x} x1={x} y1="212" x2={x} y2="306" />
            ))}
            <line x1="150" y1="248" x2="290" y2="248" strokeWidth="4" />
            <line x1="150" y1="280" x2="290" y2="280" strokeWidth="4" />
          </g>
          <g fill="#2A2119">
            {PORTCULLIS_BARS.map((x) => (
              <path key={x} d={`M${x - 3.4},306 L${x + 3.4},306 L${x},318 Z`} />
            ))}
          </g>
        </g>

        {/* --- The stone ---------------------------------------------------- */}
        <path fillRule="evenodd" fill="url(#gateStone)" d={BODY} />
        {MERLONS.map((merlon) => (
          <rect key={`${merlon.x}-${merlon.y}`} x={merlon.x} y={merlon.y}
            width="16" height="20" fill="url(#gateStone)" />
        ))}

        {/* Courses and staggered joints, dim enough to read as a wall rather
            than as a chart, and only on the tower faces. */}
        <g stroke="rgba(237,230,216,0.055)" strokeWidth="1">
          {COURSES.map((y, row) => (
            <React.Fragment key={y}>
              <line x1="34" y1={y} x2="134" y2={y} />
              <line x1="306" y1={y} x2="406" y2={y} />
              <line x1={row % 2 ? 60 : 84} y1={y} x2={row % 2 ? 60 : 84} y2={y + 38} />
              <line x1={row % 2 ? 108 : 84} y1={y} x2={row % 2 ? 108 : 84} y2={y + 38} />
              <line x1={row % 2 ? 332 : 356} y1={y} x2={row % 2 ? 332 : 356} y2={y + 38} />
              <line x1={row % 2 ? 380 : 356} y1={y} x2={row % 2 ? 380 : 356} y2={y + 38} />
            </React.Fragment>
          ))}
          {/* Corbel course carrying the battlements */}
          <line x1="34" y1="162" x2="134" y2="162" strokeWidth="1.2" />
          <line x1="306" y1="162" x2="406" y2="162" strokeWidth="1.2" />
          <line x1="134" y1="208" x2="306" y2="208" strokeWidth="1.2" />
        </g>

        {/* Cross-shaped arrow slits, one to a tower. */}
        <g fill="#05070B">
          {[84, 356].map((x) => (
            <React.Fragment key={x}>
              <rect x={x - 2.5} y="248" width="5" height="62" />
              <rect x={x - 11} y="272" width="22" height="5" />
            </React.Fragment>
          ))}
        </g>

        {/* Relieving arch over the opening, and rim light down the jambs. */}
        <path fill="none" stroke="rgba(237,230,216,0.09)" strokeWidth="1.2"
          d="M150,318 Q150,242 220,220 Q290,242 290,318" />
        <path fill="none" stroke="url(#gateRim)" strokeWidth="1.5"
          d="M160,470 L160,320 Q160,252 220,232 Q280,252 280,320 L280,470" />

        {/* Keystone, and the mark cut into it. */}
        <path d="M206,238 L234,238 L230,200 L210,200 Z" fill="#141A26"
          stroke="rgba(232,163,61,0.3)" strokeWidth="1" />
        <Rune $still={reduced}
          d="M220,206 L228,214 L220,222 L212,214 Z M220,222 L214,230 M220,222 L226,230" />

        {/* --- Timber doors, open against the jambs ------------------------- */}
        <g stroke="rgba(10,8,5,0.55)" strokeWidth="1">
          <path d="M160,318 L178,330 L178,458 L160,470 Z" fill="url(#gateTimber)" />
          <path d="M280,318 L262,330 L262,458 L280,470 Z" fill="url(#gateTimber)" />
        </g>
        <g stroke="rgba(237,230,216,0.09)" strokeWidth="1" fill="none">
          <path d="M166,323 L166,465M172,327 L172,461" />
          <path d="M274,323 L274,465M268,327 L268,461" />
          <path d="M160,356 L178,366M160,420 L178,428" />
          <path d="M280,356 L262,366M280,420 L262,428" />
        </g>

        {/* --- Braziers ----------------------------------------------------- */}
        {BRAZIERS.map((x, index) => (
          <g key={x}>
            <circle cx={x} cy="404" r="34" fill="url(#fireGlow)" />
            <g stroke="#2A2119" strokeWidth="2.4" strokeLinecap="round" fill="none">
              <path d={`M${x - 11},${GROUND} L${x},430`} />
              <path d={`M${x + 11},${GROUND} L${x},430`} />
              <path d={`M${x},${GROUND} L${x},430`} />
            </g>
            <path d={`M${x - 14},414 L${x + 14},414 L${x + 9},434 L${x - 9},434 Z`}
              fill="#1A130D" stroke="#3A2C1E" strokeWidth="1.4" />
            <Flame $still={reduced} $delay={index * 700}
              d={`M${x},376 Q${x + 9},396 ${x + 6},410 Q${x},418 ${x - 6},410 Q${x - 9},396 ${x},376 Z`} />
            <FlameCore $still={reduced} $delay={index * 700 + 260}
              d={`M${x},392 Q${x + 4},402 ${x + 2},409 Q${x},413 ${x - 2},409 Q${x - 4},402 ${x},392 Z`} />
          </g>
        ))}

        {/* Falloff last, over the stone, so nothing ends on a hard edge. */}
        <g clipPath="url(#gateBodyBox)">
          <rect x="0" y="0" width="440" height="500" fill="url(#gateFalloff)" />
        </g>

        {/* Ground */}
        <line x1="6" y1={GROUND} x2="434" y2={GROUND} stroke="rgba(237,230,216,0.1)" strokeWidth="1" />
      </Svg>
    </Frame>
  );
}

const Frame = styled.div`
  position: relative;
  width: 100%;
  max-width: 460px;
  margin: 0 auto;
`;

const Embers = styled.div`
  position: absolute;
  inset: -6% -12% 0 -12%;
  pointer-events: none;

  /* Once the gate has the full column the bleed would carry embers off the
     page, so below the breakpoint it stays inside its own box. */
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

/* Fire is never still and never regular. Two cycles of different length,
   offset per brazier, keep it from reading as a pulse. */
const Flame = styled.path`
  fill: #E8A33D;
  filter: drop-shadow(0 0 10px rgba(232, 163, 61, 0.75));
  transform-box: fill-box;
  transform-origin: 50% 100%;
  animation: ${(props) => (props.$still ? "none" : "flicker 2.3s ease-in-out infinite")};
  animation-delay: ${(props) => props.$delay}ms;

  @keyframes flicker {
    0%, 100% { transform: scale(1, 1); opacity: 0.86; }
    28% { transform: scale(0.9, 1.14); opacity: 1; }
    54% { transform: scale(1.07, 0.9); opacity: 0.78; }
    76% { transform: scale(0.95, 1.06); opacity: 0.95; }
  }
`;

const FlameCore = styled.path`
  fill: #FFF1D2;
  transform-box: fill-box;
  transform-origin: 50% 100%;
  animation: ${(props) => (props.$still ? "none" : "flickerCore 1.7s ease-in-out infinite")};
  animation-delay: ${(props) => props.$delay}ms;

  @keyframes flickerCore {
    0%, 100% { transform: scale(1, 0.94); opacity: 0.75; }
    40% { transform: scale(0.86, 1.16); opacity: 1; }
    70% { transform: scale(1.05, 0.9); opacity: 0.65; }
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
