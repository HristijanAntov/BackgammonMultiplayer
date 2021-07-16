import React from "react";
import { useNetworkManager } from "../../../game-manager/network-manager";
import { CreateRoomForm } from "../../../game-manager/network-manager/hooks/useRooms";
//styles
import { Container, Title, Body, Button, ControlWrapper } from "../ui/styles";

//components
import TextBox from "../ui/textbox";

interface Props {}

const isFormValid = (form: CreateRoomForm): boolean =>
  [form.roomName, form.username, form.password].some(
    (it) => it === undefined || it === ""
  );

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

    const { roomName, username, password } = createRoomForm;

    emitterService.createRoom(
      roomName as string,
      username as string,
      password as string
    );
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
        <ControlWrapper>
          <TextBox
            width="100%"
            placeholder="Password"
            defaultValue=""
            type="password"
            value={createRoomForm.password}
            onChange={(value) => syncField("password", value)}
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
