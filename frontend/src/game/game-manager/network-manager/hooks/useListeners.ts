import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import map from "lodash/map";

import IO from "../io";
import { actions } from "../constants";
import { useGameState } from "../../game-state";
import { UIState, useGameUI } from "../../game-ui";
import { RoomsService } from "./useRooms";
import {
  Consequence,
  GameState,
  MoveTransactionEntry,
  PlayerType,
} from "../../../types";
import { NetworkState, ExecuteRollPayload } from "../types";
import { wait } from "../../../utils";

import { ROLL_DICE_ANIMATION_DURATION } from "../../../game-manager/game-ui/hooks/useRollDiceAnimation";

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
    IO.on(actions.ROOMS_FETCHED, (payload: any) => {
      wait(200).then(() => {
        roomsService.setRooms(payload.rooms);
        roomsService.setIsLoading(false);
      });
    });

    IO.on(actions.ROOM_CREATED, (payload: any) => {
      const { roomId, role, hostUsername, status } = payload;
      console.log(actions.ROOM_CREATED, payload);

      currentNetworkState = {
        ...currentNetworkState,
        status,
        roomId,
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

    IO.on(actions.ROOM_JOINED, (payload: any) => {
      console.log(actions.ROOM_JOINED, payload);
      const { roomId, role, hostUsername, status } = payload;
      console.log(role, "joiuning");
      currentNetworkState = {
        ...currentNetworkState,
        roomId,
        role,
        hostUsername,
        status,
      };
      updateNetworkState(currentNetworkState);
      history.push(`/game/${roomId}`);
      //TODO: handle
    });

    IO.on(actions.GAME_STARTED, (payload: any) => {
      console.log(actions.GAME_STARTED, payload);
      const { initState } = payload;

      updateGameState({
        ...initState,
      });

      currentNetworkState = {
        ...currentNetworkState,
        status: "STARTED",
      };
      updateNetworkState(currentNetworkState);
    });

    IO.on(actions.SYNC_STATE, (payload: any) => {
      console.log(actions.SYNC_STATE, payload);
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

      //TODO: handle
    });

    IO.on(actions.EXECUTE_ROLL, async (payload: ExecuteRollPayload) => {
      console.log(actions.EXECUTE_ROLL, payload);

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

    IO.on(actions.INIT_ROLL, (payload: any) => {
      console.log(actions.GAME_STARTED, payload);
      const { state } = payload;

      updateGameState({
        ...state,
      });

      currentNetworkState = { ...currentNetworkState, status: "STARTED" };
      updateNetworkState(currentNetworkState);
    });

    IO.on(actions.EXECUTE_MOVE, async (payload: any) => {
      console.log(actions.EXECUTE_MOVE, "EXECUTING", payload);

      const transactionEntries: MoveTransactionEntry[] =
        payload.transactionEntries;

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

    IO.on(actions.ERROR_OCCURRED, async (payload: any) => {
      console.log(actions.ERROR_OCCURRED, "ERROR", payload.error); //TODO
    });
  }, []);

  return {};
};

export default useListeners;