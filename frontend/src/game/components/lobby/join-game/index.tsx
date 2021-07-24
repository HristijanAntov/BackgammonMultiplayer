import React, { useEffect, useState } from "react";
import { useNetworkManager } from "../../../game-manager/network-manager";
import { JoinRoomForm } from "../../../game-manager/network-manager/hooks/useRooms";

import {
  Container,
  Title,
  Body,
  Button,
  ControlWrapper,
  ErrorWrapper,
} from "../ui/styles";

import {
  StyledBody,
  GameItems,
  ItemWrapper,
  Item,
  ItemSection,
  ItemLabel,
  Badge,
} from "./styles";

//components
import TextBox from "../ui/textbox";
import { IError } from "../../../game-manager/network-manager/types";

interface Props {}

const isFormValid = (form: JoinRoomForm): boolean =>
  [form.username, form.password].some((it) => it === undefined || it === "");

const getErrorMessage = (error: IError) => {
  const { errorType, payload } = error;

  switch (errorType) {
    case "PASSWORD_NOT_PRESENT":
      return `There was no password for room named: ${payload.roomName}`;
    case "PASSWORD_NOT_VALID":
      return `Password for room '${payload.roomName}' was not valid. Please try again.`;
    default:
      return "Some error happened";
  }
};

const JoinGameComponent: React.FC<Props> = () => {
  const [expandedRoomId, setExpandedRoom] = useState<string | undefined>(
    undefined
  );
  const { emitterService, roomsService } = useNetworkManager();

  const {
    rooms,
    isLoading,
    isJoiningRoom,
    updateJoinRoomForm,
    joinRoomForm,
    setIsJoiningRoom,
    error,
  } = roomsService;

  useEffect(() => {
    emitterService.getRooms();

    return () => {
      roomsService.setRooms([]);
      roomsService.setIsJoiningRoom(false);
      roomsService.setError(undefined);
    };
  }, []);

  const syncField = (key: keyof JoinRoomForm, value: string) => {
    updateJoinRoomForm({
      ...joinRoomForm,
      [key]: value,
    });
  };

  const onJoin = (roomId: string) => {
    console.log("trying to join", roomId);
    setIsJoiningRoom(true);

    const { username, password } = joinRoomForm;
    console.log(username, password, roomId);

    emitterService.joinRoom(roomId, username as string, password as string);
  };

  const isJoinDisabled =
    isFormValid(roomsService.joinRoomForm) || isJoiningRoom;

  const errorMessage = error === undefined ? undefined : getErrorMessage(error);

  return (
    <Container>
      <Title>Available Rooms ({isLoading ? "Loading" : "Up to date"})</Title>
      <StyledBody>
        <GameItems>
          {rooms.map((game) => (
            <ItemWrapper key={game.id} isExpanded={expandedRoomId === game.id}>
              <Item
                onClick={() =>
                  setExpandedRoom((current) =>
                    current !== game.id ? game.id : undefined
                  )
                }
              >
                <ItemSection>
                  <ItemLabel>{game.name}</ItemLabel>
                </ItemSection>
                <ItemSection>
                  <Badge>@{game.hostedBy}</Badge>
                </ItemSection>
              </Item>

              {game.id === expandedRoomId && (
                <Container>
                  <Body>
                    <ControlWrapper>
                      <TextBox
                        width="100%"
                        placeholder="Username"
                        defaultValue=""
                        value={joinRoomForm.username}
                        onChange={(value) => syncField("username", value)}
                      />
                    </ControlWrapper>
                    <ControlWrapper>
                      <TextBox
                        width="100%"
                        placeholder="Password"
                        defaultValue=""
                        value={joinRoomForm.password}
                        type="password"
                        onChange={(value) => syncField("password", value)}
                      />
                    </ControlWrapper>
                    {errorMessage && (
                      <ControlWrapper>
                        <ErrorWrapper>{errorMessage}</ErrorWrapper>
                      </ControlWrapper>
                    )}
                    <ControlWrapper style={{ flexDirection: "row-reverse" }}>
                      <Button
                        style={{ height: "32px" }}
                        disabled={isJoinDisabled}
                        onClick={() => onJoin(game.id)}
                      >
                        {isJoiningRoom
                          ? "Joining Room"
                          : `Join Room ${game.name}`}
                      </Button>
                    </ControlWrapper>
                  </Body>
                </Container>
              )}
            </ItemWrapper>
          ))}
        </GameItems>
      </StyledBody>
    </Container>
  );
};

export default JoinGameComponent;
