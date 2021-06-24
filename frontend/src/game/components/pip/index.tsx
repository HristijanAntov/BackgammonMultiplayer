import React from "react";
import times from "lodash/times";
import nth from "lodash/nth";
import find from "lodash/find";

//types
import {
  Pip,
  PlayerType,
  PositionTransitionEntry,
  PositionTransition,
} from "../../types";

//hooks
import { useGameState } from "../../game-manager/game-state";
import { useNetworkManager } from "../../game-manager/network-manager";
import { useGameUI } from "../../game-manager/game-ui";
import { useGameInference } from "../../game-manager/inference";

//utils
import { pipRefs } from "../../dom-refs";
import { isThereMoveOnPipPosition } from "../../utils/backgammon";

//styles
import { PipWrapper, Triangle, CheckerStack, PositionHandle } from "./styles";

//components
import Checker from "../checker";

const MAX_CHECKERS_SHOWN = 5;

interface Props {
  pipNumber: number;
  quadrantNum: number;
}

const PipComponent: React.FC<Props> = ({ pipNumber, quadrantNum }) => {
  const { state } = useGameState();
  const { emitterService } = useNetworkManager();
  const { getHasPipMove } = useGameInference();

  const { uiState, updateUiState } = useGameUI();
  const { selectedChecker, isExecutingMove } = uiState;
  const { positionTransitionsMap } = state || {};
  const currentPipState = nth(state?.pips, pipNumber) as Pip;

  const currentCount = currentPipState?.count || 0;

  const checkersIterator = currentPipState?.isEmpty
    ? []
    : times(currentCount).slice(0, MAX_CHECKERS_SHOWN);

  const countIndicator =
    currentCount > MAX_CHECKERS_SHOWN
      ? currentCount - MAX_CHECKERS_SHOWN + 1
      : undefined;

  const canBeHit = currentCount === 1;

  const hasMove = getHasPipMove(currentPipState.pipId, currentPipState.player);

  const getCanBeSelected = (checkerNum: number) =>
    countIndicator
      ? checkerNum === MAX_CHECKERS_SHOWN - 1
      : checkerNum === checkersIterator.length - 1;

  const positionTranslationsForSelectedChecker = find(positionTransitionsMap, {
    from: selectedChecker?.pipId,
  }) as PositionTransitionEntry;

  const shouldHighlightMovePosition = isThereMoveOnPipPosition(
    currentPipState.pipId,
    positionTranslationsForSelectedChecker
  );

  // actions
  const onSelectPosition = () => {
    const positionTranslation = {
      from: selectedChecker?.pipId,
      to: currentPipState.pipId,
    };

    updateUiState({
      ...uiState,
      selectedChecker: undefined,
      isExecutingMove: true,
    });

    emitterService.selectToMove(positionTranslation as PositionTransition);
  };

  return (
    <PipWrapper
      id={`PIP_ID_${pipNumber}`}
      key={pipNumber}
      onClick={() => {
        shouldHighlightMovePosition && onSelectPosition();
      }}
      ref={(ref) => (pipRefs[pipNumber] = ref)}
    >
      <Triangle
        shouldHighlight={shouldHighlightMovePosition}
        metadata={{
          even: pipNumber % 2 === 0,
          quadrantNum,
        }}
      />
      <CheckerStack quadrantNum={quadrantNum}>
        {checkersIterator.map((checkerNum) => (
          <Checker
            key={checkerNum}
            checkerNum={checkerNum}
            countIndicator={
              checkerNum === MAX_CHECKERS_SHOWN - 1 ? countIndicator : undefined
            }
            canBeSelected={getCanBeSelected(checkerNum)}
            canBeHit={canBeHit}
            hasMove={
              !isExecutingMove && hasMove && getCanBeSelected(checkerNum)
            }
            pipNum={pipNumber}
            player={currentPipState.player as PlayerType}
          />
        ))}
        {<PositionHandle className="position-handle" />}
      </CheckerStack>
    </PipWrapper>
  );
};

export default PipComponent;
