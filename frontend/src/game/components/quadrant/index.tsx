import React from "react";
import range from "lodash/range";

import { Quadrant } from "./styles";

//components
import Pip from "../pip";

interface PipsRange {
  from: number;
  to: number;
}

interface Props {
  quadrantNum: number;
  pipsRange: PipsRange;
}

const QuadrantComponent: React.FC<Props> = ({ quadrantNum, pipsRange }) => {
  return (
    <Quadrant quadrantNum={quadrantNum}>
      {range(pipsRange.from, pipsRange.to).map((pipNumber) => (
        <Pip key={pipNumber} pipNumber={pipNumber} quadrantNum={quadrantNum} />
      ))}
    </Quadrant>
  );
};

export default QuadrantComponent;
