import React from "react";
import styled from "styled-components";

export default function FullButton({ title, action, border, glow = true }) {
  return (
    <Wrapper
      className="animate pointer radius8 displayFont"
      onClick={action ? () => action() : null}
      border={border}
      glow={glow}
    >
      {title}
    </Wrapper>
  );
}

const Wrapper = styled.button`
  border: 1px solid ${(props) => (props.border ? "var(--accent-2)" : "var(--accent)")};
  background-color: ${(props) => (props.border ? "transparent" : "var(--accent)")};
  width: 100%;
  padding: 15px;
  outline: none;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: ${(props) => (props.border ? "var(--accent-2)" : "#fff")};
  box-shadow: ${(props) =>
    props.glow && !props.border ? "0 0 20px var(--accent-glow)" : "none"};
  :hover {
    background-color: ${(props) => (props.border ? "rgba(34, 211, 238, 0.08)" : "#8b4bf5")};
    border: 1px solid ${(props) => (props.border ? "var(--accent-2)" : "var(--accent)")};
    color: ${(props) => (props.border ? "var(--accent-2)" : "#fff")};
    box-shadow: ${(props) =>
      props.border ? "0 0 20px rgba(34, 211, 238, 0.35)" : "0 0 32px var(--accent-glow)"};
  }
`;
