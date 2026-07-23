import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Link } from "react-scroll";
// Components
import Sidebar from "../Nav/Sidebar";
import Backdrop from "../Elements/Backdrop";
// Assets
import LogoIcon from "../../assets/svg/Logo";
import BurgerIcon from "../../assets/svg/BurgerIcon";
// Config
import { CTA_WISHLIST, STEAM_URL } from "../../config/links";

export default function TopNavbar() {
  const [y, setY] = useState(window.scrollY);
  const [sidebarOpen, toggleSidebar] = useState(false);

  useEffect(() => {
    window.addEventListener("scroll", () => setY(window.scrollY));
    return () => {
      window.removeEventListener("scroll", () => setY(window.scrollY));
    };
  }, [y]);

  return (
    <>
      <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      {sidebarOpen && <Backdrop toggleSidebar={toggleSidebar} />}
      <Wrapper
        className="flexCenter animate"
        scrolled={y > 100}
        style={y > 100 ? { height: "60px" } : { height: "80px" }}
      >
        <NavInner className="container flexSpaceCenter">
          <Link className="pointer flexNullCenter" to="home" smooth={true}>
            <LogoIcon />
            <LogoText style={{ marginLeft: "15px", marginTop: "5px" }} className="font20 extraBold displayFont">
              Epic Millennium
            </LogoText>
          </Link>
          <BurderWrapper className="pointer" onClick={() => toggleSidebar(!sidebarOpen)}>
            <BurgerIcon />
          </BurderWrapper>
          <UlWrapper className="flexNullCenter">
            <li className="semiBold font15 pointer">
              <Link activeClass="active" style={{ padding: "10px 15px" }} to="home" spy={true} smooth={true} offset={-80}>
                Home
              </Link>
            </li>
            <li className="semiBold font15 pointer">
              <Link activeClass="active" style={{ padding: "10px 15px" }} to="game" spy={true} smooth={true} offset={-80}>
                Game
              </Link>
            </li>
            <li className="semiBold font15 pointer">
              <Link activeClass="active" style={{ padding: "10px 15px" }} to="features" spy={true} smooth={true} offset={-80}>
                Features
              </Link>
            </li>
            <li className="semiBold font15 pointer">
              <Link activeClass="active" style={{ padding: "10px 15px" }} to="studio" spy={true} smooth={true} offset={-80}>
                Studio
              </Link>
            </li>
          </UlWrapper>
          <UlWrapperRight className="flexNullCenter">
            <li className="semiBold font15 pointer flexCenter">
              <NavCTA
                className="radius8 animate displayFont"
                href={STEAM_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                {CTA_WISHLIST}
              </NavCTA>
            </li>
          </UlWrapperRight>
        </NavInner>
      </Wrapper>
    </>
  );
}

const Wrapper = styled.nav`
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  background-color: transparent;
  border-bottom: 1px solid transparent;
  ${(props) =>
    props.scrolled &&
    `
    background-color: rgba(10, 10, 15, 0.55);
    border-bottom: 1px solid var(--border);
    backdrop-filter: blur(12px) saturate(140%);
    -webkit-backdrop-filter: blur(12px) saturate(140%);
  `}
`;

const LogoText = styled.h1`
  color: var(--text);
`;

const NavInner = styled.div`
  position: relative;
  height: 100%;
`
const BurderWrapper = styled.button`
  outline: none;
  border: 0px;
  background-color: transparent;
  height: 100%;
  padding: 0 15px;
  display: none;
  color: var(--accent);
  filter: drop-shadow(0 0 8px var(--accent-glow));
  @media (max-width: 760px) {
    display: block;
  }
`;

const UlWrapper = styled.ul`
  display: flex;
  @media (max-width: 760px) {
    display: none;
  }
`;

const UlWrapperRight = styled.ul`
  @media (max-width: 760px) {
    display: none;
  }
`;

const NavCTA = styled.a`
  display: inline-block;
  padding: 10px 20px;
  font-weight: 600;
  letter-spacing: 0.04em;
  font-size: 0.938rem;
  color: #fff !important;
  background-color: var(--accent);
  border: 1px solid var(--accent);
  box-shadow: 0 0 20px var(--accent-glow);
  :hover {
    background-color: #8b4bf5;
    color: #fff !important;
    box-shadow: 0 0 32px var(--accent-glow);
  }
`;
