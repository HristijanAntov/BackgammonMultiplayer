import { PointPosition, DieFaceType } from "./styles";

export const pointConfigs: Map<number, PointPosition[]> = new Map()
  .set(1, ["MIDDLE"])
  .set(2, ["NW", "SE"])
  .set(3, ["SW", "MIDDLE", "NE"])
  .set(4, ["NW", "NE", "SE", "SW"])
  .set(5, ["NW", "NE", "SE", "SW", "MIDDLE"])
  .set(6, ["NW", "NE", "E", "SE", "SW", "W"]);

const dieFaces: DieFaceType[] = [
  "FRONT",
  "LEFT",
  "BOTTOM",
  "TOP",
  "RIGHT",
  "BACK",
];

interface FaceConfig {
  face: DieFaceType;
  points: PointPosition[];
}

export const faceConfigs: FaceConfig[] = dieFaces.map((face, i) => ({
  face,
  points: pointConfigs.get(i + 1) || [],
}));

export default faceConfigs;
