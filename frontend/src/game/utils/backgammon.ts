import some from "lodash/some";

import { PlayerType, PositionTransitionEntry } from "../types";

import { NetworkRole } from "../game-manager/network-manager/types";

export const isFacingNorth = (player: PlayerType) => player === "W";

export const getBearOffPosition = (player: PlayerType) =>
  isFacingNorth(player) ? -1 : 24;

export const whoAmI = (role: NetworkRole): PlayerType =>
  role === "HOST" ? "W" : "B";

export const isThereMoveOnPipPosition = (
  pipPosition: number,
  positionTranslations: PositionTransitionEntry | undefined
) => {
  if (positionTranslations === undefined) {
    return false;
  }

  const isThereMove = some(positionTranslations.to, (n) => n === pipPosition);

  return isThereMove;
};
