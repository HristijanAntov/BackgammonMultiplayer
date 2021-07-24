import { useState } from "react";

import { Room, IError } from "../types";

export interface CreateRoomForm {
  roomName: string | undefined;
  username: string | undefined;
  password: string | undefined;
}

export interface JoinRoomForm {
  roomId: string | undefined;
  username: string | undefined;
  password: string | undefined;
}

export interface RoomsService {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  rooms: Room[];
  setRooms: (rooms: Room[]) => void;
  createRoomForm: CreateRoomForm;
  joinRoomForm: JoinRoomForm;
  isCreatingRoom: boolean;
  isJoiningRoom: boolean;
  error: IError | undefined;
  setError: (error: IError | undefined) => void;
  updateCreateRoomForm: (form: CreateRoomForm) => void;
  updateJoinRoomForm: (form: JoinRoomForm) => void;
  setIsJoiningRoom: (isJoiningRoom: boolean) => void;
  setIsCreatingRoom: (isCreatingRoom: boolean) => void;
  initCreateForm: () => void;
  initJoinForm: () => void;
}

interface Params {}

const initCreateRoomForm = () => ({
  roomName: undefined,
  username: undefined,
  password: undefined,
});

const initJoinRoomForm = () => ({
  roomId: undefined,
  username: undefined,
  password: undefined,
});

const useRoomsService = (params: Params): RoomsService => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isCreatingRoom, setIsCreatingRoom] = useState<boolean>(false);
  const [isJoiningRoom, setIsJoiningRoom] = useState<boolean>(false);

  const [createRoomForm, updateCreateRoomForm] = useState<CreateRoomForm>(
    initCreateRoomForm()
  );

  const [joinRoomForm, updateJoinRoomForm] = useState<JoinRoomForm>(
    initJoinRoomForm()
  );

  const [error, setError] = useState<IError | undefined>(undefined);

  const initCreateForm = () => {
    updateCreateRoomForm(initCreateRoomForm());
  };

  const initJoinForm = () => {
    updateJoinRoomForm(initJoinRoomForm());
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
    isJoiningRoom,
    setIsJoiningRoom,
    updateJoinRoomForm,
    joinRoomForm,
    initJoinForm,
    error,
    setError,
  };
};

export default useRoomsService;
