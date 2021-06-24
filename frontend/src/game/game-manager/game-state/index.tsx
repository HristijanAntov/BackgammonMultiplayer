import React, { useContext, useState, createContext } from "react";
import { GameState, Consequence } from "../../types";
import { INITIAL_STATE } from "../../components/constants";

export interface GameStateContextValue {
  state: GameState;
  consequences: Consequence[];
  updateGameState: (state: GameState) => void;
  updateConsequences: (consequences: Consequence[]) => void;
}

export const GameStateContext = createContext({} as GameStateContextValue);

export const GameStateProvider: React.FC = ({ children }) => {
  const [state, updateGameState] =
    useState<GameState | undefined>(INITIAL_STATE);

  const [consequences, updateConsequences] = useState<Consequence[]>([]);

  return (
    <GameStateContext.Provider
      value={{
        state: state as GameState,
        consequences,
        updateGameState,
        updateConsequences,
      }}
    >
      {children}
    </GameStateContext.Provider>
  );
};

export const useGameState = (): GameStateContextValue => {
  const context = useContext(GameStateContext);
  return context;
};
