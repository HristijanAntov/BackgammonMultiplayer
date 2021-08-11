import styled, { keyframes, css } from "styled-components";

const spin = () => keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const animatePopup = () => keyframes`
  0% {
    bottom: -15vh;
  }
  100% {
    bottom: 0px;
  }
`;

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
  width: 80%;
  color: white;
`;

export const PendingBanner = styled.div`
  border: 1px solid black;
  background-image: url(/wood-board.jpg);
  box-shadow: 9px 3px 19px black;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 10%;
  width: 71%;
  margin-top: calc(50vh - 20%);
  color: white;
  font-size: 20px;
  font-style: italic;
`;

export const PlayerLane = styled.div`
  background-color: transparent;
  flex: 1;
  color: black;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  padding: 0px 10px;

  & label {
    font-size: 1.2vw;
  }
`;

export const LogLane = styled.div`
  flex: 2;
  display: flex;
  font-size: 1.7vw;
  justify-content: center;
  align-items: center;
  color: orange;
`;

export const Toast = styled.div`
  box-sizing: border-box;
  border: 1px solid black;
  border-bottom: none;
  border-radius: 8px;
  border-bottom-left-radius: 0px;
  border-bottom-right-radius: 0px;
  border-top-right-radius: 0px;
  border-right: 0px;
  box-shadow: -5px -3px 18px #4f4a46;
  background-image: url(/wood-board.jpg);
  position: absolute;
  display: flex;
  flex-direction: column;

  bottom: 0px;
  right: 0px;
  width: 40vw;
  height: 15vh;
  min-width: 300px;
  min-height: 80px;
  z-index: 9999;

  transition: bottom 0.5s ease-out;

  animation: ${animatePopup()} 0.5s ease-out;
  animation-direction: alternate;

  h4 {
    margin: 0px;
    padding: 0px;
    font-size: calc(8px + 0.8vw);
    display: flex;
    justify-content: center;
    align-items: center;
    height: 35%;
    border-bottom: 1px solid black;
    font-style: italic;
    font-weight: normal;
    color: white;
  }

  .buttons {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;

    & button {
      width: 100px;
      height: 30px;
      &:nth-child(even) {
        background-color: #fa4f4f;
        margin-left: 20px;
      }

      &:nth-child(odd) {
        background-color: #4f8c4f;
        margin-left: 20px;
      }
    }
  }
`;

export const Spinner = styled.div`
  background-image: url(/wood-t.jpg);
  border-radius: 50%;
  box-shadow: 3px 6px 9px 4px rgb(15 12 23 / 81%) inset;
  width: 40px;
  height: 40px;
  margin-left: 40px;

  animation: ${spin()} 0.7s infinite;
  animation-direction: alternate;
`;
