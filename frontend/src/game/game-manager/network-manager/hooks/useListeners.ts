import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import map from "lodash/map";

import IO from "../io";
import { Actions, JOIN_ROOM_ERRORS } from "../constants";
import { useGameState } from "../../game-state";
import { UIState, useGameUI } from "../../game-ui";
import { RoomsService } from "./useRooms";
import { Consequence, GameState, MoveTransactionEntry } from "../../../types";
import { NetworkState, ExecuteRollPayload, IError, ErrorType } from "../types";
import { wait } from "../../../utils";

interface Result {}

interface StatePayload {
  state: GameState;
  finalState: GameState;
}

interface Params {
  networkState: NetworkState;
  updateNetworkState: (networkState: NetworkState) => void;
  roomsService: RoomsService;
}

const useListeners = (params: Params): Result => {
  const {
    state,
    consequences,
    updateGameState: syncUpdateGameState,
    updateConsequences: syncUpdateConsequences,
  } = useGameState();

  const {
    uiState,
    updateUiState: syncUpdateUiState,
    handleMoveAnimation,
    animationService,
  } = useGameUI();

  const history = useHistory();

  const {
    networkState,
    updateNetworkState: syncUpdateNetworkState,
    roomsService,
  } = params;

  let currentNetworkState = { ...networkState };
  let currentGameState = { ...state };
  let currentConsequences = [...consequences];
  let currentUiState = { ...uiState };

  const updateGameState = (newState: GameState) => {
    currentGameState = { ...newState };
    syncUpdateGameState(currentGameState);
  };

  const updateConsequences = (consequences: Consequence[]) => {
    currentConsequences = [...consequences];
    syncUpdateConsequences(currentConsequences);
  };

  const updateNetworkState = (newState: NetworkState) => {
    currentNetworkState = { ...newState };
    syncUpdateNetworkState(currentNetworkState);
  };

  const updateUiState = (newState: UIState) => {
    currentUiState = { ...newState };
    syncUpdateUiState(currentUiState);
  };

  useEffect(() => {
    IO.on(Actions.ROOMS_FETCHED, (payload: any) => {
      wait(200).then(() => {
        roomsService.setRooms(payload.rooms);
        roomsService.setIsLoading(false);
      });
    });

    IO.on(Actions.ROOM_CREATED, (payload: any) => {
      const { roomId, roomName, role, hostUsername, status } = payload;
      console.log(Actions.ROOM_CREATED, payload);

      currentNetworkState = {
        ...currentNetworkState,
        status,
        roomId,
        roomName,
        role,
        hostUsername,
      };

      updateNetworkState(currentNetworkState);

      wait(500).then(() => {
        roomsService.initCreateForm();
        roomsService.setIsCreatingRoom(false);

        history.push(`/game/${roomId}`);
      });
    });

    IO.on(Actions.SYNC_NETWORK_STATUS, (payload: any) => {
      console.log(Actions.SYNC_NETWORK_STATUS, payload);

      const { roomId, role, hostUsername, guestUsername, status } = payload;

      currentNetworkState = {
        ...currentNetworkState,
        status,
        roomId,
        role,
        hostUsername,
        guestUsername,
      };

      updateNetworkState(currentNetworkState);
    });

    IO.on(Actions.ROOM_JOINED, (payload: any) => {
      console.log(Actions.ROOM_JOINED, payload);
      const { roomId, roomName, role, hostUsername, guestUsername, status } =
        payload;

      console.log(role, "joiuning");

      currentNetworkState = {
        ...currentNetworkState,
        roomId,
        roomName,
        role,
        hostUsername,
        guestUsername,
        status,
      };

      updateNetworkState(currentNetworkState);
      roomsService.setError(undefined);
      history.push(`/game/${roomId}`);
    });

    IO.on(Actions.GAME_STARTED, (payload: any) => {
      console.log(Actions.GAME_STARTED, payload);
      const { initState } = payload;

      updateGameState({
        ...initState,
      });

      roomsService.setIsSendRematchInvitationLoading(false);
      roomsService.setHasPendingRematchInvitation(false);

      currentNetworkState = {
        ...currentNetworkState,
        status: "STARTED",
      };
      updateNetworkState(currentNetworkState);
    });

    IO.on(Actions.SYNC_STATE, (payload: any) => {
      console.log(Actions.SYNC_STATE, payload);
      const { state, finalState } = payload;

      updateGameState({
        ...state,
      });

      if (finalState) {
        wait(1500).then(() => {
          updateGameState({
            ...finalState,
          });
        });
      }

      updateNetworkState({ ...currentNetworkState, status: "STARTED" });

      const pressedButtonsState = {
        pressedRoll: false,
        pressedUndo: false,
        pressedConfirm: false,
      };

      updateUiState({
        ...currentUiState,
        ...pressedButtonsState,
      });
    });

    IO.on(Actions.EXECUTE_ROLL, async (payload: ExecuteRollPayload) => {
      console.log(Actions.EXECUTE_ROLL, payload);

      const { diceRolledMetadata, consequences, state } = payload;

      const animationsToExecute = map(
        diceRolledMetadata,
        ({ player, nthDie, die }) =>
          animationService.rollDice.commit(player, nthDie, die)
      );

      const player = diceRolledMetadata[0].player;

      /* The pattern goes as follows:
           1. We first execute animations for given dice
           2. Then update the consequences if there are some
           3. Await consequences to be shown for some amount of time
           4. Invalidate them
           5. Update GameState
      */

      updateUiState({
        ...currentUiState,
        isExecutingRoll: {
          ...currentUiState.isExecutingRoll,
          [player]: true,
        },
      });

      await Promise.all(animationsToExecute);

      if (consequences.length > 0) {
        updateConsequences(consequences);
        await wait(1500);
        updateConsequences([]);
      }

      updateGameState(state);
      updateUiState({
        ...currentUiState,
        isExecutingRoll: {
          ...currentUiState.isExecutingRoll,
          [player]: false,
        },
      });
    });

    IO.on(Actions.INIT_ROLL, (payload: any) => {
      console.log(Actions.INIT_ROLL, payload);
      const { state } = payload;

      updateGameState({
        ...state,
      });

      currentNetworkState = { ...currentNetworkState, status: "STARTED" };
      updateNetworkState(currentNetworkState);
    });

    IO.on(Actions.EXECUTE_MOVE, async (payload: any) => {
      console.log(Actions.EXECUTE_MOVE, "EXECUTING", payload);

      const transactionEntries: MoveTransactionEntry[] =
        payload.transactionEntries;

      updateUiState({
        ...currentUiState,
        isExecutingMove: true,
      });

      for (let i = 0; i < transactionEntries.length; i++) {
        const move = transactionEntries[i].move;
        const updatedState = transactionEntries[i].state;

        await handleMoveAnimation(move);
        updateGameState(updatedState);
      }

      const { finalState } = payload;

      if (finalState !== undefined) {
        // The upper state update is mostly regarding positions and
        // here we get turn switch and things like that
        updateGameState(finalState);
      }

      updateUiState({
        ...currentUiState,
        isExecutingMove: false,
      });
    });

    IO.on(Actions.REMATCH_INVITATION_SENT, () => {
      roomsService.setHasPendingRematchInvitation(true);
    });

    IO.on(Actions.REMATCH_INVITATION_DECLINED, () => {
      roomsService.setIsSendRematchInvitationLoading(false);
      roomsService.setHasPendingRematchInvitation(false);
      history.push("/");
    });

    IO.on(Actions.ERROR_OCCURRED, async (error: IError) => {
      console.log(Actions.ERROR_OCCURRED, "ERROR", error);

      const { errorType } = error;

      if (JOIN_ROOM_ERRORS.includes(errorType)) {
        roomsService.setError(error);
        roomsService.setIsJoiningRoom(false);
      }
    });
  }, []);

  return {};
};

export default useListeners;
