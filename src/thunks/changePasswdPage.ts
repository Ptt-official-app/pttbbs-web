import type { Thunk } from "use-thunk";
import type { State as State_t } from "../types";
import * as errors from "./errors";
import * as serverUtils from "./serverUtils";

export const name = "pttbbs-web/ChangePasswdPage";

export interface State extends State_t {
  theDate?: Date;
  userID: string;
}

export const defaultState: State = {
  userID: "",
  errmsg: "",
};

// init
export const init = (myID: string, userID: string): Thunk<State> => {
  const theDate = new Date();
  return async (set) => {
    set(myID, { theDate, userID });
  };
};

export const changePasswd = (
  myID: string,
  userID: string,
  origPassword: string,
  password: string,
  passwordConfirm: string,
): Thunk<State> => {
  return async (set) => {
    const { data, errmsg, status } = await serverUtils.changePasswd(
      userID,
      origPassword,
      password,
      passwordConfirm,
    );

    if (!status) {
      set(myID, { errmsg: errors.ERR_NETWORK });
      return;
    }

    if (status === 403) {
      set(myID, { errmsg: errors.ERR_PASSWD });
      return;
    }

    if (status !== 200) {
      set(myID, { errmsg });
      return;
    }
    if (!data) {
      return;
    }

    window.location.href = "/user/" + data.username;
  };
};

export const cleanErr = (myID: string): Thunk<State> => {
  return async (set) => {
    set(myID, { errmsg: "" });
  };
};
