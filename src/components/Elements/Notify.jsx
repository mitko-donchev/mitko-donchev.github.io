import React, { useState } from "react";
import styled from "styled-components";
import {
  DISCORD_URL,
  NOTIFY_ENDPOINT,
  NOTIFY_KICKER,
  NOTIFY_LINE,
  NOTIFY_PLACEHOLDER,
  NOTIFY_CTA,
  NOTIFY_SENDING,
  NOTIFY_DONE,
  NOTIFY_ERROR,
  NOTIFY_FALLBACK,
  NOTIFY_FALLBACK_CTA,
} from "../../config/links";

/* "Demo: coming soon" was stated in three places and actionable in none.
 *
 * Two shapes, chosen by whether NOTIFY_ENDPOINT is set. With an endpoint this
 * is a one-field signup; without one it points at the Discord, which is a
 * channel that already exists. It never renders a form that posts nowhere.
 *
 * The request is a plain form-encoded POST with no library and no third-party
 * script, so adding this cannot undo the loading work: Buttondown, Formspree,
 * ConvertKit and a hand-rolled Worker all accept exactly this. If the service
 * needs JSON instead, change the two lines in `send`.
 *
 * `website` is a honeypot — hidden from sight and from assistive tech, never
 * focusable. Bots fill it; people cannot. A filled one is dropped on the
 * floor and reported as success, because telling a bot it failed is telling
 * it how to succeed. */
const IDLE = "idle";
const SENDING = "sending";
const DONE = "done";
const FAILED = "failed";

export default function Notify() {
  const [email, setEmail] = useState("");
  const [trap, setTrap] = useState("");
  const [state, setState] = useState(IDLE);

  const send = async (event) => {
    event.preventDefault();
    if (state === SENDING || state === DONE) return;
    if (trap) {
      setState(DONE);
      return;
    }
    setState(SENDING);
    try {
      const body = new URLSearchParams();
      body.set("email", email);
      const response = await fetch(NOTIFY_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json" },
        body: body.toString(),
      });
      setState(response.ok ? DONE : FAILED);
    } catch (error) {
      setState(FAILED);
    }
  };

  return (
    <Wrapper className="container">
      <Row>
        <Copy>
          <span className="hudLabel">{NOTIFY_KICKER}</span>
          <Line className="loreFont">{NOTIFY_ENDPOINT ? NOTIFY_LINE : NOTIFY_FALLBACK}</Line>
        </Copy>

        {NOTIFY_ENDPOINT ? (
          <Form onSubmit={send}>
            <Field
              type="email"
              name="email"
              required
              autoComplete="email"
              placeholder={NOTIFY_PLACEHOLDER}
              aria-label="Your email address"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={state === SENDING || state === DONE}
            />
            <Trap
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              value={trap}
              onChange={(event) => setTrap(event.target.value)}
            />
            <Send type="submit" disabled={state === SENDING || state === DONE}>
              {state === SENDING ? NOTIFY_SENDING : NOTIFY_CTA}
            </Send>
          </Form>
        ) : (
          <Fallback href={DISCORD_URL} target="_blank" rel="noopener noreferrer">
            {NOTIFY_FALLBACK_CTA}
          </Fallback>
        )}
      </Row>

      {/* Announced rather than only shown: the form it replaces is the thing
          that had focus, and a status nobody is told about is not a status. */}
      <Status role="status" aria-live="polite" $shown={state === DONE || state === FAILED}>
        {state === DONE ? NOTIFY_DONE : state === FAILED ? NOTIFY_ERROR : ""}
      </Status>
    </Wrapper>
  );
}

/* No rule of its own. The studio section above already ends on one (the
   socials row), and the footer opens with the divider, so a third hairline
   inside 300px was three lines competing to be the end of the page. The
   padding here plus the studio's own makes the standard section seam — see
   the rhythm note in src/style/index.css. */
const Wrapper = styled.section`
  width: 100%;
  padding-top: var(--space-section);
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-group);
  flex-wrap: wrap;
`;

const Copy = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Line = styled.p`
  margin: 0;
  font-size: 1.16rem;
  color: var(--bone-dim);
`;

const Form = styled.form`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const Field = styled.input`
  min-width: 260px;
  flex: 1 1 260px;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--hairline-strong);
  border-radius: 2px;
  color: var(--bone);
  font-family: var(--font-ui);
  font-size: 0.94rem;

  &::placeholder { color: var(--bone-faint); }
  &:focus { border-color: rgba(232, 163, 61, 0.42); outline: none; }
  &:focus-visible { outline: 2px solid var(--ember); outline-offset: 2px; }
  &:disabled { opacity: 0.5; }
`;

/* Off-screen rather than display:none — a hidden field some bots skip is a
   honeypot some bots skip. */
const Trap = styled.input`
  position: absolute;
  left: -9999px;
  width: 1px;
  height: 1px;
  opacity: 0;
`;

const Send = styled.button`
  padding: 12px 26px;
  background: transparent;
  border: 1px solid var(--hairline-strong);
  border-radius: 2px;
  color: var(--bone);
  font-family: var(--font-ui);
  font-size: 0.76rem;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  cursor: pointer;
  transition: color 240ms var(--ease-soft), border-color 240ms var(--ease-soft);

  &:hover:not(:disabled) { color: var(--ember-hot); border-color: rgba(232, 163, 61, 0.42); }
  &:disabled { opacity: 0.5; cursor: default; }
`;

const Fallback = styled.a`
  padding: 12px 26px;
  border: 1px solid var(--hairline-strong);
  border-radius: 2px;
  color: var(--bone);
  font-size: 0.76rem;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  white-space: nowrap;
  transition: color 240ms var(--ease-soft), border-color 240ms var(--ease-soft);

  &:hover { color: var(--ember-hot); border-color: rgba(232, 163, 61, 0.42); }
`;

/* Height is reserved whether or not there is anything to say, so a result
   arriving cannot push the footer down the page. */
const Status = styled.p`
  min-height: 1.5em;
  margin: 14px 0 0 0;
  font-size: 0.88rem;
  color: var(--bone-faint);
  opacity: ${(props) => (props.$shown ? 1 : 0)};
  transition: opacity 300ms var(--ease-soft);
`;
