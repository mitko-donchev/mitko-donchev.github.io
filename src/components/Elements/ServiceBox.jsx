import React from "react";
import styled from "styled-components";
// Assets
import RollerIcon from "../../assets/svg/Services/RollerIcon";
import MonitorIcon from "../../assets/svg/Services/MonitorIcon";
import MobileIcon from "../../assets/svg/Services/MobileIcon";
import BrowserIcon from "../../assets/svg/Services/BrowserIcon";
import PrinterIcon from "../../assets/svg/Services/PrinterIcon";
import ProgLangIcon from "../../assets/svg/Services/ProgLangIcon";
import PubHostIcon from "../../assets/svg/Services/PubHostIcon";

export default function ServiceBox({ icon, title, subtitle }) {
  let getIcon;

  switch (icon) {
    case "roller":
      getIcon = <RollerIcon />;
      break;
    case "monitor":
      getIcon = <MonitorIcon />;
      break;
    case "mobile":
      getIcon = <MobileIcon />;
      break;
    case "browser":
      getIcon = <ProgLangIcon />;
      break;
    case "printer":
      getIcon = <PubHostIcon />;
      break;
    default:
      getIcon = <RollerIcon />;
      break;
  }

  if (icon == "monitor") {
    return (
      <Wrapper className="flex flexColumn">
        <IconStyle>{getIcon}</IconStyle>
        <TitleStyleMonitor className="font20 extraBold">{title}</TitleStyleMonitor>
        <SubtitleStyle className="font13">{subtitle}</SubtitleStyle>
      </Wrapper>
    );
  } else {
    return (
      <Wrapper className="flex flexColumn">
        <IconStyle>{getIcon}</IconStyle>
        <TitleStyle className="font20 extraBold">{title}</TitleStyle>
        <SubtitleStyle className="font13">{subtitle}</SubtitleStyle>
      </Wrapper>
    );
  }
}

const Wrapper = styled.div`
  width: 100%;
`;

const IconStyle = styled.div`
  @media (max-width: 860px) {
    margin: 0 auto;
  }
`;

const TitleStyle = styled.h2`
  width: 100%;
  max-width: 300px;
  margin: 0 auto;
  padding: 40px 0;
  @media (max-width: 860px) {
    padding: 20px 0;
  }
`;

const TitleStyleMonitor = styled.h2`
  width: 100%;
  max-width: 300px;
  margin: 0 auto;
  padding: 52px 0 40px 0;
  @media (max-width: 860px) {
    padding: 20px 0;
  }
`;

const SubtitleStyle = styled.p`
  width: 100%;
  max-width: 300px;
  margin: 0 auto;
`;