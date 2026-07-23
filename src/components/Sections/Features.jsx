import React from "react";
import styled from "styled-components";
// Components
import ServiceBox from "../Elements/ServiceBox";
import FullButton from "../Buttons/FullButton";
// Config
import { STEAM_URL, CTA_WISHLIST } from "../../config/links";

const FEATURES = [
  {
    icon: "worlds",
    title: "A Village That Won't Let Go",
    subtitle:
      "Every road out bends back to the gate. A handcrafted world that remembers every attempt to escape it.",
  },
  {
    icon: "combat",
    title: "Fluid Combat",
    subtitle:
      "Fast, readable, and responsive — combat that rewards timing and punishes button-mashing.",
  },
  {
    icon: "choices",
    title: "Runs That Evolve",
    subtitle:
      "Woods, fields, and caves that reshape themselves each time you fall. Every death teaches you what the last run cost you.",
  },
  {
    icon: "community",
    title: "Built With the Community",
    subtitle:
      "We're building in the open with the players who care. Your feedback shapes what ships.",
  },
];

export default function Features() {
  const handleWishlistClick = () => {
    window.open(STEAM_URL, "_blank", "noopener,noreferrer");
  };

  return (
    <Wrapper id="features" className="container">
      <hr className="divider" />
      <HeaderInfo>
        <span className="hudLabel">02 // Features</span>
        <h1 className="font40 extraBold displayFont" style={{ marginTop: "18px" }}>
          What Makes <span className="textGradient">Project Zero</span>
        </h1>
        <p className="font15" style={{ color: "var(--text-muted)", maxWidth: "540px" }}>
          Built for players who want worlds worth exploring and choices that actually matter.
        </p>
      </HeaderInfo>
      <Grid>
        {FEATURES.map((f, i) => (
          <Cell key={f.title}>
            <Index className="displayFont font12">{String(i + 1).padStart(2, "0")}</Index>
            <ServiceBox icon={f.icon} title={f.title} subtitle={f.subtitle} />
          </Cell>
        ))}
      </Grid>
      <Teaser className="textCenter">
        <h2 className="font40 semiBold displayFont textGradient textGlow">From gamers, for gamers</h2>
        <p className="font18" style={{ color: "var(--text-muted)", margin: "16px 0 30px 0" }}>
          Wishlist Project Zero and follow the journey.
        </p>
        <div style={{ width: "220px", margin: "0 auto" }}>
          <FullButton title={CTA_WISHLIST} action={handleWishlistClick} glow />
        </div>
      </Teaser>
    </Wrapper>
  );
}

const Wrapper = styled.section`
  width: 100%;
  padding: 90px 0;
`;

const HeaderInfo = styled.div`
  margin-top: 70px;
  margin-bottom: 30px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 50px 30px;
  }
  @media (max-width: 560px) {
    grid-template-columns: 1fr;
    gap: 50px;
    text-align: center;
  }
`;

const Cell = styled.div`
  position: relative;
  padding-top: 40px;
`;

const Index = styled.span`
  position: absolute;
  top: 0;
  left: 0;
  color: var(--accent-2);
  letter-spacing: 0.2em;
  opacity: 0.8;
  @media (max-width: 560px) {
    left: 50%;
    transform: translateX(-50%);
  }
`;

const Teaser = styled.div`
  max-width: 640px;
  margin: 110px auto 0 auto;
`;
