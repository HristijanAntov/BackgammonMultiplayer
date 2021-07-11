import styled, { keyframes, css } from "styled-components";
import { DIMENSIONS_CONFIG } from "../constants";
import { Position } from "../../types";

const { ACTIVE_CHECKER_RATIO, BEAROFF_CHECKER_RATIO } = DIMENSIONS_CONFIG;

const animateMove = (targetPosition: Position) => keyframes`
  0% {
    z-index: 2;
  }
  100% {
    left: ${targetPosition.left}px;
    top: ${targetPosition.top}px;
    z-index: 2;
  }
`;

const blinkChecker = () => keyframes`
  0% {
    background: linear-gradient(-30deg, rgb(22 206 122), rgb(116 125 133));
    // background: linear-gradient(-30deg, rgb(0 206 55), rgb(16 25 133));
  }
  100% {
  
    background: linear-gradient(-30deg, rgb(22 206 122), rgb(116 125 133));
  }
`;

export const CheckerInner = styled.div<{ player: any }>`
  border-radius: 50%;
  width: 80%;
  height: 80%;
  display: flex;
  justify-content: center;
  align-items: center;

  font-size: 24px;
  font-weight: bold;

  color: ${({ player }) => (player === "W" ? "black" : "white")};
`;

export const Checker = styled.div<{
  animationMetadata?: any;
  player: any;
  checkerNum: number;
  shouldAnimate: boolean;
  canBeSelected: boolean;
  hasMove: boolean;
  isBearOffChecker: boolean;
  isSelected: boolean;
}>`
  z-index: 1;
  border-radius: 50%; 
  transition: background 1s ease-in;
  box-sizing: border-box;


  ${({ theme: { dimensions } }) => `
    width: ${dimensions.width * ACTIVE_CHECKER_RATIO}px;
    height: ${dimensions.width * ACTIVE_CHECKER_RATIO}px;
    `};

  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
 
  left: 0px;
  top: 0px;

  margin: auto;
  margin-top: 0px;
  margin-bottom: 0px;
   ${({ animationMetadata, shouldAnimate }) =>
     animationMetadata &&
     shouldAnimate &&
     css`
       animation: ${animateMove({
           left: animationMetadata.left,
           top: animationMetadata.top,
         })}
         ${animationMetadata.duration}s cubic-bezier(0.91, 1, 0.61, 0.95);
       animation-fill-mode: forwards;
     `};}

  
  ${({ player }) =>
    player === "W"
      ? ` 
 
      background: linear-gradient(-30deg, rgb(0, 0, 0), rgb(200, 230, 255));
      & ${CheckerInner} {
        background: linear-gradient(0deg, rgb(196 219 237) 0%, rgb(39 23 12 / 79%) 100%);
      }`
      : `
      background: linear-gradient(13deg ,rgb(9 10 10),rgb(116 125 133));
      & ${CheckerInner} {
       background: linear-gradient(235deg, rgb(25 26 27 / 91%) 0%,rgb(160 155 151 / 79%) 100%);
      }}`}


      ${({ hasMove }) =>
        hasMove &&
        css`
          animation: ${blinkChecker()} 0.5s ease-out infinite alternate;
          // background: linear-gradient(-30deg, rgb(22 206 122), rgb(116 125 133));
          cursor: pointer;
        `}
   
    ${({ isBearOffChecker, theme: { dimensions } }) =>
      isBearOffChecker &&
      `
      border-radius: 4px;
      
      height: ${
        dimensions.width * ACTIVE_CHECKER_RATIO * BEAROFF_CHECKER_RATIO
      }px;
    `}
  

    ${({ isSelected }) =>
      isSelected &&
      `  
      border: 1px solid black;
     `}

`;
