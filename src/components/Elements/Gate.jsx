import React from "react";
import styled from "styled-components";
import EmberField from "./EmberField";
import useReducedMotion from "../../hooks/useReducedMotion";
import { GAME_NAME } from "../../config/links";

/* The village gate, seen head-on.

   Not a portal and not a gatehouse: a trestle gate. Two heavy posts, one
   crossbeam notched over them, knee braces, iron straps at the joints. The
   kind of thing a dozen families put up in an afternoon out of whatever the
   woods gave them — no masonry anywhere, because this is a village and not a
   town. The sign board above it is the focal point and carries the name.

   A palisade runs off both sides into the dark so the gate belongs to
   something. Two braziers burn on the road and two lanterns hang under the
   beam, throwing the light that catches the carved letters from below.

   The road inside runs *toward* the viewer. You are always arriving. */

const GROUND = 380;

/* Everything is hewn rather than sawn, so no edge is quite parallel to any
   other. The small offsets below are the whole difference between "timber"
   and "brown rectangle". */
const LEFT_POST = "M149,136 L194,138 L196,258 L197,380 L145,380 L147,256 Z";
const RIGHT_POST = "M406,138 L451,136 L453,256 L455,380 L403,380 L404,258 Z";

/* Chamfered at both ends, the way a beam is dressed where it overhangs. */
const CROSSBEAM =
  "M124,153 L137,147 L463,146 L476,152 L476,181 L463,187 L137,186 L124,180 Z";

/* Braces are drawn before the posts and the beam so they tuck into the
   joints instead of sitting on top of them. */
const BRACES = [
  "M192,278 L276,178 L288,188 L204,288 Z",
  "M408,278 L324,178 L312,188 L396,288 Z",
];

/* The board. Live edges, a slight bow, wider than it is deep — read first,
   read from across the road. */
const SIGN = "M154,44 L300,40 L446,45 L448,120 L300,126 L152,119 Z";

const BRAZIERS = [112, 488];

/* Stakes marching off both sides and thinning out. Wood, like everything
   else, now that the stone is gone. */
const PALISADE = [
  ...[132, 110, 88, 64, 40, 16].map((x, index) => ({
    x,
    top: 286 + (index % 2) * 9,
    fade: 0.55 - index * 0.09,
  })),
  ...[452, 474, 496, 520, 546, 572].map((x, index) => ({
    x,
    top: 288 + (index % 2) * 9,
    fade: 0.55 - index * 0.09,
  })),
];

export default function Gate() {
  const reduced = useReducedMotion();

  return (
    <Frame>
      <Embers>
        <EmberField density={0.55} />
      </Embers>

      <Svg
        viewBox="0 0 600 420"
        role="img"
        aria-label={`The village gate, standing open beneath a carved ${GAME_NAME} sign`}
      >
        <defs>
          <linearGradient id="gateVeil" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#E8A33D" stopOpacity="0.19" />
            <stop offset="45%" stopColor="#B9741F" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#0B0E14" stopOpacity="0" />
          </linearGradient>

          {/* One gradient in user space for every piece of timber, so the
              posts, the beam and the braces all take the same light and the
              joints show no seam. */}
          <linearGradient id="gateTimber" gradientUnits="userSpaceOnUse"
            x1="124" y1="130" x2="476" y2="380">
            <stop offset="0%" stopColor="#453220" />
            <stop offset="52%" stopColor="#2F2216" />
            <stop offset="100%" stopColor="#1F1710" />
          </linearGradient>

          <linearGradient id="gateTimberDark" gradientUnits="userSpaceOnUse"
            x1="0" y1="280" x2="0" y2="380">
            <stop offset="0%" stopColor="#1E1610" />
            <stop offset="100%" stopColor="#0D0A07" />
          </linearGradient>

          {/* The board is the one thing the fire is allowed to reach. */}
          <linearGradient id="signBoard" gradientUnits="userSpaceOnUse"
            x1="152" y1="126" x2="152" y2="40">
            <stop offset="0%" stopColor="#4A3624" />
            <stop offset="55%" stopColor="#33251A" />
            <stop offset="100%" stopColor="#241A12" />
          </linearGradient>

          <linearGradient id="signLetter" gradientUnits="userSpaceOnUse"
            x1="152" y1="110" x2="448" y2="56">
            <stop offset="0%" stopColor="#C98A2E" />
            <stop offset="26%" stopColor="#F7CE84" />
            <stop offset="52%" stopColor="#FBE7BC" />
            <stop offset="74%" stopColor="#E8A33D" />
            <stop offset="100%" stopColor="#B9741F" />
          </linearGradient>

          {/* The only light in the scene comes off the road and the fires, so
              the rim on the inner faces climbs from the ground and dies out
              before it reaches the beam. */}
          <linearGradient id="gateRim" gradientUnits="userSpaceOnUse"
            x1="0" y1="380" x2="0" y2="196">
            <stop offset="0%" stopColor="#F7CE84" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#E8A33D" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="gateDoor" gradientUnits="userSpaceOnUse"
            x1="0" y1="222" x2="0" y2="380">
            <stop offset="0%" stopColor="#2A1E15" />
            <stop offset="100%" stopColor="#150F0A" />
          </linearGradient>

          {/* Same rule as the sign glow: centred and r=0.5, so it reaches zero
              on the ellipse edge instead of being cut off there. */}
          <radialGradient id="gateHalo" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="#E8A33D" stopOpacity="0.4" />
            <stop offset="62%" stopColor="#B9741F" stopOpacity="0.13" />
            <stop offset="100%" stopColor="#E8A33D" stopOpacity="0" />
          </radialGradient>

          {/* The lanterns washing the board from underneath. Centre and radius
              are both 0.5 so the falloff reaches zero exactly at the edge of
              the ellipse — anything shorter clips, and a clipped glow shows a
              hard arc across the beam. The bias is in where the ellipse sits,
              not in the gradient. */}
          <radialGradient id="signGlow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="#E8A33D" stopOpacity="0.32" />
            <stop offset="55%" stopColor="#B9741F" stopOpacity="0.11" />
            <stop offset="100%" stopColor="#E8A33D" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="fireGlow">
            <stop offset="0%" stopColor="#F7CE84" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#E8A33D" stopOpacity="0" />
          </radialGradient>

          <clipPath id="gateOpening">
            <rect x="194" y="140" width="212" height="240" />
          </clipPath>
        </defs>

        {/* Light spilling out around the gate. Kept inside the viewBox: the
            svg is overflow:visible, so anything hanging past the bottom edge
            floats free below the ground line with nothing to sit on. */}
        <ellipse cx="300" cy="250" rx="292" ry="170" fill="url(#gateHalo)" />

        {/* --- The palisade, behind everything ------------------------------ */}
        {/* Barely edged — a lit outline turns stakes into a picket fence. */}
        <g stroke="rgba(237,230,216,0.07)" strokeWidth="1" fill="url(#gateTimberDark)">
          {PALISADE.map((stake) => (
            <path
              key={stake.x}
              opacity={Math.max(0.12, stake.fade)}
              d={`M${stake.x},${GROUND} L${stake.x},${stake.top + 11}
                  L${stake.x + 7},${stake.top} L${stake.x + 14},${stake.top + 11}
                  L${stake.x + 14},${GROUND} Z`}
            />
          ))}
        </g>

        {/* --- What is on the other side ------------------------------------ */}
        <g clipPath="url(#gateOpening)">
          <rect x="190" y="180" width="220" height="200" fill="url(#gateVeil)" />

          {/* The road, running out of the gate toward you. Perspective only:
              two edges to a vanishing point, and rungs widening as they come. */}
          <g stroke="rgba(247, 206, 132, 0.13)" strokeWidth="1" fill="none">
            <path d="M300,248 L232,380" />
            <path d="M300,248 L368,380" />
          </g>
          {[0.18, 0.33, 0.5, 0.7, 0.92].map((step) => {
            const y = 248 + step * 132;
            const halfWidth = step * 68;
            return (
              <line key={step} x1={300 - halfWidth} y1={y} x2={300 + halfWidth} y2={y}
                stroke="rgba(247, 206, 132, 0.1)" strokeWidth="1" />
            );
          })}

          <line x1="194" y1="248" x2="406" y2="248" stroke="rgba(247,206,132,0.12)" strokeWidth="1" />
          <VanishingPoint cx="300" cy="248" r="3" $still={reduced} />
        </g>

        {/* --- The frame ---------------------------------------------------- */}
        {/* Braces first, so the posts and the beam close over their ends. */}
        <g fill="url(#gateTimber)" stroke="rgba(10,8,5,0.6)" strokeWidth="1">
          {BRACES.map((brace) => (
            <path key={brace} d={brace} />
          ))}
          <path d={LEFT_POST} />
          <path d={RIGHT_POST} />
          <path d={CROSSBEAM} />
        </g>

        {/* Grain, dim enough to read as wood rather than as a chart. */}
        <g stroke="rgba(237,230,216,0.055)" strokeWidth="1" fill="none">
          <path d="M160,142 Q157,258 161,376" />
          <path d="M176,142 Q180,254 175,376" />
          <path d="M186,142 Q183,260 187,376" />
          <path d="M414,142 Q411,258 415,376" />
          <path d="M428,142 Q432,254 427,376" />
          <path d="M440,142 Q437,260 441,376" />
          <path d="M132,160 Q300,164 468,159" />
          <path d="M132,174 Q300,170 468,175" />
        </g>

        {/* Iron straps and their nails, where a hewn frame actually needs
            them: over the post heads and at the ends of the beam. */}
        <g fill="#191310" stroke="rgba(237,230,216,0.1)" strokeWidth="0.8">
          <rect x="145" y="196" width="52" height="9" rx="1" />
          <rect x="403" y="196" width="52" height="9" rx="1" />
          <rect x="146" y="342" width="52" height="9" rx="1" />
          <rect x="403" y="342" width="52" height="9" rx="1" />
          <rect x="128" y="152" width="10" height="30" rx="1" />
          <rect x="462" y="152" width="10" height="30" rx="1" />
        </g>
        <g fill="rgba(237,230,216,0.22)">
          {[152, 190, 410, 448].map((x) => (
            <React.Fragment key={x}>
              <circle cx={x} cy="200.5" r="1.5" />
              <circle cx={x} cy="346.5" r="1.5" />
            </React.Fragment>
          ))}
          <circle cx="133" cy="158" r="1.5" />
          <circle cx="133" cy="176" r="1.5" />
          <circle cx="467" cy="158" r="1.5" />
          <circle cx="467" cy="176" r="1.5" />
        </g>

        {/* Rim light up the inner faces of the posts, and the underside of
            the braces catching the same glow off the road. */}
        <g fill="none" stroke="url(#gateRim)" strokeWidth="1.5">
          <path d="M195,380 L195,190" />
          <path d="M405,380 L405,190" />
        </g>
        <g fill="none" stroke="rgba(247,206,132,0.11)" strokeWidth="1">
          <path d="M204,288 L288,188" />
          <path d="M396,288 L312,188" />
        </g>

        {/* Somebody has been marking the post. Five to a gate, and more than
            one gate's worth. */}
        <Tally $still={reduced}
          d="M160,296 L160,320 M168,296 L168,320 M176,296 L176,320 M184,296 L184,320 M156,321 L188,294" />

        {/* --- The sign ----------------------------------------------------- */}
        {/* Glow before the board, so the lantern light sits behind and under
            it rather than washing over the letters. */}
        <ellipse cx="300" cy="142" rx="230" ry="122" fill="url(#signGlow)" />

        {/* Two short uprights carry it off the beam. */}
        <g fill="url(#gateTimber)" stroke="rgba(10,8,5,0.6)" strokeWidth="1">
          <rect x="214" y="112" width="19" height="42" />
          <rect x="367" y="112" width="19" height="42" />
        </g>

        <path d={SIGN} fill="url(#signBoard)" stroke="rgba(10,8,5,0.65)" strokeWidth="1.4" />
        <g stroke="rgba(237,230,216,0.05)" strokeWidth="1" fill="none">
          <path d="M156,55 Q300,51 445,56" />
          <path d="M156,112 Q300,116 445,111" />
        </g>

        {/* Iron bands at the ends of the board, nailed through. */}
        <g fill="#191310" stroke="rgba(237,230,216,0.1)" strokeWidth="0.8">
          <path d="M163,44 L176,44 L177,120 L164,121 Z" />
          <path d="M424,44 L437,44 L436,121 L423,120 Z" />
        </g>
        <g fill="rgba(237,230,216,0.24)">
          {[170, 430].map((x) => (
            <React.Fragment key={x}>
              <circle cx={x} cy="54" r="1.7" />
              <circle cx={x} cy="110" r="1.7" />
            </React.Fragment>
          ))}
        </g>

        {/* Cut into the board, then the face of the cut catching the fire. */}
        <SignCut x="300" y="105.5" textAnchor="middle">{GAME_NAME}</SignCut>
        <SignFace x="300" y="103" textAnchor="middle" $still={reduced}>{GAME_NAME}</SignFace>

        {/* --- Lanterns under the beam -------------------------------------- */}
        {[140, 460].map((x, index) => (
          <g key={x}>
            <circle cx={x} cy="209" r="26" fill="url(#fireGlow)" />
            <path d={`M${x},186 L${x},195`} stroke="#2A2119" strokeWidth="1.6" fill="none" />
            <path d={`M${x - 8},199 L${x + 8},199 L${x + 6},218 L${x - 6},218 Z`}
              fill="#1A130D" stroke="#3A2C1E" strokeWidth="1.2" />
            <path d={`M${x - 10},199 L${x + 10},199 L${x + 5},194 L${x - 5},194 Z`}
              fill="#241A12" stroke="#3A2C1E" strokeWidth="1" />
            <FlameCore $still={reduced} $delay={index * 520}
              d={`M${x},203 Q${x + 3.5},210 ${x + 2},215 Q${x},218 ${x - 2},215 Q${x - 3.5},210 ${x},203 Z`} />
          </g>
        ))}

        {/* --- Timber doors, swung open against the posts -------------------- */}
        {/* Darker than the frame: they are turned away from the road, and the
            step in tone is what stops them reading as more post. */}
        <g stroke="rgba(8,6,4,0.8)" strokeWidth="1.2" fill="url(#gateDoor)">
          <path d="M194,222 L228,236 L228,366 L194,380 Z" />
          <path d="M406,222 L372,236 L372,366 L406,380 Z" />
        </g>
        <g stroke="rgba(237,230,216,0.07)" strokeWidth="1" fill="none">
          <path d="M205,227 L205,375M216,231 L216,371" />
          <path d="M395,227 L395,375M384,231 L384,371" />
        </g>
        {/* Strap hinges, running off the post they are hung on. */}
        <g stroke="#191310" strokeWidth="4" strokeLinecap="square" fill="none">
          <path d="M194,262 L228,272M194,332 L228,338" />
          <path d="M406,262 L372,272M406,332 L372,338" />
        </g>

        {/* --- Braziers ----------------------------------------------------- */}
        {BRAZIERS.map((x, index) => (
          <g key={x}>
            <circle cx={x} cy="314" r="36" fill="url(#fireGlow)" />
            <g stroke="#2A2119" strokeWidth="2.4" strokeLinecap="round" fill="none">
              <path d={`M${x - 11},${GROUND} L${x},340`} />
              <path d={`M${x + 11},${GROUND} L${x},340`} />
              <path d={`M${x},${GROUND} L${x},340`} />
            </g>
            <path d={`M${x - 14},324 L${x + 14},324 L${x + 9},344 L${x - 9},344 Z`}
              fill="#1A130D" stroke="#3A2C1E" strokeWidth="1.4" />
            <Flame $still={reduced} $delay={index * 700}
              d={`M${x},286 Q${x + 9},306 ${x + 6},320 Q${x},328 ${x - 6},320 Q${x - 9},306 ${x},286 Z`} />
            <FlameCore $still={reduced} $delay={index * 700 + 260}
              d={`M${x},302 Q${x + 4},312 ${x + 2},319 Q${x},323 ${x - 2},319 Q${x - 4},312 ${x},302 Z`} />
          </g>
        ))}

        {/* No vignette rect over the top. A rect spanning the viewBox makes the
            svg's alpha a solid rectangle, and the drop-shadow on <Svg> then
            casts a rectangle instead of the gate. The palisade fading out at
            both ends is what keeps the silhouette off a hard edge. */}

        {/* Ground */}
        <line x1="8" y1={GROUND} x2="592" y2={GROUND} stroke="rgba(237,230,216,0.1)" strokeWidth="1" />
      </Svg>
    </Frame>
  );
}

const Frame = styled.div`
  position: relative;
  width: 100%;
  max-width: 560px;
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

/* The name, in the display face, so the board and the wordmark elsewhere on
   the page are recognisably the same hand. */
const signType = `
  font-family: 'Cormorant Garamond', 'Iowan Old Style', Georgia, serif;
  font-size: 58px;
  font-weight: 600;
  letter-spacing: 2px;
`;

/* The shadow inside the incision, offset down because the light is below. */
const SignCut = styled.text`
  ${signType}
  fill: #0B0703;
  opacity: 0.85;
`;

const SignFace = styled.text`
  ${signType}
  fill: url(#signLetter);
  animation: ${(props) => (props.$still ? "none" : "signLight 6s ease-in-out infinite")};

  @keyframes signLight {
    0%, 100% { opacity: 0.9; }
    50% { opacity: 1; }
  }
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
   offset per source, keep it from reading as a pulse. */
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

/* Cut into the post, not painted on it. */
const Tally = styled.path`
  fill: none;
  stroke: var(--ember);
  stroke-width: 1.4;
  stroke-linecap: round;
  stroke-linejoin: round;
  animation: ${(props) => (props.$still ? "none" : "tallyGlow 5.5s ease-in-out infinite")};

  @keyframes tallyGlow {
    0%, 100% { opacity: 0.34; }
    50% { opacity: 0.8; }
  }
`;
