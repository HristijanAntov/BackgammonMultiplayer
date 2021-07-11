import React from "react";
import { ReactComponent as $CheckIcon } from "./icons/check.svg";

//types
import { PlayerType } from "../../types";

//hooks
import { useGameUI } from "../../game-manager/game-ui";
import { useGameInference } from "../../game-manager/inference";
import { useNetworkManager } from "../../game-manager/network-manager";

//styles
import { BarActions, ControlItem, CheckIcon, UndoIcon } from "./styles";

//components

interface Props {}

const BarActionsComponent: React.FC<Props> = () => {
  const { uiState, updateUiState } = useGameUI();
  const { emitterService } = useNetworkManager();
  const { canConfirmMove, canUndo } = useGameInference();

  const onConfirm = () => {
    const el = document.querySelector(
      "#play-confirm-move"
    ) as HTMLButtonElement;
    el.click();

    updateUiState({ ...uiState, pressedConfirm: true });
    emitterService.confirmMove();
  };

  const onUndo = () => {
    const el = document.querySelector("#play-undo-move") as HTMLButtonElement;
    el.click();

    updateUiState({ ...uiState, pressedUndo: true });
    emitterService.undo();
  };

  const isUndoDisabled = !canUndo();
  const isConfirmDisabled = !canConfirmMove();

  return (
    <BarActions>
      <ControlItem
        title="Undo"
        isDisabled={isUndoDisabled}
        onClick={() => onUndo()}
      >
        <UndoIcon is_disabled={String(isUndoDisabled)} />
      </ControlItem>
      <ControlItem
        title="Confirm"
        isDisabled={isConfirmDisabled}
        onClick={() => onConfirm()}
      >
        <CheckIcon is_disabled={String(isConfirmDisabled)} />
      </ControlItem>
    </BarActions>
  );
};

export default BarActionsComponent;
