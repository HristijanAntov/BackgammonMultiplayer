import { useState } from "react";
import {
  ANIMATION_DURATION,
  DIMENSIONS_CONFIG,
} from "../../../components/constants";
import { pipRefs, hitSpaceRefs, bearOffRefs } from "../../../dom-refs";
import { PlayerType } from "../../../types";

import {
  wait,
  calculateTranslatingPosition,
  getOpponent,
  coalesce,
  getUniqueId,
} from "../../../utils";

import { isFacingNorth, getBearOffPosition } from "../../../utils/backgammon";

import { AnimationHandler, AnimationMetadata } from "../index";

const { BEAROFF_CHECKER_RATIO } = DIMENSIONS_CONFIG;

export interface AnimationMoveCheckerMetadata extends AnimationMetadata {
  left: number;
  top: number;
  pipNum: number | undefined;
  isHitSpaceMove: boolean;
  isBearOffMove: boolean;
  player: PlayerType;
}

interface Result {
  animationHandler: AnimationHandler;
  animationsMetadata: AnimationMoveCheckerMetadata[];
}

const useMoveChecker = (): Result => {
  const [animationsMetadata, setAnimationsMetadata] = useState<
    AnimationMoveCheckerMetadata[]
  >([]);

  let currentAnimations: AnimationMoveCheckerMetadata[] = [];

  const animationHandler = {
    commit: async (
      fromPosition: number | "hit-space",
      toPosition: number | "hit-space",
      player: PlayerType,
      shouldDispose = true
    ) => {
      const animationUniqueId = getUniqueId();
      const isHitSpaceMove = fromPosition === "hit-space";
      const isBearOffMove = toPosition === getBearOffPosition(player);

      const sourceParent =
        fromPosition === "hit-space"
          ? hitSpaceRefs[player]
          : pipRefs[fromPosition];

      const targetParent =
        toPosition === "hit-space"
          ? hitSpaceRefs[player]
          : isBearOffMove
          ? bearOffRefs[player]
          : pipRefs[toPosition];

      const sourcePip = sourceParent.querySelector(".checker.can-be-selected");

      const targetPip = coalesce([
        targetParent.querySelector(`.can-be-hit.${getOpponent(player)}`),
        targetParent.querySelector(".position-handle"),
      ]);

      const offset =
        isBearOffMove && !isFacingNorth(player)
          ? -BEAROFF_CHECKER_RATIO * 100
          : 0;
      const transformedPosition = calculateTranslatingPosition(
        sourcePip,
        targetPip,
        offset
      );

      if (transformedPosition === undefined) {
        return animationUniqueId;
      }

      // We store metadata for the animation
      currentAnimations = [
        ...currentAnimations,
        {
          animationUniqueId,
          left: transformedPosition.left,
          top: transformedPosition.top,
          duration: ANIMATION_DURATION,
          pipNum: isHitSpaceMove
            ? undefined
            : typeof fromPosition === "number"
            ? fromPosition
            : undefined,
          isHitSpaceMove,
          isBearOffMove,
          player,
        },
      ];
      setAnimationsMetadata(currentAnimations);

      // We wait for the configured duration period of the animation
      await wait(ANIMATION_DURATION * 1000);

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
