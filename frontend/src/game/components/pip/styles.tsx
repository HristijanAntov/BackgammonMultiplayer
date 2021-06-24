import styled from "styled-components";
import { DIMENSIONS_CONFIG } from "../constants";

const { ACTIVE_CHECKER_RATIO } = DIMENSIONS_CONFIG;

export const renderPipTriangle = (metadata: any) => {
  const styles: any = {};

  if (metadata.even) {
    // styles.backgroundColor = "#c1a47fa1";
    styles.backgroundColor = "#533713a1";
  } else {
    // styles.backgroundColor = "#75502a8c";
    styles.backgroundColor = "#211b26a1";
  }

  if ([0, 1].includes(metadata.quadrantNum)) {
    styles.transform = `rotate(180deg)`;
  }

  return styles;
};

export const PipWrapper = styled.div`
  border-radius: 4px;
  transition: background 0.7s ease-out;
  box-sizing: border-box;
  flex: 1;
  height: 88%;
  border-left: none;
  position: relative;
`;

export const Triangle = styled.div<{ metadata: any; shouldHighlight: boolean }>`
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
  width: 100%;
  height: 100%;
  position: absolute;
  transform: opacity 0.2s ease-out;
  ${({ metadata }) => renderPipTriangle(metadata)};

  transition: background-color 0s ease-out;
  ${({ shouldHighlight }) =>
    shouldHighlight &&
    `
    background-color: #7db53c;
    cursor: pointer;
    
  `}
`;

export const CheckerStack = styled.div<{ quadrantNum: number }>`
  background-color: transparent;
  width: 100%;
  height: 100%;
  position: relative;

  display: flex;
  flex-direction: column;

  ${({ quadrantNum }) =>
    [2, 3].includes(quadrantNum)
      ? `
    flex-direction: column-reverse;
  `
      : ""}
`;

export const PositionHandle = styled.div`
  width: ${({ theme }) => theme.dimensions.width * ACTIVE_CHECKER_RATIO}px;
  height: ${({ theme }) => theme.dimensions.width * ACTIVE_CHECKER_RATIO}px;
  background-color: black;
  margin: 0px auto;
  visibility: hidden;
`;
