import styled from "styled-components";
import { DIMENSIONS_CONFIG } from "../constants";

const { ACTIVE_CHECKER_RATIO, BEAROFF_CHECKER_RATIO } = DIMENSIONS_CONFIG;

const getDirectionStyles = (direction: any) =>
  direction === "S"
    ? {
        flexDirection: "column",
        borderTopLeftRadius: "0px",
        borderTopRightRadius: "0px",
      }
    : {
        flexDirection: "column-reverse",
        borderBottomLeftRadius: "0px",
        borderBottomRightRadius: "0px",
      };

export const PositionHandle = styled.div`
  width: ${({ theme }) => theme.dimensions.width * ACTIVE_CHECKER_RATIO}px;
  height: ${({ theme }) =>
    theme.dimensions.height *
    ACTIVE_CHECKER_RATIO *
    1.75 *
    BEAROFF_CHECKER_RATIO}px;
  background-color: black;
  margin: 0px auto;
  visibility: hidden;
`;

export const BearOffContainer = styled.div`
  box-sizing: border-box;
  width: 90%;
  margin: auto;
  height: calc(50% - 50px);
  display: flex;
  flex-direction: column;
  align-items: left;
  padding: 8px 8px;

  // border-radius: 9px;
  // box-shadow: -5px -3px 18px #4f4a46;
  // background: linear-gradient(
  //   0deg,
  //   rgb(0 0 0 / 72%) 0%,
  //   rgb(39 23 12 / 79%) 100%
  // );
  // border: 1px solid black;

  // border-left: 1px solid #7a7575;
  // border-bottom: 1px solid #7a7574;
  border-radius: 9px;
  box-shadow: 3px 6px 9px 4px rgb(15 12 23 / 81%) inset,
    1px -1px 7px 0 rgb(38 20 20) inset;
`;

export const Inner = styled.div<{
  direction: "N" | "S";
  shouldHighlight: boolean;
}>`
  width: 100%;
  height: 100%;
  display: flex;

  transition: background-color 0.3s ease-out;
  // background-image: url(/wood-board.jpg);
  // border-radius: 9px;
  // box-shadow: -5px -3px 18px black;
  // padding: 3px 0px;

  border-radius: inherit;

  ${({ shouldHighlight }) =>
    shouldHighlight &&
    `
    background-image: none;
    background-color: #7db53c;
    cursor: pointer;
  `}
  ${({ direction }) => getDirectionStyles(direction) as any}
`;
