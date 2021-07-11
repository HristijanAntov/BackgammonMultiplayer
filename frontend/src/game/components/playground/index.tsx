import React from "react";

// hooks
import { useGameStats } from "../../game-manager/stats";

//components
import Board from "../board";

//styles
import { Playground, Stats, BoardContainer } from "./styles";

interface Props {}

const PlaygroundComponent: React.FC<Props> = () => {
  const { inferLog } = useGameStats();

  const shouldRenderBoard = true;

  return (
    <Playground>
      <Stats>{inferLog()}</Stats>
      {shouldRenderBoard && (
        <BoardContainer>
          <Board />
        </BoardContainer>
      )}
    </Playground>
  );
};

export default PlaygroundComponent;
