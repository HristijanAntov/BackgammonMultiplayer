import React, { useState, useEffect } from "react";
import { useNetworkManager } from "../../../game-manager/network-manager";
//styles
import {
  Container,
  Title,
  Body,
  Button,
  Paragraph,
  ControlWrapper,
} from "../ui/styles";

//components
import TextBox from "../ui/textbox";

interface Props {}

interface CreateRoomForm {
  roomName: string | undefined;
  username: string | undefined;
}

const isFormValid = (form: CreateRoomForm): boolean =>
  [form.roomName, form.username].some((it) => it === undefined || it === "");

const CreateGameComponent: React.FC<Props> = () => {
  const { emitterService, roomsService } = useNetworkManager();

  const {
    isCreatingRoom,
    updateCreateRoomForm,
    createRoomForm,
    setIsCreatingRoom,
  } = roomsService;

  const syncField = (key: keyof CreateRoomForm, value: string) => {
    updateCreateRoomForm({
      ...createRoomForm,
      [key]: value,
    });
  };

  const isCreateDisabled =
    isFormValid(roomsService.createRoomForm) || isCreatingRoom;

  const onCreate = () => {
    setIsCreatingRoom(true);

    const { roomName, username } = createRoomForm;

    emitterService.createRoom(roomName as string, username as string);
  };

  return (
    <Container>
      <Title>Create New Game</Title>
      <Body>
        <ControlWrapper>
          <TextBox
            width="100%"
            placeholder="Room Name"
            defaultValue=""
            value={createRoomForm.roomName}
            onChange={(value) => syncField("roomName", value)}
          />
        </ControlWrapper>
        <ControlWrapper>
          <TextBox
            width="100%"
            placeholder="Username"
            defaultValue=""
            value={createRoomForm.username}
            onChange={(value) => syncField("username", value)}
          />
        </ControlWrapper>
        <ControlWrapper style={{ flexDirection: "row-reverse" }}>
          <Button
            style={{ height: "32px" }}
            disabled={isCreateDisabled}
            onClick={() => onCreate()}
          >
            {isCreatingRoom ? "Creating" : "Create Game"}
          </Button>
        </ControlWrapper>
      </Body>
    </Container>
  );
};

export default CreateGameComponent;
