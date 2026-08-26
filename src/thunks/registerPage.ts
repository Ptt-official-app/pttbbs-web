import type { Thunk } from "use-thunk";
import type { State as State_t } from "../types";
import * as errors from "./errors";
import * as serverUtils from "./serverUtils";
import { goUserHome } from "./utils";

export const name = "pttbbs-web/RegisterPage";

export interface State extends State_t {
  theDate?: Date;
  infomsg?: string;

  isAttemptRegister: boolean;
}

export const defaultState: State = {
  errmsg: "",
  isAttemptRegister: false,
};

// init
export const init = (myID: string): Thunk<State> => {
  return async (set) => {
    const theDate = new Date();
    set(myID, { theDate });
  };
};

export const attemptRegister = (myID: string, email: string): Thunk<State> => {
  return async (set) => {
    const { errmsg, status } = await serverUtils.attemptRegister(email);
    if (errmsg) {
      set(myID, { errmsg });
      return;
    }
    if (status !== 200) {
      set(myID, {
        errmsg: `unable to register: status: ${status}`,
      });
      return;
    }

    set(myID, { isAttemptRegister: true });
  };
};

export const register = (
  myID: string,
  username: string,
  password: string,
  passwordConfirm: string,
  email: string,
  over18: boolean,
  verifyCode: string,
): Thunk<State> => {
  return async (set) => {
    const { data, errmsg, status } = await serverUtils.register(
      username,
      password,
      passwordConfirm,
      email,
      over18,
      verifyCode,
    );

    if (!status) {
      set(myID, { errmsg: errors.ERR_NETWORK });
      return;
    }

    if (status === 400) {
      set(myID, { errmsg: errors.ERR_REGISTER });
      return;
    }

    if (status !== 200) {
      set(myID, { errmsg });
      return;
    }
    if (!data) {
      return;
    }

    const { username: user_id } = data;

    goUserHome(user_id);
  };
};

export const cleanMsg = (myID: string): Thunk<State> => {
  return async (set) => {
    set(myID, { infomsg: "", errmsg: "" });
  };
};
