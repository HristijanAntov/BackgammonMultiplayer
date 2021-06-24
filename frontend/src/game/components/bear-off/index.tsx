import React from "react";
import times from "lodash/times";
import find from "lodash/find";

import { isThereMoveOnPipPosition } from "../../utils/backgammon";

//types
import {
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
import { bearOffRefs } from "../../dom-refs";

//styles
import { BearOffContainer, PositionHandle, Inner } from "./styles";

//components
import Checker from "../checker";

const MAX_CHECKERS_SHOWN = 3;

interface Props {
  player: PlayerType;
}

const BearOffComponent: React.FC<Props> = ({ player }) => {
  const { state } = useGameState();
  const { emitterService } = useNetworkManager();
  const {} = useGameInference();
  const { uiState, updateUiState } = useGameUI();
  const { bearOff } = state;

  const currentCount = bearOff[player];
  const checkersIterator = times(currentCount);

  const pipNum = player === "W" ? -1 : 24; //TODO: get this from somewhere else
  const checkersDirection = player === "W" ? "S" : "N"; //TODO: get this from somewhere else
  const { selectedChecker } = uiState;
  const { positionTransitionsMap } = state || {};

  const positionTranslationsForSelectedChecker = find(positionTransitionsMap, {
    from: selectedChecker?.pipId,
  }) as PositionTransitionEntry;

  const shouldHighlightMovePosition = isThereMoveOnPipPosition(
    pipNum,
    positionTranslationsForSelectedChecker
  );

  const onSelectPosition = () => {
    const positionTranslation = {
      from: selectedChecker?.pipId,
      to: pipNum,
    };

    updateUiState({
      ...uiState,
      selectedChecker: undefined,
    });

    emitterService.selectToMove(positionTranslation as PositionTransition);
  };

  return (
    <BearOffContainer ref={(ref) => (bearOffRefs[player] = ref)}>
      <Inner
        direction={checkersDirection}
        shouldHighlight={shouldHighlightMovePosition}
        onClick={() => shouldHighlightMovePosition && onSelectPosition()}
      >
        {checkersIterator.map((checkerNum) => (
          <Checker
            key={checkerNum}
            checkerNum={checkerNum}
            canBeSelected={false}
            hasMove={false}
            pipNum={pipNum}
            player={player}
            countIndicator={undefined}
            isBearOffChecker={true}
          />
        ))}
        <PositionHandle className="position-handle" />
      </Inner>
    </BearOffContainer>
  );
};

export default BearOffComponent;
