import isEqual from "lodash/isEqual";

import { GameState, PlayerType, Move } from "../types";

import { INITIAL_STATE } from "../constants";

export const getInitialState = (): GameState => ({ ...INITIAL_STATE });
export const isFacingNorth = (player: PlayerType) => player === "W";

export const getOpponent = (p: PlayerType): PlayerType =>
  p === "W" ? "B" : "W";

export const isEqualMove = (move: Move, anotherMove: Move) =>
  isEqual(move, anotherMove);

export const isWin = (state: GameState, player: PlayerType) =>
  state.bearOff[player] === 15;
