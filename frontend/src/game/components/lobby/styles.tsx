import styled from "styled-components";
import { Link } from "react-router-dom";

export const colors = {
  brown300: "#7f512f",
};

export const Lobby = styled.div`
  background-image: url(/wood-texture.png);

  width: 100%;
  height: 100vh;
  padding: 10px;

  display: flex;
  justify-content: center;
  align-items: center;
`;

export const OptionsForm = styled.div`
  box-shadow: 5px -3px 16px black;
  background-image: url(/wood-board.jpg);
  border-radius: 4px;
  min-width: 500px;
  max-width: 600px;
  width: 40%;
  height: 400px;
  display: flex;
  flex-direction: column;
`;

export const Header = styled.div`
  height: 40px;
  border-bottom: 1px solid ${colors.brown300};
  font-size: 19px;
  font-style: italic;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
`;

export const Body = styled.div`
  display: flex;
  height: 100%;
  opacity: 0.7;
`;

export const OptionsContainer = styled.div`
  box-sizing: border-box;
  border-right: 1px solid ${colors.brown300};
  border-radius: 4px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  display: flex;
  flex-direction: column;
  width: 30%;
  min-width: 170px;
`;

export const Option = styled.div<{ isSelected: boolean }>`
  height: 40px;
  font-size: 13px;

  color: white;
  padding: 0px 15px;
  display: flex;

  align-items: center;

  transition: background-color 0.3s ease-out;
  user-select: none;
  cursor: pointer;

  &:hover {
    background-color: ${colors.brown300};
  }

  ${({ isSelected }) =>
    isSelected &&
    `background-color: ${colors.brown300};
  `}
`;

export const RightContainer = styled.div`
  flex: 1;
  height: 100%;
  box-sizing: border-box;
`;

export const StyledLink = styled(Link)`
  text-decoration: none !important;
`;
