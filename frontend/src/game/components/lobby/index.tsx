import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import {
  Lobby,
  OptionsForm,
  Header,
  Body,
  OptionsContainer,
  Option,
  RightContainer,
  StyledLink,
} from "./styles";

//components
import CreateGame from "./create-game";
import JoinGame from "./join-game";
import About from "./about";

interface Props {}

const LobbyComponent: React.FC<Props> = () => {
  const location = useLocation();

  const [selectedOptionId, setSelectedOptionId] =
    useState<string | undefined>(undefined);

  const navMenu = [
    {
      id: "create-game",
      label: "Create New Game",
      path: "/game/create",
      component: CreateGame,
    },
    {
      id: "join-game",
      label: "Join Game",
      path: "/game/join",
      component: JoinGame,
    },
    {
      id: "about",
      label: "About",
      path: "/about",
      component: About,
    },
  ];

  useEffect(() => {
    const matchedOption = navMenu.find((nav) => nav.path === location.pathname);

    if (matchedOption !== undefined) {
      setSelectedOptionId(matchedOption.id);
    }
  }, [location.pathname]);

  const SelectedComponent = (
    selectedOptionId === undefined
      ? null
      : navMenu.find((nav) => nav.id === selectedOptionId)?.component
  ) as React.FC | null;

  return (
    <Lobby>
      <OptionsForm>
        <Header>Backgammon Lobby</Header>
        <Body>
          <OptionsContainer>
            {navMenu.map((option) => (
              <StyledLink
                key={option.id}
                to={option.path}
                style={{ fontStyle: "normal !important" }}
              >
                <Option isSelected={option.id === selectedOptionId}>
                  {option.label}
                </Option>
              </StyledLink>
            ))}
          </OptionsContainer>
          <RightContainer>
            {SelectedComponent !== null ? <SelectedComponent /> : null}
          </RightContainer>
        </Body>
      </OptionsForm>
    </Lobby>
  );
};

export default LobbyComponent;
