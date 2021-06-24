import styled from "styled-components";

import { colors } from "../../styles";

export const TextBox = styled.input.attrs({
  type: "textbox",
})`
  outline: none;
  border: none;
  padding: 0px;
  margin: 0px;
  box-sizing: border-box;
  border: 1px solid transparent;
  border-radius: 4px;
  display: block;
  color: white;
  background-color: ${colors.brown300};
  height: 30px;
  padding: 4px 8px;
  transition: opacity, border-color 0.3s ease-in;
  opacity: 1;

  &::placeholder {
    color: #8fe6d6;
    font-style: italic;
    opacity: 1;
  }

  &:focus {
    border: 1px solid white;
    opacity: 0.9;
  }
`;
