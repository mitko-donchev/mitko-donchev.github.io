import React from "react";
import styled from "styled-components";
// Components
import FullButton from "../Buttons/FullButton";
// Assets
import LogoFull from "../../assets/img/logo-full.png";
// Config
import {
  STEAM_URL,
  TRAILER_URL,
  GAME_NAME,
  CTA_WISHLIST,
  CTA_TRAILER,
  CTA_DEMO_BADGE,
} from "../../config/links";

export default function Hero() {
  const openWishlist = () => {
    window.open(STEAM_URL, "_blank", "noopener,noreferrer");
  };

  const openTrailer = () => {
    window.open(TRAILER_URL, "_blank", "noopener,noreferrer");
  };

  return (
    <Wrapper id="home" className="container flexColumn flexCenter">
      <Inner className="textCenter">
        <BrandLockup src={LogoFull} alt="Epic Millennium — Game Development Studio" />
        <span className="hudLabel">Debut Title</span>
        <Title className="extraBold displayFont textGradient textGlow">{GAME_NAME}</Title>
        <Tagline className="font18">
          Trapped in a cursed village that pulls you back every time you try to leave.
          Roam the woods, fields, and caves — die, and return — an action-RPG roguelike
          where every run remembers what the last one cost you.
        </Tagline>
        <BtnRow>
          <FullButton title={CTA_WISHLIST} action={openWishlist} glow />
          <FullButton title={CTA_TRAILER} action={openTrailer} border />
        </BtnRow>
        <DemoBadge className="font13">
          <Dot aria-hidden="true" /> {CTA_DEMO_BADGE}
        </DemoBadge>
      </Inner>
    </Wrapper>
  );
}

const Wrapper = styled.section`
  width: 100%;
  min-height: 100vh;
  padding-top: 80px;
  position: relative;
  justify-content: center;
`;

const Inner = styled.div`
  width: 100%;
  max-width: 860px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const BrandLockup = styled.img`
  width: 340px;
  max-width: 72vw;
  height: auto;
  margin-bottom: 34px;
  filter: drop-shadow(0 0 45px var(--accent-glow));
  @media (max-width: 560px) {
    width: 260px;
    margin-bottom: 24px;
  }
`;

const Title = styled.h1`
  font-size: 6.5rem;
  line-height: 1.02;
  margin: 22px 0 0 0;
  @media (max-width: 960px) {
    font-size: 4.5rem;
  }
  @media (max-width: 560px) {
    font-size: 3rem;
  }
`;

const Tagline = styled.p`
  width: 100%;
  max-width: 620px;
  color: var(--text-muted);
  line-height: 1.7rem;
  margin: 28px auto 40px auto;
`;

const BtnRow = styled.div`
  display: flex;
  gap: 20px;
  button {
    width: 220px;
  }
  @media (max-width: 560px) {
    flex-direction: column;
    align-items: center;
    button {
      width: 260px;
    }
  }
`;

const DemoBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-top: 28px;
  color: var(--accent-2);
  letter-spacing: 0.12em;
  text-transform: uppercase;
`;

const Dot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--accent-2);
  box-shadow: 0 0 10px var(--accent-2);
  animation: pulseDot 1.8s ease-in-out infinite;
  @keyframes pulseDot {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.35; }
  }
`;
