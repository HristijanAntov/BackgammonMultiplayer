import styled from "styled-components";
import { Body } from "../ui/styles";

import { colors } from "../styles";

export const StyledBody = styled(Body)`
  display: flex;
  flex-direction: column;
  max-height: 300px;
`;

export const GameItems = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto;
`;

export const ItemWrapper = styled.div<{ isExpanded: boolean }>`
  margin-bottom: 20px;
  padding: 4px;
  border: 1px solid transparent;

  transition: border-color 0.3s ease-out;

  ${({ isExpanded }) => isExpanded && `border-color: gray;`}
`;

export const Item = styled.div`
  box-shadow: 5px -3px 16px black;
  height: 28px;
  border-radius: 4px;
  padding: 0px 8px;
  user-select: none;
  background-color: ${colors.brown300};
  margin-bottom: 4px;
  display: flex;

  &:hover {
    opacity: 0.7;
  }
  cursor: pointer;
`;

export const ItemSection = styled.section`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;

  & input {
    height: 90%;
    width: 100%;
  }
`;

export const ItemLabel = styled.label`
  display: inline-block;
  font-size: 13px;
  font-weight: 700;
  min-width: 80px;
  color: white;
`;

export const Badge = styled.label`
  color: #9de7ec;
  font-size: 13px;
  font-weight: 600;
`;

export const Form = styled.div``;
