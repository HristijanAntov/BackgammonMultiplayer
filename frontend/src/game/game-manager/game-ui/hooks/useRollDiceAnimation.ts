import { useState } from "react";
import random from "lodash/random";
import times from "lodash/times";
import { PlayerType } from "../../../types";

import { wait, getUniqueId } from "../../../utils";

import { AnimationHandler, AnimationMetadata } from "../index";

export const ROLL_DICE_ANIMATION_DURATION = 1;

export interface AnimationRollDiceMetadata extends AnimationMetadata {
  dieFaceSequence: number[];
  player: PlayerType;
  nthDie: number;
}

interface Result {
  animationHandler: AnimationHandler;
  animationsMetadata: AnimationRollDiceMetadata[];
}

const useMoveChecker = (): Result => {
  const [animationsMetadata, setAnimationsMetadata] = useState<
    AnimationRollDiceMetadata[]
  >([]);

  let currentAnimations: AnimationRollDiceMetadata[] = [];

  const animationHandler = {
    commit: async (
      player: PlayerType,
      nthDie: number,
      die: number,
      shouldDispose = true
    ) => {
      const animationUniqueId = getUniqueId();

      // GENERATE RANDOM SEQUENCE
      const randomDieFaceSequence = [1]
        .concat(times(random(13, 17)).map(() => random(1, 6)))
        .concat(die);

      // We store metadata for the animation
      currentAnimations = [
        ...currentAnimations,
        {
          player,
          animationUniqueId,
          duration: ROLL_DICE_ANIMATION_DURATION,
          dieFaceSequence: randomDieFaceSequence,
          nthDie,
        },
      ];

      setAnimationsMetadata(currentAnimations);
      const element: any = document.querySelector("#play-dice-throw");
      element.click();

      // We wait for the configured duration period of the animation
      await wait(ROLL_DICE_ANIMATION_DURATION * 1000);

      // We dispose the animation metadata
      // Or we don't, then it's up to the consumer to dispose it whenever fits the usage
      if (shouldDispose) {
        currentAnimations = currentAnimations.filter(
          (it) => it.animationUniqueId !== animationUniqueId
        );
        setAnimationsMetadata(currentAnimations);
      }

      return animationUniqueId;
    },
    dispose: async (animationUniqueId: string) => {
      currentAnimations = currentAnimations.filter(
        (it) => it.animationUniqueId !== animationUniqueId
      );
      setAnimationsMetadata(currentAnimations);
    },
  };

  return {
    animationHandler,
    animationsMetadata,
  };
};

export default useMoveChecker;
