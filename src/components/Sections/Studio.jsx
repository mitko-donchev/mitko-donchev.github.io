import React from "react";
import styled from "styled-components";
// Config
import {
  STUDIO_TAGLINE,
  STUDIO_MISSION,
  STUDIO_TEAM_BLURB,
  DISCORD_URL,
  TWITTER_URL,
  YOUTUBE_URL,
} from "../../config/links";

const TEAM_ROLES = ["Design", "Code", "Art"];

const SOCIALS = [
  { href: DISCORD_URL, label: "Discord", aria: "Join our Discord", Icon: DiscordIcon },
  { href: TWITTER_URL, label: "X", aria: "Follow us on X", Icon: XIcon },
  { href: YOUTUBE_URL, label: "YouTube", aria: "Subscribe on YouTube", Icon: YouTubeIcon },
];

export default function Studio() {
  return (
    <Wrapper id="studio" className="container">
      <hr className="divider" />
      <HeaderInfo className="textCenter">
        <span className="hudLabel">03 // The Studio</span>
        <h1 className="font40 extraBold displayFont textGradient textGlow" style={{ marginTop: "18px" }}>
          {STUDIO_TAGLINE}
        </h1>
        <MissionP className="font18">{STUDIO_MISSION}</MissionP>
      </HeaderInfo>

      <TeamSection className="textCenter">
        <p className="font15" style={{ color: "var(--text-muted)" }}>{STUDIO_TEAM_BLURB}</p>
        <TeamRow className="flexCenter">
          {TEAM_ROLES.map((role) => (
            <TeamMember key={role} className="flexCenter flexColumn">
              <Avatar aria-hidden="true" />
              <RoleLabel className="font13">{role}</RoleLabel>
            </TeamMember>
          ))}
        </TeamRow>
      </TeamSection>

      <SocialRow className="flexCenter">
        {SOCIALS.map(({ href, label, aria, Icon }) => (
          <SocialLink
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={aria}
            className="font14 animate"
          >
            <Icon />
            <span>{label}</span>
          </SocialLink>
        ))}
      </SocialRow>
    </Wrapper>
  );
}

// Inline icons — lightweight, no new deps.
function DiscordIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.317 4.369a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.056 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.291a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.009c.12.099.246.198.373.292a.077.077 0 0 1-.006.127 12.3 12.3 0 0 1-1.873.892.076.076 0 0 0-.04.107c.36.698.772 1.363 1.225 1.993a.076.076 0 0 0 .084.029 19.84 19.84 0 0 0 6.002-3.03.077.077 0 0 0 .032-.055c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028ZM8.02 15.278c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.418 2.157-2.418 1.211 0 2.176 1.094 2.157 2.418 0 1.334-.955 2.419-2.157 2.419Zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.418 2.157-2.418 1.21 0 2.176 1.094 2.157 2.418 0 1.334-.946 2.419-2.157 2.419Z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-6.02-8.03-6.86 8.03H0l7.71-8.83L0 2.25h6.828l5.556 7.352L18.244 2.25Zm-1.161 17.52h1.833L7.014 4.126H5.06l11.023 15.644Z" />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M23.498 6.186a2.994 2.994 0 0 0-2.108-2.116C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.39.57A2.994 2.994 0 0 0 .502 6.186 31.26 31.26 0 0 0 0 12a31.26 31.26 0 0 0 .502 5.814 2.994 2.994 0 0 0 2.108 2.116C4.495 20.5 12 20.5 12 20.5s7.505 0 9.39-.57a2.994 2.994 0 0 0 2.108-2.116A31.26 31.26 0 0 0 24 12a31.26 31.26 0 0 0-.502-5.814ZM9.75 15.568V8.432L15.818 12 9.75 15.568Z" />
    </svg>
  );
}

// Styled components
const Wrapper = styled.section`
  width: 100%;
  padding: 90px 0;
`;

const HeaderInfo = styled.div`
  max-width: 760px;
  margin: 70px auto 0 auto;
`;

const MissionP = styled.p`
  color: var(--text-muted);
  margin-top: 24px;
  line-height: 1.7rem;
`;

const TeamSection = styled.div`
  margin-top: 70px;
`;

const TeamRow = styled.div`
  gap: 50px;
  margin-top: 34px;
  flex-wrap: wrap;
`;

const TeamMember = styled.div`
  gap: 14px;
`;

/* Frameless avatar: a soft gradient orb with a glow ring, no hard box. */
const Avatar = styled.div`
  width: 76px;
  height: 76px;
  border-radius: 50%;
  background:
    radial-gradient(circle at 35% 30%, rgba(34, 211, 238, 0.5), transparent 60%),
    radial-gradient(circle at 70% 75%, rgba(124, 58, 237, 0.6), transparent 62%);
  box-shadow: 0 0 24px var(--accent-glow);
`;

const RoleLabel = styled.span`
  color: var(--text-muted);
  letter-spacing: 0.16em;
  text-transform: uppercase;
`;

const SocialRow = styled.div`
  gap: 40px;
  margin-top: 70px;
  flex-wrap: wrap;
`;

/* Frameless social link: icon + label with an animated gradient underline. */
const SocialLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 9px;
  padding: 6px 2px;
  position: relative;
  color: var(--text) !important;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  svg {
    fill: var(--accent-2);
  }
  ::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 1px;
    background: linear-gradient(90deg, var(--accent), var(--accent-2));
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.3s ease;
  }
  :hover {
    color: var(--accent-2) !important;
  }
  :hover::after {
    transform: scaleX(1);
  }
`;
