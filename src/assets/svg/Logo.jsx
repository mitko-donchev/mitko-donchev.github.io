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
        // The artwork bleeds to its own edges, so the emblem's outer circle used
        // to touch the frame and get clipped by the border radius. Inset it with
        // padding + contain so the full mark reads. The artwork's edge is ~#000,
        // so the padded area blends into the background seamlessly.
        objectFit: 'contain',
        backgroundColor: '#05050A',
        padding: '5px',
        boxSizing: 'border-box',
      }}
      alt="Header logo"
    />
  );
}

export default SvgComponent;
