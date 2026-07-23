import React from "react";
import styled from "styled-components";
// Components
import FullButton from "../Buttons/FullButton";
// Config
import {
  STEAM_URL,
  GAME_NAME,
  GAME_WORKING_TITLE_NOTE,
  GAME_GENRE,
  GAME_SYNOPSIS,
  GAME_VERSE_LEAD,
  GAME_VERSE,
  GAME_VERSE_TAIL,
  GAME_RELEASE,
  GAME_DEMO,
  GAME_PLATFORM,
  GAME_ENGINE,
  CTA_WISHLIST,
} from "../../config/links";

const STATS = [
  { label: "Release", value: GAME_RELEASE },
  { label: "Demo", value: GAME_DEMO },
  { label: "Platform", value: GAME_PLATFORM },
  { label: "Engine", value: GAME_ENGINE },
];

export default function AboutGame() {
  const handleWishlistClick = () => {
    window.open(STEAM_URL, "_blank", "noopener,noreferrer");
  };

  return (
    <Wrapper id="game" className="container">
      <hr className="divider" />
      <About className="flexSpaceCenter">
        <AboutLeft>
          <span className="hudLabel">01 // The Game</span>
          <p className="font13" style={{ color: "var(--text-muted)", letterSpacing: "0.06em", marginTop: "18px" }}>
            {GAME_WORKING_TITLE_NOTE}
          </p>
          <h1 className="font40 extraBold textGradient displayFont" style={{ marginBottom: "6px" }}>
            {GAME_NAME}
          </h1>
          <Genre className="font15">{GAME_GENRE}</Genre>
          {GAME_SYNOPSIS.map((paragraph, index) => (
            <SynopsisP key={index} className="font15">
              {paragraph}
            </SynopsisP>
          ))}
          <Verse>
            <VerseFade className="font15 displayFont">{GAME_VERSE_LEAD}</VerseFade>
            {GAME_VERSE.map((line, index) => (
              <VerseLine key={index} className="font15 displayFont">
                {line}
              </VerseLine>
            ))}
            <VerseFade className="font15 displayFont" $trailing>
              {GAME_VERSE_TAIL}
            </VerseFade>
          </Verse>
          <StatusRow>
            {STATS.map((stat) => (
              <Stat key={stat.label}>
                <StatLabel className="font12">{stat.label}</StatLabel>
                <StatValue className="font18 displayFont">{stat.value}</StatValue>
              </Stat>
            ))}
          </StatusRow>
          <ButtonsRow className="flexNullCenter">
            <div style={{ width: "220px" }}>
              <FullButton title={CTA_WISHLIST} action={handleWishlistClick} glow />
            </div>
          </ButtonsRow>
        </AboutLeft>
        <AboutRight>
          {/* TODO: replace with real key art / logo, e.g. src/assets/img/game/key-art.png */}
          <KeyArt className="brackets flexCenter">
            <span className="hudLabel">{GAME_NAME} — Key Art TBD</span>
          </KeyArt>
        </AboutRight>
      </About>
    </Wrapper>
  );
}

const Wrapper = styled.section`
  width: 100%;
  padding: 90px 0;
`;

const About = styled.div`
  margin-top: 70px;
  gap: 60px;
  @media (max-width: 960px) {
    flex-direction: column;
    gap: 40px;
  }
`;

const AboutLeft = styled.div`
  width: 55%;
  @media (max-width: 960px) {
    width: 100%;
    order: 1;
  }
`;

const AboutRight = styled.div`
  width: 42%;
  @media (max-width: 960px) {
    width: 100%;
    order: 0;
  }
`;

const Genre = styled.p`
  color: var(--accent-2);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-bottom: 26px;
`;

const SynopsisP = styled.p`
  max-width: 520px;
  color: var(--text-muted);
  line-height: 1.7rem;
  margin-bottom: 16px;
`;

/* In-world verse: no box — an excerpt lifted from an old text. The core
   stanza reads clearly; a lead-in and a trailing line fade at the edges as
   if the page were torn away above and below. */
const Verse = styled.blockquote`
  max-width: 520px;
  margin: 34px 0 12px 0;
  padding: 0;
`;

const VerseLine = styled.p`
  margin: 0;
  font-style: italic;
  line-height: 1.9rem;
  letter-spacing: 0.02em;
  color: var(--text-muted);
`;

/* Faded fragment before/after the stanza. Masked to dissolve toward the
   torn edge of the "page" (top-left for the lead, bottom-right for the tail). */
const VerseFade = styled.p`
  margin: ${(props) => (props.$trailing ? "6px 0 0 0" : "0 0 6px 0")};
  font-style: italic;
  line-height: 1.9rem;
  letter-spacing: 0.02em;
  color: var(--text-muted);
  opacity: 0.5;
  -webkit-mask-image: ${(props) =>
    props.$trailing
      ? "linear-gradient(105deg, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 92%)"
      : "linear-gradient(285deg, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%)"};
  mask-image: ${(props) =>
    props.$trailing
      ? "linear-gradient(105deg, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 92%)"
      : "linear-gradient(285deg, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%)"};
`;

const StatusRow = styled.div`
  display: flex;
  gap: 44px;
  margin: 38px 0;
  flex-wrap: wrap;
`;

const Stat = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const StatLabel = styled.span`
  color: var(--text-muted);
  letter-spacing: 0.16em;
  text-transform: uppercase;
`;

const StatValue = styled.span`
  color: var(--text);
`;

const ButtonsRow = styled.div``;

const KeyArt = styled.div`
  width: 100%;
  height: 460px;
  padding: 20px;
  text-align: center;
  background:
    radial-gradient(circle at 50% 45%, rgba(124, 58, 237, 0.16), transparent 65%);
  @media (max-width: 960px) {
    height: 320px;
  }
  @media (max-width: 560px) {
    height: 260px;
  }
`;
