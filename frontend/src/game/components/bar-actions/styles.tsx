import styled from "styled-components";

import { ReactComponent as $CheckIcon } from "./icons/check.svg";
import { ReactComponent as $UndoIcon } from "./icons/undo.svg";

const getIconStyles = () => `
  width: 30px;
  padding: 4px;
  height: 30px;
`;

export const BarActions = styled.div`
  box-shadow: -5px -3px 18px #4f4a46;
  background-image: url(/wood-board.jpg);
  width: 150%;
  height: 50px;
  border-radius: 10px;
  display: flex;
  z-index: 5;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  left: -25%;
`;

export const ControlItem = styled.div<{ isDisabled: boolean }>`
  border: 1px solid #64badd;
  box-sizing: border-box;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  margin-right: 2px;
  box-shadow: -5px -3px 18px #4f4a46;
  transition: background-color 0.3s ease-out;

  cursor: pointer;
  background-color: white;

  ${({ isDisabled }) =>
    isDisabled &&
    `
    background-color: lightgray;
    pointer-events: none;
  `}

  &:hover {
    ${({ isDisabled }) =>
      !isDisabled &&
      `
    border: 1px solid orange;
    background-color: #b5c9d0;
    `}
  }
`;

export const CheckIcon = styled($CheckIcon)<{ is_disabled: string }>`
  color: ${({ is_disabled }) => (is_disabled === "true" ? "gray" : "#64badd")};
  ${getIconStyles()}
`;

export const UndoIcon = styled($UndoIcon)<{ is_disabled: string }>`
  color: ${({ is_disabled }) => (is_disabled === "true" ? "gray" : "#638def")};
  ${getIconStyles()}
`;
