import type { Thunk } from "use-thunk";
import type { State as State_t } from "../types";
import * as errors from "./errors";
import * as serverUtils from "./serverUtils";

export const name = "pttbbs-web/LoginPage";

export interface State extends State_t {
  theDate?: Date;
  isRequested: boolean;
}

export const defaultState: State = { errmsg: "", isRequested: false };

// init
export const init = (myID: string): Thunk<State> => {
  const theDate = new Date();
  return async (set) => {
    set(myID, { theDate });
  };
};

export const attemptLogin = (
  myID: string,
  input: string,
  authRequestID: string,
): Thunk<State> => {
  return async (set) => {
    set(myID, { isRequested: true });
    const { errmsg, status } = await serverUtils.attemptLogin(
      input,
      authRequestID,
    );
    if (errmsg) {
      set(myID, { errmsg });
      return;
    }

    if (!status) {
      set(myID, { errmsg: errors.ERR_NETWORK });
      return;
    }

    if (status !== 200) {
      set(myID, { errmsg: `status not 200: ${status}` });
      return;
    }

    set(myID, { isRequested: true });
  };
};

export const reset = (myID: string): Thunk<State> => {
  return (set) => {
    set(myID, defaultState);
  };
};

export const cleanErr = (myID: string): Thunk<State> => {
  return (set) => {
    set(myID, { errmsg: "" });
  };
};

export const login = (
  myID: string,
  input: string,
  verifyCode: string,
): Thunk<State> => {
  return async (set) => {
    const { data, errmsg, status } = await serverUtils.login(input, verifyCode);

    if (errmsg) {
      set(myID, { errmsg });
      return;
    }

    if (!status) {
      set(myID, { errmsg: errors.ERR_NETWORK });
      return;
    }

    if (status === 401) {
      set(myID, { errmsg: errors.ERR_PASSWD });
      return;
    }

    if (status !== 200) {
      set(myID, { errmsg });
      return;
    }

    if (!data) {
      set(myID, { errmsg: "no data" });
      return;
    }

    const redirectURI =
      data.redirect_uri || "/user/" + data.username + "/favorites";

    window.location.href = redirectURI;
  };
};
