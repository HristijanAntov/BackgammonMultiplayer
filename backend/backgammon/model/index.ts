import maxBy from "lodash/maxBy";
import get from "lodash/get";
import last from "lodash/last";
import some from "lodash/some";

import {
  GameState,
  Consequence,
  DiceRolledResult,
  Move,
  StateMachine,
  Pip,
  MoveNode,
  PlayerType,
  PositionTransition,
  PendingMoveTransactionEntry,
  PositionTransitionEntry,
  PositionFromHitSpace,
  WinResult,
} from "../types";

import { getInitialState, getOpponent, isWin } from "../utils";

import {
  getNextState,
  pickMoveFromSequence,
  getNextMoveNodesAfterMove,
} from "../utils/move-maker";

import {
  getPositionId,
  getPossibleMoveNodes,
  getValidMoveNodes,
  getPositionTransitionsFromMoveNodes,
  generateAllMoveSequencesFromPositionTransition,
} from "../utils/move-generator";

import { rollDie, rollDice } from "../utils/roller";
import { Player, StateMachineValidTransitions } from "../constants";

const authorizeValidStates = (
  action: string,
  validStates: StateMachine[],
  currentState: StateMachine
): boolean => {
  if (!validStates.includes(currentState)) {
    console.log(`Invalid Action ${action} for state ${currentState}`);
    // throw new Error(`Invalid Action ${action} for state ${currentState}`);
    return false;
  }

  return true;
};

export default class Backgammon {
  private state: GameState;
  private pendingTransactionEntries: PendingMoveTransactionEntry[] = [];
  private currentMoveNodes: MoveNode[] | null = null;

  constructor() {
    this.state = getInitialState();
  }

  switchTurn(player?: PlayerType) {
    const { turn } = this.state;

    this.transitionStateMachine("PENDING_ROLL");

    if (turn === undefined && player) {
      //after init roll

      this.state.turn = player;
      return;
    }

    if (turn === undefined) {
      throw new Error("Invalid State: Cannot switch turn");
    }

    const resettedStateFields = {
      turn: getOpponent(turn),
      diceRolled: [],
      plyRoll: [],
      positionTransitionsMap: [],
    };

    this.state = {
      ...this.state,
      ...resettedStateFields,
    };
  }

  private transitionStateMachine(nextTransition: StateMachine) {
    const { stateMachine: currentTransition } = this.state;

    if (
      StateMachineValidTransitions[currentTransition].includes(nextTransition)
    ) {
      this.state.stateMachine = nextTransition;
      return;
    }

    throw new Error(
      `Invalid State: Cannot transition from ${currentTransition} to ${nextTransition} `
    );
  }

  areThereAvailableMoves(
    positionTransitionEntries: PositionTransitionEntry[]
  ): boolean {
    const { state } = this;

    const areThere =
      state.stateMachine !== "PENDING_MOVE" ||
      some(
        positionTransitionEntries,
        (positionTransition) => positionTransition.to.length > 0
      );

    return areThere;
  }

  hasInitRolled(player: PlayerType) {
    return this.state.initDiceRolled[player] !== -1;
  }

  private getInitialTurn(): PlayerType | false {
    const { initDiceRolled } = this.state;

    if (initDiceRolled.W === initDiceRolled.B) {
      return false;
    }

    const diceOrder: any = [
      {
        player: Player.White,
        die: initDiceRolled.W,
      },
      {
        player: Player.Black,
        die: initDiceRolled.B,
      },
    ];

    return get(maxBy(diceOrder, "die"), "player");
  }

  rollDice(player: PlayerType): DiceRolledResult | undefined {
    console.log("dovagjam ovde", player);
    const { diceRolled, initDiceRolled, stateMachine } = this.state;
    const validStates: StateMachine[] = ["PENDING_INIT_ROLL", "PENDING_ROLL"];

    const isAuthorized = authorizeValidStates(
      "rollDice",
      validStates,
      stateMachine
    );

    if (!isAuthorized) {
      return;
    }

    const isInitRoll = stateMachine === "PENDING_INIT_ROLL";
    const consequences: Consequence[] = [];

    if (isInitRoll) {
      const canInitRoll = initDiceRolled[player] === -1; // Has Already rolled
      if (canInitRoll) {
        const rolledDie = rollDie();

        this.state.initDiceRolled = {
          ...initDiceRolled,
          [player]: rolledDie,
        };

        const diceRolledInfo = {
          isInit: true,
          player,
          rolledDice: [rolledDie],
        };

        if (this.hasInitRolled(getOpponent(player))) {
          const initialTurn = this.getInitialTurn();

          if (!initialTurn) {
            this.state.initDiceRolled = {
              W: -1,
              B: -1,
            };

            // We add a consequence
            // This serves the client to show the Die and then update the actual resetted state
            consequences.push({
              type: "SAME_DIE_ROLLED",
              payload: {
                rolledDie,
              },
            });
          } else {
            consequences.push({
              type: "FINISHED_INIT_ROLL",
              payload: {
                turn: initialTurn,
                initDiceRolled: this.getState().initDiceRolled,
              },
            });
            this.switchTurn(initialTurn);
          }
        }
        return {
          consequences,
          diceRolledInfo,
        };
      } else {
        console.log(
          `Player ${player} cannot roll again cause he already rolled`
        );
        return;
      }
    }

    //Normal Roll from here
    const canRoll = stateMachine === "PENDING_ROLL" && diceRolled.length === 0;

    if (!canRoll) {
      console.log(`Invalid Action: Cannot roll in state: ${stateMachine} `);
      return;
    }

    const rolledDice = rollDice();
    this.state.diceRolled = [...rolledDice];
    this.state.plyRoll = [...rolledDice];

    console.log(`ROLLED DICE`, rolledDice);
    console.log("-".repeat(50));

    const moveNodes = getValidMoveNodes(
      getPossibleMoveNodes(this.state, player)
    );

    this.currentMoveNodes = moveNodes;

    const positionTransitions = getPositionTransitionsFromMoveNodes(
      moveNodes,
      player
    );

    this.state.positionTransitionsMap = positionTransitions;

    this.transitionStateMachine("PENDING_MOVE");

    if (!this.areThereAvailableMoves(positionTransitions)) {
      this.switchTurn(getOpponent(player));

      consequences.push({
        type: "NON_AVAILABLE_MOVES",
        payload: {
          player,
          rolledDice,
        },
      });
    }

    return {
      consequences,
      diceRolledInfo: {
        isInit: false,
        player,
        rolledDice,
      },
    };
  }

  move(move: Move): WinResult {
    const { turn, stateMachine } = this.state;
    const validStates: StateMachine[] = ["PENDING_MOVE"];

    authorizeValidStates("makeMove", validStates, stateMachine);

    if (turn !== move.player) {
      throw new Error(`Invalid state: Cannot move player: ${move.player}`);
    }

    if (this.currentMoveNodes === null) {
      throw new Error(
        `Invalid state: There are no moves in the tree for player: ${move.player}`
      );
    }

    const nextState = getNextState(this.state, move);

    this.pendingTransactionEntries.push({
      move,
      nextState,
      previousState: this.state,
      previousMoveNodes: this.currentMoveNodes,
    });

    const nextMoveNodes = getNextMoveNodesAfterMove(
      this.currentMoveNodes,
      move
    );

    const nextTransitionMap = getPositionTransitionsFromMoveNodes(
      nextMoveNodes,
      move.player
    );

    this.state = {
      ...nextState,
      positionTransitionsMap: nextTransitionMap,
    };

    this.currentMoveNodes = nextMoveNodes;

    const hasPlayerWon = isWin(this.state, move.player);

    if (hasPlayerWon) {
      this.transitionStateMachine("WIN");

      this.state.turn = undefined;

      return {
        isWin: true,
        player: move.player,
      };
    }

    return {
      isWin: false,
      player: move.player,
    };
  }

  undo() {
    const pendingTransactionEntries = this.pendingTransactionEntries;
    const undoedTransactionEntry = last(pendingTransactionEntries);

    const undoedState = get(
      undoedTransactionEntry,
      "previousState",
      this.getState()
    );

    const undoedMoveNodes = get(
      undoedTransactionEntry,
      "previousMoveNodes",
      this.currentMoveNodes
    );

    this.state = { ...undoedState };
    this.currentMoveNodes = undoedMoveNodes;
    this.pendingTransactionEntries = pendingTransactionEntries.slice(0, -1);
  }

  pickMoveByPositionTransition(positionTransition: PositionTransition): Move[] {
    const { from, to } = positionTransition;
    const { pips } = this.state;
    const { currentMoveNodes } = this;

    if (currentMoveNodes === null) {
      console.log("Something got corrupted, no moves in the move tree");
      return [];
    }

    const pip = pips.find((p) => p.pipId === from);

    if (pip === undefined && from !== "hit-space") {
      throw new Error(`Invalid position pip not present`);
    }

    const validMoves = generateAllMoveSequencesFromPositionTransition(
      currentMoveNodes,
      positionTransition
    );

    const positionEntry: Pip | PositionFromHitSpace = pip || "hit-space";

    const pickedMoveSequence = pickMoveFromSequence(to, {
      pipId: getPositionId(positionEntry),
      moves: validMoves,
    });

    return pickedMoveSequence || [];
  }

  confirmMove(): PendingMoveTransactionEntry[] {
    const { state } = this;
    const { stateMachine } = state;

    if (stateMachine !== "WIN") {
      this.switchTurn();
    }

    const currentPendingTransactionEntries = [
      ...this.pendingTransactionEntries,
    ];

    this.pendingTransactionEntries = [];

    return currentPendingTransactionEntries;
  }

  getState(): GameState {
    return this.state;
  }
}
