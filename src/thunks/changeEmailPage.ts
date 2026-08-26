import type { Thunk } from "use-thunk";
import type { State as State_t } from "../types";
import * as serverUtils from "./serverUtils";
import { goUserHome } from "./utils";

export const name = "pttbbs-web/ChangeEmailPage";

export interface State extends State_t {
  theDate?: Date;
  userID: string;
  token: string;
  isDone: boolean;
}

export const defaultState: State = {
  userID: "",
  token: "",
  isDone: false,
  errmsg: "",
};

// init
export const init = (
  myID: string,
  userID: string,
  token: string,
): Thunk<State> => {
  const theDate = new Date();
  return async (set) => {
    set(myID, { theDate, userID, token });
    set(getData(myID, userID, token));
  };
};

const getData = (myID: string, userID: string, token: string): Thunk<State> => {
  return async (set) => {
    const { data, errmsg, status } = await serverUtils.changeEmail(
      userID,
      token,
    );

    if (status !== 200) {
      set(myID, { errmsg, isDone: true });
      return;
    }

    set(myID, { data, isDone: true });
  };
};

export const sleepAndRedirect = (
  _myID: string,
  userID: string,
): Thunk<State> => {
  return async () => {
    setTimeout(() => {
      goUserHome(userID);
    }, 5000);
  };
};
