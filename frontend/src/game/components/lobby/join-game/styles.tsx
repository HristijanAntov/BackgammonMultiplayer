import styled from "styled-components";
import { Body } from "../ui/styles";

import { colors } from "../styles";

export const StyledBody = styled(Body)`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
`;

export const GameItems = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

export const Item = styled.div`
  box-shadow: 5px -3px 16px black;
  height: 28px;
  border-radius: 4px;
  padding: 0px 8px;

  background-color: ${colors.brown300};
  margin-bottom: 4px;
  display: flex;
  justify-content: space-between;
`;

export const ItemSection = styled.section`
  display: flex;
  justify-content: center;
  align-items: center;
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
