import { Consequence, GameState, PlayerType } from "../../types";

export type NetworkStatus = "NOT_STARTED" | "WAITING_FOR_GUEST" | "STARTED";
export type NetworkRole = "HOST" | "GUEST";

export interface NetworkState {
  status: NetworkStatus;
  roomId: string | undefined;
  role: NetworkRole | undefined;
  hostUsername: string | undefined;
  guestUsername: string | undefined;
}

export interface Room {
  id: string;
  name: string;
  hostedBy: string;
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

export type ErrorType = "PASSWORD_NOT_VALID" | "PASSWORD_NOT_PRESENT";

export interface IError {
  errorType: ErrorType;
  payload: any;
}
