import map from "lodash/map";
import findIndex from "lodash/findIndex";
import filter from "lodash/filter";
import clamp from "lodash/clamp";
import maxBy from "lodash/maxBy";
import last from "lodash/last";
import get from "lodash/get";
import find from "lodash/find";

// types
import {
  GameState,
  Pip,
  Move,
  PlayerType,
  PipMovesSequence,
  MoveNode,
} from "../types";

// utils
import { isEqualMove, getOpponent, isFacingNorth } from "./index";
import { isBearOffMove } from "./bearoff";

export const getHitCountInMoveSequence = (moves: Move[]) =>
  moves.reduce((hitCount, move) => (move.isHit ? hitCount + 1 : hitCount), 0);

export const getDiceCountInMoveSequence = (moves: Move[]) => moves.length;

export const getLeap = (
  from: number | "hit-space",
  die: number,
  player: PlayerType,
  shouldClamp = true, // We don't clamp when making a decision for bearing off
  shouldReverse = false
) => {
  const fromQuantity =
    from === "hit-space" ? (isFacingNorth(player) ? 24 : -1) : from;

  const clamps = {
    northFacing: shouldClamp ? -1 : -Infinity,
    southFacing: shouldClamp ? 24 : Infinity,
  };

  // In this context -1, 24 are the hitSpace positions for the players accordingly
  const leap = isFacingNorth(player)
    ? clamp(fromQuantity - die, clamps.northFacing, Infinity)
    : clamp(fromQuantity + die, -Infinity, clamps.southFacing);

  return leap;
};

/* When there are more then one MoveSequence for a given PositionTransition
we want to pick the "best" move for the player.

  For now these 2 metrics are taken into account:
    1. How much hits there are for the specific sequence (THE MORE THE MERRIER)
    2. How much moves in total the sequence consists of (LESS IS MORE) :)
*/

export const pickMoveFromSequence = (
  toPip: number,
  movesSequence: PipMovesSequence
) => {
  const { moves } = movesSequence;

  const movesToPosition = filter(
    moves,
    (moveSequence) => get(last(moveSequence), "to") === toPip
  );

  const bestMoveSequence = maxBy(
    movesToPosition,
    (moveSeq) =>
      getHitCountInMoveSequence(moveSeq) +
      getDiceCountInMoveSequence(moveSeq) * -1
  );

  return bestMoveSequence;
};

const transformPip = (pip: Pip, move: Move): Pip => {
  const { from, to, player, isHit } = move;

  if (![from, to].includes(pip.pipId)) {
    return pip;
  }

  const [isSource, isTarget] = [pip.pipId === from, pip.pipId === to];

  if (isSource) {
    const newPip = { ...pip };
    newPip.count = clamp(newPip.count - 1, 0, Infinity);
    newPip.player = newPip.count > 0 ? player : undefined;
    newPip.isEmpty = newPip.count === 0;
    return newPip;
  }

  if (isTarget) {
    const newPip = { ...pip };
    newPip.count = isHit ? 1 : newPip.count + 1;
    newPip.player = player;
    newPip.isEmpty = false;
    return newPip;
  }

  return pip;
};

export const getNextState = (state: GameState, move: Move): GameState => {
  const { hitSpace, bearOff, pips, diceRolled } = state;
  const { from, isHit, player, die } = move;

  const isFromHitSpaceMove = from === "hit-space";
  const isBearOff = isBearOffMove(move);

  const updatedPips = map(pips, (pip) => transformPip(pip, move));

  const updatedHitSpace = { ...hitSpace };
  const updatedBearOff = { ...bearOff };

  if (isHit) {
    const opponent = getOpponent(player);
    const currentHitCount = updatedHitSpace[opponent];
    updatedHitSpace[opponent] = currentHitCount + 1;
  }

  if (isFromHitSpaceMove) {
    const currentHitCount = updatedHitSpace[player];
    updatedHitSpace[player] = clamp(currentHitCount - 1, 0, Infinity);
  }

  if (isBearOff) {
    const currentBearOffCount = updatedBearOff[player];
    // theoretically upper bound  for this backgammon variation is 15 but
    // let's not hardcode that here and instead just generalise with +Infinity
    updatedBearOff[player] = clamp(currentBearOffCount + 1, Infinity);
  }

  const dieIndex = findIndex(diceRolled, (d) => d === die);

  return {
    ...state,
    diceRolled: filter(diceRolled, (_, i) => i !== dieIndex),
    hitSpace: updatedHitSpace,
    bearOff: updatedBearOff,
    pips: updatedPips,
  };
};

export const getNextMoveNodesAfterMove = (
  moveNodes: MoveNode[],
  move: Move
): MoveNode[] => {
  const childrenNodes = find(moveNodes, (mn) => isEqualMove(mn.data, move));

  return childrenNodes ? childrenNodes.children : [];
};
