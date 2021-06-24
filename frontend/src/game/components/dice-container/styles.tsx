import styled from "styled-components";
import { DIMENSIONS_CONFIG } from "../constants";
import { Dimensions } from "../../types";

const { CONTROLS_RATIO } = DIMENSIONS_CONFIG;

export const DiceContainer = styled.div`
  // border: 1px solid white;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
