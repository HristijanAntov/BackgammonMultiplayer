import React, { useEffect } from "react";

// hooks
import { useGameStats } from "../../game-manager/stats";
import { useNetworkManager } from "../../game-manager/network-manager";
import { useGameInference } from "../../game-manager/inference";

//components
import Checker from "../checker";
import Board from "../board";
import { Button } from "../lobby/ui/styles";

//styles
import {
  Playground,
  Stats,
  PlayerLane,
  LogLane,
  BoardContainer,
  PendingBanner,
  Toast,
  Spinner,
} from "./styles";

interface Props {}

const PlaygroundComponent: React.FC<Props> = () => {
  const { inferLog } = useGameStats();
  const { networkState, roomsService, emitterService } = useNetworkManager();
  const { canInviteForRematch, shouldShowRematchInvitation } =
    useGameInference();

  const { setIsSendRematchInvitationLoading } = roomsService;

  const shouldRenderBoard = networkState.status === "STARTED";

  const { hostUsername, guestUsername } = networkState;

  const onRematchInvite = () => {
    setIsSendRematchInvitationLoading(true);
    emitterService.sendRematchInvitation();
  };

  const onAcceptRematchInvitation = () => {
    emitterService.acceptRematchInvitation();
  };

  const onDeclineRematchInvitation = () => {
    emitterService.declineRematchInvitation();
  };

  useEffect(() => {
    if (networkState.roomName !== undefined) {
      document.title = `Game Room: ${networkState.roomName}`;
    }

    return () => {
      document.title = "Backgammon";
    };
  }, [networkState.roomName]);

  return (
    <Playground>
      {!shouldRenderBoard && (
        <PendingBanner>
          <span>Waiting for guest player to join </span>
          <Spinner></Spinner>
        </PendingBanner>
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
          {canInviteForRematch() && (
            <Button onClick={onRematchInvite}>Invite for Rematch</Button>
          )}
          {shouldShowRematchInvitation() && (
            <Toast>
              <h4>Kiko invited you to play again</h4>
              <div className="buttons">
                <Button onClick={onAcceptRematchInvitation}>Accept</Button>
                <Button onClick={onDeclineRematchInvitation}>Decline</Button>
              </div>
            </Toast>
          )}
        </>
      )}
    </Playground>
  );
};

export default PlaygroundComponent;
