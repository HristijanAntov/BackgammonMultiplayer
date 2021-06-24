import React from "react";

import {
  Board,
  ActiveSection,
  WoodBar,
  PlaygroundContainer,
  Side,
  Ruler,
  Pips,
} from "./styles";

import { QUADRANT_CONFIGS } from "../constants";

//components
import Quadrant from "../quadrant";
import HUD from "../hud";
import HitSpace from "../hit-space";
import BearOff from "../bear-off";

interface Props {}

const woodBarsSides: Side[] = ["W", "N", "S", "E", "CENTER"];

const BoardComponent: React.FC<Props> = () => {
  return (
    <Board>
      <ActiveSection>
        {woodBarsSides.map((side) => (
          <WoodBar key={side} side={side}>
            {side === "CENTER" && (
              <>
                <HitSpace player="B" />
                <HitSpace player="W" />
              </>
            )}
          </WoodBar>
        ))}
        <Ruler>
          <Pips />
        </Ruler>
        <PlaygroundContainer side="left">
          {QUADRANT_CONFIGS.left.map((config) => (
            <Quadrant
              key={config.quadrantNum}
              quadrantNum={config.quadrantNum}
              pipsRange={config.pipsRange}
            />
          ))}
          <HUD player="W" />
        </PlaygroundContainer>
        <PlaygroundContainer side="right">
          {QUADRANT_CONFIGS.right.map((config) => (
            <Quadrant
              key={config.quadrantNum}
              quadrantNum={config.quadrantNum}
              pipsRange={config.pipsRange}
            />
          ))}
          <HUD player="B" />
        </PlaygroundContainer>
      </ActiveSection>
      <WoodBar side="BEAROFF">
        <BearOff player="W" />
        <BearOff player="B" />
      </WoodBar>
    </Board>
  );
};

export default BoardComponent;
