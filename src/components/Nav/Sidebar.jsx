import React from "react";
import styled from "styled-components";
import { Link } from "react-scroll";
// Assets
import CloseIcon from "../../assets/svg/CloseIcon";
import LogoIcon from "../../assets/svg/Logo";
// Config
import { CTA_WISHLIST, STEAM_URL } from "../../config/links";

export default function Sidebar({ sidebarOpen, toggleSidebar }) {
  return (
    <Wrapper className="animate darkBg" sidebarOpen={sidebarOpen}>
      <SidebarHeader className="flexSpaceCenter">
        <div className="flexNullCenter">
          <LogoIcon />
          <h1 className="whiteColor font20 displayFont" style={{ marginLeft: "15px" }}>
            Epic Millennium
          </h1>
        </div>
        <CloseBtn onClick={() => toggleSidebar(!sidebarOpen)} className="animate pointer">
          <CloseIcon />
        </CloseBtn>
      </SidebarHeader>

      <UlStyle className="flexNullCenter flexColumn">
        <li className="semiBold font30 pointer">
          <Link
            onClick={() => toggleSidebar(!sidebarOpen)}
            activeClass="active"
            className="whiteColor"
            style={{ padding: "10px 15px" }}
            to="home"
            spy={true}
            smooth={true}
            offset={-60}
          >
            Home
          </Link>
        </li>
        <li className="semiBold font30 pointer">
          <Link
            onClick={() => toggleSidebar(!sidebarOpen)}
            activeClass="active"
            className="whiteColor"
            style={{ padding: "10px 15px" }}
            to="game"
            spy={true}
            smooth={true}
            offset={-60}
          >
            Game
          </Link>
        </li>
        <li className="semiBold font30 pointer">
          <Link
            onClick={() => toggleSidebar(!sidebarOpen)}
            activeClass="active"
            className="whiteColor"
            style={{ padding: "10px 15px" }}
            to="features"
            spy={true}
            smooth={true}
            offset={-60}
          >
            Features
          </Link>
        </li>
        <li className="semiBold font30 pointer">
          <Link
            onClick={() => toggleSidebar(!sidebarOpen)}
            activeClass="active"
            className="whiteColor"
            style={{ padding: "10px 15px" }}
            to="studio"
            spy={true}
            smooth={true}
            offset={-60}
          >
            Studio
          </Link>
        </li>
      </UlStyle>
      <UlStyle className="Center">
        <li className="semiBold font30 pointer flexCenter">
          <a
            href={STEAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="radius8"
            style={{
              padding: "10px 15px",
              backgroundColor: "var(--accent)",
              color: "#fff",
              boxShadow: "0 0 20px var(--accent-glow)",
            }}
          >
            {CTA_WISHLIST}
          </a>
        </li>
      </UlStyle>
    </Wrapper>
  );
}

const Wrapper = styled.nav`
  width: 300px;
  height: 100vh;
  position: fixed;
  top: 0;
  padding: 0 30px;
  right: ${(props) => (props.sidebarOpen ? "0px" : "-400px")};
  z-index: 9999;
  border-left: 1px solid var(--border);
  background: rgba(10, 10, 15, 0.92);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  box-shadow: -20px 0 60px rgba(0, 0, 0, 0.5);
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
const UlStyle = styled.ul`
  padding: 40px;
  li {
    margin: 20px 0;
  }
`;
