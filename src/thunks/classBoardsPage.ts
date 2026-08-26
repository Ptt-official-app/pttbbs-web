import type { Thunk } from "use-thunk";
import type { BoardSummary_i, State as State_t } from "../types";
import * as serverUtils from "./serverUtils";
import { mergeList, santizeBoard } from "./utils";

export const name = "pttbbs-web/ClassBoardsPage";

export interface State extends State_t {
  theDate?: Date;
  clsID: number;
  startIdx: string;
  scrollTo?: any;
  list: BoardSummary_i[];
  lastPre: string;
  lastNext: string;
  isBusyLoading: boolean;
  nextIdx: string;
  scrollToRow: number;
  isPreEnd: boolean;
  isNextEnd: boolean;
}

export const defaultState: State = {
  clsID: 0,
  startIdx: "",
  list: [],
  lastPre: "",
  lastNext: "",
  isBusyLoading: false,
  nextIdx: "",
  scrollToRow: 0,
  isPreEnd: false,
  isNextEnd: false,

  errmsg: "",
};

export const init = (
  myID: string,
  clsID: number,
  startIdx: string,
): Thunk<State> => {
  const theDate = new Date();
  return async (set) => {
    const toUpdate: Partial<State> = {
      theDate,
      clsID,
      startIdx,
      scrollTo: null,
      list: [],
      lastPre: "",
      lastNext: "",
      isBusyLoading: false,
      nextIdx: "",
      scrollToRow: 0,
      isPreEnd: false,
      isNextEnd: false,
    };
    set(myID, toUpdate);
    set(getBoards(myID, clsID, startIdx, false, false));
  };
};

export const setData = (myID: string, data: Partial<State>): Thunk<State> => {
  return async (set) => {
    set(myID, data);
  };
};

export const getBoards = (
  myID: string,
  clsID: number,
  startIdx: string,
  desc: boolean,
  isExclude: boolean,
): Thunk<State> => {
  clsID = clsID || 1; //clsID default by 1. (no clsID == 0)
  return async (set, get) => {
    const me = get(myID);
    if (!me) {
      return;
    }
    const myList = me.list;

    //check busy
    const lastPre = me.lastPre;
    const lastNext = me.lastNext;
    const isBusyLoading = me.isBusyLoading;
    if (isBusyLoading) {
      return;
    }

    if (desc) {
      if (lastPre === startIdx) {
        return;
      }
    } else {
      if (lastNext === startIdx) {
        return;
      }
    }

    set(myID, { isBusyLoading: true });

    // api
    const { data, errmsg, status } = await serverUtils.loadClassBoards(
      clsID,
      startIdx,
      desc,
    );

    if (status !== 200) {
      set(myID, { errmsg, isBusyLoading: false });
      return;
    }
    if (!data) {
      return;
    }

    // integrate list
    let dataList = data.list;
    dataList = dataList.map((each) => santizeBoard(each));

    const newList = mergeList(myList, dataList, desc, isExclude);

    // to update
    const toUpdate: Partial<State> = {
      list: newList,
    };
    if (!desc) {
      toUpdate.nextIdx = data.next_idx;
      toUpdate.lastNext = startIdx;
      toUpdate.isBusyLoading = false;
      if (!data.next_idx) {
        toUpdate.isNextEnd = true;
      }
    } else {
      toUpdate.scrollToRow = dataList.length - 1; //only dataList.length - 1 new items.
      toUpdate.lastPre = startIdx;
      toUpdate.isBusyLoading = false;
      if (!data.next_idx) {
        toUpdate.isPreEnd = true;
      }
    }

    set(myID, toUpdate);
  };
};
