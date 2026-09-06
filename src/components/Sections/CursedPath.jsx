import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
// Hooks
import useInView from "../../hooks/useInView";
import useMediaQuery from "../../hooks/useMediaQuery";
import useReducedMotion from "../../hooks/useReducedMotion";
// Config
import {
  PATH_TITLE,
  PATH_KICKER,
  PATH_INTRO,
  PATH_WAYPOINTS,
  PATH_FACTS,
} from "../../config/links";
import { STACKED } from "../../config/breakpoints";

/* ---------------------------------------------------------------------------
   Geometry

   OUTBOUND is the surveyed road: west gate to far gate, and the only thing
   the map draws. RETURN_TAIL is the traveller's way back to the start of its
   circuit — deliberately NEVER RENDERED. The two are concatenated into LOOP
   only so the wisp has a route, and it fades out before it reaches that leg.

   That omission is the point. The map shows a road with two ends; the
   traveller reaches the far end, goes out of sight, and is quietly back at
   the beginning. Anyone watching long enough will notice and wonder. Telling
   them outright is the game's job, later, and not the website's.
   --------------------------------------------------------------------------- */

const OUTBOUND =
  "M128,300 C196,292 244,264 312,262 C382,260 424,306 492,306 " +
  "C560,306 610,250 676,252 C744,254 800,292 866,292";

const RETURN_TAIL =
  "C962,278 998,150 906,98 C820,50 640,74 500,68 " +
  "C352,62 176,66 122,148 C100,182 104,246 128,300";

const NODES = [
  { x: 128, y: 300 },
  { x: 312, y: 262 },
  { x: 492, y: 306 },
  { x: 676, y: 252 },
  { x: 866, y: 292 },
];

/* The same road, surveyed down the page instead of across it.

   A phone cannot hold a 1000-unit map: squeezed to fit, the waypoint names
   come out a few pixels tall, and held at full size it has to be dragged
   sideways, which hides half the road behind an edge nobody knows to swipe.
   So the portrait viewport gets a portrait map. Same five waypoints, same
   order, same undrawn return leg — turned through ninety degrees, with the
   names set beside each node where there is room for them. */
const OUTBOUND_V =
  "M60,60 C60,105 72,150 72,195 C72,240 56,285 56,330 " +
  "C56,375 74,420 74,465 C74,510 60,555 60,600";

const RETURN_TAIL_V =
  "C60,644 172,656 244,618 C316,580 316,78 244,42 C172,6 60,18 60,60";

const NODES_V = [
  { x: 60, y: 60 },
  { x: 72, y: 195 },
  { x: 56, y: 330 },
  { x: 74, y: 465 },
  { x: 60, y: 600 },
];

/* Everything the two orientations disagree about, in one place: the road, the
   nodes, the survey grid, and where a node hangs its name. */
const ACROSS = {
  viewBox: "0 0 1000 420",
  outbound: OUTBOUND,
  loop: `${OUTBOUND} ${RETURN_TAIL}`,
  nodes: NODES,
  grid: [
    ...[0, 1, 2, 3, 4, 5, 6, 7].map((column) => ({
      x1: 60 + column * 126, y1: 26, x2: 60 + column * 126, y2: 394,
    })),
    ...[0, 1, 2, 3].map((row) => ({
      x1: 40, y1: 60 + row * 100, x2: 960, y2: 60 + row * 100,
    })),
  ],
  tick: { x1: 0, y1: 26, x2: 0, y2: 38 },
  /* One block, so the name and the distance beneath it cannot end up on
     different sides of the node. */
  label: { x: 0, anchor: "middle", y: 54, distanceY: 72 },
};

const DOWN = {
  viewBox: "0 0 340 660",
  outbound: OUTBOUND_V,
  loop: `${OUTBOUND_V} ${RETURN_TAIL_V}`,
  nodes: NODES_V,
  grid: [
    ...[0, 1, 2, 3, 4].map((column) => ({
      x1: 24 + column * 72, y1: 18, x2: 24 + column * 72, y2: 642,
    })),
    ...[0, 1, 2, 3, 4, 5].map((row) => ({
      x1: 14, y1: 40 + row * 100, x2: 326, y2: 40 + row * 100,
    })),
  ],
  tick: { x1: 22, y1: 0, x2: 32, y2: 0 },
  label: { x: 40, anchor: "start", y: -2, distanceY: 16 },
};

/* One lap. Slow on purpose — the road is a sentence, not a loading bar. */
const LAP_SECONDS = 22;
const TAIL_LENGTH = 8;

/* Waypoint glyphs, drawn centred on the origin so a node can just translate
   to them. Both gates share one glyph — they are both gates, and a viewer who
   reads more into that is welcome to. */
const GLYPHS = {
  gate: (
    <>
      <path d="M-9,11 L-9,-2 A9,9 0 0 1 9,-2 L9,11" />
      <path d="M-12,11 L12,11" />
      <path d="M-9,1 L9,1" />
    </>
  ),
  wood: (
    <>
      <path d="M-5,11 L-5,6 M-5,6 L-11,6 L-5,-2 L-9,-2 L-5,-9 L-1,-2 L-5,-2 L1,6 L-5,6" />
      <path d="M7,11 L7,3 M7,3 L2,3 L7,-4 L12,3 L7,3" />
    </>
  ),
  narrows: (
    <>
      <path d="M-12,-9 C-6,-7 -3,-3 -3,0 C-3,4 -6,8 -12,10" />
      <path d="M12,-9 C6,-7 3,-3 3,0 C3,4 6,8 12,10" />
      <path d="M0,-11 L0,-6 M0,6 L0,11" />
    </>
  ),
  camp: (
    <>
      <path d="M0,10 C-6,6 -6,0 -2,-4 C-2,-1 0,-1 0,-3 C0,-7 -3,-8 -1,-11 C3,-8 6,-3 6,1 C6,6 3,9 0,10 Z" />
      <path d="M-11,11 L11,11" />
    </>
  ),
};

export default function CursedPath() {
  const [wrapRef, inView] = useInView({ threshold: 0.2 });
  const reduced = useReducedMotion();
  const stacked = useMediaQuery(STACKED);
  const layout = stacked ? DOWN : ACROSS;

  // The waypoint whose card is showing. `hovered` is the visitor taking over;
  // `reached` is the traveller's own progress. Hover wins while it lasts.
  const [reached, setReached] = useState(0);
  const [hovered, setHovered] = useState(null);
  const active = hovered !== null ? hovered : reached;

  const loopRef = useRef(null);
  const travellerRef = useRef(null);
  const tailRefs = useRef([]);
  const nodeRefs = useRef([]);

  const tailIndices = useMemo(
    () => Array.from({ length: TAIL_LENGTH }, (unused, index) => index),
    []
  );

  const setTailRef = useCallback((index) => (element) => {
    tailRefs.current[index] = element;
  }, []);

  const setNodeRef = useCallback((index) => (element) => {
    nodeRefs.current[index] = element;
  }, []);

  useEffect(() => {
    if (reduced || !inView) return undefined;

    const loopPath = loopRef.current;
    const traveller = travellerRef.current;
    if (!loopPath || !traveller) return undefined;

    const total = loopPath.getTotalLength();

    /* Where each waypoint sits along the loop, found by sampling rather than
       by hand — the nodes are authored as coordinates, so their arc lengths
       would otherwise have to be kept in sync by eye. */
    const SAMPLES = 900;
    const nodes = layout.nodes;
    const nodeArcLengths = nodes.map(() => 0);
    const nodeBest = nodes.map(() => Infinity);

    for (let step = 0; step <= SAMPLES; step += 1) {
      const length = (step / SAMPLES) * total;
      const point = loopPath.getPointAtLength(length);
      for (let index = 0; index < nodes.length; index += 1) {
        const dx = point.x - nodes[index].x;
        const dy = point.y - nodes[index].y;
        const distance = dx * dx + dy * dy;
        if (distance < nodeBest[index]) {
          nodeBest[index] = distance;
          nodeArcLengths[index] = length;
        }
      }
    }

    // Everything past this point on the loop is the leg the map does not draw.
    const outboundEnd = nodeArcLengths[nodeArcLengths.length - 1];

    let frame = 0;
    let travelled = 0;
    let lastTime = performance.now();
    let lastReached = -1;
    let running = true;
    const speed = total / LAP_SECONDS;

    const tick = (now) => {
      const delta = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      travelled = (travelled + speed * delta) % total;

      const head = loopPath.getPointAtLength(travelled);
      traveller.setAttribute("transform", `translate(${head.x} ${head.y})`);

      /* Visible only on the drawn road. Past the far gate it dims out over a
         short distance, stays gone for the undrawn leg, and comes back up
         just before the village gate — so it is never seen crossing. */
      /* Proportional, not absolute: the portrait loop is a fraction of the
         landscape one's length, and a fixed 70 units there would dim the wisp
         out most of the way down the road. */
      const FADE = total * 0.028;
      let presence = 1;
      if (travelled > outboundEnd) {
        presence = Math.max(0, 1 - (travelled - outboundEnd) / FADE);
      }
      const untilLap = total - travelled;
      if (untilLap < FADE) {
        presence = Math.max(presence, 1 - untilLap / FADE);
      }
      traveller.style.opacity = String(presence);

      // A tail of samples behind the head. Spacing widens with index so the
      // trail reads as a comet rather than as a string of beads.
      for (let index = 0; index < tailRefs.current.length; index += 1) {
        const element = tailRefs.current[index];
        if (!element) continue;
        const back = (index + 1) * (7 + index * 2.4);
        const at = (travelled - back + total) % total;
        const point = loopPath.getPointAtLength(at);
        element.setAttribute("transform", `translate(${point.x} ${point.y})`);
        // The tail obeys the same rule as the head, per-sample.
        element.style.opacity = at > outboundEnd && total - at > FADE ? "0" : "";
      }

      /* The nearest waypoint behind the traveller is the one it has reached.
         Written straight to the DOM for the flare, and lifted into state only
         when it changes — five renders a lap, not sixty a second. */
      let current = 0;
      for (let index = 0; index < nodeArcLengths.length; index += 1) {
        if (travelled >= nodeArcLengths[index] - 6) current = index;
      }

      for (let index = 0; index < nodeRefs.current.length; index += 1) {
        const element = nodeRefs.current[index];
        if (!element) continue;
        const gap = Math.abs(travelled - nodeArcLengths[index]);
        element.style.setProperty("--flare", gap < 46 ? String(1 - gap / 46) : "0");
      }

      if (current !== lastReached) {
        lastReached = current;
        setReached(current);
      }

      frame = window.requestAnimationFrame(tick);
    };

    const start = () => {
      if (running) return;
      running = true;
      lastTime = performance.now();
      frame = window.requestAnimationFrame(tick);
    };
    const stop = () => {
      running = false;
      window.cancelAnimationFrame(frame);
    };
    const onVisibility = () => (document.hidden ? stop() : start());

    frame = window.requestAnimationFrame(tick);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
    };
    // layout: rotating the map replaces the path the traveller walks, so the
    // arc lengths have to be sampled again from the new geometry.
  }, [reduced, inView, layout]);

  const current = PATH_WAYPOINTS[active] || PATH_WAYPOINTS[0];

  return (
    <Wrapper ref={wrapRef}>
      <Head>
        <span className="hudLabel">{PATH_KICKER}</span>
        <Title className="displayFont textGradient">{PATH_TITLE}</Title>
        <Intro className="font18">{PATH_INTRO}</Intro>
      </Head>

      <MapFrame $in={inView} $stacked={stacked}>
        <Svg viewBox={layout.viewBox} $stacked={stacked} role="img" aria-label={`${PATH_TITLE} — a surveyed map of the road out of the village, from the village gate to the far gate`}>
          <defs>
            <radialGradient id="wispGlow">
              <stop offset="0%" stopColor="#FBE7BC" stopOpacity="1" />
              <stop offset="40%" stopColor="#E8A33D" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#E8A33D" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="roadInk" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#B9741F" />
              <stop offset="45%" stopColor="#E8A33D" />
              <stop offset="100%" stopColor="#F7CE84" />
            </linearGradient>
            <filter id="softBloom" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Faint survey grid — a chart of somewhere real, not a diagram. */}
          <g opacity="0.16">
            {layout.grid.map((line, index) => (
              <line
                key={index}
                x1={line.x1}
                y1={line.y1}
                x2={line.x2}
                y2={line.y2}
                stroke="var(--bone)"
                strokeWidth="0.5"
                strokeDasharray="2 9"
              />
            ))}
          </g>

          {/* The road itself: a wide dim bed with the lit line drawn over it. */}
          <path
            d={layout.outbound}
            fill="none"
            stroke="rgba(232,163,61,0.13)"
            strokeWidth="11"
            strokeLinecap="round"
          />
          <RoadPath key={layout.viewBox} d={layout.outbound} $in={inView} />

          {/* Measured, invisible, and the only thing the traveller follows. */}
          <path ref={loopRef} d={layout.loop} fill="none" stroke="none" />

          {/* Comet tail, then the head, so the head sits on top. */}
          {!reduced &&
            tailIndices.map((index) => (
              <circle
                key={index}
                ref={setTailRef(index)}
                r={3.4 - index * 0.33}
                fill="#F7CE84"
                opacity={0.34 - index * 0.038}
              />
            ))}

          <g ref={travellerRef} transform={`translate(${layout.nodes[0].x} ${layout.nodes[0].y})`}>
            <circle r="19" fill="url(#wispGlow)" />
            <Wisp r="3.6" $still={reduced} />
          </g>

          {/* Waypoints last: they are the thing you read. */}
          {layout.nodes.map((node, index) => {
            const data = PATH_WAYPOINTS[index];
            const isActive = index === active;
            return (
              <Node
                key={data.id}
                ref={setNodeRef(index)}
                transform={`translate(${node.x} ${node.y})`}
                $active={isActive}
                $in={inView}
                $delay={420 + index * 130}
                tabIndex={0}
                role="button"
                aria-label={`${data.name}, ${data.distance}. ${data.lore} ${data.intel.join(". ")}.`}
                onMouseEnter={() => setHovered(index)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(index)}
                onBlur={() => setHovered(null)}
              >
                {/* Generous invisible hit area — the glyph itself is small. */}
                <circle r="34" fill="transparent" />
                <NodeHalo r="26" />
                <NodeRing r="16" />
                <circle r="16" fill="var(--ink)" fillOpacity="0.82" />
                <Glyph transform="scale(0.68)">{GLYPHS[data.icon]}</Glyph>

                {/* Down the page the name goes beside the node, not under it:
                    stacked labels would collide with the next waypoint. */}
                <line
                  x1={layout.tick.x1} y1={layout.tick.y1}
                  x2={layout.tick.x2} y2={layout.tick.y2}
                  stroke="var(--hairline-strong)" strokeWidth="1"
                />
                <NodeLabel
                  x={layout.label.x} y={layout.label.y}
                  textAnchor={layout.label.anchor} $active={isActive}
                >
                  {data.name}
                </NodeLabel>
                <NodeDistance
                  x={layout.label.x} y={layout.label.distanceY}
                  textAnchor={layout.label.anchor} $active={isActive}
                >
                  {data.distance}
                </NodeDistance>
              </Node>
            );
          })}
        </Svg>
      </MapFrame>

      {/* The card the map is pointing at. Fixed height so the page never
          jumps as the traveller moves between waypoints. */}
      <Card aria-live="polite">
        <CardIndex className="displayFont">{String(active + 1).padStart(2, "0")}</CardIndex>
        <CardBody>
          <CardTop>
            <CardName className="displayFont">{current.name}</CardName>
            <CardDistance>{current.distance}</CardDistance>
          </CardTop>
          <CardLore className="loreFont font18" key={current.id}>{current.lore}</CardLore>
          <Chips>
            {current.intel.map((item) => (
              <Chip key={item}>{item}</Chip>
            ))}
          </Chips>
        </CardBody>
      </Card>

      <Facts>
        {PATH_FACTS.map((fact, index) => (
          <Fact key={fact.label} $in={inView} $delay={700 + index * 110}>
            <FactValue className="displayFont">{fact.value}</FactValue>
            <FactLabel>{fact.label}</FactLabel>
          </Fact>
        ))}
      </Facts>
    </Wrapper>
  );
}

/* --- styles --------------------------------------------------------------- */

const Wrapper = styled.div`
  width: 100%;
  margin-top: var(--space-block);
`;

const Head = styled.div`
  max-width: 640px;
  margin-bottom: var(--space-group);
`;

const Title = styled.h2`
  font-size: var(--type-title);
  font-weight: 600;
  margin: 16px 0 14px 0;
`;

const Intro = styled.p`
  color: var(--bone-dim);
  line-height: 1.75;
`;

const MapFrame = styled.div`
  position: relative;
  width: 100%;
  opacity: ${(props) => (props.$in ? 1 : 0)};
  transition: opacity 1s var(--ease-out);

  /* The map used to hold 720px here and scroll sideways behind a mask. It
     read as broken: you saw half a road, the far labels were sliced mid-word,
     and nothing said it moved. The portrait geometry replaces all of that, so
     there is no overflow left to hide. */

  /* A pool of ember light along the road, so the map sits in the world rather
     than floating on the page. It follows the road's axis. */
  &::before {
    content: "";
    position: absolute;
    left: 4%;
    right: 4%;
    top: 30%;
    bottom: 6%;
    background: radial-gradient(60% 70% at 50% 60%, rgba(232, 163, 61, 0.10), transparent 72%);
    pointer-events: none;

    ${(props) => props.$stacked && `
      left: -6%;
      right: 34%;
      top: 4%;
      bottom: 4%;
      background: radial-gradient(58% 46% at 42% 50%, rgba(232, 163, 61, 0.10), transparent 72%);
    `}
  }
`;

/* No min-width any more: the portrait viewBox is authored to fit the viewport
   it is chosen for, so the survey stays legible without being dragged. */
const Svg = styled.svg`
  display: block;
  width: 100%;
  height: auto;
  overflow: visible;

  /* The portrait map is narrow and tall; centring it stops the road hugging
     the left edge on a wide-ish tablet still under the breakpoint. */
  ${(props) => props.$stacked && `
    max-width: 380px;
    margin: 0 auto;
  `}
`;

/* Draws itself once, west to east. pathLength normalises the dash maths so
   the geometry can change without the animation needing new numbers. */
const RoadPath = styled.path.attrs({ pathLength: 1 })`
  fill: none;
  stroke: url(#roadInk);
  stroke-width: 2.4;
  stroke-linecap: round;
  filter: url(#softBloom);
  stroke-dasharray: 1;
  stroke-dashoffset: ${(props) => (props.$in ? 0 : 1)};
  transition: stroke-dashoffset 2.6s var(--ease-out) 0.15s;
`;


const Wisp = styled.circle`
  fill: #FFF6E4;
  animation: ${(props) => (props.$still ? "none" : "breathe 2.6s ease-in-out infinite")};

  @keyframes breathe {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.62; }
  }
`;

const Node = styled.g`
  cursor: pointer;
  outline: none;
  opacity: ${(props) => (props.$in ? 1 : 0)};
  transition: opacity 0.7s var(--ease-out) ${(props) => props.$delay}ms;

  /* --flare is written by the traveller loop: 0 normally, rising to 1 as the
     wisp arrives. Everything that reacts to a pass reads it from here. */
  --flare: 0;

  &:focus-visible circle:nth-of-type(3) {
    stroke: var(--ember-hot);
  }
`;

const NodeHalo = styled.circle`
  fill: var(--ember);
  opacity: calc(0.04 + var(--flare) * 0.2);
  transition: opacity 0.2s linear;
`;

const NodeRing = styled.circle`
  fill: none;
  stroke: var(--ember);
  stroke-width: 1;
  opacity: calc(0.42 + var(--flare) * 0.58);
`;

const Glyph = styled.g`
  fill: none;
  stroke: var(--ember-hot);
  stroke-width: 2.1;
  stroke-linecap: round;
  stroke-linejoin: round;
  opacity: calc(0.72 + var(--flare) * 0.28);
`;

const NodeLabel = styled.text`
  font-family: 'Inter', sans-serif;
  font-size: 12.5px;
  font-weight: 600;
  letter-spacing: 0.06em;
  fill: ${(props) => (props.$active ? "var(--bone)" : "var(--bone-dim)")};
  transition: fill 0.35s var(--ease-soft);
`;

const NodeDistance = styled.text`
  font-family: 'Inter', sans-serif;
  font-size: 10.5px;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  fill: ${(props) => (props.$active ? "var(--ember)" : "var(--bone-faint)")};
  transition: fill 0.35s var(--ease-soft);
`;

const Card = styled.div`
  display: flex;
  gap: 26px;
  align-items: flex-start;
  margin-top: var(--space-group);
  padding: 30px 0 0 0;
  border-top: 1px solid var(--hairline);
  min-height: 178px;

  @media (max-width: 620px) {
    gap: 16px;
    min-height: 210px;
  }
`;

const CardIndex = styled.span`
  font-size: var(--type-numeral);
  line-height: 1;
  color: var(--ember);
  opacity: 0.42;
  min-width: 62px;
`;

const CardBody = styled.div`
  flex: 1;
  min-width: 0;
`;

const CardTop = styled.div`
  display: flex;
  align-items: baseline;
  gap: 18px;
  flex-wrap: wrap;
`;

const CardName = styled.h3`
  font-size: var(--type-heading);
  font-weight: 600;
  color: var(--bone);
`;

const CardDistance = styled.span`
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: var(--ember);
`;

/* Keyed on the waypoint id, so React remounts it and the fade replays each
   time the card changes. */
const CardLore = styled.p`
  color: var(--bone-dim);
  line-height: 1.72;
  max-width: 640px;
  margin-top: 12px;
  animation: loreIn 0.75s var(--ease-out) both;

  @keyframes loreIn {
    from { opacity: 0; transform: translate3d(0, 7px, 0); }
    to { opacity: 1; transform: none; }
  }
`;

const Chips = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 18px;
  flex-wrap: wrap;
`;

const Chip = styled.span`
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--verdigris);
  border: 1px solid rgba(95, 182, 168, 0.28);
  padding: 6px 12px;
`;

const Facts = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  margin-top: var(--space-group);
  padding-top: 34px;
  border-top: 1px solid var(--hairline);

  @media (max-width: 720px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 32px 24px;
  }
`;

const Fact = styled.div`
  opacity: ${(props) => (props.$in ? 1 : 0)};
  transform: translate3d(0, ${(props) => (props.$in ? 0 : 14)}px, 0);
  transition:
    opacity 0.8s var(--ease-out) ${(props) => props.$delay}ms,
    transform 0.8s var(--ease-out) ${(props) => props.$delay}ms;
`;

const FactValue = styled.div`
  font-size: 2.4rem;
  font-weight: 600;
  color: var(--bone);
  line-height: 1.1;
`;

const FactLabel = styled.div`
  font-size: 0.72rem;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--bone-faint);
  margin-top: 6px;
`;
