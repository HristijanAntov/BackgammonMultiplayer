import React from "react";
import { Checker, CheckerInner } from "./styles";

import { useGameUI, SelectedCheckerMetadata } from "../../game-manager/game-ui";
import { PlayerType } from "../../types";
import { getConditionalClassnames } from "../../utils";

interface Props {
  player: PlayerType;
  pipNum?: number | "hit-space";
  checkerNum: number;
  isHitChecker?: boolean;
  isBearOffChecker?: boolean;
  canBeHit?: boolean;
  canBeSelected: boolean;
  hasMove: boolean;
  countIndicator: number | undefined;
}

const CheckerComponent: React.FC<Props> = ({
  player,
  pipNum,
  checkerNum,
  canBeSelected,
  isHitChecker = false,
  countIndicator,
  canBeHit = false,
  hasMove = false,
  isBearOffChecker = false,
}) => {
  const { uiState, updateUiState, animations } = useGameUI();
  const { moveChecker: moveCheckerAnimations } = animations;
  const { selectedChecker } = uiState;
  const classNames = getConditionalClassnames([
    { when: true, value: "checker" },
    { when: player !== undefined, value: player },
    { when: canBeSelected, value: "can-be-selected" },
    { when: canBeHit, value: "can-be-hit" },
  ]);

  const moveCheckerAnimation = moveCheckerAnimations.find(
    (animation) =>
      (animation.pipNum !== undefined && animation.pipNum === pipNum) ||
      (animation.isHitSpaceMove && isHitChecker && animation.player === player)
  );

  const shouldAnimate = moveCheckerAnimation !== undefined && canBeSelected;

  const onSelect = (e: any) => {
    if (hasMove) {
      e.stopPropagation();

      const { selectedChecker } = uiState;
      const nextSelectedChecker: SelectedCheckerMetadata | undefined =
        selectedChecker?.pipId === pipNum
          ? undefined
          : {
              ...selectedChecker,
              pipId: pipNum === undefined ? "hit-space" : pipNum,
            };

      const el = document.querySelector(
        "#play-select-checker"
      ) as HTMLButtonElement;

      el.click();
      updateUiState({ ...uiState, selectedChecker: nextSelectedChecker });
    }
  };

  const shouldTransformToBearOffChecker =
    isBearOffChecker ||
    (shouldAnimate && Boolean(moveCheckerAnimation?.isBearOffMove));

  const shouldShowInner = !shouldTransformToBearOffChecker;

  const isSelected = canBeSelected && selectedChecker?.pipId === pipNum;

  return (
    <Checker
      className={classNames}
      onMouseDown={hasMove ? onSelect : undefined}
      player={player}
      checkerNum={checkerNum}
      shouldAnimate={shouldAnimate}
      animationMetadata={moveCheckerAnimation}
      canBeSelected={canBeSelected}
      hasMove={hasMove && !shouldAnimate}
      isBearOffChecker={shouldTransformToBearOffChecker}
      isSelected={isSelected}
    >
      {shouldShowInner && (
        <CheckerInner player={player}>
          {!shouldAnimate && countIndicator}
        </CheckerInner>
      )}
    </Checker>
  );
};

export default CheckerComponent;
