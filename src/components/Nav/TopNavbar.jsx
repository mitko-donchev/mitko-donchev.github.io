import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Link, scrollSpy } from "react-scroll";
// Components
import Sidebar from "../Nav/Sidebar";
import Backdrop from "../Elements/Backdrop";
// Assets
import LogoIcon from "../../assets/svg/Logo";
import BurgerIcon from "../../assets/svg/BurgerIcon";
// Config
import { SteamMark } from "../Buttons/WishlistButton";
import { CTA_WISHLIST, STEAM_URL } from "../../config/links";

export default function TopNavbar() {
  const [y, setY] = useState(window.scrollY);
  const [sidebarOpen, toggleSidebar] = useState(false);

  useEffect(() => {
    const onScroll = () => setY(window.scrollY);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // react-scroll only recomputes the active link on a scroll event, so on first
  // load (scrollY === 0, no scroll yet) no nav item is highlighted. Nudge the spy
  // once after mount so "Home" is selected straight away.
  useEffect(() => {
    scrollSpy.update();
  }, []);

  return (
    <>
      <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      {sidebarOpen && <Backdrop toggleSidebar={toggleSidebar} />}
      <Wrapper
        className="flexCenter animate"
        $scrolled={y > 100}
        style={y > 100 ? { height: "60px" } : { height: "80px" }}
      >
        <NavInner className="container flexSpaceCenter">
          <Link className="pointer flexNullCenter" href="#home"
            to="home" smooth={true}>
            <LogoIcon />
            <LogoText className="displayFont">Epic Millennium</LogoText>
          </Link>
          <BurderWrapper
            className="pointer"
            onClick={() => toggleSidebar(!sidebarOpen)}
            aria-label="Open menu"
            aria-expanded={sidebarOpen}
          >
            <BurgerIcon />
          </BurderWrapper>
          <UlWrapper className="flexNullCenter">
            <li className="semiBold font15 pointer">
              <Link activeClass="active" style={{ padding: "10px 15px" }} href="#home"
            to="home" spy={true} smooth={true} offset={-80}>
                Home
              </Link>
            </li>
            <li className="semiBold font15 pointer">
              <Link activeClass="active" style={{ padding: "10px 15px" }} href="#game"
            to="game" spy={true} smooth={true} offset={-80}>
                Game
              </Link>
            </li>
            <li className="semiBold font15 pointer">
              <Link activeClass="active" style={{ padding: "10px 15px" }} href="#features"
            to="features" spy={true} smooth={true} offset={-80}>
                Features
              </Link>
            </li>
            <li className="semiBold font15 pointer">
              <Link activeClass="active" style={{ padding: "10px 15px" }} href="#studio"
            to="studio" spy={true} smooth={true} offset={-80}>
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
                <SteamMark size={14} />
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
    props.$scrolled &&
    `
    background-color: rgba(11, 14, 20, 0.66);
    border-bottom: 1px solid var(--hairline);
    backdrop-filter: blur(16px) saturate(130%);
    -webkit-backdrop-filter: blur(16px) saturate(130%);
  `}
`;

const LogoText = styled.span`
  margin-left: 14px;
  font-size: 1.24rem;
  font-weight: 600;
  letter-spacing: 0.03em;
  color: var(--bone);
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

  li a {
    display: inline-block;
    font-family: 'Inter', sans-serif;
    font-size: 0.72rem;
    font-weight: 500;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--bone-dim);
    transition: color 0.3s var(--ease-soft);
  }

  li a:hover,
  li a.active {
    color: var(--ember);
  }

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
  display: inline-flex;
  align-items: center;
  gap: 9px;
  padding: 11px 18px;
  font-family: 'Inter', sans-serif;
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--bone) !important;
  border: 1px solid var(--hairline-strong);
  background: transparent;
  transition: 0.35s var(--ease-soft);

  &:hover {
    color: #20160A !important;
    background: var(--ember);
    border-color: var(--ember);
    box-shadow: 0 6px 26px rgba(232, 163, 61, 0.3);
  }
`;
