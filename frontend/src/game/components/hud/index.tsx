import React from "react";

//types
import { PlayerType } from "../../types";

//hooks
import { useGameUI } from "../../game-manager/game-ui";
import { useGameInference } from "../../game-manager/inference";
import { useNetworkManager } from "../../game-manager/network-manager";

//utils

//styles
import { HUD, ActionButtonsWrapper, RollButton } from "./styles";

//components
import DiceContainer from "../dice-container";

interface Props {
  player: PlayerType;
}

const HUDComponent: React.FC<Props> = ({ player }) => {
  const { uiState, updateUiState } = useGameUI();
  const { emitterService } = useNetworkManager();
  const {
    canInitRoll,
    canRoll,
    myPlayer,
    canConfirmMove,
    shouldShowDiceContainer,
  } = useGameInference();

  const onRoll = (isInit: boolean) => {
    updateUiState({
      ...uiState,
      pressedRoll: true,
    });

    if (isInit) {
      emitterService.pressInitRoll();
      return;
    }

    emitterService.pressRoll();
  };

  const onConfirm = () => {
    const el = document.querySelector(
      "#play-confirm-move"
    ) as HTMLButtonElement;
    el.click();

    emitterService.confirmMove();
  };

  return (
    <HUD>
      <ActionButtonsWrapper>
        {player === myPlayer && canRoll() && (
          <RollButton onClick={() => onRoll(false)}>Roll</RollButton>
        )}
        {player === myPlayer && canInitRoll() && (
          <RollButton disabled={!canInitRoll()} onClick={() => onRoll(true)}>
            Roll Initial
          </RollButton>
        )}

        {player === myPlayer && canConfirmMove() && (
          <RollButton onClick={() => onConfirm()}>Confirm Move</RollButton>
        )}
        {shouldShowDiceContainer(player) && <DiceContainer player={player} />}
      </ActionButtonsWrapper>
    </HUD>
  );
};

export default HUDComponent;
