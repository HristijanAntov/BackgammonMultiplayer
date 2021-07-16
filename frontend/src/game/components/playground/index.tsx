import React from "react";

// hooks
import { useGameStats } from "../../game-manager/stats";
import { useNetworkManager } from "../../game-manager/network-manager";
import Checker from "../checker";

//components
import Board from "../board";

//styles
import {
  Playground,
  Stats,
  PlayerLane,
  LogLane,
  BoardContainer,
  PendingBanner,
} from "./styles";

interface Props {}

const PlaygroundComponent: React.FC<Props> = () => {
  const { inferLog } = useGameStats();
  const { networkState } = useNetworkManager();

  const shouldRenderBoard = networkState.status === "STARTED";

  const { hostUsername, guestUsername } = networkState;

  return (
    <Playground>
      {!shouldRenderBoard && (
        <PendingBanner>Waiting for guest player to join</PendingBanner>
      )}
      {shouldRenderBoard && (
        <>
          <Stats>
            <PlayerLane style={{ borderRight: "1px solid #7e512f" }}>
              <Checker
                canBeSelected={false}
                checkerNum={0}
                player="W"
                hasMove={false}
                canBeHit={false}
                countIndicator={undefined}
              />
              <label>{hostUsername}</label>
            </PlayerLane>
            <LogLane>{inferLog()}</LogLane>
            <PlayerLane style={{ borderLeft: "1px solid #7e512f" }}>
              <Checker
                canBeSelected={false}
                checkerNum={0}
                player="B"
                hasMove={false}
                canBeHit={false}
                countIndicator={undefined}
              />
              <label>{guestUsername}</label>
            </PlayerLane>
          </Stats>

          <BoardContainer>
            <Board />
          </BoardContainer>
        </>
      )}
    </Playground>
  );
};

export default PlaygroundComponent;
