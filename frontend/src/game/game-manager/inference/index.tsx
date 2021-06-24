import React, { useContext, createContext } from "react";
import { get, find, every, map, times, identity } from "lodash";

import { useNetworkManager } from "../network-manager";
import { NetworkRole } from "../network-manager/types";

import { useGameState } from "../game-state";
import { useGameUI } from "../game-ui";

import { whoAmI } from "../../utils/backgammon";
import { getOpponent } from "../../utils";
import { PlayerType } from "../../types";

type PredicateCheck = () => boolean;

interface DieContainerMetadata {
  nthDie: number;
  dieNum: number;
}

export interface InferenceContextValue {
  isMyTurn: boolean;
  myPlayer: PlayerType;
  canInitRoll: PredicateCheck;
  canRoll: PredicateCheck;
  canUndo: PredicateCheck;
  canConfirmMove: PredicateCheck;
  getHasPipMove: (
    pipId: number | "hit-space",
    player: PlayerType | undefined
  ) => boolean;
  areThereNonAvailableMoves: PredicateCheck;
  shouldShowDiceContainer: (player: PlayerType) => boolean;
  getDiceMetadata: (player: PlayerType) => DieContainerMetadata[];
}

export const InferenceContext = createContext({} as InferenceContextValue);

export const InferenceProvider: React.FC = ({ children }) => {
  const { networkState } = useNetworkManager();
  const { state, consequences } = useGameState();
  const { uiState } = useGameUI();

  const myPlayer: PlayerType = whoAmI(networkState.role as NetworkRole);
  const isMyTurn = state.turn === myPlayer;

  const getHasPipMove = (
    pipId: number | "hit-space",
    player: PlayerType | undefined
  ) => {
    const { positionTransitionsMap } = state;

    const hasPossibleMove =
      get(find(positionTransitionsMap, { from: pipId }), "to.length", 0) > 0;

    const isFromMyHitSpace = pipId === "hit-space" && player === myPlayer;

    if (pipId === "hit-space") {
      return isMyTurn && isFromMyHitSpace && hasPossibleMove;
    }

    return isMyTurn && hasPossibleMove;
  };

  const canInitRoll = () => {
    const { pressedRoll } = uiState;
    const { stateMachine, initDiceRolled } = state;
    const checks = [
      stateMachine === "PENDING_INIT_ROLL",
      initDiceRolled[myPlayer] === -1,
      !pressedRoll,
    ];

    return every(checks, identity);
  };

  const canRoll = () => {
    const { stateMachine, diceRolled } = state;
    const { pressedRoll, isExecutingRoll } = uiState;

    const checks = [
      isMyTurn,
      !isExecutingRoll[myPlayer],
      stateMachine === "PENDING_ROLL",
      diceRolled.length === 0,
      !pressedRoll,
    ];
    return every(checks, identity);
  };

  const canConfirmMove = () => {
    const { stateMachine, diceRolled, positionTransitionsMap } = state;
    const checks = [
      isMyTurn,
      stateMachine === "PENDING_MOVE",
      diceRolled.length === 0 || positionTransitionsMap.length === 0,
    ];

    return every(checks, identity);
  };

  const canUndo = () => {
    const { stateMachine } = state;
    const checks = [isMyTurn, stateMachine === "PENDING_MOVE"];

    return every(checks, identity);
  };

  const areThereNonAvailableMoves = () => {
    const nonAvailableMovesConsequence = Boolean(
      find(consequences, {
        type: "NON_AVAILABLE_MOVES",
      })
    );

    return nonAvailableMovesConsequence;
  };

  const shouldShowDiceContainer = (player: PlayerType) => {
    const { stateMachine, turn, initDiceRolled, diceRolled } = state;
    const { isExecutingRoll } = uiState;

    const isRolling = isExecutingRoll[player];

    const check =
      isRolling ||
      (stateMachine === "PENDING_INIT_ROLL" && initDiceRolled[player] !== -1) ||
      stateMachine === "PENDING_MOVE";

    return check;
  };

  const getDiceMetadata = (player: PlayerType): DieContainerMetadata[] => {
    const canShowDice = shouldShowDiceContainer(player);

    if (!canShowDice) {
      return [];
    }

    const { stateMachine, turn, initDiceRolled, diceRolled } = state;
    const { isExecutingRoll } = uiState;

    const isRolling = isExecutingRoll[player];
    const nonAvailableMovesConsequence = find(consequences, {
      type: "NON_AVAILABLE_MOVES",
    });

    if (stateMachine === "PENDING_INIT_ROLL") {
      const sameRollConsequence = find(consequences, {
        type: "SAME_DIE_ROLLED",
      });

      const finishedInitRollConsequence = find(consequences, {
        type: "FINISHED_INIT_ROLL",
      });

      if (sameRollConsequence !== undefined) {
        const { rolledDie } = sameRollConsequence.payload;

        return [
          {
            nthDie: 0,
            dieNum: rolledDie as number,
          },
        ];
      }

      if (finishedInitRollConsequence !== undefined) {
        const { initDiceRolled } = finishedInitRollConsequence.payload;

        const dieForPlayer = initDiceRolled[player];

        return [
          {
            nthDie: 0,
            dieNum: dieForPlayer,
          },
        ];
      }

      const initDie = initDiceRolled[player];
      const hasInitRolled = initDie !== -1;
      const dieMetadata: DieContainerMetadata = hasInitRolled
        ? { nthDie: 0, dieNum: initDie }
        : { nthDie: 0, dieNum: 1 }; // We just provide some starting num, it doesn't matter

      return [dieMetadata];
    }

    if (isRolling) {
      const resultingRoll =
        nonAvailableMovesConsequence !== undefined
          ? (nonAvailableMovesConsequence.payload.rolledDice as number[])
          : times(2);

      const diceMetadata: DieContainerMetadata[] = map(
        resultingRoll,
        (dieNum, nthDie) => ({
          nthDie,
          dieNum, // We just provide some starting num, it doesn't matter
        })
      );

      return diceMetadata;
    }

    if (player === turn) {
      const nonAvailableMovesConsequence = find(consequences, {
        type: "NON_AVAILABLE_MOVES",
      });

      const resultingRoll =
        nonAvailableMovesConsequence !== undefined
          ? (nonAvailableMovesConsequence.payload.rolledDice as number[])
          : diceRolled;

      console.log(resultingRoll, "omg");

      const diceMetadata: DieContainerMetadata[] = map(
        resultingRoll,
        (dieNum, nthDie) => ({
          nthDie,
          dieNum,
        })
      );

      return diceMetadata;
    }

    return [];
  };

  return (
    <InferenceContext.Provider
      value={{
        myPlayer,
        isMyTurn,
        canInitRoll,
        canRoll,
        canUndo,
        canConfirmMove,
        getHasPipMove,
        areThereNonAvailableMoves: areThereNonAvailableMoves,
        shouldShowDiceContainer,
        getDiceMetadata,
      }}
    >
      {children}
    </InferenceContext.Provider>
  );
};

export const useGameInference = (): InferenceContextValue => {
  const context = useContext(InferenceContext);
  return context;
};
