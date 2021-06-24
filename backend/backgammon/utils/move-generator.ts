import map from "lodash/map";
import filter from "lodash/filter";
import maxBy from "lodash/maxBy";
import max from "lodash/max";
import uniq from "lodash/uniq";
import uniqBy from "lodash/uniqBy";
import times from "lodash/times";
import last from "lodash/last";
import flatMap from "lodash/flatMap";

// types
import {
  GameState,
  Pip,
  Move,
  PlayerType,
  PositionTransitionEntry,
  MoveNode,
  PositionFromHitSpace,
  PositionTransition,
} from "../types";

// utils
import { getOpponent } from "./index";
import { getLeap, getNextState } from "./move-maker";
import { getBearOffPosition, canBearOffWithThisMove } from "./bearoff";

export const getPositionId = (
  positionEntry: Pip | "hit-space"
): number | "hit-space" =>
  positionEntry === "hit-space" ? "hit-space" : positionEntry.pipId;

/*
  We calculate the max depth of the POSSIBLE MoveNodes[],
  This is needed so we can infer if the POSSIBLE MovesNode is actually VALID too
*/

export const getMaxMoveNodesDepth = (movesNodes: MoveNode[]): number => {
  if (movesNodes.length === 0) {
    return 0;
  }

  const maxDepth = max(
    map(movesNodes, (node) =>
      node.children.length !== 0 ? 1 + getMaxMoveNodesDepth(node.children) : 1
    )
  );

  return maxDepth || 0;
};

export const getPositionTransitionsFromMoveNodesPerPip = (
  from: "hit-space" | number,
  moveNodes: MoveNode[]
) => {
  const currentMoveNodes = filter(moveNodes, (node) => node.data.from === from);

  const transitions = [];

  for (const { data: move, children } of currentMoveNodes) {
    const currentTransition = {
      from: move.from,
      to: move.to,
    };

    const followingTransitions: any = getPositionTransitionsFromMoveNodesPerPip(
      move.to,
      children
    );

    transitions.push(...[currentTransition, ...followingTransitions]);
  }

  return transitions;
};

export const getPositionTransitionsFromMoveNodes = (
  moveNodes: MoveNode[],
  player: PlayerType
) => {
  const currentMoveNodes = uniqBy(
    filter(moveNodes, (node) => node.data.player === player),
    (node) => node.data.from
  );

  const positionTransitionsMap: PositionTransitionEntry[] = [];

  for (let { data: move } of currentMoveNodes) {
    const positionTransitions: any = getPositionTransitionsFromMoveNodesPerPip(
      move.from,
      moveNodes
    );

    const positionTransitionEntry: PositionTransitionEntry = {
      from: move.from,
      to: uniq(map(positionTransitions, "to")),
    };

    positionTransitionsMap.push(positionTransitionEntry);
  }

  return positionTransitionsMap;
};

/*
  Maybe one of the most important move generator util.
  This will generate all the possible sequences of moves of how one 'ply' 
  can end up being given a set of dice rolled.

  By POSSIBLE Move it is considered any atomic move that
  makes sense by the trivial rules for this backgammon variation.

  Not all POSSIBLE Moves will end up being VALID too, because there are specific conditions how
  a 'ply' shall be played. For all the rules read more here: https://www.bkgm.com/rules.html
*/

export const getPossibleMoveNodes = (
  state: GameState,
  player: PlayerType
): MoveNode[] => {
  const { pips, hitSpace, diceRolled: dice } = state;
  const opponent = getOpponent(player);
  const currentPlayersPips = filter(pips, { player });
  const moveNodes: MoveNode[] = [];
  const diceRolled = uniq(dice); // It is uniq cause for doubles we don't want to yield duplicate combinations;

  const hasHitSpaceChecker = hitSpace[player] > 0;

  const playerPositionsIterator: Pip[] | number[] = hasHitSpaceChecker
    ? times(hitSpace[player])
    : currentPlayersPips;

  for (let i = 0; i < playerPositionsIterator.length; i++) {
    const fromPosition = (
      hasHitSpaceChecker ? "hit-space" : playerPositionsIterator[i]
    ) as Pip | PositionFromHitSpace;

    const leaps = diceRolled.map((die) => ({
      leap: getLeap(getPositionId(fromPosition), die, player),
      die,
    }));

    for (let { leap, die } of leaps) {
      const toPip = pips[leap];

      const canLeap =
        toPip !== undefined && (toPip.player !== opponent || toPip.count === 1);

      const isBearOff = leap === getBearOffPosition(player);

      const shouldBearOffWithMove =
        isBearOff &&
        canBearOffWithThisMove(state, {
          from: getPositionId(fromPosition),
          to: leap,
          isHit: false,
          player,
          die,
        });

      const isValid = canLeap || shouldBearOffWithMove;

      if (isValid) {
        const move: Move = {
          from: getPositionId(fromPosition),
          to: shouldBearOffWithMove ? getBearOffPosition(player) : toPip.pipId,
          player,
          isHit: !shouldBearOffWithMove && toPip.player === opponent,
          die,
        };

        const nextState = { ...getNextState(state, move) };

        const node: MoveNode = {
          data: move,
          children: [],
        };

        const validChildrenMoveNodes = getPossibleMoveNodes(nextState, player);

        node.children = [...validChildrenMoveNodes];
        moveNodes.push(node);
      }
    }
  }

  return moveNodes;
};

/*
  This util eventually yields a list of TreeNodes that will consist of
  all the VALID and only VALID sequences of moves of how one 'ply' can
  end up being, given a set of dice rolled.

  It basically scans a list of POSSIBLE MoveNodes and leaves out those 
  that do not fit into the official Backgammon restrictions of 
  how a 'ply' shall be played
*/

export const getValidMoveNodes = (movesNodes: MoveNode[]): MoveNode[] => {
  const maxDepth = getMaxMoveNodesDepth(movesNodes);
  const validMoveNodes: MoveNode[] = [];

  for (let possibleMoveNode of movesNodes) {
    const childrenMaxDepth = getMaxMoveNodesDepth(possibleMoveNode.children);

    if (childrenMaxDepth + 1 === maxDepth) {
      validMoveNodes.push(possibleMoveNode);
    }
  }

  if (maxDepth === 1) {
    const maxDie = maxBy(validMoveNodes, (node) => node.data.die)?.data.die;
    if (maxDie !== undefined) {
      const biggerDieMoveNodes = filter(
        validMoveNodes,
        (node) => node.data.die === maxDie
      );
      return biggerDieMoveNodes;
    }
  }

  return validMoveNodes;
};

export const generateAllMoveSequencesFromPositionTransition = (
  moveNodes: MoveNode[],
  positionTransition: PositionTransition
): Move[][] => {
  const currentNodes = filter(
    moveNodes,
    (mn) => mn.data.from === positionTransition.from
  );

  if (currentNodes.length === 0) {
    return [];
  }

  const movesSequences: Move[][] = map(currentNodes, (node) => [node.data]);

  for (let i = 0; i < currentNodes.length; i++) {
    const moveSequence = movesSequences[i];
    const lastMoveInSequence = last(moveSequence) as Move;

    if (lastMoveInSequence.to === positionTransition.to) {
      continue;
    }

    const nextPositionTransition: PositionTransition = {
      from: lastMoveInSequence.to,
      to: positionTransition.to,
    };

    const childrenNodes = currentNodes[i].children;

    for (let childNode of childrenNodes) {
      const { data: childMove } = childNode;

      if (childMove.from === nextPositionTransition.from) {
        const followingMoveSequence = flatMap(
          generateAllMoveSequencesFromPositionTransition(
            [childNode],
            nextPositionTransition
          )
        );

        moveSequence.push(...followingMoveSequence);
      }
    }
  }

  return movesSequences;
};
