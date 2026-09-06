import React from "react";
import styled from "styled-components";
// Components
import WishlistButton from "../Buttons/WishlistButton";
import Reveal from "../Elements/Reveal";
import CursedPath from "./CursedPath";
import Bestiary from "./Bestiary";
import Gate from "../Elements/Gate";
import Book from "../Elements/Book";
// Config
import {
  GAME_NAME,
  GAME_GENRE,
  GAME_SUBTITLE,
  GAME_SYNOPSIS,
  BOOK_KICKER,
  BOOK_TITLE,
  BOOK_BODY,
  BOOK_QUESTION,
  GAME_VERSE_LEAD,
  GAME_VERSE,
  GAME_VERSE_TAIL,
  GAME_RELEASE,
  GAME_DEMO,
  GAME_PLATFORM,
  GAME_ENGINE,
} from "../../config/links";

const STATS = [
  { label: "Release", value: GAME_RELEASE },
  { label: "Demo", value: GAME_DEMO },
  { label: "Platform", value: GAME_PLATFORM },
  { label: "Engine", value: GAME_ENGINE },
];

export default function AboutGame() {
  return (
    <Wrapper id="game" className="container">
      <hr className="divider" />

      <Lede>
        <Copy>
          <Reveal>
            <span className="hudLabel">01 — The Game</span>
          </Reveal>
          <Reveal delay={80}>
            <Title className="displayFont textGradient">{GAME_NAME}</Title>
          </Reveal>
          <Reveal delay={140}>
            <Genre>{GAME_GENRE}</Genre>
          </Reveal>
          <Reveal delay={170}>
            <Subtitle className="loreFont">{GAME_SUBTITLE}</Subtitle>
          </Reveal>
          {GAME_SYNOPSIS.map((paragraph, index) => (
            <Reveal key={paragraph.slice(0, 24)} delay={200 + index * 70}>
              <SynopsisP className="font18">{paragraph}</SynopsisP>
            </Reveal>
          ))}
        </Copy>

        <GateColumn>
          <Reveal delay={160} y={40}>
            <Gate />
          </Reveal>
        </GateColumn>
      </Lede>

      {/* The object the game is named after, and the reason it opens the way
          it does. */}
      <BookBeat>
        <BookArt>
          <Reveal y={34}>
            <Book />
          </Reveal>
        </BookArt>
        <BookCopy>
          <Reveal delay={60}>
            <span className="hudLabel">{BOOK_KICKER}</span>
          </Reveal>
          <Reveal delay={120}>
            <BookTitle className="displayFont">{BOOK_TITLE}</BookTitle>
          </Reveal>
          {BOOK_BODY.map((paragraph, index) => (
            <Reveal key={paragraph.slice(0, 20)} delay={180 + index * 70}>
              <SynopsisP className="font18">{paragraph}</SynopsisP>
            </Reveal>
          ))}
          <Reveal delay={340}>
            <BookQuestion className="loreFont font18">{BOOK_QUESTION}</BookQuestion>
          </Reveal>
        </BookCopy>
      </BookBeat>

      {/* The verse gets the full width and a lot of air. It is the only place
          on the page where the village speaks, so nothing shares the room. */}
      <Reveal delay={60}>
        <Verse>
          <VerseFade className="loreFont font18">{GAME_VERSE_LEAD}</VerseFade>
          {GAME_VERSE.map((line, index) => (
            <VerseLine key={line} className="loreFont" style={{ transitionDelay: `${index * 90}ms` }}>
              {line}
            </VerseLine>
          ))}
          <VerseFade className="loreFont font18" $trailing>
            {GAME_VERSE_TAIL}
          </VerseFade>
        </Verse>
      </Reveal>

      {/* The centrepiece — the arena as a map, walked on a loop. */}
      <CursedPath />

      {/* And what is standing on it. */}
      <Bestiary />

      <Reveal>
        <StatusRow>
          {STATS.map((stat) => (
            <Stat key={stat.label}>
              <StatLabel>{stat.label}</StatLabel>
              <StatValue className="displayFont">{stat.value}</StatValue>
            </Stat>
          ))}
          <StatAction>
            <WishlistButton />
          </StatAction>
        </StatusRow>
      </Reveal>
    </Wrapper>
  );
}

const Wrapper = styled.section`
  width: 100%;
  padding-top: var(--space-section);
  padding-bottom: var(--space-section);
`;

const Lede = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr);
  gap: 70px;
  align-items: center;
  margin-top: 88px;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
    gap: 48px;
    margin-top: 60px;
  }
`;

const Copy = styled.div`
  min-width: 0;
`;

const GateColumn = styled.div`
  min-width: 0;
  @media (max-width: 960px) {
    order: -1;
  }
`;

const Title = styled.h2`
  font-size: var(--type-display);
  font-weight: 600;
  line-height: 1;
  margin: 20px 0 10px 0;
`;

const Subtitle = styled.p`
  font-size: 1.5rem;
  color: var(--bone-dim);
  margin-bottom: 30px;
  @media (max-width: 960px) {
    font-size: 1.25rem;
  }
`;

const BookBeat = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr);
  gap: 70px;
  align-items: center;
  margin-top: var(--space-block);

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
    gap: 44px;
  }
`;

const BookArt = styled.div`
  min-width: 0;
`;

const BookCopy = styled.div`
  min-width: 0;
`;

const BookTitle = styled.h3`
  /* 3rem at the top end, where --type-subtitle stops at 2.8rem. */
  font-size: clamp(2rem, 6.8vw, 3rem);
  font-weight: 600;
  color: var(--bone);
  margin: 18px 0 26px 0;
`;

/* The open question, set apart. The site is allowed to ask it. */
const BookQuestion = styled.p`
  margin-top: 26px;
  padding-left: 22px;
  border-left: 1px solid rgba(232, 163, 61, 0.35);
  color: var(--ember);
  line-height: 1.7;
  max-width: 480px;
`;

const Genre = styled.p`
  color: var(--verdigris);
  font-size: 0.72rem;
  font-weight: 500;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  margin-bottom: 32px;
`;

const SynopsisP = styled.p`
  max-width: 560px;
  color: var(--bone-dim);
  line-height: 1.8;
  margin-bottom: 20px;
`;

/* The verse, set as a rubbing taken from something older than the page: the
   stanza reads clean and the lines above and below it dissolve at the torn
   edge. */
const Verse = styled.blockquote`
  max-width: 720px;
  margin: 120px auto;
  padding: 0;
  text-align: center;

  @media (max-width: 760px) {
    margin: 80px auto;
  }
`;

const VerseLine = styled.p`
  margin: 0;
  font-size: 1.9rem;
  font-weight: 400;
  line-height: 1.85;
  color: var(--bone);
  text-shadow: 0 0 40px rgba(232, 163, 61, 0.18);

  @media (max-width: 760px) {
    font-size: 1.35rem;
    line-height: 1.7;
  }
`;

const VerseFade = styled.p`
  margin: ${(props) => (props.$trailing ? "22px 0 0 0" : "0 0 22px 0")};
  color: var(--bone-faint);
  line-height: 1.8;
  -webkit-mask-image: ${(props) =>
    props.$trailing
      ? "linear-gradient(100deg, rgba(0,0,0,1) 24%, rgba(0,0,0,0) 94%)"
      : "linear-gradient(280deg, rgba(0,0,0,1) 32%, rgba(0,0,0,0) 100%)"};
  mask-image: ${(props) =>
    props.$trailing
      ? "linear-gradient(100deg, rgba(0,0,0,1) 24%, rgba(0,0,0,0) 94%)"
      : "linear-gradient(280deg, rgba(0,0,0,1) 32%, rgba(0,0,0,0) 100%)"};
`;

const StatusRow = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 56px;
  margin-top: var(--space-block);
  padding-top: 36px;
  border-top: 1px solid var(--hairline);
  flex-wrap: wrap;
`;

const Stat = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const StatLabel = styled.span`
  font-size: 0.68rem;
  font-weight: 500;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: var(--bone-faint);
`;

const StatValue = styled.span`
  font-size: 1.5rem;
  color: var(--bone);
  line-height: 1.1;
`;

const StatAction = styled.div`
  width: 230px;
  margin-left: auto;

  @media (max-width: 720px) {
    margin-left: 0;
    width: 100%;
  }
`;
