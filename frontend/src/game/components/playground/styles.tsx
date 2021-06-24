import styled from "styled-components";

export const Playground = styled.div`
  box-sizing: border-box;
  background-image: url(/wood-texture.png);
  width: 100%;
  height: 100vh;
  margin: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 20px;
`;

export const BoardContainer = styled.div`
  background-color: white;
  border-radius: 4px;
  // box-shadow: 19px -7px 19px black;
  // padding: 25px;
  // border: 1px solid white;
`;

export const Stats = styled.div`
  border: 1px solid black;
  background-image: url(/wood-board.jpg);
  box-shadow: 9px 3px 19px black;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 5%;
  margin-bottom: 50px;
  width: 71%;
  color: white;
`;

export const Buttons = styled.div`
  background-color: white;
  padding: 4px;
  margin: auto;
  margin-top: 10px;
  display: flex;
  height: 70px;

  & > div {
    margin-top: 10px;
  }

  & > button {
    margin-left: 4px;
  }
`;