import { useEffect } from "react";
import IO from "../io";
import { actions } from "../constants";
import { useGameState } from "../../game-state";
import { useGameUI } from "../../game-ui";
import { NetworkState } from "../types";
import { PositionTransition } from "../../../types";
import { RoomsService } from "./useRooms";

export type VoidEmitter = () => void;

export interface EmitterService {
  createRoom: (roomName: string, username: string) => void;
  joinRoom: (roomId: string, username: string) => void;
  pressInitRoll: VoidEmitter;
  pressRoll: VoidEmitter;
  getRooms: VoidEmitter;
  selectToMove: (positionTranslation: PositionTransition) => void;
  confirmMove: VoidEmitter;
  undo: VoidEmitter;
}

interface Params {
  networkState: NetworkState;
  updateNetworkState: (networkState: NetworkState) => void;
  roomsService: RoomsService;
}

const useEmitters = (params: Params): EmitterService => {
  const { updateGameState } = useGameState();
  const { uiState } = useGameUI();

  const { networkState, updateNetworkState, roomsService } = params;

  const getRooms = () => {
    roomsService.setIsLoading(true);
    IO.emit(actions.GET_ROOMS, "");
  };

  const createRoom = (roomName: string, username: string) => {
    IO.emit(actions.CREATE_ROOM, {
      roomName,
      username,
    });
  };

  const joinRoom = (roomId: string, username: string) => {
    IO.emit(actions.JOIN_ROOM, {
      roomId,
      username,
    });
  };

  const pressInitRoll = () => {
    IO.emit(actions.INIT_ROLL, "");
  };

  const pressRoll = () => {
    IO.emit(actions.ROLL, "");
  };

  const selectToMove = (positionTranslation: PositionTransition) => {
    IO.emit(actions.MOVE, positionTranslation);
  };

  const confirmMove = () => {
    IO.emit(actions.CONFIRM_MOVE, "");
  };

  const undo = () => {
    IO.emit(actions.UNDO_MOVE, "");
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
  };
};

export default useEmitters;
