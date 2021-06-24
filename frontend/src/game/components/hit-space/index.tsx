import React from "react";
import times from "lodash/times";

//types
import { GameState, PlayerType } from "../../types";

//hooks
import { useGameState } from "../../game-manager/game-state";
import { useNetworkManager } from "../../game-manager/network-manager";
import { useGameInference } from "../../game-manager/inference";

//utils
import { hitSpaceRefs } from "../../dom-refs";

//styles
import { HitContainer, PositionHandle } from "./styles";

//components
import Checker from "../checker";

const MAX_CHECKERS_SHOWN = 3;

interface Props {
  player: PlayerType;
}

const PipComponent: React.FC<Props> = ({ player }) => {
  const { state } = useGameState();
  const { emitterService } = useNetworkManager();
  const { getHasPipMove } = useGameInference();

  const { hitSpace } = state;

  const currentCount = hitSpace[player];
  const checkersIterator = times(currentCount).slice(0, MAX_CHECKERS_SHOWN);

  const countIndicator =
    currentCount > MAX_CHECKERS_SHOWN
      ? currentCount - MAX_CHECKERS_SHOWN + 1
      : undefined;

  const hasMove = getHasPipMove("hit-space", player);

  const getCanBeSelected = (checkerNum: number) =>
    countIndicator
      ? checkerNum === MAX_CHECKERS_SHOWN - 1
      : checkerNum === checkersIterator.length - 1;

  return (
    <HitContainer ref={(ref) => (hitSpaceRefs[player] = ref)}>
      {checkersIterator.map((checkerNum) => (
        <Checker
          key={checkerNum}
          checkerNum={checkerNum}
          canBeSelected={getCanBeSelected(checkerNum)}
          hasMove={hasMove}
          pipNum="hit-space"
          player={player}
          countIndicator={
            checkerNum === MAX_CHECKERS_SHOWN - 1 ? countIndicator : undefined
          }
          isHitChecker={true}
        />
      ))}
      <PositionHandle className="position-handle" />
    </HitContainer>
  );
};

export default PipComponent;
