import React, { useContext, createContext, ReactElement } from "react";
import {
  get,
  find,
  every,
  some,
  map,
  times,
  identity,
  cond,
  constant,
} from "lodash";

import { useNetworkManager } from "../network-manager";
import { NetworkRole } from "../network-manager/types";

import { useGameState } from "../game-state";
import { useGameUI } from "../game-ui";
import { useGameInference } from "../inference";

import { whoAmI, getPlayerTypeName } from "../../utils/backgammon";
import { getOpponent } from "../../utils";
import { Consequence, PlayerType } from "../../types";

type PredicateCheck = () => boolean;

export interface StatsContextValue {
  inferLog: () => ReactElement | string;
}

export const StatsContext = createContext({} as StatsContextValue);

export const StatsProvider: React.FC = ({ children }) => {
  const { networkState } = useNetworkManager();
  const { state, consequences } = useGameState();
  const { uiState } = useGameUI();
  const { isMyTurn, myPlayer, areThereNonAvailableMoves } = useGameInference();

  const hasSameDieRolledConsequence = () =>
    some(consequences, {
      type: "SAME_DIE_ROLLED",
    });

  const hasFinishedInitRollConsequence = () =>
    some(consequences, {
      type: "FINISHED_INIT_ROLL",
    });

  const inferLog = () =>
    cond<undefined, string | ReactElement>([
      [areThereNonAvailableMoves, constant("There are no moves available")],
      [
        hasSameDieRolledConsequence,
        constant("Same Die Rolled, please Roll Again"),
      ],
      [
        hasFinishedInitRollConsequence,
        () => {
          const consequence = find(consequences, {
            type: "FINISHED_INIT_ROLL",
          }) as Consequence;

          return (
            <span>
              {getPlayerTypeName(consequence.payload.turn)} had bigger roll, he
              plays first
            </span>
          );
        },
      ],
      [
        () => state.stateMachine === "PENDING_INIT_ROLL",
        constant("Waiting for init roll"),
      ],
      [
        () => uiState.isExecutingMove,
        constant(`${getPlayerTypeName(state.turn)}'s turn: Currently moving`),
      ],
      [
        () => state.stateMachine === "PENDING_MOVE",
        constant(`${getPlayerTypeName(state.turn)}'s turn: Waiting to move`),
      ],
      [
        () => uiState.isExecutingRoll["B"] || uiState.isExecutingRoll["W"],
        constant(`${getPlayerTypeName(state.turn)}'s turn: Currently rolling`),
      ],

      [
        () => state.stateMachine === "PENDING_ROLL",
        constant(`${getPlayerTypeName(state.turn)}'s turn: Waiting to roll`),
      ],
    ])(undefined);

  return (
    <StatsContext.Provider
      value={{
        inferLog,
      }}
    >
      {children}
    </StatsContext.Provider>
  );
};

export const useGameStats = (): StatsContextValue => {
  const context = useContext(StatsContext);
  return context;
};
