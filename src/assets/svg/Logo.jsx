import * as React from "react";
import logoImg from '../img/logo.png';

function SvgComponent(props) {
  return (
    <img
      src={logoImg}
      style={{
        width: '40px',
        height: '40px',
        borderRadius: '10px',
        border: '1px solid var(--border)',
        boxShadow: '0 0 16px var(--accent-glow)',
        objectFit: 'cover',
      }}
      alt="Header logo"
    />
  );
}

export default SvgComponent;
