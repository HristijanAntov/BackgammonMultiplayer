export interface Dimensions {
  width: number;
  height: number;
}

export interface Position {
  top: number;
  left: number;
}

export type PlayerType = "W" | "B";

export type StateMachine =
  | "PENDING_INIT_ROLL"
  | "PENDING_ROLL"
  | "PENDING_MOVE"
  | "WIN";

export type PlayerBuckets = Record<PlayerType, number>;

export interface Pip {
  isEmpty: boolean;
  player: PlayerType | undefined;
  count: number;
  pipId: number;
}

export interface GameState {
  turn: PlayerType | undefined;
  stateMachine: StateMachine;
  diceRolled: number[];
  plyRoll: number[];
  initDiceRolled: PlayerBuckets;
  positionTransitionsMap: PositionTransitionEntry[];
  pips: Pip[];
  hitSpace: PlayerBuckets;
  bearOff: PlayerBuckets;
}

export type ConsequenceType =
  | "FINISHED_INIT_ROLL"
  | "SAME_DIE_ROLLED"
  | "NON_AVAILABLE_MOVES";

export interface Consequence {
  type: ConsequenceType;
  payload: any;
}

export interface Move {
  player: PlayerType;
  from: number | "hit-space";
  to: number;
  isHit: boolean;
  die: number;
}

export interface PositionTransitionEntry {
  from: number | "hit-space";
  to: number[];
}

export interface PositionTransition {
  from: number | "hit-space";
  to: number;
}

export interface ConditionalEntry {
  when: boolean;
  value: string;
}

export interface MoveTransactionEntry {
  move: Move;
  state: GameState;
}
