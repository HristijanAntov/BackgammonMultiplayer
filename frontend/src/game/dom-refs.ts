import { PlayerType } from "./types";

export let checkerRefs: any = [];
export let pipRefs: any = [];
export let hitSpaceRefs: Record<PlayerType, any> = {
  W: null,
  B: null,
};

export let bearOffRefs: Record<PlayerType, any> = {
  W: null,
  B: null,
};
