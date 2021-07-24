import { IError, ErrorType } from "../networking/types";

export const getUniqueId = () => "_" + Math.random().toString(36).substr(2, 9);

export const generateError = (errorType: ErrorType, payload: any): IError => ({
  errorType,
  payload,
});
