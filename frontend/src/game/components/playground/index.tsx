import React, { useEffect } from "react";
import find from "lodash/find";
import { useParams } from "react-router-dom";
import { useGameState } from "../../game-manager/game-state";
import { useGameInference } from "../../game-manager/inference";
import { useNetworkManager } from "../../game-manager/network-manager";
import { Playground, Stats, BoardContainer } from "./styles";

//components
import Board from "../board";

interface Props {}

const PlaygroundComponent: React.FC<Props> = () => {
  const { emitterService, networkState } = useNetworkManager();
  const { state, consequences } = useGameState();
  const {
    canInitRoll,
    canRoll,
    canUndo,
    canConfirmMove,
    areThereNonAvailableMoves,
  } = useGameInference();

  const shouldRenderBoard = true;
  const sameRollConsequence = find(consequences, { type: "SAME_DIE_ROLLED" });
  const finishedInitRollConsequence = find(consequences, {
    type: "FINISHED_INIT_ROLL",
  });

  let messageLog = undefined;

  if (sameRollConsequence !== undefined) {
    messageLog = "Same Die Rolled, please Roll Again";
  }

  if (finishedInitRollConsequence !== undefined) {
    messageLog = `${finishedInitRollConsequence.payload.turn} had bigger roll, he plays first`;
  }

  if (areThereNonAvailableMoves()) {
    messageLog = "There are no moves available";
  }

  return (
    <Playground>
      <Stats>{messageLog}</Stats>
      {shouldRenderBoard && (
        <BoardContainer>
          <Board />
        </BoardContainer>
      )}
    </Playground>
  );
};

export default PlaygroundComponent;
