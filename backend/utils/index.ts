export const getUniqueId = () => "_" + Math.random().toString(36).substr(2, 9);
export const wait = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

//copied this from here: https://decipher.dev/30-seconds-of-typescript/docs/powerset/
export const powerSet = (arr: any[]) =>
  arr.reduce((a, v) => a.concat(a.map((r: any) => [v].concat(r))), [[]]);
