import React, { useEffect, useRef } from "react";
import styled from "styled-components";
// Components
import FullButton from "../Buttons/FullButton";
import WishlistButton from "../Buttons/WishlistButton";
import EmberField from "../Elements/EmberField";
import ScrollCue from "../Elements/ScrollCue";
// Hooks
import useReducedMotion from "../../hooks/useReducedMotion";
// Config
import {
  TRAILER_URL,
  GAME_NAME,
  GAME_GENRE,
  CTA_TRAILER,
  CTA_DEMO_BADGE,
} from "../../config/links";

/* Served from public/ rather than imported, so index.html can preload it by a
   stable path — an imported asset gets a content hash the static HTML cannot
   know. It is the LCP element, and it used to be discovered only after the
   bundle had mounted React, at ~2s. The query string must stay in step with
   the preload in public/index.html or the browser fetches the file twice.

   It is also no longer 822 kB. It was a 900x900 PNG rendered into a 210px
   slot; at 480x480 it never upscales on any real device — 210 at 2x is 420,
   158 at 3x is 474 — and weighs 173 kB. */
const LOGO_FULL = `${process.env.PUBLIC_URL}/logo-full.png?v=1`;

/* The cold open, not the premise. It is stranger, it is specific, and it
   leaves the first real surprise for the game to spend. */
const TAGLINE =
  "One road out of the village, walked with a bow. It is never quite the road you walked last time.";

export default function Hero() {
  const reduced = useReducedMotion();
  const skyRef = useRef(null);
  const ridgeRef = useRef(null);
  const contentRef = useRef(null);

  const openTrailer = () => window.open(TRAILER_URL, "_blank", "noopener,noreferrer");

  // The trailer link is still a placeholder. A button that opens a blank tab
  // is worse than no button, so it appears when there is something to show.
  const hasTrailer = Boolean(TRAILER_URL) && TRAILER_URL !== "#";

  /* Two parallaxes, both written straight to the DOM.

     Pointer moves the distant ridge against the near content, which is what
     gives the hero depth on a still page. Scroll drifts the whole lockup up
     and fades it, so leaving the hero feels like walking through the gate
     rather than like a section ending. */
  useEffect(() => {
    if (reduced) return undefined;

    let frame = 0;
    let running = false;
    let onScreen = true;
    let lastScroll = -1;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    /* currentX/Y are fractions of the viewport, so this is the point where
       the largest multiplier (46px) is moving under a fiftieth of a pixel. */
    const SETTLED = 0.0005;

    const onPointerMove = (event) => {
      targetX = event.clientX / window.innerWidth - 0.5;
      targetY = event.clientY / window.innerHeight - 0.5;
      wake();
    };

    const tick = () => {
      currentX += (targetX - currentX) * 0.06;
      currentY += (targetY - currentY) * 0.06;

      if (skyRef.current) {
        skyRef.current.style.transform = `translate3d(${currentX * -22}px, ${currentY * -14}px, 0)`;
      }
      if (ridgeRef.current) {
        ridgeRef.current.style.transform = `translate3d(${currentX * -46}px, ${currentY * -10}px, 0)`;
      }
      const scrolled = window.scrollY;
      if (contentRef.current) {
        const fade = Math.max(0, 1 - scrolled / (window.innerHeight * 0.62));
        contentRef.current.style.transform =
          `translate3d(${currentX * 12}px, ${currentY * 8 - scrolled * 0.16}px, 0)`;
        contentRef.current.style.opacity = String(fade);
      }

      /* Idle out rather than rescheduling forever. There is nothing left to
         do once the pointer lerp has caught up and the scroll has not moved,
         and this loop used to run for the whole life of the page — writing
         three transforms a frame long after the hero was off-screen, and on
         a touch device, where pointermove never fires, doing it for nothing
         from the very first frame. */
      const stillMoving =
        Math.abs(targetX - currentX) >= SETTLED ||
        Math.abs(targetY - currentY) >= SETTLED ||
        scrolled !== lastScroll;
      lastScroll = scrolled;

      if (!stillMoving) {
        running = false;
        return;
      }
      frame = window.requestAnimationFrame(tick);
    };

    function wake() {
      if (running || !onScreen) return;
      running = true;
      frame = window.requestAnimationFrame(tick);
    }

    const onScroll = () => wake();

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });

    /* Once the hero has left the screen its parallax is invisible, so the
       loop should not merely idle — it should be unwakeable. */
    let observer;
    const wrapper = document.getElementById("home");
    if (wrapper && typeof IntersectionObserver !== "undefined") {
      observer = new IntersectionObserver(
        ([entry]) => {
          onScreen = entry.isIntersecting;
          if (onScreen) wake();
          else {
            running = false;
            window.cancelAnimationFrame(frame);
          }
        },
        { threshold: 0 }
      );
      observer.observe(wrapper);
    }

    wake();

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("scroll", onScroll);
      window.cancelAnimationFrame(frame);
      if (observer) observer.disconnect();
    };
  }, [reduced]);

  return (
    <Wrapper id="home">
      {/* --- depth, back to front --- */}
      <Sky ref={skyRef} aria-hidden="true">
        <Moon />
      </Sky>

      <Ridge ref={ridgeRef} aria-hidden="true">
        {/* The village on its ridge, far off and below. Drawn rather than
            detailed — at this distance it only has to read as somewhere with
            people in it, and lights in the windows do that. */}
        <svg viewBox="0 0 1600 300" preserveAspectRatio="xMidYMax slice">
          {/* Far ridge — hazier, higher, no detail. */}
          <path
            d="M0,300 L0,196 C90,180 150,206 232,192 C316,178 366,146 452,152
               C540,158 590,190 668,182 C752,174 800,138 884,146
               C968,154 1020,188 1104,180 C1190,172 1236,142 1322,150
               C1404,158 1462,186 1540,178 L1600,170 L1600,300 Z"
            fill="#080B13"
            opacity="0.92"
          />
          {/* Near ridge — the village sits on this one. */}
          <path
            d="M0,300 L0,238 C104,226 168,246 258,236 C352,226 404,200 496,208
               C586,216 636,244 726,238 C818,232 866,204 956,212
               C1046,220 1096,246 1186,240 C1278,234 1330,208 1420,216
               C1500,223 1548,242 1600,236 L1600,300 Z"
            fill="#03050A"
          />
          <g fill="#E8A33D">
            {[
              [268, 236], [352, 226], [420, 214], [508, 210], [612, 226],
              [700, 240], [788, 220], [880, 212], [980, 218], [1092, 240],
              [1204, 238], [1300, 212], [1436, 218],
            ].map(([x, y], index) => (
              <Window
                key={`${x}-${y}`}
                x={x}
                y={y}
                width="2.4"
                height="3.2"
                $still={reduced}
                $offset={(index * 0.73) % 4}
              />
            ))}
          </g>
        </svg>
      </Ridge>

      <EmberLayer aria-hidden="true">
        <EmberField density={0.62} />
      </EmberLayer>

      {/* --- the lockup --- */}
      <Content ref={contentRef} className="container">
        <Inner>
          {/* width/height are the intrinsic pixels, not the display size.
              They give the box an aspect ratio to reserve before the file
              arrives, which is what stops the lockup jumping as it loads. */}
          <Brand src={LOGO_FULL} alt="Epic Millennium" width="480" height="480" />

          <Kicker>
            <span className="hudLabel">Debut Title</span>
          </Kicker>

          {/* Each word rises out of its own mask, so the title arrives as a
              line being spoken rather than as a block fading up. */}
          <Title className="displayFont">
            {GAME_NAME.split("").map((letter, index) => (
              <LetterMask key={`${letter}-${index}`}>
                <Letter $delay={340 + index * 55}>
                  {letter}
                </Letter>
              </LetterMask>
            ))}
          </Title>

          <Genre>{GAME_GENRE}</Genre>

          <Tagline className="font18">
            {TAGLINE}
          </Tagline>

          <Actions>
            <ActionSlot>
              <WishlistButton />
            </ActionSlot>
            {hasTrailer && (
              <ActionSlot>
                <FullButton title={CTA_TRAILER} action={openTrailer} border />
              </ActionSlot>
            )}
          </Actions>

          <Badge>
            <Dot aria-hidden="true" $still={reduced} />
            {CTA_DEMO_BADGE}
          </Badge>
        </Inner>
      </Content>

      <CueSlot>
        <ScrollCue to="game" label="The road in" ariaLabel="Read about the game" />
      </CueSlot>
    </Wrapper>
  );
}

/* --- styles --------------------------------------------------------------- */

const Wrapper = styled.section`
  position: relative;
  width: 100%;
  min-height: 100svh;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  /* The bottom padding has to clear the scroll cue, which is absolutely
     positioned and so takes no space of its own — it sits from 34px to about
     116px off the bottom. At 100px the demo badge landed on top of it on any
     900px-tall screen, which is most laptops. 132 is the floor that keeps a
     usable margin over the cue; it is not free to shrink with the rest of the
     rhythm, which is why this is a literal and not var(--space-section). */
  padding: clamp(76px, 11vw, 120px) 0 clamp(116px, 13vw, 132px) 0;

  /* Short laptops only. Without the width bound this also caught small
     phones, which then took the stepped padding instead of the clamp above -
     the devices the clamp exists for. */
  @media (max-height: 700px) and (min-width: 761px) {
    padding: 96px 0 132px 0;
  }
`;

const Sky = styled.div`
  position: absolute;
  inset: -4%;
  pointer-events: none;
  will-change: transform;
`;

const Moon = styled.div`
  position: absolute;
  top: 14%;
  right: 16%;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  /* Deliberately no disc edge — a cold bloom behind the cloud, not a sphere
     pasted onto the sky. */
  background: radial-gradient(circle at 50% 50%,
    rgba(214, 226, 244, 0.10) 0%,
    rgba(190, 208, 236, 0.05) 22%,
    rgba(150, 175, 214, 0.02) 46%,
    transparent 68%);
  filter: blur(4px);

  @media (max-width: 760px) {
    width: 190px;
    height: 190px;
    top: 8%;
    right: -4%;
  }
`;

/* The skyline overhangs the hero on all three sides it can, which is free —
   the wrapper clips it — and closes three ways it used to come unstuck from
   its own edges. The parallax is the reason all three exist: it moves this
   element in pixels while the insets were written in percent, so the slack
   ran out on small screens.

   Sides. Travel is currentX * -46, bounded at 23px because currentX is
   clientX / innerWidth - 0.5. Against that, 3% is only 9.6px at 320 wide, so
   under 768px the ridge slid clear of the viewport and left bare sky beside
   it — 13.1px at 320, 8.4px at 480, 3.7px at 640, nothing from 768 up. The
   26px floor beats the travel everywhere and leaves the roomier percentage
   in charge on wide screens.

   Bottom, first reason. Travel is currentY * -10, bounded at 5px the same
   way. Point at the lower half of the screen and the ridge lifted that far
   off the bottom of the hero, opening a band of sky above the next section.
   Measured 4.9px at every width from 320 to 1920.

   Bottom, second reason. The hero's height lands on a fraction at most sizes
   — 779.50 at 320x720, 986.94 at 1440x900 — which left the last device-pixel
   row only half covered, and the sky showed through it as a hairline. It was
   absent at exactly the sizes where the height came out whole (844, 1080).

   Kept out of the template on purpose: CSS comments inside a styled template
   are string data, so terser leaves them in and every visitor downloads
   them. JS comments out here cost nothing. */
const Ridge = styled.div`
  position: absolute;
  left: min(-3%, -26px);
  right: min(-3%, -26px);
  bottom: -8px;
  height: 42vh;
  min-height: 240px;
  pointer-events: none;
  will-change: transform;

  svg {
    display: block;
    width: 100%;
    height: 100%;
  }

  /* Fades in well above the skyline, so the peaks stay crisp and only the
     haze below the horizon softens. */
  -webkit-mask-image: linear-gradient(180deg, transparent 0%, #000 22%, #000 100%);
  mask-image: linear-gradient(180deg, transparent 0%, #000 22%, #000 100%);

  /* Whatever is burning in the village, seen from the far side of the hill. */
  &::before {
    content: "";
    position: absolute;
    left: 10%;
    right: 10%;
    bottom: 0;
    height: 62%;
    background: radial-gradient(58% 100% at 50% 100%, rgba(232, 163, 61, 0.16), transparent 72%);
    pointer-events: none;
  }
`;

const Window = styled.rect`
  animation: ${(props) => (props.$still ? "none" : "flicker 5s ease-in-out infinite")};
  animation-delay: ${(props) => props.$offset}s;

  @keyframes flicker {
    0%, 100% { opacity: 0.35; }
    45% { opacity: 1; }
    70% { opacity: 0.6; }
  }
`;

const EmberLayer = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
`;

const Content = styled.div`
  position: relative;
  z-index: 2;
  will-change: transform, opacity;
`;

const Inner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  max-width: 900px;
  margin: 0 auto;
`;

/* The entrance is a CSS animation with `both` fill, not a state flip. It runs
   on first paint, needs no render to start, and cannot be left half-applied —
   which a mounted-flag transition can, if the flag never lands. */
const riseIn = `
  @keyframes riseIn {
    from { opacity: 0; transform: translate3d(0, 18px, 0); }
    to { opacity: 1; transform: none; }
  }
`;

const rise = (delay) => `
  ${riseIn}
  animation: riseIn 1s var(--ease-out) ${delay}ms both;
`;

const Brand = styled.img`
  width: 210px;
  max-width: 52vw;
  height: auto;
  margin-bottom: 30px;
  filter: drop-shadow(0 0 50px rgba(232, 163, 61, 0.22));
  ${rise(60)};

  @media (max-width: 560px) {
    width: 158px;
    margin-bottom: 22px;
  }
`;

const Kicker = styled.div`
  ${rise(220)};
`;

const Title = styled.h1`
  display: flex;
  justify-content: center;
  margin: 18px 0 0 0;
  font-size: clamp(4.2rem, 13vw, 11rem);
  font-weight: 500;
  line-height: 0.98;
  letter-spacing: 0.02em;
  color: var(--bone);
  position: relative;
`;

/* Each letter gets its own overflow window so it can slide up from nothing. */
const LetterMask = styled.span`
  display: inline-block;
  overflow: hidden;
  padding: 0 0.008em;
`;

const Letter = styled.span`
  display: inline-block;
  animation: letterIn 1.15s var(--ease-out) ${(props) => props.$delay}ms both;

  @keyframes letterIn {
    from { transform: translate3d(0, 108%, 0); opacity: 0; }
    to { transform: none; opacity: 1; }
  }
`;

const Genre = styled.p`
  margin-top: 22px;
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.44em;
  text-transform: uppercase;
  color: var(--verdigris);
  ${rise(780)};
`;

const Tagline = styled.p`
  max-width: 580px;
  margin: 30px auto 0 auto;
  color: var(--bone-dim);
  line-height: 1.8;
  ${rise(880)};
`;

const Actions = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 44px;
  ${rise(980)};

  @media (max-width: 560px) {
    flex-direction: column;
    width: 100%;
    max-width: 300px;
  }
`;

const ActionSlot = styled.div`
  width: 218px;
  @media (max-width: 560px) {
    width: 100%;
  }
`;

const Badge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-top: 30px;
  font-size: 0.68rem;
  font-weight: 500;
  letter-spacing: 0.26em;
  text-transform: uppercase;
  color: var(--bone-faint);
  ${rise(1080)};
`;

const Dot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--ember);
  box-shadow: 0 0 10px var(--ember);
  animation: ${(props) => (props.$still ? "none" : "pulseDot 2.4s ease-in-out infinite")};

  @keyframes pulseDot {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }
`;

const CueSlot = styled.div`
  position: absolute;
  bottom: 34px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 3;
  animation: cueIn 1.2s var(--ease-out) 1400ms both;

  @keyframes cueIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  a {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }

  @media (max-height: 700px) {
    display: none;
  }
`;
