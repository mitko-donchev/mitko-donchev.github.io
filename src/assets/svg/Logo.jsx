import * as React from "react";
import logoImg from '../img/logo.png';

function SvgComponent(props) {
  return (
    <img src={logoImg} style={{ width: '40px', height: '40px'}} alt="Header logo"/>
  );
}

export default SvgComponent;
