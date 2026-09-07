import React, { useEffect } from "react";
import styled from "styled-components";
import { Link } from "react-scroll";
// Assets
import CloseIcon from "../../assets/svg/CloseIcon";
import LogoIcon from "../../assets/svg/Logo";
// Config
import { SteamMark } from "../Buttons/WishlistButton";
import { CTA_WISHLIST, STEAM_URL } from "../../config/links";

export default function Sidebar({ sidebarOpen, toggleSidebar }) {
  /* A panel covering the page closes on Escape. Without this the only way
     out is to find the small X, which is the one thing a keyboard user
     cannot do quickly. */
  useEffect(() => {
    if (!sidebarOpen) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape") toggleSidebar(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [sidebarOpen, toggleSidebar]);

  return (
    <Wrapper $sidebarOpen={sidebarOpen} aria-hidden={!sidebarOpen}>
      <SidebarHeader className="flexSpaceCenter">
        <div className="flexNullCenter">
          <LogoIcon />
          <span className="whiteColor font20 displayFont" style={{ marginLeft: "15px" }}>
            Epic Millennium
          </span>
        </div>
        <CloseBtn onClick={() => toggleSidebar(!sidebarOpen)} className="animate pointer" aria-label="Close menu">
          <CloseIcon />
        </CloseBtn>
      </SidebarHeader>

      <NavList className="flexNullCenter flexColumn">
        <li className="pointer">
          <Link
            onClick={() => toggleSidebar(!sidebarOpen)}
            activeClass="active"
            href="#home"
            to="home"
            spy={true}
            smooth={true}
            offset={-60}
          >
            Home
          </Link>
        </li>
        <li className="pointer">
          <Link
            onClick={() => toggleSidebar(!sidebarOpen)}
            activeClass="active"
            href="#game"
            to="game"
            spy={true}
            smooth={true}
            offset={-60}
          >
            Game
          </Link>
        </li>
        <li className="pointer">
          <Link
            onClick={() => toggleSidebar(!sidebarOpen)}
            activeClass="active"
            href="#features"
            to="features"
            spy={true}
            smooth={true}
            offset={-60}
          >
            Features
          </Link>
        </li>
        <li className="pointer">
          <Link
            onClick={() => toggleSidebar(!sidebarOpen)}
            activeClass="active"
            href="#studio"
            to="studio"
            spy={true}
            smooth={true}
            offset={-60}
          >
            Studio
          </Link>
        </li>
      </NavList>
      <UlStyle className="Center">
        <li className="pointer">
          <SidebarCta href={STEAM_URL} target="_blank" rel="noopener noreferrer">
            <SteamMark size={15} />
            {CTA_WISHLIST}
          </SidebarCta>
        </li>
      </UlStyle>
    </Wrapper>
  );
}

const UlStyle = styled.ul`
  /* The drawer already pads itself. A second 40px inset left the links about
     160px to live in, which is not enough for the wishlist button. */
  padding: 34px 0;
  li {
    margin: 20px 0;
  }
`;

/* The drawer links speak with the same voice as the top bar: uppercase Inter,
   wide tracking, ember when you are standing in that section. */
const NavList = styled(UlStyle)`
  width: 100%;

  li {
    width: 100%;
  }

  li a {
    display: block;
    padding: 14px 4px;
    text-align: center;
    color: var(--bone-dim);
    font-size: 0.82rem;
    font-weight: 600;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    transition: color 0.3s var(--ease-soft);
  }

  li a:hover,
  li a.active {
    color: var(--ember);
  }
`;

/* The same button the page uses, not the template's white-on-amber one —
   white on ember lands at about 2:1, which is not readable. */
const SidebarCta = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  padding: 15px 18px;
  text-align: center;
  background: var(--ember);
  color: var(--ink);
  border: 1px solid var(--ember);
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.13em;
  text-transform: uppercase;
  white-space: nowrap;
  box-shadow: 0 0 28px rgba(232, 163, 61, 0.28);
  transition: background 0.3s var(--ease-soft), box-shadow 0.3s var(--ease-soft);

  &:hover {
    background: var(--ember-hot);
    border-color: var(--ember-hot);
    box-shadow: 0 0 38px rgba(232, 163, 61, 0.42);
  }
`;

const Wrapper = styled.nav`
  width: 300px;
  height: 100vh;
  position: fixed;
  top: 0;
  padding: 0 30px;
  right: ${(props) => (props.$sidebarOpen ? "0px" : "-400px")};
  z-index: 9999;
  border-left: 1px solid var(--hairline-strong);
  background: rgba(8, 11, 18, 0.94);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  box-shadow: -20px 0 60px rgba(0, 0, 0, 0.55);

  /* The drawer is always in the document, parked off the right edge. Its
     links are real links now, which means that without this a keyboard user
     tabs through five controls they cannot see. visibility takes them out of
     the tab order and out of hit testing; the delay lets the panel finish
     sliding out before it goes. */
  visibility: ${(props) => (props.$sidebarOpen ? "visible" : "hidden")};
  transition:
    right 0.35s var(--ease-out),
    visibility 0s linear ${(props) => (props.$sidebarOpen ? "0s" : "0.35s")};

  @media (max-width: 400px) {
    width: 100%;
  }
`;
const SidebarHeader = styled.div`
  padding: 20px 0;
`;
const CloseBtn = styled.button`
  border: 0px;
  outline: none;
  background-color: transparent;
  padding: 10px;
`;
