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
  const { emitterService } = useNetworkManager();
  const { canConfirmMove } = useGameInference();

  const onConfirm = () => {
    const el = document.querySelector(
      "#play-confirm-move"
    ) as HTMLButtonElement;
    el.click();

    emitterService.confirmMove();
  };

  const onUndo = () => {
    console.log("UNDO ACTION: TODO");
  };

  const isUndoDisabled = true;
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
