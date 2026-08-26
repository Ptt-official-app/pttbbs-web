import type { Thunk } from "use-thunk";
import type { State as State_t } from "../types";
import * as errors from "./errors";
import * as serverUtils from "./serverUtils";
import { goUserHome } from "./utils";

export const name = "pttbbs-web/attemptChangeEmailPage";

export interface State extends State_t {
  theDate?: Date;
  userID: string;
  isDone: boolean;
}

export const defaultState: State = {
  userID: "",
  isDone: false,
  errmsg: "",
};

// init
export const init = (myID: string, userID: string): Thunk<State> => {
  const theDate = new Date();
  return async (set) => {
    set(myID, { theDate, userID });
  };
};

export const changeEmail = (
  myID: string,
  userID: string,
  password: string,
  email: string,
): Thunk<State> => {
  return async (set) => {
    const { errmsg, status } = await serverUtils.attemptChangeEmail(
      userID,
      password,
      email,
    );

    if (!status) {
      set(myID, { errmsg: errors.ERR_NETWORK });
      return;
    }

    if (status === 403) {
      let theErrMsg = errors.ERR_PASSWD;
      if (errmsg === "already exists") {
        theErrMsg = errors.ERR_EMAIL_ALREADY_EXISTS;
      }
      set(myID, { errmsg: theErrMsg });
      return;
    }

    if (status !== 200) {
      set(myID, { errmsg });
      return;
    }

    set(myID, { isDone: true });
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

export const cleanErr = (myID: string): Thunk<State> => {
  return async (set) => {
    set(myID, { errmsg: "" });
  };
};
