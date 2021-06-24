import React, { useContext, useState, useEffect, createContext } from "react";
import { NetworkState, Room } from "./types";
import { useHistory } from "react-router-dom";
import useListeners from "./hooks/useListeners";
import useEmitters, { EmitterService } from "./hooks/useEmitters";
import useRooms, { RoomsService } from "./hooks/useRooms";

export interface NetworkManagerContextValue {
  networkState: NetworkState;
  roomsService: RoomsService;
  emitterService: EmitterService;
}

export const NetworkManagerContext = createContext(
  {} as NetworkManagerContextValue
);

export const NetworkManagerProvider: React.FC = ({ children }) => {
  const router = useHistory();
  const [networkState, updateNetworkState] = useState<NetworkState>({
    status: "NOT_STARTED",
    roomId: undefined,
    hostUsername: undefined,
    guestUsername: undefined,
    role: undefined,
  });

  const roomsService = useRooms({});

  useListeners({ networkState, updateNetworkState, roomsService });
  const emitterService = useEmitters({
    networkState,
    updateNetworkState,
    roomsService,
  });

  return (
    <NetworkManagerContext.Provider
      value={{
        networkState,
        roomsService,
        emitterService,
      }}
    >
      {children}
    </NetworkManagerContext.Provider>
  );
};

export const useNetworkManager = (): NetworkManagerContextValue => {
  const context = useContext(NetworkManagerContext);
  return context;
};
