import { Socket } from "socket.io";
import { Consequence, GameState, PlayerType } from "../backgammon/types";

export interface Room {
  id: string;
  name: string;
  hostedBy: string;
}

export type NetworkStatus = "NOT_STARTED" | "WAITING_FOR_GUEST" | "STARTED";

export type NetworkRole = "HOST" | "GUEST";

export interface SocketWithRole {
  role: NetworkRole;
  playerSocket: Socket;
}

export interface DiceRolledMetadata {
  player: PlayerType;
  die: number;
  nthDie: number;
}

export interface ExecuteRollPayload {
  diceRolledMetadata: DiceRolledMetadata[];
  consequences: Consequence[];
  state: GameState;
}
