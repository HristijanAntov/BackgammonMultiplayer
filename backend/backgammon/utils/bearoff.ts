import map from "lodash/map";
import filter from "lodash/filter";
import some from "lodash/some";
import every from "lodash/every";
import times from "lodash/times";
import find from "lodash/find";

import { GameState, Move, PlayerType } from "../types";

// utils
import { isFacingNorth } from "./index";
import { getLeap } from "./move-maker";

export const isBearOffMove = (move: Move) =>
  move.to === getBearOffPosition(move.player);

export const getLeastBearOffPosition = (player: PlayerType) =>
  isFacingNorth(player) ? 5 : 18;

export const getBearOffPositions = (player: PlayerType) =>
  map(times(6), (n) =>
    isFacingNorth(player)
      ? getLeastBearOffPosition(player) - n
      : getLeastBearOffPosition(player) + n
  );

export const canBearOff = (state: GameState, player: PlayerType): boolean => {
  const { hitSpace, pips } = state;

  const hasHitSpaceChecker = hitSpace[player] > 0;

  if (hasHitSpaceChecker) {
    return false;
  }

  const currentPlayersPips = filter(pips, { player });

  const areAllCheckersOnLastQuadrant = every(currentPlayersPips, (pip) =>
    isPipInBearOffPosition(player, pip.pipId)
  );

  return areAllCheckersOnLastQuadrant;
};

export const getBearOffOrder = (state: GameState, player: PlayerType) => {
  const positions = getBearOffPositions(player);
  const { pips } = state;
  const currentPlayersPips = filter(pips, { player });

  const order = find(positions, (n) =>
    some(currentPlayersPips, {
      pipId: n,
    })
  );

  if (order === undefined) {
    return positions[0];
  }

  return order;
};

// THIS MEANS THAT
// FROM THE GIVEN PIP
// MOVES WITH GREATER DIE ROLL CAN
// ENTER THE BEAROFF
export const isPipAtBearOffOrder = (pipId: number, order: number) =>
  pipId === order;

export const getBearOffPosition = (player: PlayerType) =>
  isFacingNorth(player) ? -1 : 24;

export const isPipInBearOffPosition = (player: PlayerType, pipId: number) => {
  const leastBearOffPosition = getLeastBearOffPosition(player);
  const isIt = isFacingNorth(player)
    ? pipId <= leastBearOffPosition
    : pipId >= leastBearOffPosition;

  return isIt;
};

export const canBearOffWithThisMove = (state: GameState, move: Move) => {
  const { from, die, player } = move;

  const [isBearOff, isFromHitSpace, canPlayerBearOff] = [
    isBearOffMove(move),
    from === "hit-space",
    canBearOff(state, player),
  ];

  if (!isBearOff || isFromHitSpace || !canPlayerBearOff) {
    return false;
  }

  if (from === "hit-space") {
    // this will never happen, just the best workaround for typescript
    // not being smart enough to not being able to infer that: from === 'hit-space' will fail
    // to go to here therefore 'from' will always be a number
    // I can cast it, but let's just do it defensively this time.
    return false;
  }

  const bearOffOrder = getBearOffOrder(state, player);

  const isPipAtOrder = isPipAtBearOffOrder(from, bearOffOrder);
  const unclampedLeap = getLeap(from, die, player, false);

  // In order to be able to bear off:
  //  1. Either current Pip is at order position OR
  //  2. Current Pip tries to bear off with exact die face to bearoff position
  const check = isPipAtOrder || unclampedLeap === getBearOffPosition(player);

  return check;
};
