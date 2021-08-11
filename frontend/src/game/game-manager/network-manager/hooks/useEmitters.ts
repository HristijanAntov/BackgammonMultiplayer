import IO from "../io";
import { Actions } from "../constants";
import { NetworkState } from "../types";
import { PositionTransition } from "../../../types";
import { RoomsService } from "./useRooms";

export type VoidEmitter = () => void;

export interface EmitterService {
  createRoom: (roomName: string, username: string, password: string) => void;
  joinRoom: (roomId: string, username: string, password: string) => void;
  pressInitRoll: VoidEmitter;
  pressRoll: VoidEmitter;
  getRooms: VoidEmitter;
  selectToMove: (positionTranslation: PositionTransition) => void;
  confirmMove: VoidEmitter;
  undo: VoidEmitter;
  sendRematchInvitation: VoidEmitter;
  acceptRematchInvitation: VoidEmitter;
  declineRematchInvitation: VoidEmitter;
}

interface Params {
  networkState: NetworkState;
  updateNetworkState: (networkState: NetworkState) => void;
  roomsService: RoomsService;
}

const useEmitters = (params: Params): EmitterService => {
  const { roomsService } = params;

  const getRooms = () => {
    roomsService.setIsLoading(true);
    IO.emit(Actions.GET_ROOMS, "");
  };

  const createRoom = (roomName: string, username: string, password: string) => {
    IO.emit(Actions.CREATE_ROOM, {
      roomName,
      username,
      password,
    });
  };

  const joinRoom = (roomId: string, username: string, password: string) => {
    IO.emit(Actions.JOIN_ROOM, {
      roomId,
      username,
      password,
    });
  };

  const pressInitRoll = () => {
    IO.emit(Actions.INIT_ROLL, "");
  };

  const pressRoll = () => {
    IO.emit(Actions.ROLL, "");
  };

  const selectToMove = (positionTranslation: PositionTransition) => {
    IO.emit(Actions.MOVE, positionTranslation);
  };

  const confirmMove = () => {
    IO.emit(Actions.CONFIRM_MOVE, "");
  };

  const undo = () => {
    IO.emit(Actions.UNDO_MOVE, "");
  };

  // Rematch logic
  const sendRematchInvitation = () => {
    IO.emit(Actions.INVITE_FOR_REMATCH, "");
  };

  const acceptRematchInvitation = () => {
    IO.emit(Actions.ACCEPT_REMATCH, "");
  };

  const declineRematchInvitation = () => {
    IO.emit(Actions.DECLINE_REMATCH, "");
  };

  return {
    createRoom,
    joinRoom,
    pressInitRoll,
    pressRoll,
    getRooms,
    selectToMove,
    confirmMove,
    undo,
    sendRematchInvitation,
    acceptRematchInvitation,
    declineRematchInvitation,
  };
};

export default useEmitters;
