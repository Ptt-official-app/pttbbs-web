import type { Thunk } from "use-thunk";
import { STATUS_OK } from "../constants";
import type { State as State_t } from "../types";
import * as serverUtils from "./serverUtils";

export const name = "pttbbs-web/InitPage";

export interface State extends State_t {}

export const defaultState: State = {
  errmsg: "",
};

export const init = (myID: string): Thunk<State> => {
  return async (set) => {
    const theDate = new Date();
    set(myID, { theDate });
  };
};

export const submit = (
  myID: string,
  username: string,
  realName: string,
  birthDate: string,
): Thunk<State> => {
  return async (set) => {
    const { status, errmsg } = await serverUtils.init(
      username,
      realName,
      birthDate,
    );
    if (errmsg) {
      set(myID, { errmsg });
      return;
    }
    if (status !== STATUS_OK) {
      set(myID, { errmsg: `status is not ok: ${status}` });
      return;
    }

    window.location.href = "/";
  };
};

export const cleanErr = (myID: string): Thunk<State> => {
  return (set) => {
    set(myID, { errmsg: "" });
  };
};
