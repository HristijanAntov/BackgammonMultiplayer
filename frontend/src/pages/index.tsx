import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import routes from "./config";

import { GameStateProvider } from "../game/game-manager/game-state";
import { GameUIProvider } from "../game/game-manager/game-ui";
import { NetworkManagerProvider } from "../game/game-manager/network-manager";
import { InferenceProvider } from "../game/game-manager/inference";
import { StatsProvider } from "../game/game-manager/stats";

const RouterWrapper: React.FC = () => {
  return (
    <BrowserRouter>
      <GameStateProvider>
        <GameUIProvider>
          <NetworkManagerProvider>
            <InferenceProvider>
              <StatsProvider>
                <Switch>
                  {routes.map((route) => (
                    <Route
                      key={route.id}
                      exact={route.isExact}
                      path={route.path}
                      component={route.component}
                    />
                  ))}
                </Switch>
              </StatsProvider>
            </InferenceProvider>
          </NetworkManagerProvider>
        </GameUIProvider>
      </GameStateProvider>
    </BrowserRouter>
  );
};

export default RouterWrapper;
