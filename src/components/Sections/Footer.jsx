import React from "react";
import styled from "styled-components";
import { Link } from "react-scroll";
// Assets
import LogoImg from "../../assets/svg/Logo";
// Config
import {
  STUDIO_TAGLINE,
  STEAM_URL,
  DISCORD_URL,
  TWITTER_URL,
  YOUTUBE_URL,
} from "../../config/links";

export default function Footer() {

  const getCurrentYear = () => {
    return new Date().getFullYear();
  }

  return (
    <Wrapper>
      <div className="container">
        <hr className="divider" />
        <div>
          <InnerWrapper style={{ padding: "40px 0" }}>
            <SideCol className="flexNullCenter">
              <Link className="flexCenter animate pointer" to="home" smooth={true} offset={-80}>
                <LogoImg />
                <h1 className="font15 extraBold whiteColor" style={{ marginLeft: "15px" }}>
                  Epic Millennium
                </h1>
              </Link>
            </SideCol>

            <MiddleCol className="flexCenter">
              <StyleP className="whiteColor font13">
                © {getCurrentYear()} <span className="purpleColor font13">Epic Millennium</span> — {STUDIO_TAGLINE}
              </StyleP>

              <SocialRow className="flexCenter">
                <SocialLink
                  href={DISCORD_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Join our Discord"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-2.2792-.3421-4.5487-.3421-6.7841 0-.1636-.3847-.3973-.8742-.6083-1.2495a.0741.0741 0 00-.0785-.0371 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c1.7683 1.3038 3.4785 2.3057 5.4173 3.058a.0777.0777 0 00.0846-.0276c.4162-.5701.7758-1.1594 1.0836-1.6931a.076.076 0 00-.0416-.1057 12.7132 12.7132 0 01-1.8112-.8629.0766.0766 0 01-.0076-.1276c.1216-.0911.2436-.1858.3592-.2811a.0757.0757 0 01.0785-.0106c3.9278 1.7933 8.18 1.7933 12.0614 0a.0757.0757 0 01.0785.0106c.1156.0953.2376.19.3592.2811a.0766.0766 0 01-.0076.1276 12.6924 12.6924 0 01-1.8112.8629.076.076 0 00-.0416.1057c.3078.5337.6674 1.123 1.0836 1.6931a.0761.0761 0 00.0846.0276c1.9388-.7523 3.6488-1.7542 5.4173-3.058a.0824.0824 0 00.0312-.0561c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0277zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.419 2.1569-2.419 1.2108 0 2.1757 1.0952 2.1567 2.419 0 1.3333-.9555 2.419-2.1567 2.419zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.419 2.1569-2.419 1.2108 0 2.1757 1.0952 2.1567 2.419 0 1.3333-.9556 2.419-2.1567 2.419z" />
                  </svg>
                </SocialLink>
                <SocialLink
                  href={TWITTER_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow us on X"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.26 10.99H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zM17.302 20.163h1.833L7.084 3.734H5.117z" />
                  </svg>
                </SocialLink>
                <SocialLink
                  href={YOUTUBE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Subscribe on YouTube"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M23.498 6.186a2.994 2.994 0 0 0-2.112-2.115C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.386.526A2.994 2.994 0 0 0 .502 6.186 31.09 31.09 0 0 0 0 12a31.09 31.09 0 0 0 .502 5.814 2.994 2.994 0 0 0 2.112 2.115c1.881.526 9.386.526 9.386.526s7.505 0 9.386-.526a2.994 2.994 0 0 0 2.112-2.115A31.09 31.09 0 0 0 24 12a31.09 31.09 0 0 0-.502-5.814zM9.75 15.568V8.432L15.818 12z" />
                  </svg>
                </SocialLink>
              </SocialRow>

              <a
                href={STEAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="animate pointer font13"
                style={{ color: "var(--text-muted)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent-2)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
              >
                Wishlist on Steam
              </a>
            </MiddleCol>

            <SideCol className="flexNullCenter" style={{ justifyContent: "flex-end" }}>
              <Link className="whiteColor animate pointer font13" to="home" smooth={true} offset={-80}>
                Back to top
              </Link>
            </SideCol>
          </InnerWrapper>
        </div>
      </div>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
`;
/* 1fr | auto | 1fr grid: the equal outer rails guarantee the middle
   column is centered on the page regardless of the side content widths. */
const InnerWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  @media (max-width: 550px) {
    grid-template-columns: 1fr;
    justify-items: center;
    row-gap: 20px;
  }
`;
const SideCol = styled.div`
  min-width: 0;
  @media (max-width: 550px) {
    justify-content: center !important;
  }
`;
const MiddleCol = styled.div`
  flex-direction: column;
  gap: 12px;
  text-align: center;
`;
const StyleP = styled.p`
  margin: 0;
  @media (max-width: 550px) {
    margin: 0 0 12px 0;
    text-align: center;
  }
`;
const SocialRow = styled.div`
  gap: 16px;
`;
const SocialLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  transition: color 0.2s ease;
  &:hover,
  &:focus-visible {
    color: var(--accent-2);
  }
`;
