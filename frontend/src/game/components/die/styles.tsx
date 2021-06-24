import styled, { keyframes, css } from "styled-components";
import map from "lodash/map";

import { DIMENSIONS_CONFIG } from "../constants";
import { Dimensions } from "../../types";

const { CONTROLS_RATIO, DIE_RATIO, DIE_POINT_RATIO } = DIMENSIONS_CONFIG;

export type DieFaceType =
  | "FRONT"
  | "BACK"
  | "RIGHT"
  | "LEFT"
  | "TOP"
  | "BOTTOM";
export type PointPosition = "NW" | "NE" | "E" | "MIDDLE" | "SE" | "SW" | "W";

interface DieAnimationMetadata {
  duration: number;
  dieFaceSequence: number[];
}

export const getDieSize = (viewportDimensions: Dimensions) =>
  viewportDimensions.height * CONTROLS_RATIO * DIE_RATIO;

export const getPointSize = (viewportDimensions: Dimensions) =>
  getDieSize(viewportDimensions) * DIE_POINT_RATIO;

export const getDieDimension = (viewportDimensions: Dimensions) => ({
  width: getDieSize(viewportDimensions),
  height: getDieSize(viewportDimensions),
});

const getRotationForDieNum = (die: number) => {
  const rotations: Map<number, string> = new Map()
    .set(1, "rotateX(-10deg) rotateY(20deg)")
    .set(2, "rotateX(-10deg) rotateY(110deg)")
    .set(3, "rotateX(80deg) rotateY(0deg) rotateZ(-20deg)")
    .set(4, "rotateX(-100deg) rotateY(0deg) rotateZ(20deg)")
    .set(5, "rotateX(-10deg) rotateY(-70deg)")
    .set(6, "rotateX(-190deg) rotateY(-20deg)");

  return rotations.get(die) || "";
};

const rotateCube = (dieFaceSequence: number[]) => {
  const stepIntensity = 100 / dieFaceSequence.length;
  const rotationSequence = map(
    dieFaceSequence,
    (die, nthStep) => `
    ${nthStep * stepIntensity}% { transform: ${getRotationForDieNum(die)};}
  `
  );

  const animationTransition = keyframes`
    ${rotationSequence.join(``)}
`;

  return animationTransition;
};

const faceDieNumFaceUpFront = (dieNum: number) => ({
  transform: getRotationForDieNum(dieNum),
});

const styleCubeFace = (face: DieFaceType, cubeSize: number) => {
  switch (face) {
    case "FRONT":
      return {
        transform: `rotateY(0deg) translateZ(calc(${cubeSize}px / 2))`,
      };
    case "BACK":
      return {
        transform: `rotateY(180deg) translateZ(calc(${cubeSize}px / 2))`,
      };
    case "RIGHT":
      return {
        transform: `rotateY(90deg) translateZ(calc(${cubeSize}px / 2))`,
      };
    case "LEFT":
      return {
        transform: `rotateY(-90deg) translateZ(calc(${cubeSize}px / 2))`,
      };
    case "TOP":
      return {
        transform: `rotateX(90deg) translateZ(calc(${cubeSize}px / 2))`,
      };
    case "BOTTOM":
      return {
        transform: `rotateX(-90deg) translateZ(calc(${cubeSize}px / 2))`,
      };
  }
};

const stylePoint = (position: PointPosition, pointSize: number) => {
  const halfPointSize = pointSize / 2;

  switch (position) {
    case "NW":
      return {
        left: `${halfPointSize}px`,
        top: `${halfPointSize}px`,
      };

    case "NE":
      return {
        right: `${halfPointSize}px`,
        top: `${halfPointSize}px`,
      };
    case "E":
      return {
        right: `${halfPointSize}px`,
        top: `calc(50% - ${halfPointSize}px)`,
      };
    case "MIDDLE":
      return {
        left: `calc(50% - ${halfPointSize}px)`,
        top: `calc(50% - ${halfPointSize}px)`,
      };
    case "SE":
      return {
        right: `${halfPointSize}px`,
        bottom: `${halfPointSize}px`,
      };

    case "SW":
      return {
        left: `${halfPointSize}px`,
        bottom: `${halfPointSize}px`,
      };
    case "W":
      return {
        left: `${halfPointSize}px`,
        top: `calc(50% - ${halfPointSize}px)`,
      };
  }
};

export const Scene = styled.div`
  // background-color: white;
  perpsective: 300px;
  perspective-origin: 50% 100%;
  margin-right: 7%;
  ${({ theme }) => getDieDimension(theme.dimensions)};
`;

export const Die = styled.div<{
  shouldAnimate: boolean;
  dieNum: number | undefined;
  animationMetadata: DieAnimationMetadata | undefined;
}>`
  position: relative;
  transform-style: preserve-3d;
  transform-origin: center center center;

  ${({ theme }) => getDieDimension(theme.dimensions)};
  ${({ dieNum }) => dieNum !== undefined && faceDieNumFaceUpFront(dieNum)};

  ${({ shouldAnimate, animationMetadata }) =>
    shouldAnimate &&
    animationMetadata &&
    css`
      animation: ${rotateCube(animationMetadata.dieFaceSequence)}
        ${animationMetadata.duration}s linear;
      animation-fill-mode: forwards;
    `}
`;

export const DieFace = styled.div<{ face: DieFaceType }>`
  border: 1px solid black;
  box-sizing: border-box;
  position: absolute;

  background-image: url(/dice.jpg);
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  backface-visibility: hidden;
  user-select: none;

  ${({ theme }) => getDieDimension(theme.dimensions)}
  ${({ face, theme }) => styleCubeFace(face, getDieSize(theme.dimensions))};
`;

export const Point = styled.div<{ position: PointPosition }>`
  position: absolute;
  background-color: white;
  border-radius: 50%;

  ${({ theme }) => ({
    width: `${getPointSize(theme.dimensions)}px`,
    height: `${getPointSize(theme.dimensions)}px`,
  })};

  ${({ theme, position }) =>
    stylePoint(position, getPointSize(theme.dimensions))}
`;
