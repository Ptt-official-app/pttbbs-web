import type { Thunk } from "use-thunk";
import type { BoardSummary_i, State as State_t } from "../types";
import * as serverUtils from "./serverUtils";
import { mergeIdxList, santizeBoard } from "./utils";

export const name = "pttbbs-web/HotBoardsPage";

export interface State extends State_t {
  theDate?: Date;
  list: BoardSummary_i[];
  isBusyLoading: boolean;
}

export const defaultState: State = {
  list: [],
  isBusyLoading: false,

  errmsg: "",
};

export const init = (myID: string): Thunk<State> => {
  const theDate = new Date();
  return async (set) => {
    set(myID, { theDate });
    set(getData(myID));
  };
};

const getData = (myID: string): Thunk<State> => {
  return async (set) => {
    set(myID, { isBusyLoading: true });
    const { data, errmsg, status } = await serverUtils.loadPopularBoards();

    if (status !== 200) {
      set(myID, { errmsg, isBusyLoading: false });
      return;
    }
    if (!data) {
      set(myID, { errmsg: "no data", isBusyLoading: false });
      return;
    }

    let dataList: BoardSummary_i[] = data.list || [];
    dataList = dataList.map((each) => santizeBoard(each));

    const newList = mergeIdxList([], dataList, false, 1);

    const toUpdate: Partial<State> = {
      list: newList,
      isBusyLoading: false,
    };

    set(myID, toUpdate);
  };
};
