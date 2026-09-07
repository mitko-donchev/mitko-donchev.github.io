import React, { useEffect, useRef } from "react";
import styled from "styled-components";
// Components
import EmberField from "./EmberField";
// Hooks
import useInView from "../../hooks/useInView";
import useReducedMotion from "../../hooks/useReducedMotion";
// Config
import { GAME_NAME, GATE_ALT } from "../../config/links";

/* The village gate, and what is on the other side of it.

   Both live in one <svg> and the opening is cut from the same coordinate
   system as the posts, so the view through the gate cannot come unstuck from
   the gap it is seen through. The village behind is masked to that gap: the
   only way to see any of it is through the doors.

   The drawing never moves as a whole. It is rasterised once and then the only
   things that change are the fire, a few lit windows, and — once, on arrival —
   eight path attributes as the doors swing. That restraint is deliberate: an
   earlier version scaled the whole svg on scroll, which forces the browser to
   re-rasterise two hundred vector shapes at a new resolution on every frame,
   with the flames animating inside it the whole time. It looked good and it
   dropped frames. */

const GROUND = 560;

/* Cropped in from the full drawing. The gate shares a column with the synopsis
   rather than a screen, and uncropped it puts the posts at barely two hundred
   pixels apart with scenery filling the rest — a picture of a gate a long way
   off, when the point is to be standing at it. The crop spends the width on
   the gate and lets the far palisade and the outer props go. */
const VIEW = "160 34 680 566";

/* How far a leaf swings when it is done, and how long it takes to get there.
   Not all the way to SWING: leaves flat against the posts read as a gate with
   no doors, and the point of the drawing is that it has doors and they opened. */
const RESTING_OPEN = 0.85;
const OPEN_MS = 1500;

/* The eye-line. Everything that recedes — the door leaves, the road, the
   rooftops — converges here, so the gate and the village agree about where the
   horizon is. */
const HORIZON = 372;
const CENTRE = 500;

/* How hard the perspective bites. Small numbers give a fish-eye; at 760 user
   units a leaf swung flat still loses about a fifth of its height, which is
   what a real door does at this distance. */
const FOCAL = 760;

/* Degrees at fully open. Past about 80 the leaf is edge-on and vanishes, and
   the gate stops reading as having doors at all. */
const SWING = 78;

const DOOR = { top: 356, bottom: GROUND, width: 190, left: 310, right: 690 };

/* One decimal is well under half a device pixel at any scale this reaches, and
   it keeps the path strings short enough to be worth rebuilding every frame. */
const round = (value) => Math.round(value * 10) / 10;

/* A point on a door leaf, in leaf coordinates: t runs 0 (hinge) to 1 (free
   edge), h runs 0 (top) to 1 (ground). The leaf swings inward, so t also
   carries the point away from the viewer — project it toward the horizon by
   as far as it has gone. */
function doorPoint(side, t, h, radians) {
  const depth = DOOR.width * t * Math.sin(radians);
  const scale = FOCAL / (FOCAL + depth);
  const hinge = side === "left" ? DOOR.left : DOOR.right;
  const reach = DOOR.width * t * Math.cos(radians) * (side === "left" ? 1 : -1);
  const y = DOOR.top + (DOOR.bottom - DOOR.top) * h;

  return `${round(CENTRE + (hinge + reach - CENTRE) * scale)},${round(HORIZON + (y - HORIZON) * scale)}`;
}

/* Ledged and braced, the way a village builds a door: vertical boards, two
   iron straps off the hinge, one diagonal taking the sag. */
function doorPaths(side, radians) {
  const at = (t, h) => doorPoint(side, t, h, radians);
  return {
    leaf: `M${at(0, 0)} L${at(1, 0)} L${at(1, 1)} L${at(0, 1)} Z`,
    boards:
      [0.26, 0.5, 0.74].map((t) => `M${at(t, 0)} L${at(t, 1)}`).join(" ") +
      ` M${at(0.05, 0.86)} L${at(0.95, 0.2)}`,
    // Two straps off the hinge and a batten down the free edge. Without the
    // batten the leaves meet in the middle as one unbroken brown wall.
    iron:
      `M${at(0, 0.14)} L${at(0.78, 0.14)} M${at(0, 0.86)} L${at(0.78, 0.86)}` +
      ` M${at(0.9, 0.08)} L${at(0.9, 0.92)}`,
  };
}

/* Rendered shut on the first frame, so the gate is a gate before any
   JavaScript has run, and so the doors have somewhere to open from. */
const CLOSED = { left: doorPaths("left", 0), right: doorPaths("right", 0) };

/* --- the frame ------------------------------------------------------------ */

/* Hewn, not sawn: no two edges are parallel. The small offsets are the whole
   difference between "timber" and "brown rectangle". */
const LEFT_POST = "M252,108 L308,110 L310,300 L312,560 L250,560 L252,302 Z";
const RIGHT_POST = "M692,110 L748,108 L748,302 L750,560 L688,560 L690,300 Z";
const CROSSBEAM = "M212,172 L230,162 L770,161 L788,171 L788,204 L770,212 L230,211 L212,203 Z";
const BRACES = [
  "M312,300 L406,206 L420,218 L326,312 Z",
  "M688,300 L594,206 L580,218 L674,312 Z",
];

/* Finials on the post heads, poking above the ridge the way a village leaves
   the uprights long and dresses the ends. Each gets a plinth: a bare triangle
   sitting on a roofline reads as a distant mountain, not as a post. */
const FINIALS = [
  "M262,96 L298,96 L298,84 L300,84 L280,56 L260,84 L262,84 Z",
  "M702,96 L738,96 L738,84 L740,84 L720,56 L700,84 L702,84 Z",
];

/* The roof slopes down toward the road, so its front face is what you see and
   the eave is nearer — and therefore wider — than the ridge behind it. */
const ROOF = { ridgeY: 100, ridgeHalf: 248, eaveY: 164, eaveHalf: 312, courses: 5 };

const roofEdge = (t) => ({
  left: CENTRE - (ROOF.ridgeHalf + (ROOF.eaveHalf - ROOF.ridgeHalf) * t),
  right: CENTRE + (ROOF.ridgeHalf + (ROOF.eaveHalf - ROOF.ridgeHalf) * t),
  y: ROOF.ridgeY + (ROOF.eaveY - ROOF.ridgeY) * t,
});

const ROOF_COURSES = Array.from({ length: ROOF.courses }, (unused, course) => {
  const far = roofEdge(course / ROOF.courses);
  const near = roofEdge((course + 1) / ROOF.courses);
  return `M${far.left},${far.y} L${far.right},${far.y} L${near.right},${near.y} L${near.left},${near.y} Z`;
});

/* Shingle joints, staggered course to course the way they are laid. */
const SHINGLE_TICKS = Array.from({ length: ROOF.courses }, (unused, course) => {
  const far = roofEdge(course / ROOF.courses);
  const near = roofEdge((course + 1) / ROOF.courses);
  const step = 1 / 11;
  return Array.from({ length: 11 }, (alsoUnused, index) => {
    const u = index * step + (course % 2 ? step / 2 : 0);
    const x1 = far.left + (far.right - far.left) * u;
    const x2 = near.left + (near.right - near.left) * u;
    return `M${round(x1)},${far.y} L${round(x2)},${near.y}`;
  }).join(" ");
}).join(" ");

/* The board. Live edges, a slight bow, read from across the road. */
const SIGN = "M348,240 Q500,229 652,242 L657,338 Q500,356 343,336 Z";

/* Cloth hung off a crossbar on each post: the village's colour, and the only
   cold thing in a scene otherwise lit entirely by fire. */
const BANNERS = [258, 698];

/* Stakes marching off both sides and thinning into the dark. */
const PALISADE = [
  ...[236, 208, 180, 152, 124, 96, 68, 40, 12].map((x, index) => ({
    x,
    top: 372 + (index % 2) * 11,
    fade: 0.62 - index * 0.06,
  })),
  ...[752, 780, 808, 836, 864, 892, 920, 948, 976].map((x, index) => ({
    x,
    top: 374 + (index % 2) * 11,
    fade: 0.62 - index * 0.06,
  })),
];

/* --- the village ---------------------------------------------------------- */

/* Roofs on a slope, either side of the road, none of them on it. */
const COTTAGES = [
  { x: 416, y: 424, w: 48, h: 28, smoke: false },
  { x: 542, y: 420, w: 52, h: 30, smoke: true },
  { x: 340, y: 468, w: 78, h: 44, smoke: true },
  { x: 566, y: 462, w: 70, h: 40, smoke: false },
  { x: 276, y: 506, w: 94, h: 52, smoke: true },
  { x: 628, y: 500, w: 90, h: 50, smoke: true },
];

/* Road edges, from the horizon out through the gate and past the viewer. */
const ROAD_END = 900;
const roadEdge = (y, half) => round(CENTRE + half * ((y - HORIZON) / (ROAD_END - HORIZON)));

/* Lit windows, lanterns on posts, whatever else is still burning down there. */
const ROAD_LIGHTS = [
  [452, 452], [548, 448], [418, 496], [588, 504], [472, 546], [536, 560],
];

/* --- component ------------------------------------------------------------ */

export default function Gate() {
  const [frameRef, inView] = useInView({ threshold: 0.3 });
  const reduced = useReducedMotion();
  const villageRef = useRef(null);
  const leaves = useRef({ left: {}, right: {} });

  /* The doors open once, when the gate arrives, and then the drawing is done
     moving for good.

     This used to be driven by scroll position, which meant re-projecting the
     leaves on every pixel of the page — and, worse, scaling the whole svg,
     which makes the browser re-rasterise two hundred vector shapes at a new
     resolution every frame while four flames and a dozen windows are already
     animating inside it. That was the lag. Nothing here is scaled now, and the
     only thing that ever changes is eight path attributes, for a second and a
     half, once. */
  useEffect(() => {
    const paint = (open) => {
      const radians = (SWING * open * Math.PI) / 180;
      ["left", "right"].forEach((side) => {
        const parts = leaves.current[side];
        if (!parts.leaf) return;
        const paths = doorPaths(side, radians);
        parts.leaf.setAttribute("d", paths.leaf);
        parts.shade.setAttribute("d", paths.leaf);
        parts.boards.setAttribute("d", paths.boards);
        parts.iron.setAttribute("d", paths.iron);
        // A leaf turning away from the road loses the fire on its face.
        parts.shade.style.opacity = String(0.55 * Math.sin(radians));
      });
      if (villageRef.current) {
        // Barely there behind shut doors, and all the way up once they are not.
        villageRef.current.style.opacity = String(0.16 + 0.84 * open);
      }
    };

    if (reduced) {
      paint(RESTING_OPEN);
      return undefined;
    }
    if (!inView) return undefined;

    let frame = 0;
    let started = 0;

    const step = (now) => {
      if (!started) started = now;
      const t = Math.min(1, (now - started) / OPEN_MS);
      // Slow into the stop: a door has weight, and linear reads as a hinge
      // being cranked rather than swung.
      paint(RESTING_OPEN * (1 - (1 - t) * (1 - t) * (1 - t)));
      if (t < 1) frame = window.requestAnimationFrame(step);
    };

    frame = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(frame);
  }, [inView, reduced]);

  return (
    <Frame ref={frameRef}>
      <Embers aria-hidden="true">
        <EmberField density={0.55} />
      </Embers>

      <Svg viewBox={VIEW} role="img" aria-label={GATE_ALT}>
      <defs>
        {/* One gradient in user space for every piece of timber, so posts,
            beam and braces take the same light and no joint shows a seam. */}
        <linearGradient id="gateTimber" gradientUnits="userSpaceOnUse" x1="200" y1="90" x2="800" y2="560">
          <stop offset="0%" stopColor="#332517" />
          <stop offset="54%" stopColor="#22190F" />
          <stop offset="100%" stopColor="#150F09" />
        </linearGradient>

        <linearGradient id="gateShingle" gradientUnits="userSpaceOnUse" x1="0" y1="96" x2="0" y2="168">
          <stop offset="0%" stopColor="#1B140D" />
          <stop offset="100%" stopColor="#2E2114" />
        </linearGradient>

        <linearGradient id="gateTimberDark" gradientUnits="userSpaceOnUse" x1="0" y1="370" x2="0" y2="560">
          <stop offset="0%" stopColor="#1A130C" />
          <stop offset="100%" stopColor="#080604" />
        </linearGradient>

        {/* Fades at both ends, or it reads as a rule drawn across the page
            rather than as the ground the gate is standing in. */}
        <linearGradient id="groundLine" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="1000" y2="0">
          <stop offset="0%" stopColor="#EDE6D8" stopOpacity="0" />
          <stop offset="34%" stopColor="#EDE6D8" stopOpacity="0.1" />
          <stop offset="66%" stopColor="#EDE6D8" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#EDE6D8" stopOpacity="0" />
        </linearGradient>

        <linearGradient id="signBoard" gradientUnits="userSpaceOnUse" x1="0" y1="356" x2="0" y2="236">
          <stop offset="0%" stopColor="#3C2B1C" />
          <stop offset="55%" stopColor="#281C13" />
          <stop offset="100%" stopColor="#1B130D" />
        </linearGradient>

        <linearGradient id="signLetter" gradientUnits="userSpaceOnUse" x1="348" y1="330" x2="652" y2="252">
          <stop offset="0%" stopColor="#C98A2E" />
          <stop offset="26%" stopColor="#F7CE84" />
          <stop offset="52%" stopColor="#FBE7BC" />
          <stop offset="74%" stopColor="#E8A33D" />
          <stop offset="100%" stopColor="#B9741F" />
        </linearGradient>

        <linearGradient id="gateBanner" gradientUnits="userSpaceOnUse" x1="0" y1="216" x2="0" y2="398">
          <stop offset="0%" stopColor="#1B3B33" />
          <stop offset="100%" stopColor="#0B1A16" />
        </linearGradient>

        {/* The only light is the fire on the road, so the rim on the inner
            faces climbs from the ground and dies before it reaches the beam. */}
        <linearGradient id="gateRim" gradientUnits="userSpaceOnUse" x1="0" y1="560" x2="0" y2="300">
          <stop offset="0%" stopColor="#F7CE84" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#E8A33D" stopOpacity="0" />
        </linearGradient>

        <linearGradient id="gateDoor" gradientUnits="userSpaceOnUse" x1="0" y1="356" x2="0" y2="560">
          <stop offset="0%" stopColor="#241A11" />
          <stop offset="100%" stopColor="#100B07" />
        </linearGradient>

        {/* Centre and radius both 0.5, so the falloff reaches zero exactly at
            the edge of the ellipse it fills. Anything shorter is clipped
            mid-falloff, and the clip shows as a hard arc. */}
        <radialGradient id="signGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#E8A33D" stopOpacity="0.2" />
          <stop offset="55%" stopColor="#B9741F" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#E8A33D" stopOpacity="0" />
        </radialGradient>

        <radialGradient id="fireGlow">
          <stop offset="0%" stopColor="#F7CE84" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#E8A33D" stopOpacity="0" />
        </radialGradient>

        {/* The warm band is narrow and sits just above the eye-line. Spread
            any wider and the far distance stops reading as a village at dusk
            and starts reading as a wall someone painted tan. */}
        <linearGradient id="villageSky" gradientUnits="userSpaceOnUse" x1="0" y1="-400" x2="0" y2="560">
          <stop offset="0%" stopColor="#04070E" />
          <stop offset="60%" stopColor="#090F1C" />
          <stop offset="74%" stopColor="#141324" />
          <stop offset="80%" stopColor="#241A12" />
          <stop offset="84%" stopColor="#0E0A08" />
          <stop offset="100%" stopColor="#050404" />
        </linearGradient>

        <linearGradient id="villageRoad" gradientUnits="userSpaceOnUse" x1="0" y1={HORIZON} x2="0" y2={ROAD_END}>
          <stop offset="0%" stopColor="#241811" stopOpacity="0" />
          <stop offset="26%" stopColor="#1B120B" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#0F0A06" />
        </linearGradient>

        <radialGradient id="villageHearth" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#E8A33D" stopOpacity="0.22" />
          <stop offset="52%" stopColor="#B9741F" stopOpacity="0.07" />
          <stop offset="100%" stopColor="#E8A33D" stopOpacity="0" />
        </radialGradient>

        <linearGradient id="villageMist" gradientUnits="userSpaceOnUse" x1="0" y1="336" x2="0" y2="432">
          <stop offset="0%" stopColor="#8FA6C4" stopOpacity="0" />
          <stop offset="46%" stopColor="#9DB2CC" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#8FA6C4" stopOpacity="0" />
        </linearGradient>

        {/* Four ramps rather than a blur. A filter inside a mask is
            re-rasterised every time the scene changes scale, which is every
            frame of the walk in; four gradient-filled strips cost nothing and
            land in the same place. */}
        {[
          ["featherL", 0, 0, 1, 0],
          ["featherR", 1, 0, 0, 0],
          ["featherT", 0, 0, 0, 1],
          ["featherB", 0, 1, 0, 0],
        ].map(([id, x1, y1, x2, y2]) => (
          <linearGradient key={id} id={id} x1={x1} y1={y1} x2={x2} y2={y2}>
            <stop offset="0%" stopColor="#000" />
            <stop offset="100%" stopColor="#fff" />
          </linearGradient>
        ))}

        {/* Opaque edge to edge across the gap, and the falloff hidden behind
            the posts and the beam — so the view through the gate has no edge
            of its own anywhere you can see it. The corners are left black on
            purpose: they sit under the roof, and black leaks nothing. */}
        <mask id="throughGate">
          <rect x="306" y="118" width="388" height="446" fill="#fff" />
          <rect x="252" y="118" width="54" height="446" fill="url(#featherL)" />
          <rect x="694" y="118" width="54" height="446" fill="url(#featherR)" />
          <rect x="306" y="74" width="388" height="44" fill="url(#featherT)" />
          {/* Longer at the bottom, where nothing covers it: the road carries
              on out of the gate and fades into the ground you are standing on. */}
          <rect x="306" y="564" width="388" height="58" fill="url(#featherB)" />
        </mask>
      </defs>

      {/* --- palisade, behind everything -------------------------------- */}
      {/* Barely edged: a lit outline turns stakes into a picket fence. */}
      <g stroke="rgba(237,230,216,0.05)" strokeWidth="1" fill="url(#gateTimberDark)">
        {PALISADE.map((stake) => (
          <path
            key={stake.x}
            opacity={Math.max(0.18, stake.fade)}
            d={`M${stake.x},${GROUND} L${stake.x},${stake.top + 14}
                L${stake.x + 9},${stake.top} L${stake.x + 18},${stake.top + 14}
                L${stake.x + 18},${GROUND} Z`}
          />
        ))}
      </g>
      {/* --- the village, seen only through the gap ---------------------- */}
      <g mask="url(#throughGate)">
        <g ref={villageRef} opacity="0.16">
          {/* Drawn far past the opening on every side: the gap triples on
              the way in, and blank canvas at the edge of the mask would end
              the illusion in one frame. */}
          <rect x="-700" y="-400" width="2400" height="1400" fill="url(#villageSky)" />

          {/* Far range, and something with towers on the last ridge that the
              site never mentions again. */}
          <path
            d="M-700,372 L-700,318 C-400,300 -120,286 120,262 C300,244 372,308 470,300
               C560,292 606,244 674,252 C740,260 776,300 842,292
               C1000,272 1300,300 1700,286 L1700,372 Z"
            fill="#080D18"
          />
          <g fill="#070B14">
            <path d="M726,292 L726,250 L734,250 L734,262 L748,262 L748,242 L756,242 L756,262 L770,262 L770,254 L778,254 L778,296 Z" />
            <path d="M748,242 L752,224 L756,242 Z" />
          </g>

          {/* Near ridge and treeline. */}
          <path
            d="M-700,372 L-700,352 C-300,346 -40,338 180,344 C330,348 372,314 452,322
               C532,330 566,352 640,346 C716,340 760,316 830,324
               C1100,352 1400,344 1700,338 L1700,372 Z"
            fill="#050810"
          />
          <ellipse cx={CENTRE} cy="440" rx="330" ry="170" fill="url(#villageHearth)" />
          <rect x="-700" y="336" width="2400" height="96" fill="url(#villageMist)" />

          {/* The road, running out of the gate toward you. */}
          <path
            d={`M${roadEdge(HORIZON, -8)},${HORIZON} L${roadEdge(ROAD_END, -300)},${ROAD_END}
                L${roadEdge(ROAD_END, 300)},${ROAD_END} L${roadEdge(HORIZON, 8)},${HORIZON} Z`}
            fill="url(#villageRoad)"
          />
          <g stroke="rgba(247,206,132,0.07)" strokeWidth="1" fill="none">
            <path d={`M${roadEdge(HORIZON, -3)},${HORIZON} L${roadEdge(ROAD_END, -120)},${ROAD_END}`} />
            <path d={`M${roadEdge(HORIZON, 3)},${HORIZON} L${roadEdge(ROAD_END, 120)},${ROAD_END}`} />
          </g>
          {/* Rain, some time before you got here. */}
          <g fill="rgba(247,206,132,0.08)">
            <ellipse cx="476" cy="470" rx="12" ry="2.6" />
            <ellipse cx="534" cy="512" rx="17" ry="3.4" />
            <ellipse cx="454" cy="552" rx="22" ry="4.2" />
          </g>

          {/* Further up the slope is further away, so it is dimmer: the one
              cue that keeps six flat shapes from reading as one flat row. */}
          {COTTAGES.map((cottage) => (
            <g key={`${cottage.x}-${cottage.y}`} opacity={0.5 + (cottage.y - 420) / 190}>
              <Cottage {...cottage} />
            </g>
          ))}

          {/* The tower — the one thing in the village taller than a roof. */}
          <g>
            <path d="M440,410 L472,410 L470,338 L442,338 Z" fill="#100E16" />
            <path d="M436,338 L456,294 L476,338 Z" fill="#08070E" />
            <Lit x="450" y="354" width="6" height="11" $offset={1.4} />
            <Lit x="450" y="384" width="6" height="11" $offset={3.1} />
          </g>

          {/* Somebody is still trading, this late. */}
          <g>
            <path d="M582,502 L648,502 L636,478 L594,478 Z" fill="#15131C" />
            <path d="M594,478 L615,469 L636,478 Z" fill="#0D0C14" />
            <Lit x="604" y="486" width="22" height="9" $offset={0.6} />
          </g>

          {/* Whatever else is burning down there. */}
          <g>
            {ROAD_LIGHTS.map(([x, y]) => (
              <Spark key={`${x}-${y}`} cx={x} cy={y} r="3.4" $offset={(x % 9) * 0.4} />
            ))}
          </g>

          {/* The far end of the road. Something is standing there. */}
          <VanishingPoint cx={CENTRE} cy={HORIZON} r="3" />
        </g>
      </g>

      {/* --- doors ------------------------------------------------------- */}
      {/* Before the frame, so the posts close over the hinge edge. */}
      <Door side="left" registry={leaves} />
      <Door side="right" registry={leaves} />

      {/* --- frame ------------------------------------------------------- */}
      {/* Braces first, so the posts and the beam close over their ends. */}
      <g fill="url(#gateTimber)" stroke="rgba(6,4,3,0.7)" strokeWidth="1.2">
        {BRACES.map((brace) => (
          <path key={brace} d={brace} />
        ))}
        <path d={LEFT_POST} />
        <path d={RIGHT_POST} />
      </g>

      {/* --- roof -------------------------------------------------------- */}
      <g fill="url(#gateShingle)" stroke="rgba(5,4,2,0.55)" strokeWidth="1">
        {ROOF_COURSES.map((course) => (
          <path key={course} d={course} />
        ))}
      </g>
      <path d={SHINGLE_TICKS} fill="none" stroke="rgba(5,4,2,0.45)" strokeWidth="1" />
      <path d="M240,92 L760,92 L760,104 L240,104 Z" fill="#1B140D" stroke="rgba(5,4,2,0.7)" strokeWidth="1" />

      <g fill="url(#gateTimber)" stroke="rgba(6,4,3,0.7)" strokeWidth="1.2">
        {FINIALS.map((finial) => (
          <path key={finial} d={finial} />
        ))}
        <path d={CROSSBEAM} />
      </g>

      {/* Grain, dim enough to read as wood rather than as a chart. */}
      <g stroke="rgba(237,230,216,0.045)" strokeWidth="1" fill="none">
        <path d="M266,118 Q262,340 268,556" />
        <path d="M286,118 Q291,336 284,556" />
        <path d="M300,118 Q296,344 302,556" />
        <path d="M700,118 Q696,340 702,556" />
        <path d="M720,118 Q725,336 718,556" />
        <path d="M734,118 Q730,344 736,556" />
        <path d="M222,182 Q500,187 780,180" />
        <path d="M222,198 Q500,193 780,199" />
      </g>

      {/* Iron where a hewn frame actually needs it: over the post heads and
          at the ends of the beam. */}
      <g fill="#140F0B" stroke="rgba(237,230,216,0.07)" strokeWidth="0.8">
        <rect x="250" y="322" width="60" height="12" rx="1" />
        <rect x="690" y="322" width="60" height="12" rx="1" />
        <rect x="250" y="528" width="60" height="12" rx="1" />
        <rect x="690" y="528" width="60" height="12" rx="1" />
        <rect x="216" y="170" width="12" height="36" rx="1" />
        <rect x="772" y="170" width="12" height="36" rx="1" />
      </g>
      <g fill="rgba(237,230,216,0.16)">
        {[258, 302, 698, 742].map((x) => (
          <React.Fragment key={x}>
            <circle cx={x} cy="328" r="1.8" />
            <circle cx={x} cy="534" r="1.8" />
          </React.Fragment>
        ))}
      </g>

      {/* Rim light up the inner faces, and the underside of the braces
          catching the same glow off the road. */}
      <g fill="none" stroke="url(#gateRim)" strokeWidth="1.8">
        <path d="M311,560 L311,300" />
        <path d="M689,560 L689,300" />
      </g>
      <g fill="none" stroke="rgba(247,206,132,0.08)" strokeWidth="1">
        <path d="M326,312 L420,218" />
        <path d="M674,312 L580,218" />
      </g>

      {/* Somebody has been marking the post. Five to a gate, and more than
          one gate's worth. */}
      <Tally d="M262,462 L262,494 M272,462 L272,494 M282,462 L282,494 M292,462 L292,494 M258,496 L296,459" />

      {/* --- banners ----------------------------------------------------- */}
      {BANNERS.map((left, index) => (
        <React.Fragment key={left}>
          <path d={`M${left - 10},210 L${left + 54},210`} stroke="#1B140D" strokeWidth="6" strokeLinecap="round" />
          {/* Written at absolute coordinates rather than under a translate:
              a CSS transform on an SVG element replaces its transform
              attribute outright, and the sway would eat the placement. */}
          <Banner $origin={left + 22} $delay={index * 1300}>
            <path
              d={`M${left},216 L${left + 44},216 L${left + 44},398 L${left + 22},378 L${left},398 Z`}
              fill="url(#gateBanner)"
              stroke="rgba(6,12,10,0.7)"
              strokeWidth="1"
            />
            {/* The tree the village keeps on its cloth. Nobody explains it. */}
            <g fill="rgba(180,214,202,0.3)">
              <circle cx={left + 22} cy="268" r="15" />
              <circle cx={left + 11} cy="279" r="10" />
              <circle cx={left + 33} cy="279" r="10" />
            </g>
            <g stroke="rgba(180,214,202,0.36)" strokeWidth="1.6" fill="none" strokeLinecap="round">
              <path d={`M${left + 22},312 L${left + 22},276`} />
              <path d={`M${left + 22},294 L${left + 13},285M${left + 22},300 L${left + 31},291`} />
            </g>
          </Banner>
        </React.Fragment>
      ))}

      {/* --- sign -------------------------------------------------------- */}
      {/* Glow before the board, so the lantern light sits behind and under it
          rather than washing over the letters. */}
      <ellipse cx={CENTRE} cy="292" rx="210" ry="120" fill="url(#signGlow)" />

      <SignRig>
        <g stroke="#16100B" strokeWidth="3.4" fill="none">
          <path d="M396,204 L390,242M398,204 L404,242" />
          <path d="M604,204 L598,242M606,204 L612,242" />
        </g>
        <path d={SIGN} fill="url(#signBoard)" stroke="rgba(6,4,3,0.8)" strokeWidth="1.6" />
        <g stroke="rgba(237,230,216,0.04)" strokeWidth="1" fill="none">
          <path d="M354,252 Q500,243 650,254" />
          <path d="M352,322 Q500,338 654,320" />
        </g>

        {/* A compass rose, cut small above the name. Four ways out of a
            village that only has one road. */}
        <g stroke="rgba(232,163,61,0.42)" strokeWidth="1.3" fill="none">
          <path d="M500,250 L503,262 L515,265 L503,268 L500,280 L497,268 L485,265 L497,262 Z" />
          <path d="M489,254 L494,259M511,254 L506,259M489,276 L494,271M511,276 L506,271" />
        </g>

        {/* Cut into the board, then the face of the cut catching the fire. */}
        <SignCut x={CENTRE} y="325" textAnchor="middle">{GAME_NAME}</SignCut>
        <SignFace x={CENTRE} y="322" textAnchor="middle">{GAME_NAME}</SignFace>
      </SignRig>

      {/* --- lanterns on their brackets ---------------------------------- */}
      {[
        { x: 208, from: 250 },
        { x: 792, from: 750 },
      ].map((lantern, index) => (
        <g key={lantern.x}>
          <circle cx={lantern.x} cy="250" r="44" fill="url(#fireGlow)" />
          <path
            d={`M${lantern.from},196 C${(lantern.from + lantern.x) / 2},186 ${lantern.x},188 ${lantern.x},212`}
            stroke="#1B140D"
            strokeWidth="3.4"
            fill="none"
          />
          <Lantern $delay={index * 900} style={{ transformOrigin: `${lantern.x}px 210px` }}>
            <path d={`M${lantern.x},210 L${lantern.x},222`} stroke="#241A12" strokeWidth="1.8" fill="none" />
            <path d={`M${lantern.x - 13},228 L${lantern.x + 13},228 L${lantern.x + 10},266 L${lantern.x - 10},266 Z`}
              fill="#150F0A" stroke="#33261A" strokeWidth="1.4" />
            <path d={`M${lantern.x - 16},228 L${lantern.x + 16},228 L${lantern.x + 8},220 L${lantern.x - 8},220 Z`}
              fill="#1E160F" stroke="#33261A" strokeWidth="1.2" />
            <Flame $delay={index * 520}
              d={`M${lantern.x},232 Q${lantern.x + 7},248 ${lantern.x + 4.5},258
                  Q${lantern.x},263 ${lantern.x - 4.5},258 Q${lantern.x - 7},248 ${lantern.x},232 Z`} />
            <FlameCore $delay={index * 520 + 210}
              d={`M${lantern.x},240 Q${lantern.x + 3.5},250 ${lantern.x + 2},257
                  Q${lantern.x},260 ${lantern.x - 2},257 Q${lantern.x - 3.5},250 ${lantern.x},240 Z`} />
          </Lantern>
        </g>
      ))}

      {/* --- what is lying about outside the gate ------------------------ */}
      <g fill="#0F0B07" stroke="rgba(237,230,216,0.055)" strokeWidth="1">
        <path d="M158,502 C150,516 150,542 158,556 L206,556 C214,542 214,516 206,502 Z" />
        <path d="M96,518 L146,518 L146,558 L96,558 Z" />
        <path d="M786,498 C778,514 778,542 786,558 L838,558 C846,542 846,514 838,498 Z" />
      </g>
      <g stroke="rgba(237,230,216,0.07)" strokeWidth="1.4" fill="none">
        <path d="M152,516 L212,516M152,540 L212,540" />
        <path d="M780,514 L844,514M780,540 L844,540" />
        <path d="M96,532 L146,532" />
        {/* The wheel, leaned against the fence. */}
        <circle cx="900" cy="512" r="44" />
        <circle cx="900" cy="512" r="12" />
        <path d="M900,468 L900,556M856,512 L944,512M869,481 L931,543M931,481 L869,543" />
      </g>

      {/* A raven on the fence, minding its own business. */}
      <g fill="#07070A">
        <path d="M200,378 C190,378 184,370 186,362 C188,354 196,350 204,352 C210,354 214,360 214,366 L226,362 L216,372 C214,376 208,378 200,378 Z" />
        <path d="M186,362 L176,358 L184,356 Z" />
      </g>
      <g stroke="#07070A" strokeWidth="1.6" fill="none">
        <path d="M198,378 L196,388M206,378 L206,388" />
      </g>

      {/* --- braziers on the road ---------------------------------------- */}
      {[336, 664].map((x, index) => (
        <g key={x}>
          <circle cx={x} cy="500" r="54" fill="url(#fireGlow)" />
          <g stroke="#241A12" strokeWidth="2.6" strokeLinecap="round" fill="none">
            <path d={`M${x - 14},${GROUND} L${x},512`} />
            <path d={`M${x + 14},${GROUND} L${x},512`} />
            <path d={`M${x},${GROUND} L${x},512`} />
          </g>
          <path d={`M${x - 18},492 L${x + 18},492 L${x + 11},518 L${x - 11},518 Z`}
            fill="#150F0A" stroke="#33261A" strokeWidth="1.4" />
          <Flame $delay={index * 700}
            d={`M${x},446 Q${x + 12},472 ${x + 8},492 Q${x},502 ${x - 8},492 Q${x - 12},472 ${x},446 Z`} />
          <FlameCore $delay={index * 700 + 260}
            d={`M${x},468 Q${x + 5},482 ${x + 3},491 Q${x},496 ${x - 3},491 Q${x - 5},482 ${x},468 Z`} />
        </g>
      ))}

      {/* Grass, and the ground it is standing in. No rect over the top: one
          spanning the viewBox would make the svg's alpha a solid rectangle,
          and anything filtering it would cast a rectangle instead of a gate. */}
      <g stroke="rgba(237,230,216,0.07)" strokeWidth="1.2" fill="none" strokeLinecap="round">
        {[54, 122, 238, 262, 742, 776, 866, 958].map((x) => (
          <path key={x} d={`M${x},${GROUND} q3,-12 8,-17M${x + 6},${GROUND} q-2,-14 -6,-20`} />
        ))}
      </g>
      <line x1="0" y1={GROUND} x2="1000" y2={GROUND} stroke="url(#groundLine)" strokeWidth="1" />
      </Svg>
    </Frame>
  );
}

/* A leaf. React renders it shut and never touches `d` again; the opening
   animation owns those four attributes from the first frame on. */
function Door({ side, registry }) {
  const keep = (part) => (node) => {
    registry.current[side][part] = node;
  };
  return (
    <g>
      <path ref={keep("leaf")} d={CLOSED[side].leaf} fill="url(#gateDoor)"
        stroke="rgba(5,4,2,0.9)" strokeWidth="1.4" />
      <path ref={keep("boards")} d={CLOSED[side].boards} fill="none"
        stroke="rgba(237,230,216,0.085)" strokeWidth="1.3" />
      <path ref={keep("iron")} d={CLOSED[side].iron} fill="none"
        stroke="#241C15" strokeWidth="6.5" />
      <path ref={keep("shade")} d={CLOSED[side].leaf} fill="#04060A" opacity="0" />
    </g>
  );
}

function Cottage({ x, y, w, h, smoke }) {
  const eave = 14 + h * 0.5;
  const lamp = Math.max(6, w * 0.17);
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d={`M0,0 L${w},0 L${w},${h} L0,${h} Z`} fill="#110F16" />
      <path d={`M-7,0 L${w / 2},${-eave} L${w + 7},0 Z`} fill="#0A0910" />
      {/* The ridge catching what the village is burning. */}
      <path d={`M-7,0 L${w / 2},${-eave} L${w + 7},0`} fill="none"
        stroke="rgba(232,163,61,0.14)" strokeWidth="1" />
      <Lit x={w * 0.24} y={h * 0.3} width={lamp} height={Math.max(6, h * 0.3)} $offset={x % 5} />
      <Lit x={w * 0.63} y={h * 0.3} width={lamp} height={Math.max(6, h * 0.3)} $offset={(x % 7) * 0.6} />
      {smoke && (
        <>
          <path d={`M${w * 0.7},0 L${w * 0.7},${-eave * 0.7} L${w * 0.8},${-eave * 0.7} L${w * 0.8},0 Z`} fill="#08070D" />
          <Smoke d={`M${w * 0.75},${-eave * 0.8} c-7,-12 7,-20 0,-32 c-6,-10 4,-16 1,-24`}
            fill="none" stroke="rgba(180,196,220,0.09)" strokeWidth="2" strokeLinecap="round" />
        </>
      )}
    </g>
  );
}

/* --- styles --------------------------------------------------------------- */

const Frame = styled.div`
  position: relative;
  width: 100%;
  max-width: 560px;
  margin: 0 auto;

  /* The pool of light the gate stands in. This is what a drop-shadow on the
     svg used to do, except a gradient on a div is painted once and a filter on
     the svg is re-run every time a flame moves. */
  &::before {
    content: "";
    position: absolute;
    inset: -16% -10%;
    background: radial-gradient(58% 54% at 50% 60%, rgba(232, 163, 61, 0.11), transparent 72%);
    pointer-events: none;
  }
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

/* Never transformed, and never filtered.

   A drop-shadow on the root has to re-run over the whole drawing every time
   anything inside it changes, and four flames flicker in here continuously —
   so the filter would cost a full re-composite of two hundred shapes, forever,
   for a shadow nobody is looking at. `overflow: hidden` clips to the viewBox,
   which is where the road under the gate is meant to fade out anyway. */
const Svg = styled.svg`
  position: relative;
  display: block;
  width: 100%;
  height: auto;
  overflow: hidden;
`;

/* The name, in the display face, so the board and the wordmark elsewhere on the
   page are recognisably the same hand. */
const signType = `
  font-family: var(--font-display);
  font-size: 66px;
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
`;

/* Hung on two chains off the beam, so it moves — barely, and never on a beat
   you could count. */
const SignRig = styled.g`
  transform-origin: 500px 204px;
  animation: signSway 11s ease-in-out infinite;

  @keyframes signSway {
    0%, 100% { transform: rotate(-0.45deg); }
    50% { transform: rotate(0.5deg); }
  }
`;

const Banner = styled.g`
  transform-origin: ${(props) => props.$origin}px 212px;
  animation: bannerSway 9s ease-in-out infinite;
  animation-delay: ${(props) => props.$delay}ms;

  @keyframes bannerSway {
    0%, 100% { transform: rotate(-0.7deg) skewX(0.6deg); }
    50% { transform: rotate(0.7deg) skewX(-0.6deg); }
  }
`;

const Lantern = styled.g`
  animation: lanternSway 6.5s ease-in-out infinite;
  animation-delay: ${(props) => props.$delay}ms;

  @keyframes lanternSway {
    0%, 100% { transform: rotate(-1.6deg); }
    50% { transform: rotate(1.6deg); }
  }
`;

/* The far end of the road, pulsing like something is standing there. */
const VanishingPoint = styled.circle`
  fill: #FFF6E4;
  animation: vpBreathe 4.2s ease-in-out infinite;

  @keyframes vpBreathe {
    0%, 100% { opacity: 0.3; r: 2.5; }
    50% { opacity: 1; r: 4.5; }
  }
`;

/* Fire is never still and never regular. Two cycles of different length, offset
   per source, keep it from reading as a pulse. */
const Flame = styled.path`
  fill: #E8A33D;
  filter: drop-shadow(0 0 12px rgba(232, 163, 61, 0.7));
  transform-box: fill-box;
  transform-origin: 50% 100%;
  animation: flicker 2.3s ease-in-out infinite;
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
  animation: flickerCore 1.7s ease-in-out infinite;
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
  stroke-width: 1.6;
  stroke-linecap: round;
  stroke-linejoin: round;
  animation: tallyGlow 5.5s ease-in-out infinite;

  @keyframes tallyGlow {
    0%, 100% { opacity: 0.28; }
    50% { opacity: 0.7; }
  }
`;

/* Somebody is up. Windows are the only thing in the village that moves. */
const Lit = styled.rect`
  fill: #E8A33D;
  animation: windowFlicker 5s ease-in-out infinite;
  animation-delay: ${(props) => props.$offset}s;

  @keyframes windowFlicker {
    0%, 100% { opacity: 0.34; }
    45% { opacity: 0.92; }
    70% { opacity: 0.55; }
  }
`;

const Spark = styled.circle`
  fill: #F7CE84;
  animation: sparkFlicker 4.4s ease-in-out infinite;
  animation-delay: ${(props) => props.$offset}s;

  @keyframes sparkFlicker {
    0%, 100% { opacity: 0.22; }
    50% { opacity: 0.7; }
  }
`;

const Smoke = styled.path`
  animation: smokeDrift 9s ease-in-out infinite;

  @keyframes smokeDrift {
    0%, 100% { opacity: 0.5; transform: translate(0, 0); }
    50% { opacity: 0.9; transform: translate(4px, -6px); }
  }
`;
