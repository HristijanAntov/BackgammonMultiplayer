import styled from "styled-components";

export const Quadrant = styled.div<{ quadrantNum: number }>`
  background-image: url(/wood-t.jpg);

  width: 100%;
  height: 50%;
  display: flex;
  box-sizing: border-box;

  &:nth-child(even) {
    align-items: flex-end;
  }

  ${({ quadrantNum }) =>
    [0, 1].includes(quadrantNum) &&
    `
    flex-direction: row-reverse;
  `}
`;
