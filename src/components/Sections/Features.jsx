import React, { useCallback, useRef } from "react";
import styled from "styled-components";
// Components
import WishlistButton from "../Buttons/WishlistButton";
import Reveal from "../Elements/Reveal";
// Hooks
import useReducedMotion from "../../hooks/useReducedMotion";
// Config
import { GAME_NAME } from "../../config/links";

/* Four claims, each one traceable to something that actually exists in the
   build. Nothing here describes the road's real trick — that is the game's to
   spend, not the site's. */
const FEATURES = [
  {
    icon: "book",
    title: "A book you did not write",
    body:
      "The game is named after it, and you carry it. It keeps a record of the days and the road behind you, and it keeps something that reads like a forecast. Nobody has explained the handwriting.",
  },
  {
    icon: "bow",
    title: "Bow first, and a way out",
    body:
      "Fast, readable ranged combat with a leap bound to Q that buys back the distance you just lost. The boss does not flinch when you chip it, commits the swing it aimed, and closes under fire.",
  },
  {
    icon: "chest",
    title: "Risk priced honestly",
    body:
      "A chest opens on a three-second hold, and taking a hit resets it to nothing. Which means the two chests behind the skeleton camp are not really chests — they are the camp, asked politely.",
  },
  {
    icon: "forge",
    title: "Built in the open",
    body:
      "Made in Godot by two people who wanted a game nobody was making. No publisher setting the date, no storefront tricks — we ship it when it is ready and we say so out loud while we work.",
  },
];

/* Thin, carved line-work — the same hand as the waypoint glyphs on the map. */
const ICONS = {
  book: (
    <>
      <path d="M6 10c5-3 11-3 15 0 4-3 10-3 15 0v25c-5-3-11-3-15 0-4-3-10-3-15 0z" />
      <path d="M21 10v25" />
      <path d="M26 18c3-1 6-1 8-1M26 24c3-1 6-1 8-1" />
    </>
  ),
  bow: (
    <>
      <path d="M32 6C20 12 20 30 32 36" />
      <path d="M32 6L32 36" />
      <path d="M9 21h20" />
      <path d="M9 21l5-4M9 21l5 4" />
    </>
  ),
  chest: (
    <>
      <path d="M7 19a14 8 0 0 1 28 0v14H7z" />
      <path d="M7 24h28" />
      <path d="M21 21v6" />
      <circle cx="21" cy="28" r="1.6" />
    </>
  ),
  forge: (
    <>
      <path d="M21 34c-6-3-8-8-5-13 0 3 2 4 3 2 1-3-2-5 0-9 4 3 8 7 8 12 0 4-2 7-6 8z" />
      <path d="M8 38h26" />
      <path d="M12 30l-3 4M30 30l3 4" />
    </>
  ),
};

export default function Features() {
  return (
    <Wrapper id="features" className="container">
      <hr className="divider" />

      <Head>
        <Reveal>
          <span className="hudLabel">02 — What it is</span>
        </Reveal>
        <Reveal delay={80}>
          <Title className="displayFont">
            Four things <Accent className="textGradient">{GAME_NAME}</Accent> is sure about
          </Title>
        </Reveal>
      </Head>

      <Grid>
        {FEATURES.map((feature, index) => (
          <Reveal key={feature.title} delay={index * 90}>
            <Card icon={ICONS[feature.icon]} title={feature.title} body={feature.body} index={index} />
          </Reveal>
        ))}
      </Grid>

      <Reveal>
        <Teaser>
          <TeaserTitle className="displayFont">Follow the road from here.</TeaserTitle>
          <TeaserBody className="font18">
            {GAME_NAME} has no date yet, and we would rather say so than invent one.
            Wishlist it and you will hear the moment the demo is real.
          </TeaserBody>
          <TeaserAction>
            <WishlistButton />
          </TeaserAction>
        </Teaser>
      </Reveal>
    </Wrapper>
  );
}

/* A card that leans very slightly toward the pointer and lights where the
   pointer is. Both are driven by CSS variables written inside a rAF, so a
   moving mouse never queues a React render. The tilt is small on purpose —
   past about six degrees it stops reading as depth and starts reading as a
   toy. */
function Card({ icon, title, body, index }) {
  const ref = useRef(null);
  const frame = useRef(0);
  const reduced = useReducedMotion();

  const onPointerMove = useCallback(
    (event) => {
      if (reduced) return;
      const node = ref.current;
      if (!node) return;

      const rect = node.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;

      window.cancelAnimationFrame(frame.current);
      frame.current = window.requestAnimationFrame(() => {
        node.style.setProperty("--tilt-x", `${(0.5 - y) * 5}deg`);
        node.style.setProperty("--tilt-y", `${(x - 0.5) * 5}deg`);
        node.style.setProperty("--spot-x", `${x * 100}%`);
        node.style.setProperty("--spot-y", `${y * 100}%`);
      });
    },
    [reduced]
  );

  const onPointerLeave = useCallback(() => {
    const node = ref.current;
    if (!node) return;
    window.cancelAnimationFrame(frame.current);
    node.style.setProperty("--tilt-x", "0deg");
    node.style.setProperty("--tilt-y", "0deg");
  }, []);

  return (
    <Plate ref={ref} onPointerMove={onPointerMove} onPointerLeave={onPointerLeave}>
      <Index className="displayFont">{String(index + 1).padStart(2, "0")}</Index>
      <IconWrap>
        <svg viewBox="0 0 42 42" fill="none" stroke="currentColor" strokeWidth="1.5"
          strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          {icon}
        </svg>
      </IconWrap>
      <CardTitle className="displayFont">{title}</CardTitle>
      <CardBody>{body}</CardBody>
    </Plate>
  );
}

/* --- styles --------------------------------------------------------------- */

const Wrapper = styled.section`
  width: 100%;
  padding-top: var(--space-section);
  padding-bottom: var(--space-section);
`;

const Head = styled.div`
  margin-top: var(--space-group);
  margin-bottom: var(--space-group);
  max-width: 760px;
`;

const Title = styled.h2`
  /* Its own ceiling: the shared --type-title maxes at 3.6rem and this
     heading has always been 3.4rem on a desktop. */
  font-size: clamp(2.3rem, 7.6vw, 3.4rem);
  font-weight: 600;
  margin-top: 18px;
  color: var(--bone);
`;

const Accent = styled.span``;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 22px;

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
  }
`;

const Plate = styled.div`
  --tilt-x: 0deg;
  --tilt-y: 0deg;
  --spot-x: 50%;
  --spot-y: 0%;

  position: relative;
  height: 100%;
  padding: 38px 36px 40px 36px;
  border: 1px solid var(--hairline);
  background: linear-gradient(155deg, rgba(255, 255, 255, 0.028), rgba(255, 255, 255, 0.006));
  transform: perspective(900px) rotateX(var(--tilt-x)) rotateY(var(--tilt-y));
  transform-style: preserve-3d;
  transition: transform 0.45s var(--ease-out), border-color 0.4s var(--ease-soft);
  overflow: hidden;

  /* The light the pointer carries. */
  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: radial-gradient(320px circle at var(--spot-x) var(--spot-y),
      rgba(232, 163, 61, 0.1), transparent 62%);
    opacity: 0;
    transition: opacity 0.4s var(--ease-soft);
    pointer-events: none;
  }

  &:hover {
    border-color: rgba(232, 163, 61, 0.28);
  }

  &:hover::before {
    opacity: 1;
  }

  @media (prefers-reduced-motion: reduce) {
    transform: none;
  }

  @media (max-width: 560px) {
    padding: 30px 26px 32px 26px;
  }
`;

const Index = styled.span`
  position: absolute;
  top: 26px;
  right: 30px;
  font-size: 1.6rem;
  color: var(--ember);
  opacity: 0.24;
`;

const IconWrap = styled.div`
  width: 42px;
  height: 42px;
  color: var(--ember);
  margin-bottom: 26px;

  svg {
    width: 100%;
    height: 100%;
    filter: drop-shadow(0 0 14px rgba(232, 163, 61, 0.35));
  }
`;

const CardTitle = styled.h3`
  font-size: 1.85rem;
  font-weight: 600;
  color: var(--bone);
  margin-bottom: 14px;
  max-width: 22ch;
`;

const CardBody = styled.p`
  color: var(--bone-dim);
  font-size: 0.95rem;
  line-height: 1.75;
  max-width: 46ch;
`;

const Teaser = styled.div`
  max-width: 620px;
  margin: var(--space-block) auto 0 auto;
  text-align: center;
`;

const TeaserTitle = styled.h2`
  font-size: var(--type-subtitle);
  font-weight: 600;
  color: var(--bone);

  @media (max-width: 760px) {
  }
`;

const TeaserBody = styled.p`
  color: var(--bone-dim);
  line-height: 1.8;
  margin: 20px 0 34px 0;
`;

const TeaserAction = styled.div`
  width: 240px;
  margin: 0 auto;
`;
