import map from "lodash/map";
import filter from "lodash/filter";

import { Position, PlayerType, ConditionalEntry } from "../types";

export const getOpponent = (p: PlayerType): PlayerType =>
  p === "W" ? "B" : "W";

export const getConditionalClassnames = (entries: ConditionalEntry[]) =>
  map(filter(entries, { when: true }), "value").join(" ");

export const coalesce = (arr: any[]): any => arr.find((it) => it !== null);

export const getUniqueId = () => "_" + Math.random().toString(36).substr(2, 9);

export const wait = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const calculateTranslatingPosition = (
  sourceElement: HTMLDivElement,
  targetElement: HTMLDivElement,
  offset = 0
): Position | undefined => {
  const sourcePosition = sourceElement.getBoundingClientRect();
  const targetPosition = targetElement?.getBoundingClientRect();

  if (
    sourcePosition?.left === undefined ||
    sourcePosition.top === undefined ||
    targetPosition?.left === undefined ||
    targetPosition.top === undefined
  ) {
    return;
  }

  return {
    left: targetPosition.left - sourcePosition.left,
    top: targetPosition.top - sourcePosition.top + offset,
  };
};
