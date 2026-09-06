import React from "react";
import styled from "styled-components";
import { Link } from "react-scroll";
// Assets
import LogoImg from "../../assets/svg/Logo";

/* A closing rule, not a second homepage.

   This used to carry its own copy of the socials and its own wishlist link,
   both of which the studio section already does properly about a hundred
   pixels further up, plus a third printing of the studio tagline. All of it
   is gone. What is left is what a footer is actually for: whose site this is,
   what year it is, and a way back up. */
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <Wrapper>
      <div className="container">
        <hr className="divider" />
        <Bar>
          <Brand href="#home" to="home" smooth={true} offset={-80} className="pointer flexNullCenter">
            <LogoImg />
            <Mark className="displayFont">Epic Millennium</Mark>
          </Brand>

          <Meta>
            <Copyright>© {year} Epic Millennium</Copyright>
            <TopLink href="#home" to="home" smooth={true} offset={-80} className="pointer">
              Back to top
              <Arrow viewBox="0 0 12 14" aria-hidden="true">
                <path d="M6 13V2M6 2L1.5 6.5M6 2l4.5 4.5" />
              </Arrow>
            </TopLink>
          </Meta>
        </Bar>
      </div>
    </Wrapper>
  );
}

const Wrapper = styled.footer`
  width: 100%;
  padding-bottom: 28px;
`;

const Bar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 28px;
  padding: 34px 0 6px 0;

  @media (max-width: 640px) {
    flex-direction: column;
    gap: 24px;
    text-align: center;
  }
`;

const Brand = styled(Link)`
  gap: 14px;
  color: var(--bone);
  transition: color 0.3s var(--ease-soft);

  :hover {
    color: var(--ember);
  }
`;

const Mark = styled.span`
  margin-left: 14px;
  font-size: 1rem;
  font-weight: 600;
  color: inherit;
`;

const Meta = styled.div`
  display: flex;
  align-items: center;
  gap: 36px;

  @media (max-width: 640px) {
    flex-direction: column;
    gap: 18px;
  }
`;

const Copyright = styled.p`
  margin: 0;
  color: var(--bone-faint);
  font-size: 0.72rem;
  letter-spacing: 0.06em;
`;

const Arrow = styled.svg`
  width: 11px;
  height: 13px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.4;
  stroke-linecap: round;
  stroke-linejoin: round;
  transition: transform 0.35s var(--ease-out);
`;

const TopLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 9px;
  color: var(--bone-dim);
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  transition: color 0.3s var(--ease-soft);

  :hover {
    color: var(--ember);
  }

  :hover ${Arrow} {
    transform: translateY(-3px);
  }
`;
