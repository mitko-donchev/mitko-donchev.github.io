import React from "react";
import styled from "styled-components";
// Components
import Reveal from "../Elements/Reveal";
// Assets — GitHub profile photos, keyed by the team member's `id`.
import MitkoImg from "../../assets/img/team-mitko.jpg";
import DimitarImg from "../../assets/img/team-dimitar.png";
// Config
import {
  STUDIO_TAGLINE,
  STUDIO_MISSION,
  STUDIO_TEAM_BLURB,
  STUDIO_TEAM,
  DISCORD_URL,
  TWITTER_URL,
  YOUTUBE_URL,
} from "../../config/links";

const AVATARS = {
  mitko: MitkoImg,
  dimitar: DimitarImg,
};

/* Straight out of the studio bible. These are the rules the team actually
   measures decisions against, so they are quoted rather than marketed. */
const CREED = [
  {
    title: "The player is the reason, not the cash register.",
    body: "We profit by making something worth paying for. No dark patterns, and nothing built to milk a habit.",
  },
  {
    title: "Ready, not on a date.",
    body: "It ships when we believe it is ready. That is not licence to drift — we keep our pace and we finish what we start.",
  },
  {
    title: "Our own point of view.",
    body: "We listen to players and we still decide for ourselves. If it is not in the spirit of the studio, we do not do it, however fashionable it is.",
  },
];

export default function Studio() {
  return (
    <Wrapper id="studio" className="container">
      <hr className="divider" />

      <Head>
        <Reveal>
          <span className="hudLabel">03 — The Studio</span>
        </Reveal>
        <Reveal delay={80}>
          <Title className="displayFont textGradient">{STUDIO_TAGLINE}</Title>
        </Reveal>
        <Reveal delay={140}>
          <Mission className="font18">{STUDIO_MISSION}</Mission>
        </Reveal>
      </Head>

      <Creed>
        {CREED.map((item, index) => (
          <Reveal key={item.title} delay={index * 90}>
            <Tenet>
              <TenetMark aria-hidden="true" />
              <TenetTitle className="displayFont">{item.title}</TenetTitle>
              <TenetBody>{item.body}</TenetBody>
            </Tenet>
          </Reveal>
        ))}
      </Creed>

      <Team>
        <Reveal>
          <TeamBlurb>{STUDIO_TEAM_BLURB}</TeamBlurb>
        </Reveal>
        <TeamRow>
          {STUDIO_TEAM.map(({ id, name, role, github }, index) => (
            <Reveal key={name} delay={index * 110}>
              <Member
                href={github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${name} on GitHub`}
              >
                <Avatar>
                  <AvatarImg src={AVATARS[id]} alt="" loading="lazy" />
                </Avatar>
                <MemberName className="displayFont">{name}</MemberName>
                <MemberRole>{role}</MemberRole>
                <MemberLink>
                  <GithubIcon />
                  <span>GitHub</span>
                </MemberLink>
              </Member>
            </Reveal>
          ))}
        </TeamRow>
      </Team>

      <Reveal>
        <SocialRow>
          {[
            { href: DISCORD_URL, label: "Discord", aria: "Join our Discord", Icon: DiscordIcon },
            { href: TWITTER_URL, label: "X", aria: "Follow us on X", Icon: XIcon },
            { href: YOUTUBE_URL, label: "YouTube", aria: "Subscribe on YouTube", Icon: YouTubeIcon },
          ].map(({ href, label, aria, Icon }) => (
            <SocialLink key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={aria}>
              <Icon />
              <span>{label}</span>
            </SocialLink>
          ))}
        </SocialRow>
      </Reveal>
    </Wrapper>
  );
}

/* --- icons ---------------------------------------------------------------- */

function GithubIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .5A11.5 11.5 0 0 0 .5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-2.1c-3.2.7-3.88-1.37-3.88-1.37-.53-1.34-1.3-1.7-1.3-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.2 1.77 1.2 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.56-.29-5.25-1.28-5.25-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.2-1.5 3.17-1.18 3.17-1.18.63 1.59.23 2.76.12 3.05.74.81 1.18 1.84 1.18 3.1 0 4.43-2.69 5.4-5.26 5.69.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12 11.5 11.5 0 0 0 12 .5Z" />
    </svg>
  );
}

function DiscordIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.317 4.369a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.056 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.291a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.009c.12.099.246.198.373.292a.077.077 0 0 1-.006.127 12.3 12.3 0 0 1-1.873.892.076.076 0 0 0-.04.107c.36.698.772 1.363 1.225 1.993a.076.076 0 0 0 .084.029 19.84 19.84 0 0 0 6.002-3.03.077.077 0 0 0 .032-.055c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028ZM8.02 15.278c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.418 2.157-2.418 1.211 0 2.176 1.094 2.157 2.418 0 1.334-.955 2.419-2.157 2.419Zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.418 2.157-2.418 1.21 0 2.176 1.094 2.157 2.418 0 1.334-.946 2.419-2.157 2.419Z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
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

/* --- styles --------------------------------------------------------------- */

const Wrapper = styled.section`
  width: 100%;
  padding-top: 110px;
  padding-bottom: 120px;
`;

const Head = styled.div`
  max-width: 780px;
  margin: 88px auto 0 auto;
  text-align: center;
`;

const Title = styled.h2`
  font-size: 3.6rem;
  font-weight: 600;
  margin-top: 20px;

  @media (max-width: 760px) {
    font-size: 2.4rem;
  }
`;

const Mission = styled.p`
  color: var(--bone-dim);
  line-height: 1.85;
  margin-top: 26px;
`;

const Creed = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 46px;
  margin-top: 92px;
  padding-top: 46px;
  border-top: 1px solid var(--hairline);

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
    gap: 38px;
  }
`;

const Tenet = styled.div`
  position: relative;
  padding-top: 24px;
`;

/* A struck hairline above each tenet, lit at the left. */
const TenetMark = styled.span`
  position: absolute;
  top: 0;
  left: 0;
  width: 46px;
  height: 1px;
  background: linear-gradient(90deg, var(--ember), transparent);
`;

const TenetTitle = styled.h3`
  font-size: 1.4rem;
  font-weight: 600;
  color: var(--bone);
  line-height: 1.35;
  margin-bottom: 12px;
`;

const TenetBody = styled.p`
  color: var(--bone-dim);
  font-size: 0.93rem;
  line-height: 1.75;
`;

const Team = styled.div`
  margin-top: 100px;
  padding-top: 46px;
  border-top: 1px solid var(--hairline);
  text-align: center;
`;

const TeamBlurb = styled.p`
  color: var(--bone-faint);
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.28em;
  text-transform: uppercase;
`;

const TeamRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 76px;
  margin-top: 42px;
  flex-wrap: wrap;
`;

/* The whole card links to the person's GitHub profile. */
const Member = styled.a`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  color: inherit !important;
`;

const Avatar = styled.div`
  position: relative;
  width: 92px;
  height: 92px;
  border-radius: 50%;
  overflow: hidden;
  background: radial-gradient(circle at 35% 30%, rgba(232, 163, 61, 0.4), transparent 62%);
  box-shadow: 0 0 0 1px var(--hairline-strong), 0 0 32px rgba(232, 163, 61, 0.18);
  transition: box-shadow 0.4s var(--ease-soft);

  ${Member}:hover & {
    box-shadow: 0 0 0 1px rgba(232, 163, 61, 0.5), 0 0 44px rgba(232, 163, 61, 0.34);
  }
`;

const AvatarImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  /* Sits in the page's palette until you look at it. */
  filter: grayscale(0.55) contrast(1.05);
  transition: transform 0.5s var(--ease-out), filter 0.5s var(--ease-soft);

  ${Member}:hover & {
    transform: scale(1.06);
    filter: grayscale(0) contrast(1);
  }
`;

const MemberName = styled.span`
  font-size: 1.3rem;
  color: var(--bone);
`;

const MemberRole = styled.span`
  font-size: 0.66rem;
  font-weight: 500;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: var(--bone-faint);
  margin-top: -6px;
`;

const MemberLink = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  margin-top: 6px;
  font-size: 0.68rem;
  font-weight: 500;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--bone-faint);
  transition: color 0.3s var(--ease-soft);

  ${Member}:hover & {
    color: var(--ember);
  }
`;

const SocialRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 44px;
  margin-top: 92px;
  padding-top: 46px;
  border-top: 1px solid var(--hairline);
  flex-wrap: wrap;
`;

const SocialLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 6px 2px;
  position: relative;
  color: var(--bone-dim) !important;
  font-size: 0.72rem;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  transition: color 0.3s var(--ease-soft);

  /* Touch target. The visible link is 30px tall; a fingertip needs 44. */
  &::before {
    content: "";
    position: absolute;
    left: -8px;
    right: -8px;
    top: 50%;
    transform: translateY(-50%);
    height: 44px;
  }

  &::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 1px;
    background: linear-gradient(90deg, var(--ember), transparent);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.4s var(--ease-out);
  }

  &:hover {
    color: var(--ember) !important;
  }

  &:hover::after {
    transform: scaleX(1);
  }
`;
