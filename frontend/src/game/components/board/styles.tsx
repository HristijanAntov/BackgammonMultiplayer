import styled from "styled-components";
import { Dimensions } from "../../types";
import { DIMENSIONS_CONFIG } from "../constants";

export type Side = "W" | "S" | "E" | "N" | "CENTER" | "BEAROFF";

const { BAR_TICKNESS_RATIO, CENTER_BAR_TICKNESS_RATIO, BEAROFF_BAR_RATIO } =
  DIMENSIONS_CONFIG;

const calculateWoodBoxStyles = (side: Side, dimensions: Dimensions): string => {
  switch (side) {
    case "W":
      return `
        left: 0px;
        top: 0px;
        width: ${dimensions.width * BAR_TICKNESS_RATIO}px;
        height: 100%;
        box-shadow: 9px 3px 8px #2c1c1c;
        z-index: 1;
      `;
    case "N":
      return `
        left: 0px;
        top: 0px;
        width: 100%;
        height: ${dimensions.height * BAR_TICKNESS_RATIO}px;
    `;
    case "S":
      return `
        left: 0px;
        bottom: 0px;
        width: 100%;
        height: ${dimensions.height * BAR_TICKNESS_RATIO}px;
        `;
    case "E":
      return `
        border-right: none;
        border-radius: 0px;
        right: 0px;
        top: 0px;
        width: ${dimensions.width * BAR_TICKNESS_RATIO}px;
        height: 100%;
        `;
    case "CENTER":
      return `
        border-radius: 0px;
        left: calc(50% - ${dimensions.width * CENTER_BAR_TICKNESS_RATIO}px / 2);
        top: ${dimensions.height * BAR_TICKNESS_RATIO}px;
        width: ${dimensions.width * CENTER_BAR_TICKNESS_RATIO}px;
        height: calc(100% - ${dimensions.height * BAR_TICKNESS_RATIO * 2}px);
        border-bottom: none;
        border-top: none;
        display: flex;
        flex-direction: column;
      `;
    case "BEAROFF":
      return `
        border: none;
        // border-right: 1px solid black;
        // border-top: 1px solid black;
        border-radius: 0px;
        right: 0px;
        top: 0px;
        width: ${dimensions.width * BEAROFF_BAR_RATIO - 0}px;
        height: 100%;
        display: flex;
        flex-direction: column;
          `;
  }
};

export const ActiveSection = styled.div`
  border-radius: 4px;
  position: relative;
  ${({ theme: { dimensions } }) => `
  width: ${dimensions.width - BEAROFF_BAR_RATIO * dimensions.width}px;
  height: ${dimensions.height}px;
`}
`;

export const Board = styled.div`
  border-radius: 4px;
  position: relative;
  box-shadow: 10px -8px 18px black;
  ${({ theme }) => `
    width: ${theme.dimensions.width}px;
    height: ${theme.dimensions.height}px;
  `};
`;

export const WoodBar = styled.div<{ side: Side }>`
  background-image: url(/wood-board.jpg);
  position: absolute;
  border: 1px solid black;
  border: none;
  border-radius: 4px;
  box-sizing: border-box;
  ${({ side, theme }) => calculateWoodBoxStyles(side, theme.dimensions)};
`;

export const PlaygroundContainer = styled.div<{
  side: "left" | "right";
}>`
  position: absolute;
  box-sizing: border-box;
  background-color: #1dc6dc;
  width: ${({ theme }) =>
    `calc(50% - (${theme.dimensions.width * BAR_TICKNESS_RATIO}px + ${
      (theme.dimensions.width * CENTER_BAR_TICKNESS_RATIO) / 2
    }px))`};
  height: ${({ theme }) =>
    `calc(100% - ${theme.dimensions.height * BAR_TICKNESS_RATIO * 2}px)`};

  ${({ theme, side }) =>
    `${side}:${theme.dimensions.width * BAR_TICKNESS_RATIO}px`};

  top: ${({ theme }) => `
    ${theme.dimensions.height * BAR_TICKNESS_RATIO}px;
  `};
  display: flex;
  flex-direction: column;
`;

export const Cylinder = styled.div`
  box-shadow: -10px -8px 22px black;
  border: 1px solid black;
  border-radius: 4px;
  box-sizing: border-box;
  background-color: #0200006b;

  height: 40%;
  width: 90%;
  margin-top: 20px;
`;

export const Ruler = styled.div`
  width: 2px;
  height: 100%;

  position: absolute;
  top: 0px;
  left: calc(50% - 1px);
  background-color: black;
  position: relative;
`;

export const Pips = styled.div`
  // background-image: url(/wood-board.jpg);

  // width: 700%;
  // height: 10%;
  // position: absolute;
  // top: 10%;
  // left: -350%;
  // border-radius: 4px;
`;
