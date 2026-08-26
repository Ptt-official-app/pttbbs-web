import type { Thunk } from "use-thunk";
import type { State as State_t } from "../types";
import * as errors from "./errors";
import * as serverUtils from "./serverUtils";

export const name = "pttbbs-web/Header";

export interface State extends State_t {
  username: string;
  nickname: string;
  isInit: boolean;
}

export const defaultState: State = {
  username: "",
  nickname: "",
  isInit: false,

  errmsg: "",
};

export const init = (myID: string): Thunk<State> => {
  return async (set) => {
    set(myID, { isInit: true });
    set(getData(myID));
  };
};

export const setUsername = (myID: string, username: string): Thunk<State> => {
  return (set) => {
    set(myID, { username });
  };
};

const getData = (myID: string): Thunk<State> => {
  return async (set) => {
    const { data, errmsg, status } = await serverUtils.getUsername();
    console.info("header: after getData: data:", data);

    if (!status) {
      set(myID, { errmsg: errors.ERR_NETWORK });
      return;
    }
    if (status !== 200) {
      set(myID, { errmsg });
      return;
    }
    if (!data) {
      return;
    }

    set(myID, { username: data.username });
  };
};
