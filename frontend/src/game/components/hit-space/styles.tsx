import styled from "styled-components";
import { DIMENSIONS_CONFIG } from "../constants";

const { ACTIVE_CHECKER_RATIO } = DIMENSIONS_CONFIG;

export const PositionHandle = styled.div`
  width: ${({ theme }) => theme.dimensions.width * ACTIVE_CHECKER_RATIO}px;
  height: ${({ theme }) =>
    theme.dimensions.height * ACTIVE_CHECKER_RATIO * 1.75}px;
  background-color: black;
  margin: 0px auto;
  visibility: hidden;
`;

export const HitContainer = styled.div`
  // border: 5px solid #3e210d;
  box-sizing: border-box;
  width: 90%;
  margin: auto;
  height: calc(50% - 50px);
`;
