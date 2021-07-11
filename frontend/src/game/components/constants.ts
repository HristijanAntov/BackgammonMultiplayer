import { GameState, PlayerType } from "../types";

export const QUADRANT_CONFIGS = {
  left: [
    {
      quadrantNum: 1,
      pipsRange: {
        from: 6,
        to: 12,
      },
    },
    {
      quadrantNum: 2,
      pipsRange: {
        from: 12,
        to: 18,
      },
    },
  ],

  right: [
    {
      quadrantNum: 0,
      pipsRange: {
        from: 0,
        to: 6,
      },
    },
    {
      quadrantNum: 3,
      pipsRange: {
        from: 18,
        to: 24,
      },
    },
  ],
};

export const DIMENSIONS_CONFIG = {
  BAR_TICKNESS_RATIO: 0.03,
  CENTER_BAR_TICKNESS_RATIO: 0.07,
  BEAROFF_BAR_RATIO: 0.09,
  ACTIVE_CHECKER_RATIO: 0.05,
  CHECKERS_SPACE_RATIO: 0.0095,
  CHECKER_STACKING_FACTOR: 0.7,
  BEAROFF_CHECKER_RATIO: 0.25,
  CONTROLS_RATIO: 0.1,
  DIE_RATIO: 0.6,
  DIE_POINT_RATIO: 0.19,
};

export const Player: Record<string, PlayerType> = {
  Black: "B",
  White: "W",
};

export const INITIAL_STATE: GameState = {
  turn: "W",
  diceRolled: [4, 3],
  // pipMovesSequences: [],
  positionTransitionsMap: [],
  stateMachine: "PENDING_ROLL",
  initDiceRolled: {
    W: 0,
    B: 0,
  },
  hitSpace: {
    W: 0,
    B: 0,
  },
  bearOff: {
    W: 3,
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

export const ANIMATION_DURATION = 0.4; //s
