import { useState } from "react";

import { Room } from "../types";

export interface CreateRoomForm {
  roomName: string | undefined;
  username: string | undefined;
}

export interface RoomsService {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  rooms: Room[];
  setRooms: (rooms: Room[]) => void;
  createRoomForm: CreateRoomForm;
  isCreatingRoom: boolean;
  updateCreateRoomForm: (form: CreateRoomForm) => void;
  setIsCreatingRoom: (isCreatingRoom: boolean) => void;
  initCreateForm: () => void;
}

interface Params {}

const useRoomsService = (params: Params): RoomsService => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isCreatingRoom, setIsCreatingRoom] = useState<boolean>(false);
  const [createRoomForm, updateCreateRoomForm] = useState<CreateRoomForm>({
    roomName: undefined,
    username: undefined,
  });

  const initCreateForm = () => {
    updateCreateRoomForm({
      roomName: undefined,
      username: undefined,
    });
  };

  return {
    isLoading,
    setIsLoading,
    rooms,
    setRooms,
    createRoomForm,
    isCreatingRoom,
    setIsCreatingRoom,
    updateCreateRoomForm,
    initCreateForm,
  };
};

export default useRoomsService;
