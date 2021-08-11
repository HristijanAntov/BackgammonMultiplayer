import React, { useContext, createContext, ReactElement } from "react";
import { find, some, cond, constant } from "lodash";

import { useGameState } from "../game-state";
import { useGameUI } from "../game-ui";
import { useGameInference } from "../inference";

import { Consequence, PlayerType } from "../../types";

export interface StatsContextValue {
  inferLog: () => ReactElement | string;
}

export const StatsContext = createContext({} as StatsContextValue);

export const StatsProvider: React.FC = ({ children }) => {
  const { state, consequences } = useGameState();
  const { uiState } = useGameUI();
  const { areThereNonAvailableMoves, getUsernameByPlayer, hasWin, whoWon } =
    useGameInference();

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
      [
        hasWin,
        constant(
          <span style={{ color: "greenyellow" }}>
            Player <label style={{ color: "#ffd17a" }}>{whoWon()}</label> has
            won
          </span>
        ),
      ],
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
              {getUsernameByPlayer(consequence.payload.turn)} had bigger roll,
              he plays first
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
        constant(
          <span>
            <label style={{ color: "#ffd17a" }}>
              {getUsernameByPlayer(state.turn as PlayerType)}
            </label>
            's turn: Currently moving
          </span>
        ),
      ],
      [
        () => state.stateMachine === "PENDING_MOVE",
        constant(
          <span>
            <label style={{ color: "#ffd17a" }}>
              {getUsernameByPlayer(state.turn as PlayerType)}{" "}
            </label>
            's turn: Waiting to move
          </span>
        ),
      ],
      [
        () => uiState.isExecutingRoll["B"] || uiState.isExecutingRoll["W"],
        constant(
          <span>
            <label style={{ color: "#ffd17a" }}>
              {getUsernameByPlayer(state.turn as PlayerType)}{" "}
            </label>
            's turn: Currently rolling
          </span>
        ),
      ],

      [
        () => state.stateMachine === "PENDING_ROLL",
        constant(
          <span>
            <label style={{ color: "#ffd17a" }}>
              {getUsernameByPlayer(state.turn as PlayerType)}
            </label>{" "}
            's turn: Waiting to roll
          </span>
        ),
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
