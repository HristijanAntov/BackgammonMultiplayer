import React from "react";
import find from "lodash/find";

//types
import { PlayerType } from "../../types";

//hooks
import { useGameState } from "../../game-manager/game-state";
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
  const { consequences } = useGameState();
  const {
    canInitRoll,
    canRoll,
    canUndo,
    myPlayer,
    canConfirmMove,
    areThereNonAvailableMoves,
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

  const sameRollConsequence = find(consequences, { type: "SAME_DIE_ROLLED" });
  const finishedInitRollConsequence = find(consequences, {
    type: "FINISHED_INIT_ROLL",
  });

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
      {/* <div className="buttons"> */}
      {/* <button disabled={!canInitRoll()} onClick={() => onRoll(true)}>
          Roll Initial
        </button> */}
      {/* <button disabled={!canRoll()} onClick={() => onRoll(false)}>
          Roll
        </button> */}
      {/* <button
          disabled={!canConfirmMove()}
          onClick={() => emitterService.confirmMove()}
        >
          Confirm Move
        </button> */}
      {/* {sameRollConsequence !== undefined && (
          <div style={{ color: "white" }}>Same Die Rolled, Roll Again</div>
        )}
        {finishedInitRollConsequence !== undefined && (
          <div style={{ color: "white" }}>
            {finishedInitRollConsequence.payload.turn} had bigger, he plays
            first
          </div>
        )}

        {areThereNonAvailableMoves(player) && (
          <div style={{ color: "white" }}>Non available Moves</div>
        )} */}
      {/* </div> */}
    </HUD>
  );
};

export default HUDComponent;
