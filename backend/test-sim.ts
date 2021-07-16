const printTree = require("print-tree");

import Backgammon from "./backgammon/model";

export function play() {
  const game = new Backgammon();

  const p1 = game.rollDice("W");

  game.move({ from: 12, to: 7, die: 5, isHit: false, player: "W" });
  game.move({ from: 12, to: 7, die: 5, isHit: false, player: "W" });
  console.log(game.getState(), "c");

  game.undo();
  game.undo();

  console.log(game.getState(), "after undo");

  // console.log(game.getState(), "after undo");

  // printTree(
  //   { children: movesNodes },
  //   (node: any) =>
  //     !node.data
  //       ? "root"
  //       : `|${node.data.from} , ${node.data.to}| die: ${node.data.die}`,
  //   (node: any) => node.children
  // );
}
