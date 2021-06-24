import React from "react";

import find from "lodash/find";

//types
import { PlayerType } from "../../types";

//hooks
import { useGameUI } from "../../game-manager/game-ui";

//utils
import faceConfigs from "./config";

//styles
import { Scene, Die, DieFace, Point } from "./styles";

//components
interface Props {
  dieNum?: number | undefined;
  nthDie: number;
  player: PlayerType;
}

const DieComponent: React.FC<Props> = ({ dieNum, player, nthDie }) => {
  const { animations } = useGameUI();

  const animationForThisDice = find(animations.rollDice, {
    nthDie,
    player,
  });

  const shouldAnimate = animationForThisDice !== undefined;
  const animationMetadata =
    !shouldAnimate || !animationForThisDice
      ? undefined
      : {
          duration: animationForThisDice.duration,
          dieFaceSequence: animationForThisDice.dieFaceSequence,
        };

  return (
    <Scene>
      <Die
        shouldAnimate={shouldAnimate}
        animationMetadata={animationMetadata}
        dieNum={dieNum}
      >
        {faceConfigs.map((faceConfig) => (
          <DieFace key={faceConfig.face} face={faceConfig.face}>
            {faceConfig.points.map((position) => (
              <Point key={position} position={position} />
            ))}
          </DieFace>
        ))}
      </Die>
    </Scene>
  );
};

export default DieComponent;
