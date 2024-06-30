import React from "react";
import styled from "styled-components";
// Components
import FullButton from "../Buttons/FullButton";
// Assets
import RollerIcon from "../../assets/svg/Services/RollerIcon";
import MonitorIcon from "../../assets/svg/Services/MonitorIcon";
import MobileIcon from "../../assets/svg/Services/MobileIcon";
import BrowserIcon from "../../assets/svg/Services/BrowserIcon";
import PrinterIcon from "../../assets/svg/Services/PrinterIcon";
import ProgLangIcon from "../../assets/svg/Services/ProgLangIcon";
import PubHostIcon from "../../assets/svg/Services/PubHostIcon";
import PlusIcon from "../../assets/svg/Services/PlusIcon";
import CheckMark from "../../assets/svg/Checkmark";
import CrossIcon from "../../assets/svg/CrossIcon";

export default function PricingTable({ icon, price, title, text, offers, action }) {
  let getIcon;
  let extraIcon;

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

  return (
    <Wrapper className="whiteBg radius8 shadow">
      <div className="flexSpaceCenter">
        {icon === "crossPlatform" ? (
          <>
            <MobileIcon />
            <PlusIcon />
            <MonitorIcon />
          </>
        ) : (
          getIcon
        )}
        <p className="font20 extraBold">{price}</p>
      </div>
      <div style={{ margin: "30px 0" }}>
        <h4 className="font30 extraBold">{title}</h4>
        <p className="font13">{text}</p>
      </div>
      <div>
        {offers
          ? offers.map((item, index) => (
            <div className="flexNullCenter" style={{ margin: "15px 0" }} key={index}>
              <div style={{ position: "relative", top: "-1px", marginRight: "15px" }}>
                {item.cheked ? (
                  <div style={{ minWidth: "20px" }}>
                    <CheckMark />
                  </div>
                ) : (
                  <div style={{ minWidth: "20px" }}>
                    <CrossIcon />
                  </div>
                )}
              </div>
              <p className="font20 extraBold">{item.name}</p>
            </div>
          ))
          : null}
      </div>
      {/* <div style={{ maxWidth: "120px", margin: "30px auto 0 auto" }}>
        <FullButton title="Select" action={action} />
      </div> */}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  text-align: left;
  padding: 20px 30px;
  margin-top: 30px;
`;