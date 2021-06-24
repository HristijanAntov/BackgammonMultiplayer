import React, { ReactComponentElement, FC } from "react";
import LobbyPage from "./lobby";
import PlaygroundPage from "./playground";

interface RouteConfig {
  id: string;
  path: string;
  component: FC;
  isExact: boolean;
}

const routes: RouteConfig[] = [
  {
    id: "lobby",
    path: "/",
    component: LobbyPage,
    isExact: true,
  },
  {
    id: "lobby",
    path: "/game/create",
    component: LobbyPage,
    isExact: true,
  },
  {
    id: "lobby",
    path: "/game/join",
    component: LobbyPage,
    isExact: true,
  },
  {
    id: "lobby",
    path: "/about",
    component: LobbyPage,
    isExact: true,
  },
  {
    id: "playground",
    path: "/game/:id",
    component: PlaygroundPage,
    isExact: true,
  },
];

export default routes;
