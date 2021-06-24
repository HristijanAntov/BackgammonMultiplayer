import styled, { keyframes, css } from "styled-components";
import { DIMENSIONS_CONFIG } from "../constants";
import { Dimensions } from "../../types";

const { CONTROLS_RATIO } = DIMENSIONS_CONFIG;

const animateExpandButton = keyframes`
  0% {
    opacity: 0;
    height: 0px;
  }
  100% {
    opacity: 1;
    height: 100%;
  }
`;

export const HUD = styled.div`
  // border: 1px solid white;
  box-sizing: border-box;

  position: absolute;

  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;
  height: ${({ theme }) => `${theme.dimensions.height * CONTROLS_RATIO}px`};
  top: ${({ theme }) =>
    `calc(50% - ${(theme.dimensions.height * CONTROLS_RATIO) / 2}px)`};
`;

export const ActionButtonsWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const RollButton = styled.button`
  outline: none;
  border: none;

  // border: 1px solid white;
  background-image: linear-gradient(
    to right,
    #603813 0%,
    #b29f94 51%,
    #603813 100%
  );

  border-radius: 6px;
  box-shadow: 5px -5px 13px black;
  width: 35%;
  height: 100%;
  min-width: 140px;
  max-width: 200px;
  max-height: 35px;
  font-size: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  color: white;
  font-weight: 700;
  font-style: italic;
  font-family: monospace;

  ${() => css`
    animation: ${animateExpandButton} 0.5s ease-in;
    animation-fill-mode: forwards;
  `}

  &:hover {
    opacity: 0.9;
  }
`;
