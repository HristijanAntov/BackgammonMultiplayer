import React, { useContext, createContext, useState } from "react";

import { Move, PlayerType } from "../../types";

//animation hooks
import useMoveCheckerAnimation, {
  AnimationMoveCheckerMetadata,
} from "./hooks/useMoveCheckerAnimation";

import useHandleMoveAnimation from "./hooks/useHandleMoveAnimation";
import useRollDiceAnimation, {
  AnimationRollDiceMetadata,
} from "./hooks/useRollDiceAnimation";

export interface UIState {
  selectedChecker: undefined | SelectedCheckerMetadata;
  pressedRoll: boolean;
  pressedUndo: boolean;
  pressedConfirm: boolean;
  isExecutingMove: boolean;
  isExecutingRoll: Record<PlayerType, boolean>;
}

type AnimationID = "moveChecker" | "rollDice";

export interface AnimationHandler {
  commit: (...args: any) => Promise<string>;
  dispose: (animationUniqueId: string) => Promise<unknown>;
}

export type AnimationService = Record<AnimationID, AnimationHandler>;

export interface AnimationMetadata {
  animationUniqueId: string;
  duration: number;
}

interface AnimationMetadataMap {
  moveChecker: AnimationMoveCheckerMetadata[];
  rollDice: AnimationRollDiceMetadata[];
}

export interface GameUIContextValue {
  animationService: AnimationService;
  animations: AnimationMetadataMap;
  uiState: UIState;
  updateUiState: (uiState: UIState) => void;
  handleMoveAnimation: (move: Move) => Promise<unknown>;
}

export interface SelectedCheckerMetadata {
  pipId: number | "hit-space";
}

export const GameUIContext = createContext({} as GameUIContextValue);

export const GameUIProvider: React.FC = ({ children }) => {
  const [uiState, updateUiState] = useState<UIState>({
    selectedChecker: undefined,
    pressedRoll: false,
    pressedUndo: false,
    pressedConfirm: false,
    isExecutingMove: false,
    isExecutingRoll: {
      W: false,
      B: false,
    },
  });

  // Move Checker
  const {
    animationHandler: moveCheckerHandler,
    animationsMetadata: moveCheckerAnimationsMetadata,
  } = useMoveCheckerAnimation();

  // Roll Dice
  const {
    animationHandler: rollDiceHandler,
    animationsMetadata: rollDiceAnimationsMetadata,
  } = useRollDiceAnimation();

  const animationService: AnimationService = {
    moveChecker: moveCheckerHandler,
    rollDice: rollDiceHandler,
  };

  const { handleMoveAnimation } = useHandleMoveAnimation({ animationService });

  return (
    <GameUIContext.Provider
      value={{
        uiState,
        updateUiState,
        handleMoveAnimation,
        animationService,
        animations: {
          moveChecker: moveCheckerAnimationsMetadata,
          rollDice: rollDiceAnimationsMetadata,
        },
      }}
    >
      {children}
    </GameUIContext.Provider>
  );
};

export const useGameUI = (): GameUIContextValue => {
  const context = useContext(GameUIContext);
  return context;
};
