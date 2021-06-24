import React from "react";

//types
import { PlayerType } from "../../types";

//hooks
import { useGameInference } from "../../game-manager/inference";

//styles
import { DiceContainer } from "./styles";

//components
import Die from "../die";

interface Props {
  player: PlayerType;
}

const DiceContainerComponent: React.FC<Props> = ({ player }) => {
  const { getDiceMetadata } = useGameInference();

  const diceToShow = getDiceMetadata(player);

  return (
    <DiceContainer>
      {diceToShow.map(({ dieNum, nthDie }) => (
        <Die key={nthDie} player={player} dieNum={dieNum} nthDie={nthDie} />
      ))}
    </DiceContainer>
  );
};

export default DiceContainerComponent;
