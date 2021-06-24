import { Move } from "../../../types";
import { getOpponent } from "../../../utils";

import { AnimationService } from "../index";

interface Result {
  handleMoveAnimation: (move: Move) => Promise<unknown>;
}

interface Params {
  animationService: AnimationService;
}

const useHandleMoveAnimation = (params: Params): Result => {
  const { animationService } = params;

  const handleMoveAnimation = async (move: Move) => {
    const { from, to, player, isHit } = move;

    if (isHit) {
      // This is because whenever we have a hit we have an atomic move
      // but the nature of the animations is not atomic cause it is represented as
      // 2 separate animations (hitter checker moves to position, then hit checker moves to hit-space)
      // therefore we basically execute  these animations in sequence
      // and then dispose the one started first.

      //TODO: sound
      (document.querySelector("#play-move") as HTMLButtonElement).click();

      const animationDisposeId = await animationService.moveChecker.commit(
        from,
        to,
        player,
        false
      );

      (document.querySelector("#play-hit") as HTMLButtonElement).click();

      await animationService.moveChecker.commit(
        to,
        "hit-space",
        getOpponent(player)
      );

      await animationService.moveChecker.dispose(animationDisposeId);
    } else {
      (document.querySelector("#play-move") as HTMLButtonElement).click();

      await animationService.moveChecker.commit(from, to, player);
      // stop();
    }

    return;
  };

  return {
    handleMoveAnimation,
  };
};

export default useHandleMoveAnimation;
