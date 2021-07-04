import { CREATE_MESSAGES, GET_ERRORS } from "./types";

export const createMessage = (msg: any) => {
  return {
    type: CREATE_MESSAGES,
    payload: msg
  }
}

export const returnErrors = (msg: any, status: any) => {
  return {
    type: GET_ERRORS,
    payload: { msg, status },
  };
};