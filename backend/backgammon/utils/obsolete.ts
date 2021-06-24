import map from "lodash/map";
import flatMap from "lodash/flatMap";
import filter from "lodash/filter";
import some from "lodash/some";
import get from "lodash/get";
import uniq from "lodash/uniq";
import last from "lodash/last";
import uniqWith from "lodash/uniqWith";
import isEqual from "lodash/isEqual";
import { powerSet } from "../../utils";

import {
  GameState,
  Pip,
  Move,
  PlayerType,
  PipMovesSequence,
  PositionTransitionEntry,
} from "../types";

import { getLeap, getNextState } from "./move-maker";
import { getBearOffPosition, canBearOffWithThisMove } from "./bearoff";

import { getOpponent } from "./index";

const isThereMoveOnPipPosition = (
  pipPosition: number,
  movesSequence: PipMovesSequence | undefined
) => {
  if (movesSequence === undefined) {
    return false;
  }

  const { moves } = movesSequence;
  const isThereMove = some(
    moves,
    (moveSequence) => get(last(moveSequence), "to") === pipPosition
  );

  return isThereMove;
};

export const getValidMovesPerPip = (
  pip: Pip | "hit-space",
  state: GameState,
  player: PlayerType
): Move[][] => {
  const { pips, diceRolled } = state;

  if (diceRolled.length === 0) {
    return [];
  }

  const opponent = getOpponent(player);

  const diceCombinations = uniqWith(
    filter(
      [...powerSet(diceRolled), ...powerSet([...diceRolled].reverse())],
      (it) => it.length !== 0
    ),
    isEqual
  );

  const getPipId = (positionEntry: Pip | "hit-space"): number | "hit-space" =>
    positionEntry === "hit-space" ? "hit-space" : positionEntry.pipId;

  const moveSequenceMetadatas = diceCombinations.map((diceSequence) => {
    const moveMetadata = diceSequence.reduce(
      (meta: any, die: any, dieIndex: any) => {
        const { currentState, fromPip } = meta;
        const { hitSpace } = currentState;

        // cause we are pushing forward
        // bear off position is just like a normal
        // pip position, therefore we need to fail
        // safe here and treat it like a non valid move :)

        if (fromPip === undefined) {
          return {
            ...meta,
            isValid: false,
          };
        }

        const leap = getLeap(getPipId(fromPip), die, player);
        const toPip = pips[leap];
        const moves = [...meta.moves];

        const canLeap =
          toPip !== undefined &&
          (toPip.player !== opponent || toPip.count === 1);

        const isBearOff = leap === getBearOffPosition(player);
        const shouldBearOffWithMove =
          isBearOff &&
          canBearOffWithThisMove(currentState, {
            from: getPipId(fromPip),
            to: leap,
            isHit: false,
            player,
            die,
          });

        const isValid =
          (canLeap || shouldBearOffWithMove) &&
          (hitSpace[player] === 0 || fromPip === "hit-space");

        if (isValid) {
          const move: Move = {
            from: getPipId(fromPip),
            to: shouldBearOffWithMove
              ? getBearOffPosition(player)
              : toPip.pipId,
            player,
            isHit: shouldBearOffWithMove ? false : toPip.player === opponent,
            die,
          };

          const updatedState = getNextState(currentState, move);

          moves.push(move);

          return {
            ...meta,
            currentState: updatedState,
            fromPip: dieIndex < diceSequence.length - 1 ? toPip : fromPip,
            moves,
          };
        }

        return {
          ...meta,
          isValid: false,
        };
      },
      {
        isValid: true,
        currentState: state,
        fromPip: pip,
        moves: [],
      } as any
    );

    return moveMetadata;
  });
  const result = map(filter(moveSequenceMetadatas, "isValid"), "moves");

  return result;
};

export const getValidMoves = (
  state: GameState,
  player: PlayerType
): PipMovesSequence[] => {
  const { pips, hitSpace } = state;

  // When we have a hit space blocker
  // other moves are not relevant
  // therefore we only return hit-space valid moves

  if (hitSpace[player] > 0) {
    console.log("vleguvam vo hit-space ?");

    const validHitSpaceMoves = getValidMovesPerPip("hit-space", state, player);
    const moveSequences: PipMovesSequence[] = [
      {
        pipId: "hit-space",
        moves: validHitSpaceMoves,
      },
    ];
    return moveSequences;
  }

  const currentPlayersPips = filter(pips, { player });

  const validMovesPerPip: PipMovesSequence[] = currentPlayersPips
    .map((pip) => ({
      pipId: pip.pipId,
      moves: getValidMovesPerPip(pip, state, player) as Move[][],
    }))
    .filter((it) => it.moves.length > 0);

  return validMovesPerPip;
};

export const getValidPositionTransitions = (
  state: GameState,
  player: PlayerType
): PositionTransitionEntry[] => {
  const validMoves = getValidMoves(state, player);
  const positions: PositionTransitionEntry[] = map(
    validMoves,
    (movesMetadata) => ({
      from: movesMetadata.pipId,
      to: uniq(
        flatMap(movesMetadata.moves, (moveSequence) => map(moveSequence, "to"))
      ),
    })
  );

  return positions;
};
