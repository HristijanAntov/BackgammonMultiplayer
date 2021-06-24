import some from "lodash/some";

import { Move, PlayerType, PositionTransitionEntry } from "../types";

import { NetworkRole } from "../game-manager/network-manager/types";

export const isFacingNorth = (player: PlayerType) => player === "W";

export const getBearOffPosition = (player: PlayerType) =>
  isFacingNorth(player) ? -1 : 24;

export const whoAmI = (role: NetworkRole): PlayerType =>
  role === "HOST" ? "W" : "B";

const getHitCountInMoveSequence = (moves: Move[]) =>
  moves.reduce((hitCount, move) => (move.isHit ? hitCount + 1 : hitCount), 0);

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

// export const rollDice = () => {
//   let diceRolled = [random(1, 6), random(1, 6)];

//   if (diceRolled[0] === diceRolled[1]) {
//     diceRolled = [...diceRolled, ...diceRolled];
//   }

//   return diceRolled;
// };

// export const getValidMovesPerPip = (
//   pip: Pip,
//   state: GameState,
//   player: PlayerType
// ): Move[][] => {
//   const { pips, diceRolled } = state;

//   if (diceRolled.length === 0) {
//     return [];
//   }

//   const opponent = getOpponent(player);

//   const diceCombinations = uniqWith(
//     filter(
//       [
//         ...new PowerSet(diceRolled).toArray(),
//         ...new PowerSet([...diceRolled].reverse()).toArray(),
//       ],
//       (it) => it.length !== 0
//     ),
//     isEqual
//   );

//   const moveSequenceMetadatas = diceCombinations.map((diceSequence) => {
//     const moveMetadata = diceSequence.reduce(
//       (meta, die, dieIndex) => {
//         const { currentState, fromPip } = meta;
//         const leap = getLeap(fromPip.pipId, die, player);
//         const toPip = pips[leap];
//         const moves = [...meta.moves];

//         const canLeap =
//           toPip !== undefined &&
//           (toPip.player !== opponent || toPip.count === 1);

//         if (canLeap) {
//           const move: Move = {
//             from: fromPip.pipId,
//             to: toPip.pipId,
//             player,
//             isHit: toPip.player === opponent,
//             die,
//           };
//           moves.push(move);
//           const updatedState = getNextState(currentState, move);
//           return {
//             ...meta,
//             currentState: updatedState,
//             fromPip: dieIndex < diceSequence.length - 1 ? toPip : fromPip,
//             moves,
//           };
//         }

//         return {
//           ...meta,
//           isValid: false,
//         };
//         // invalid move here
//       },
//       {
//         isValid: true,
//         currentState: state,
//         fromPip: pip,
//         moves: [],
//       } as any
//     );

//     return moveMetadata;
//   });

//   const moveSequence = map(filter(moveSequenceMetadatas, "isValid"), "moves");
//   return moveSequence;
// };

// export const getValidMoves = (
//   state: GameState,
//   player: PlayerType
// ): PipMovesSequence[] => {
//   const { pips, hitSpace } = state;

//   //TODO: for the hitSpace

//   const currentPlayersPips = filter(pips, { player });

//   const validMovesPerPip: PipMovesSequence[] = currentPlayersPips.map(
//     (pip) => ({
//       pipId: pip.pipId,
//       moves: getValidMovesPerPip(pip, state, player),
//     })
//   );

//   return validMovesPerPip;
// };

// const transformPip = (pip: Pip, move: Move): Pip => {
//   const { from, to, player, isHit } = move;

//   if (![from, to].includes(pip.pipId)) {
//     return pip;
//   }

//   const [isSource, isTarget] = [pip.pipId === from, pip.pipId === to];

//   if (isSource) {
//     const newPip = { ...pip };
//     newPip.count = clamp(newPip.count - 1, 0, Infinity);
//     newPip.player = newPip.count > 0 ? player : undefined;
//     newPip.isEmpty = newPip.count === 0;
//     return newPip;
//   }

//   if (isTarget) {
//     const newPip = { ...pip };
//     newPip.count = isHit ? 1 : newPip.count + 1;
//     newPip.player = player;
//     newPip.isEmpty = false;
//     return newPip;
//   }

//   return pip;
// };

// export const getNextState = (state: GameState, move: Move): GameState => {
//   const { hitSpace, pips, diceRolled } = state;
//   const { from, to, isHit, player, die } = move;

//   const isFromHitSpaceMove = from === "hit-space";

//   const updatedPips = map(pips, (pip) => transformPip(pip, move));

//   const updatedHitSpace = { ...hitSpace };

//   if (isHit) {
//     const opponent = getOpponent(player);
//     const currentHitCount = updatedHitSpace[opponent];
//     updatedHitSpace[opponent] = currentHitCount + 1;
//   }

//   if (isFromHitSpaceMove) {
//     const currentHitCount = updatedHitSpace[player];
//     updatedHitSpace[player] = clamp(currentHitCount - 1, 0, Infinity);
//   }

//   const dieIndex = findIndex(diceRolled, (d) => d === die);

//   return {
//     ...state,
//     diceRolled: filter(diceRolled, (_, i) => i !== dieIndex),
//     hitSpace: updatedHitSpace,
//     pips: updatedPips,
//   };
// };
