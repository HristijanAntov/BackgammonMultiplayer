export type PlayerType = "W" | "B";

export type StateMachine =
  | "PENDING_INIT_ROLL"
  | "PENDING_ROLL"
  | "PENDING_MOVE"
  | "WIN";

export type StateMachineTransition = Record<StateMachine, StateMachine[]>;

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

export interface DiceRolledInfo {
  isInit: boolean;
  player: PlayerType;
  rolledDice: number[];
}

export interface DiceRolledResult {
  diceRolledInfo: DiceRolledInfo;
  consequences: Consequence[];
}

export interface PipMovesSequence {
  pipId: number | "hit-space";
  moves: Move[][];
}

export interface PositionTransitionEntry {
  from: number | "hit-space";
  to: number[];
}

export interface PositionTransition {
  from: number | "hit-space";
  to: number;
}

export type PositionFromHitSpace = "hit-space";

export interface MoveTransactionEntry {
  move: Move;
  state: GameState;
}

export interface PendingMoveTransactionEntry {
  move: Move;
  previousState: GameState;
  previousMoveNodes: MoveNode[];
  nextState: GameState;
}

//TODO: This is a generic, I can maybe put it in some not game specific module later
export interface TreeNode<T> {
  data: T;
  children: TreeNode<T>[];
}

export interface WinResult {
  isWin: boolean;
  player: PlayerType;
}

export type MoveNode = TreeNode<Move>;
