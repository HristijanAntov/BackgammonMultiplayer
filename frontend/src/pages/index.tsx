import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import routes from "./config";

import { GameStateProvider } from "../game/game-manager/game-state";
import { GameUIProvider } from "../game/game-manager/game-ui";
import { NetworkManagerProvider } from "../game/game-manager/network-manager";
import { InferenceProvider } from "../game/game-manager/inference";

const RouterWrapper: React.FC = () => {
  return (
    <BrowserRouter>
      <GameStateProvider>
        <GameUIProvider>
          <NetworkManagerProvider>
            <InferenceProvider>
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
            </InferenceProvider>
          </NetworkManagerProvider>
        </GameUIProvider>
      </GameStateProvider>
    </BrowserRouter>
  );
};

export default RouterWrapper;
