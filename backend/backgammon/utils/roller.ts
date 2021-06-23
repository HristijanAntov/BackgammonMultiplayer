import random from "lodash/random";

export const rollDie = () => {
  let dieRolled = random(1, 6);
  return dieRolled;
};

export const rollDice = () => {
  let diceRolled = [rollDie(), rollDie()];

  if (diceRolled[0] === diceRolled[1]) {
    diceRolled = [...diceRolled, ...diceRolled];
  }

  return diceRolled;
};
