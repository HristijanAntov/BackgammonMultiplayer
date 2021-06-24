import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useNetworkManager } from "../../../game-manager/network-manager";
import { wait } from "../../../utils";

import { Container, Title, Paragraph, Button } from "../ui/styles";
import {
  StyledBody,
  GameItems,
  Item,
  ItemSection,
  ItemLabel,
  Badge,
} from "./styles";
//components

interface Props {}

const JoinGameComponent: React.FC<Props> = () => {
  const { emitterService, roomsService } = useNetworkManager();
  const history = useHistory();
  const { rooms, isLoading } = roomsService;

  // const games = [
  //   {
  //     id: "a",
  //     hostedBy: "Anonymous",
  //     name: "play-room-1",
  //   },
  //   {
  //     id: "b",
  //     hostedBy: "Hristijan",
  //     name: "roomio",
  //   },
  //   {
  //     id: "c",
  //     hostedBy: "Branko",
  //     name: "test room 1",
  //   },
  //   {
  //     id: "dd",
  //     hostedBy: "Valerija",
  //     name: "friends room 3",
  //   },
  // ];

  useEffect(() => {
    emitterService.getRooms();
    return () => {
      roomsService.setRooms([]);
    };
  }, []);

  const onJoin = (gameId: string) => {
    console.log("trying to join", gameId);
    emitterService.joinRoom(gameId, "");
  };

  return (
    <Container>
      <Title> Available Rooms ({isLoading ? "Loading" : "Up to date"})</Title>
      <StyledBody>
        <GameItems>
          {rooms.map((game) => (
            <Item key={game.id}>
              <ItemSection>
                <ItemLabel>{game.name}</ItemLabel>
              </ItemSection>
              <ItemSection>
                <Badge>@{game.hostedBy}</Badge>
              </ItemSection>
              <ItemSection>
                <Button onClick={() => onJoin(game.id)}>Join</Button>
              </ItemSection>
            </Item>
          ))}
        </GameItems>
      </StyledBody>
    </Container>
  );
};

export default JoinGameComponent;
