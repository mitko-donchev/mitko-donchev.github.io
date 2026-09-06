import React, { useEffect, useState } from "react";
import styled from "styled-components";
// Hooks
import useInView from "../../hooks/useInView";
import useReducedMotion from "../../hooks/useReducedMotion";
// Config
import { BESTIARY, BESTIARY_INTRO } from "../../config/links";

/* A true-scale line-up.

   The heights are the measured silhouettes from the build, not artistic
   licence, so the strip is doing the same job the game does at a glance:
   telling the tiers apart before any number is read. Everything is laid out
   against one pixels-per-metre constant, and the hero's own height is ruled
   across the whole row — which is the only reason the golem lands. */

const HERO_HEIGHT = BESTIARY.find((entry) => entry.friendly).height;

/* One SVG holds the whole line-up, so the four figures cannot drift out of
   scale with each other when the page is resized — which is exactly what
   happened when each had its own box: `preserveAspectRatio` fitted every
   figure to its column WIDTH, and a 4.23 m golem rendered the same height as
   a 1.80 m elf.

   100 user units to the metre. Figures are authored in a 100-unit-tall box
   standing on y=100 and are placed with translate + scale, so a figure's
   drawing never has to know how tall its creature is. */
const UNITS_PER_METRE = 72;
const GROUND = 344;
const VIEW_WIDTH = 1000;
const VIEW_HEIGHT = 384;
const COLUMN = VIEW_WIDTH / BESTIARY.length;

/* Figures are authored in a 100-unit box standing on y=100. `top` is the
   highest ink in that box, and the layout uses it to make the drawn head —
   not the empty box — land on the creature's real height.

   Strokes are non-scaling, so these widths are pixels: mass is carried by
   silhouette and by a deliberate step in weight per tier, not by the scale
   factor, which would render the golem in tree trunks. */
const FIGURES = {
  hero: {
    top: 5.5,
    art: (
      <g strokeWidth="1.5">
        <circle cx="52" cy="13" r="7.5" />
        <path d="M52,21 L52,57" />
        <path d="M52,30 L38,38" />
        <path d="M52,30 L63,25" />
        {/* bow + string */}
        <path d="M33,19 C24,33 24,45 33,59" />
        <path d="M33,19 L33,59" strokeWidth="0.9" />
        <path d="M52,57 L44,100" />
        <path d="M52,57 L60,100" />
      </g>
    ),
  },
  minion: {
    top: 5,
    art: (
      <g strokeWidth="1.5">
        <circle cx="50" cy="12" r="7" />
        <path d="M50,19 L50,52" />
        {/* Ribs read before anything else does. Arms hang from the shoulders
            rather than from the spine, so they frame the ribs instead of
            crossing them out. */}
        <path d="M44,27 L56,27" strokeWidth="1" />
        <path d="M44,33 L56,33" strokeWidth="1" />
        <path d="M45,39 L55,39" strokeWidth="1" />
        <path d="M44,24 L39,51" />
        <path d="M56,24 L61,51" />
        <path d="M45,52 L55,52" />
        <path d="M46,52 L42,100" />
        <path d="M54,52 L58,100" />
      </g>
    ),
  },
  elite: {
    top: 5,
    art: (
      <g strokeWidth="1.9">
        <circle cx="47" cy="12.5" r="7.5" />
        <path d="M36,24 L59,24" />
        <path d="M47,20 L47,55" />
        <path d="M42,31 L54,31" strokeWidth="1.2" />
        <path d="M42,38 L54,38" strokeWidth="1.2" />
        <path d="M36,24 L32,52" />
        {/* Sword arm: elbow, then the blade above it. */}
        <path d="M59,24 L66,35" />
        <path d="M66,35 L75,10" strokeWidth="1.7" />
        <path d="M68,30 L75,32" strokeWidth="1.3" />
        <path d="M42,55 L53,55" />
        <path d="M43,55 L39,100" />
        <path d="M52,55 L57,100" />
      </g>
    ),
  },
  boss: {
    top: 5,
    art: (
      <g strokeWidth="2.6">
        {/* Head sunk low and small — the proportion that keeps a big figure
            from reading as a tall person. */}
        <circle cx="50" cy="17" r="5.5" />
        {/* One heavy hunched shoulder mass, narrower than a sandwich board */}
        <path d="M31,30 C36,20 64,20 69,30" strokeWidth="4.5" />
        <path d="M34,31 L39,56" />
        <path d="M66,31 L61,56" />
        <path d="M39,56 L61,56" strokeWidth="3.4" />
        {/* Long heavy arms, hanging past the hips */}
        <path d="M32,32 L27,63" strokeWidth="3.6" />
        <path d="M68,32 L74,61" strokeWidth="3.6" />
        {/* Two-handed maul carried low */}
        <path d="M27,72 L72,53" strokeWidth="2.4" />
        <path d="M68,46 L79,59" strokeWidth="6" strokeLinecap="butt" />
        {/* Short, wide-set, heavy legs */}
        <path d="M42,56 L37,100" strokeWidth="3.8" />
        <path d="M58,56 L64,100" strokeWidth="3.8" />
      </g>
    ),
  },
};

/* Counts a metre value up as the strip arrives. Small enough to live here;
   it exists only so the numbers land with the figures instead of before. */
function CountUp({ value, active, delay = 0 }) {
  const [shown, setShown] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!active) return undefined;
    if (reduced) {
      setShown(value);
      return undefined;
    }

    let frame = 0;
    let start = 0;
    const duration = 900;

    const step = (now) => {
      if (!start) start = now + delay;
      const elapsed = now - start;
      if (elapsed < 0) {
        frame = window.requestAnimationFrame(step);
        return;
      }
      const progress = Math.min(1, elapsed / duration);
      // Same ease as the entrance, so number and figure settle together.
      const eased = 1 - Math.pow(1 - progress, 3);
      setShown(value * eased);
      if (progress < 1) frame = window.requestAnimationFrame(step);
    };

    frame = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(frame);
  }, [active, value, delay, reduced]);

  return <>{shown.toFixed(2)}</>;
}

export default function Bestiary() {
  const [ref, inView] = useInView({ threshold: 0.25 });
  const [active, setActive] = useState(null);

  return (
    <Wrapper ref={ref}>
      <Head>
        <span className="hudLabel">What walks it</span>
        <Intro className="font18">{BESTIARY_INTRO}</Intro>
      </Head>

      <Strip>
        <StripSvg
          viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
          role="img"
          aria-label={BESTIARY.map((e) => `${e.name}, ${e.height} metres`).join("; ")}
        >
          {/* Ground */}
          <GroundLine
            x1="0"
            y1={GROUND}
            x2={VIEW_WIDTH}
            y2={GROUND}
            $in={inView}
          />

          {/* The hero's height, ruled across everything. Without it the row is
              four drawings; with it, it is a measurement. */}
          <g opacity={inView ? 1 : 0} style={{ transition: "opacity 0.9s var(--ease-out) 0.7s" }}>
            <line
              x1="0"
              y1={GROUND - HERO_HEIGHT * UNITS_PER_METRE}
              x2={VIEW_WIDTH}
              y2={GROUND - HERO_HEIGHT * UNITS_PER_METRE}
              stroke="rgba(232, 163, 61, 0.34)"
              strokeWidth="1"
              strokeDasharray="5 7"
              vectorEffect="non-scaling-stroke"
            />
            <EyeLine x="0" y={GROUND - HERO_HEIGHT * UNITS_PER_METRE - 11} textAnchor="start">
              {HERO_HEIGHT.toFixed(2)} m — your eye line
            </EyeLine>
          </g>

          {BESTIARY.map((entry, index) => {
            const figure = FIGURES[entry.id];
            /* Uniform scale chosen so the figure's highest ink lands exactly
               on its real height above the ground — the empty headroom in the
               100-unit box must not count toward the measurement. */
            const scale = (entry.height * UNITS_PER_METRE) / (100 - figure.top);
            const centre = COLUMN * (index + 0.5);
            const isActive = active === entry.id;
            return (
              <FigureGroup
                key={entry.id}
                $in={inView}
                $delay={index * 130}
                $active={isActive}
                $friendly={entry.friendly}
                tabIndex={0}
                role="button"
                aria-label={`${entry.name}, ${entry.kind}, ${entry.height} metres, ${entry.stat}`}
                onMouseEnter={() => setActive(entry.id)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(entry.id)}
                onBlur={() => setActive(null)}
              >
                {/* Hit area, and the pool of light it stands in */}
                <rect
                  x={COLUMN * index}
                  y={GROUND - entry.height * UNITS_PER_METRE - 20}
                  width={COLUMN}
                  height={entry.height * UNITS_PER_METRE + 34}
                  fill="transparent"
                />
                <ellipse
                  cx={centre}
                  cy={GROUND + 3}
                  rx={38 * Math.sqrt(scale)}
                  ry={7 * Math.sqrt(scale)}
                  fill={entry.friendly ? "rgba(95,182,168,0.16)" : "rgba(232,163,61,0.16)"}
                />

                {/* Feet on the ground, height in metres, every time. */}
                <g
                  transform={`translate(${centre - 50 * scale} ${GROUND - 100 * scale}) scale(${scale})`}
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                >
                  {figure.art}
                </g>
              </FigureGroup>
            );
          })}
        </StripSvg>
      </Strip>

      <Legend>
        {BESTIARY.map((entry, index) => {
          const isActive = active === entry.id;
          return (
            <LegendItem
              key={entry.id}
              $active={isActive}
              $friendly={entry.friendly}
              onMouseEnter={() => setActive(entry.id)}
              onMouseLeave={() => setActive(null)}
            >
              <LegendKind $friendly={entry.friendly}>{entry.kind}</LegendKind>
              <LegendName className="displayFont">{entry.name}</LegendName>
              <LegendHeight className="displayFont">
                <CountUp value={entry.height} active={inView} delay={index * 130} /> m
              </LegendHeight>
              <LegendStat>{entry.stat}</LegendStat>
              <LegendNote className="loreFont">{entry.note}</LegendNote>
            </LegendItem>
          );
        })}
      </Legend>
    </Wrapper>
  );
}

/* --- styles --------------------------------------------------------------- */

const Wrapper = styled.div`
  width: 100%;
  margin-top: 130px;
`;

const Head = styled.div`
  max-width: 620px;
  margin-bottom: 60px;
`;

const Intro = styled.p`
  color: var(--bone-dim);
  line-height: 1.75;
  margin-top: 18px;
`;

const Strip = styled.div`
  width: 100%;
  margin-bottom: 34px;

  /* Same reasoning as the map: the line-up only means anything if the
     heights can be compared, so on a phone it holds its size and scrolls. */
  @media (max-width: 860px) {
    overflow-x: auto;
    overflow-y: hidden;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    -webkit-mask-image: linear-gradient(90deg, transparent 0, #000 18px,
      #000 calc(100% - 18px), transparent 100%);
    mask-image: linear-gradient(90deg, transparent 0, #000 18px,
      #000 calc(100% - 18px), transparent 100%);

    ::-webkit-scrollbar {
      display: none;
    }
  }
`;

/* Height comes from the viewBox aspect, so the whole line-up scales as one
   piece and the relative heights survive any viewport. */
const StripSvg = styled.svg`
  display: block;
  width: 100%;
  height: auto;
  overflow: visible;

  @media (max-width: 860px) {
    width: 720px;
    min-width: 720px;
  }
`;

const GroundLine = styled.line`
  stroke: var(--hairline-strong);
  stroke-width: 1;
  vector-effect: non-scaling-stroke;
  transform: scaleX(${(props) => (props.$in ? 1 : 0.15)});
  transform-origin: 50% 50%;
  opacity: ${(props) => (props.$in ? 1 : 0)};
  transition: transform 1.2s var(--ease-out), opacity 0.6s var(--ease-out);
`;

const EyeLine = styled.text`
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  fill: var(--ember);
  opacity: 0.8;
`;

/* Rises out of the ground: the origin is the feet, so the baseline holds and
   only the height grows. */
const FigureGroup = styled.g`
  cursor: pointer;
  outline: none;
  transform-box: fill-box;
  transform-origin: 50% 100%;
  opacity: ${(props) => (props.$in ? 1 : 0)};
  transform: scaleY(${(props) => (props.$in ? 1 : 0.02)});
  transition:
    opacity 0.55s var(--ease-out) ${(props) => props.$delay}ms,
    transform 1.05s var(--ease-out) ${(props) => props.$delay}ms;

  path,
  circle {
    stroke: ${(props) =>
      props.$friendly
        ? props.$active ? "var(--verdigris-hot)" : "var(--verdigris)"
        : props.$active ? "var(--ember-hot)" : "var(--bone-dim)"};
    transition: stroke 0.4s var(--ease-soft);
  }

  ellipse {
    transition: opacity 0.4s var(--ease-soft);
    opacity: ${(props) => (props.$active ? 1 : 0.55)};
  }

  filter: ${(props) =>
    props.$active
      ? `drop-shadow(0 0 14px ${props.$friendly ? "rgba(95,182,168,0.55)" : "rgba(232,163,61,0.5)"})`
      : "none"};

  :focus-visible path,
  :focus-visible circle {
    stroke: var(--ember-hot);
  }

  @media (prefers-reduced-motion: reduce) {
    transform: none;
    opacity: 1;
  }
`;

const Legend = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-top: 40px;
  padding: 0 4%;

  @media (max-width: 860px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 34px 20px;
    padding: 0;
  }
  @media (max-width: 460px) {
    grid-template-columns: 1fr;
  }
`;

const LegendItem = styled.div`
  text-align: center;
  cursor: pointer;
  opacity: ${(props) => (props.$active ? 1 : 0.82)};
  transition: opacity 0.3s var(--ease-soft);

  @media (max-width: 860px) {
    text-align: left;
  }
`;

const LegendKind = styled.div`
  font-size: 0.62rem;
  font-weight: 600;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: ${(props) => (props.$friendly ? "var(--verdigris)" : "var(--ember)")};
`;

const LegendName = styled.div`
  font-size: 1.5rem;
  color: var(--bone);
  margin-top: 6px;
  line-height: 1.2;
`;

const LegendHeight = styled.div`
  font-size: 1rem;
  color: var(--bone-dim);
  font-variant-numeric: tabular-nums;
  margin-top: 2px;
`;

const LegendStat = styled.div`
  font-size: 0.72rem;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--bone-faint);
  margin-top: 10px;
`;

const LegendNote = styled.p`
  font-size: 1rem;
  color: var(--bone-dim);
  line-height: 1.55;
  margin-top: 12px;
  opacity: 0.85;
`;
