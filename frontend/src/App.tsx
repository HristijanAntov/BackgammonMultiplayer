import React, { useEffect, useState } from "react";
import useSound from "use-sound";

import { ThemeProvider } from "styled-components";

//styles
import "./App.css";

import Pages from "./pages";

let BOARD_RATIO = 1;
let BOARD_ASPECT_RATIO = 2;

const App: React.FC = () => {
  const [currentWidth, setCurrentWidth] = useState<number>(window.innerWidth);
  const [currentHeight, setCurrentHeight] = useState<number>(
    window.innerHeight
  );

  const [playMove] = useSound("/sound-effects/move.mp3");
  const [playHit] = useSound("/sound-effects/hit.wav");
  const [playDieThrow] = useSound("/sound-effects/dice.wav");
  const [playSelectChecker] = useSound("/sound-effects/select-checker.wav");

  const [confirmMove] = useSound("/sound-effects/confirm-move.wav");

  useEffect(() => {
    const onResize = () => {
      const { innerWidth, innerHeight } = window;

      // if (innerHeight > innerWidth) {
      //   BOARD_RATIO = 0.9;
      //   BOARD_ASPECT_RATIO = 1.1;
      // } else {
      //   BOARD_RATIO = 0.85;
      //   BOARD_ASPECT_RATIO = 1.8;
      // }

      setCurrentWidth(innerWidth);
      setCurrentHeight(innerHeight);
    };

    window.addEventListener("resize", onResize);

    return () => window.removeEventListener("resize", onResize);
  }, []);

  const theme = {
    dimensions: {
      width: Math.min(1000, currentWidth * 0.8), //currentWidth * BOARD_RATIO,
      height: Math.min(1000, currentHeight * 0.8), //(currentWidth * BOARD_RATIO) / BOARD_ASPECT_RATIO,
    },
  };

  return (
    <ThemeProvider theme={theme}>
      <Pages />
      <button
        style={{ display: "none" }}
        onClick={() => playMove()}
        id="play-move"
      >
        play
      </button>
      <button
        style={{ display: "none" }}
        onClick={() => playHit()}
        id="play-hit"
      >
        hit
      </button>
      <button
        style={{ display: "none" }}
        onClick={() => playDieThrow()}
        id="play-dice-throw"
      >
        Dice Throw
      </button>

      <button
        style={{ display: "none" }}
        onClick={() => playSelectChecker()}
        id="play-select-checker"
      >
        Select Checker
      </button>

      <button
        style={{ display: "none" }}
        onClick={() => confirmMove()}
        id="play-confirm-move"
      >
        Confirm Move
      </button>
    </ThemeProvider>
  );
};

// const Wrapper = styled.div`
//   background-image: url(wood-texture.png);
//   min-height: 100vh;
//   display: flex;
//   justify-content: center;
//   align-items: center;
// `;

export default App;
