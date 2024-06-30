import React from "react";
import styled from "styled-components";
import googlePlayIcon from "../../assets/img/projects/google-play-label.png";
import appStoreIcon from "../../assets/img/projects/app-store-label.svg";

export default function ProjectBox({ img, title, text, action, googlePlayLink, appStoreLink }) {
  return (
    <Wrapper>
      <ImgBtn className="animate pointer" onClick={action ? () => action() : null}>
        <img className="radius8" src={img} alt="project" />
      </ImgBtn>
      <h3 className="font20 extraBold">{title}</h3>
      <p className="font13">{text}</p>
      <ButtonContainer>
        {googlePlayLink && (
          <ActionButton href={googlePlayLink} target="_blank">
            <AppStoreLabel src={googlePlayIcon} alt="Google Play" />
          </ActionButton>
        )}
        {appStoreLink && (
          <ActionButton href={appStoreLink} target="_blank">
            <AppStoreLabel src={appStoreIcon} alt="App Store" />
          </ActionButton>
        )}
      </ButtonContainer>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  margin-top: 30px;

  img {
    width: 100%;
    height: auto;
    margin: 20px 0;
  }

  h3 {
    padding-bottom: 10px;
  }
`;

const ImgBtn = styled.button`
  background-color: transparent;
  border: 0px;
  outline: none;
  padding: 0px;
  margin: 0px;
  position: relative;

  &:hover > img {
    opacity: 0.5;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
`;

const ActionButton = styled.a`
  display: ${props => props.href ? 'inline-block' : 'none'}; /* Hide button if href is empty */
  text-decoration: none;
`;

const AppStoreLabel = styled.img` 
  width: 120px !important; 
  height: 40px !important; 
  margin: 10px; 
`;