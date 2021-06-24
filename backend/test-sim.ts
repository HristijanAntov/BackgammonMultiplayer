const printTree = require("print-tree");

import Backgammon from "./backgammon/model";

import { getPossibleMoveNodes } from "./backgammon/utils/move-generator";

export function play() {
  const game = new Backgammon();

  game.rollDice("W");

  // printTree(
  //   { children: movesNodes },
  //   (node: any) =>
  //     !node.data
  //       ? "root"
  //       : `|${node.data.from} , ${node.data.to}| die: ${node.data.die}`,
  //   (node: any) => node.children
  // );
}
