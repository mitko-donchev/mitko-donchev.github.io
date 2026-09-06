import React from "react";
import styled from "styled-components";

/* Two weights of the same button.

   Primary is gilded — ember fill, ink text — and is the only filled surface
   on the page, so it always reads as the thing to press. Secondary is a
   hairline. Both take the interface voice (Inter, tracked, uppercase) rather
   than the display serif: the serif is the world talking, and a button is
   not the world talking. */
export default function FullButton({ title, action, border, glow = true }) {
  return (
    <Wrapper
      type="button"
      className="pointer"
      onClick={action ? () => action() : null}
      $border={border}
      $glow={glow}
    >
      <Label>{title}</Label>
    </Wrapper>
  );
}

const Wrapper = styled.button`
  position: relative;
  width: 100%;
  padding: 16px 22px;
  border: 1px solid ${(props) => (props.$border ? "var(--hairline-strong)" : "var(--ember)")};
  background: ${(props) => (props.$border ? "transparent" : "var(--ember)")};
  color: ${(props) => (props.$border ? "var(--bone)" : "#20160A")};
  font-family: 'Inter', sans-serif;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  overflow: hidden;
  outline: none;
  box-shadow: ${(props) =>
    props.$glow && !props.$border ? "0 6px 30px rgba(232, 163, 61, 0.28)" : "none"};
  transition:
    background 0.35s var(--ease-soft),
    border-color 0.35s var(--ease-soft),
    color 0.35s var(--ease-soft),
    box-shadow 0.35s var(--ease-soft),
    transform 0.35s var(--ease-out);

  /* A light that crosses the face on hover — the same sheen as the gate. */
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: -60%;
    width: 45%;
    height: 100%;
    background: linear-gradient(
      100deg,
      transparent,
      ${(props) => (props.$border ? "rgba(232,163,61,0.14)" : "rgba(255,255,255,0.34)")},
      transparent
    );
    transform: skewX(-18deg);
    transition: left 0.62s var(--ease-out);
  }

  &:hover {
    transform: translateY(-1px);
    border-color: var(--ember);
    background: ${(props) => (props.$border ? "rgba(232, 163, 61, 0.07)" : "var(--ember-hot)")};
    color: ${(props) => (props.$border ? "var(--ember-hot)" : "#20160A")};
    box-shadow: ${(props) =>
      props.$border
        ? "0 6px 26px rgba(232, 163, 61, 0.14)"
        : "0 8px 38px rgba(232, 163, 61, 0.42)"};
  }

  &:hover::before {
    left: 115%;
  }

  &:active {
    transform: translateY(0);
  }

  @media (prefers-reduced-motion: reduce) {
    &::before { display: none; }
    &:hover { transform: none; }
  }
`;

const Label = styled.span`
  position: relative;
  z-index: 1;
`;
