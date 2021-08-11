import { GameState, PlayerType, StateMachineTransition } from "../types";

export const Player: Record<string, PlayerType> = {
  Black: "B",
  White: "W",
};

export const StateMachineValidTransitions: StateMachineTransition = {
  PENDING_INIT_ROLL: ["PENDING_ROLL"],
  PENDING_MOVE: ["PENDING_ROLL", "WIN"],
  PENDING_ROLL: ["PENDING_ROLL", "PENDING_MOVE"],
  WIN: [],
};

export const INITIAL_STATE: GameState = {
  turn: undefined,
  diceRolled: [],
  plyRoll: [],
  positionTransitionsMap: [],
  stateMachine: "PENDING_INIT_ROLL",
  initDiceRolled: {
    W: -1,
    B: -1,
  },
  hitSpace: {
    W: 0,
    B: 0,
  },
  bearOff: {
    W: 0,
    B: 0,
  },
  pips: [
    { isEmpty: false, player: Player.Black, count: 2, pipId: 0 },
    { isEmpty: true, player: undefined, count: 0, pipId: 1 },
    { isEmpty: true, player: undefined, count: 0, pipId: 2 },
    { isEmpty: true, player: undefined, count: 0, pipId: 3 },
    { isEmpty: true, player: undefined, count: 0, pipId: 4 },
    { isEmpty: false, player: Player.White, count: 5, pipId: 5 },
    { isEmpty: true, player: undefined, count: 0, pipId: 6 },
    { isEmpty: false, player: Player.White, count: 3, pipId: 7 },
    { isEmpty: true, player: undefined, count: 0, pipId: 8 },
    { isEmpty: true, player: undefined, count: 0, pipId: 9 },
    { isEmpty: true, player: undefined, count: 0, pipId: 10 },
    { isEmpty: false, player: Player.Black, count: 5, pipId: 11 },
    { isEmpty: false, player: Player.White, count: 5, pipId: 12 },
    { isEmpty: true, player: undefined, count: 0, pipId: 13 },
    { isEmpty: true, player: undefined, count: 0, pipId: 14 },
    { isEmpty: true, player: undefined, count: 0, pipId: 15 },
    { isEmpty: false, player: Player.Black, count: 3, pipId: 16 },
    { isEmpty: true, player: undefined, count: 0, pipId: 17 },
    { isEmpty: false, player: Player.Black, count: 5, pipId: 18 },
    { isEmpty: true, player: undefined, count: 0, pipId: 19 },
    { isEmpty: true, player: undefined, count: 0, pipId: 20 },
    { isEmpty: true, player: undefined, count: 0, pipId: 21 },
    { isEmpty: true, player: undefined, count: 0, pipId: 22 },
    { isEmpty: false, player: Player.White, count: 2, pipId: 23 },
  ],
};

export const INITIAL_STATE_TEST: GameState = {
  turn: "W",
  diceRolled: [],
  plyRoll: [],
  positionTransitionsMap: [],
  stateMachine: "PENDING_ROLL",
  initDiceRolled: {
    W: -1,
    B: -1,
  },
  hitSpace: {
    W: 0,
    B: 0,
  },
  bearOff: {
    W: 0,
    B: 0,
  },
  pips: [
    { isEmpty: true, player: undefined, count: 0, pipId: 0 },
    { isEmpty: true, player: undefined, count: 0, pipId: 1 },
    { isEmpty: true, player: undefined, count: 0, pipId: 2 },
    { isEmpty: true, player: undefined, count: 0, pipId: 3 },
    { isEmpty: true, player: undefined, count: 0, pipId: 4 },
    { isEmpty: false, player: Player.Black, count: 2, pipId: 5 },
    { isEmpty: false, player: Player.White, count: 1, pipId: 6 },
    { isEmpty: false, player: Player.Black, count: 2, pipId: 7 },
    { isEmpty: true, player: undefined, count: 0, pipId: 8 },
    { isEmpty: true, player: undefined, count: 0, pipId: 9 },
    { isEmpty: true, player: undefined, count: 0, pipId: 10 },
    { isEmpty: true, player: undefined, count: 0, pipId: 11 },
    { isEmpty: true, player: undefined, count: 0, pipId: 12 },
    { isEmpty: true, player: undefined, count: 0, pipId: 13 },
    { isEmpty: false, player: Player.White, count: 1, pipId: 14 },
    { isEmpty: true, player: undefined, count: 0, pipId: 15 },
    { isEmpty: false, player: Player.Black, count: 3, pipId: 16 },
    { isEmpty: true, player: undefined, count: 0, pipId: 17 },
    { isEmpty: false, player: Player.Black, count: 5, pipId: 18 },
    { isEmpty: true, player: undefined, count: 0, pipId: 19 },
    { isEmpty: true, player: undefined, count: 0, pipId: 20 },
    { isEmpty: true, player: undefined, count: 0, pipId: 21 },
    { isEmpty: true, player: undefined, count: 0, pipId: 22 },
    { isEmpty: true, player: undefined, count: 0, pipId: 23 },
  ],
};
