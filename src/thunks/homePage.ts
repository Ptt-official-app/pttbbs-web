import type { State as rState, Thunk } from "use-thunk";

export const name = "pttbbs-web/HomePage";

export interface State extends rState {
  theDate?: Date;
}

export const defaultState: State = {};

// init
export const init = (myID: string): Thunk<State> => {
  const theDate = new Date();
  return async (set) => {
    const state: State = { theDate };
    set(myID, state);
  };
};
