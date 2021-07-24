import styled from "styled-components";
import { colors } from "../styles";

export const Container = styled.div``;

export const Title = styled.h3`
  color: white;
  height: 32px;
  font-size: 1rem;
  margin: 0px;
  padding: 0px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 600;
  border-bottom: 1px solid ${colors.brown300};
`;

export const Body = styled.div`
  padding: 10px;
`;

export const Paragraph = styled.p`
  font-size: 13px;
  color: white;
`;

export const Button = styled.button`
  border-radius: 4px;
  border: none;
  outlone: none;
  background-color: ${colors.brown300};
  color: white;
  border: 2px solid black;
  cursor: pointer;
  transition: backround-color 0.5s ease-in;

  &:hover:not(:disabled) {
    background-color: orange;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

export const ControlWrapper = styled.div`
  display: flex;
  padding: 10px;
`;

export const ErrorWrapper = styled.label`
  background-color: #fa4f4f;
  font-size: 13px;
  color: white;
  border-radius: 4px;
  padding: 8px 16px;
  font-weight: 700;
  font-style: italic;
`;
