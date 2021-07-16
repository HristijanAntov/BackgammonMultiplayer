import { NetworkRole } from "./types";
import { PlayerType } from "../backgammon/types";

export const Actions = {
  ROOMS_FETCHED: "ROOMS_FETCHED",
  ROOM_CREATED: "ROOM_CREATED",
  ROOM_JOINED: "ROOM_JOINED",
  GAME_STARTED: "GAME_STARTED",
  SYNC_STATE: "SYNC_STATE",
  EXECUTE_MOVE: "EXECUTE_MOVE",
  EXECUTE_ROLL: "EXECUTE_ROLL",
  NO_AVAILABLE_MOVES: "NO_AVAILABLE_MOVES",
  ERROR_OCCURRED: "ERROR_OCCURRED",
  SYNC_NETWORK_STATUS: "SYNC_NETWORK_STATUS",

  // Emitters
  GET_ROOMS: "GET_ROOMS",
  CREATE_ROOM: "CREATE_ROOM",
  JOIN_ROOM: "JOIN_ROOM",
  INIT_ROLL: "INIT_ROLL",
  ROLL: "ROLL",
  MOVE: "MOVE",
  UNDO_MOVE: "UNDO_MOVE",
  CONFIRM_MOVE: "CONFIRM_MOVE",
};

export const Rooms = {
  PLAYERS: "players",
};

export const RolePlayerMap: Record<NetworkRole, PlayerType> = {
  HOST: "W",
  GUEST: "B",
};
