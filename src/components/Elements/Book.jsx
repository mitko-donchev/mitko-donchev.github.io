import React from "react";
import styled from "styled-components";
import useInView from "../../hooks/useInView";
import useReducedMotion from "../../hooks/useReducedMotion";
import { useLedger } from "../../hooks/useLedger";
import { stageFor, stageName, forecastFor, shortDate } from "../../lib/ledger";

/* The book, open, mid-sentence.

   The left page is set text — abstract rules, because the book's contents are
   not ours to invent. The right page is the moment the game opens on: a line
   of handwriting that draws itself, unprompted, in ember ink. The hand is
   deliberately just past legibility. The protagonist's name is still an open
   question in the design docs, and a website is no place to answer it. */
/* A hand, not a font. It has an ascender, a descender and a trailing flourish
   so it reads as somebody's name — and it stays just short of legible, because
   the protagonist's name is still an open question in the design docs. */
const SIGNATURE =
  "M292,190 c5,-7 9,-9 12,-5 3,5 -1,16 -4,24 -2,6 0,9 4,7 5,-3 9,-10 13,-18 3,-7 7,-7 8,-1 1,6 -1,13 1,17 3,4 8,1 12,-6 3,-6 5,-15 3,-25 -2,-10 -6,-15 -9,-9 -3,7 0,19 5,29 5,10 11,16 17,15 6,-1 10,-7 13,-14 2,-6 6,-6 7,0 1,6 0,12 3,15 4,3 9,0 13,-7 3,-6 7,-5 8,1 1,6 0,12 3,14 4,3 11,-3 18,-14";

export default function Book() {
  const [ref, inView] = useInView({ threshold: 0.3 });
  const reduced = useReducedMotion();
  const record = useLedger();

  /* The three ruled lines below the signature are drawn empty and described
     in this file as "waiting". This is what they were waiting for. BOOK_BODY
     says the book keeps a record of the days and of the road behind you, and
     until now nothing on the site kept a record of anything.

     Entries are built here rather than in the ledger so the drawing decides
     what fits: the ruled line is 154 units wide, which is about twenty
     characters of the italic at this size.

     Nothing appears on a first visit except the date, because that is all
     the book honestly knows yet. */
  const entries = [];
  let forecast = null;
  if (record) {
    entries.push(["first walked", shortDate(record.first)]);
    if (record.visits > 1) {
      entries.push(["returned", record.visits === 2 ? "once" : `${record.visits - 1} times`]);
    }
    if (record.deepest > 0) {
      entries.push(["reached", stageName(stageFor(record.deepest))]);
      forecast = forecastFor(record.deepest);
    }
  }

  return (
    <Frame ref={ref}>
      <Svg viewBox="0 0 520 380" role="img" aria-label="An open book, writing a name on its first page by itself">
        <defs>
          <linearGradient id="pageLeft" x1="1" y1="0" x2="0" y2="0">
            <stop offset="0%" stopColor="#E5DAC2" />
            <stop offset="58%" stopColor="#D6C9AD" />
            <stop offset="100%" stopColor="#B6A98D" />
          </linearGradient>
          <linearGradient id="pageRight" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#E9DFC9" />
            <stop offset="58%" stopColor="#D9CCB1" />
            <stop offset="100%" stopColor="#B9AC90" />
          </linearGradient>
          <linearGradient id="spineShade" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(60,44,24,0)" />
            <stop offset="45%" stopColor="rgba(52,38,20,0.55)" />
            <stop offset="55%" stopColor="rgba(52,38,20,0.55)" />
            <stop offset="100%" stopColor="rgba(60,44,24,0)" />
          </linearGradient>
          <radialGradient id="pageGlow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="#E8A33D" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#E8A33D" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Light coming up off the pages */}
        <ellipse cx="260" cy="210" rx="250" ry="150" fill="url(#pageGlow)" opacity="0.5" />

        {/* Cover, showing as a hair of dark board around the block */}
        <path
          d="M26,92 C110,58 202,58 258,84 C314,58 406,58 490,92 L498,330
             C410,296 316,296 258,320 C200,296 106,296 18,330 Z"
          fill="#20160E"
        />

        <path d="M34,96 C114,64 200,64 254,90 L254,318 C198,294 110,294 26,326 Z" fill="url(#pageLeft)" />
        <path d="M482,96 C402,64 316,64 262,90 L262,318 C318,294 406,294 490,326 Z" fill="url(#pageRight)" />
        <rect x="238" y="66" width="40" height="256" fill="url(#spineShade)" />

        {/* Left page: written long ago, by someone else. */}
        <g stroke="#6A5B41" strokeWidth="2.4" strokeLinecap="round" opacity="0.42">
          {[126, 146, 166, 186, 206, 226, 246, 266].map((y, index) => (
            <line
              key={y}
              x1={62 + (index % 3) * 4}
              y1={y}
              x2={index % 4 === 3 ? 150 : 226 - (index % 2) * 22}
              y2={y - 2}
            />
          ))}
        </g>

        {/* Right page: the first line is a heading rule, and then the hand. */}
        <line x1="292" y1="124" x2="452" y2="118" stroke="#6A5B41" strokeWidth="2" opacity="0.3" />

        {/* Lifted clear of the ruled lines. The signature was authored when
            nothing was written under it and sat straight across the first two
            rules; now that the book keeps a record, the hand belongs at the
            head of the entry rather than through it. The nib rides the same
            group so it cannot come adrift from the stroke. */}
        <g transform="translate(0 -26)">
          <Hand d={SIGNATURE} $in={inView} $still={reduced} />

        {/* The nib, riding the end of the stroke. */}
        {!reduced && inView && (
          <Nib r="2.6" fill="#F7CE84">
            <animateMotion
              dur="11s"
              repeatCount="indefinite"
              keyPoints="0;1;1"
              keyTimes="0;0.3;1"
              calcMode="linear"
              path={SIGNATURE}
            />
            {/* Off the page for the long hold, so there is no bright dot
                parked at the end of the stroke. */}
            <animate
              attributeName="opacity"
              dur="11s"
              repeatCount="indefinite"
              values="1;1;0;0"
              keyTimes="0;0.3;0.34;1"
            />
          </Nib>
        )}
        </g>

        {/* Lines below it, waiting — and, once there is a record, written on. */}
        <g stroke="#6A5B41" strokeWidth="2" strokeLinecap="round" opacity="0.2">
          {[214, 240, 266].map((y) => (
            <line key={y} x1="292" y1={y} x2="446" y2={y - 3} />
          ))}
        </g>

        {entries.map(([label, value], index) => {
          const y = [214, 240, 266][index] - 6;
          return (
            <g key={label}>
              <Entry x="292" y={y} $delay={index}>{label}</Entry>
              <Entry x="446" y={y - 2} textAnchor="end" $delay={index}>{value}</Entry>
            </g>
          );
        })}

        {/* Written where there is no line for it. */}
        {forecast && <Forecast x="446" y="296" textAnchor="end">{forecast}</Forecast>}
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

const Svg = styled.svg`
  display: block;
  width: 100%;
  height: auto;
  overflow: visible;
  filter: drop-shadow(0 36px 60px rgba(0, 0, 0, 0.6));
`;

/* Draws, holds a long time, fades, and waits before starting again.

   This used to run on a 4.6s loop. Next to a column of body copy that is
   movement in the reader's periphery every few seconds, which pulls the eye
   off the sentence they are on. Most of the eleven seconds is now the held
   state — the idea survives, the distraction does not. */
const Hand = styled.path.attrs({ pathLength: 1 })`
  fill: none;
  stroke: #8A5A1E;
  stroke-width: 2.6;
  stroke-linecap: round;
  stroke-linejoin: round;
  filter: drop-shadow(0 0 6px rgba(232, 163, 61, 0.55));
  stroke-dasharray: 1;
  stroke-dashoffset: ${(props) => (props.$in ? 0 : 1)};

  ${(props) =>
    props.$still
      ? ""
      : props.$in
      ? "animation: write 11s var(--ease-soft) infinite;"
      : ""}

  @keyframes write {
    0% { stroke-dashoffset: 1; opacity: 1; }
    30% { stroke-dashoffset: 0; opacity: 1; }
    82% { stroke-dashoffset: 0; opacity: 1; }
    92% { stroke-dashoffset: 0; opacity: 0; }
    100% { stroke-dashoffset: 1; opacity: 0; }
  }
`;

const Nib = styled.circle`
  filter: drop-shadow(0 0 8px rgba(247, 206, 132, 0.9));
`;

/* The same ink as the signature above it, in the serif the page already
   loads — a handwriting face would be a second font request for six words,
   and the italic at this size reads as a hand well enough on a drawn page.

   Faded up rather than drawn: the signature is the thing that writes itself,
   and two things writing on one page is one too many.

   The keyframes have distinct names on purpose. A bare @keyframes inside a
   styled template is a GLOBAL name, not a scoped one, so two components
   declaring `inkIn` with different end states would fight over whichever was
   injected last. */
const Entry = styled.text`
  font-family: 'Cormorant Garamond', 'Iowan Old Style', Georgia, serif;
  font-style: italic;
  font-size: 15px;
  fill: #6B4A1C;
  opacity: 0;
  animation: inkIn 1.4s var(--ease-out) ${(props) => 900 + (props.$delay || 0) * 260}ms forwards;

  @keyframes inkIn {
    to { opacity: 0.82; }
  }

  @media (prefers-reduced-motion: reduce) {
    opacity: 0.82;
    animation: none;
  }
`;

/* One place further than they have been. Fainter than the record, because it
   is not a record of anything. */
const Forecast = styled(Entry)`
  font-size: 13.5px;
  fill: #8A5A1E;
  animation: inkInFaint 1.6s var(--ease-out) 2100ms forwards;

  @keyframes inkInFaint {
    to { opacity: 0.42; }
  }

  @media (prefers-reduced-motion: reduce) {
    opacity: 0.42;
    animation: none;
  }
`;
