import type { Thunk } from "use-thunk";
import type { BoardSummary_i, State as State_t } from "../types";
import * as serverUtils from "./serverUtils";
import { mergeList, santizeBoard } from "./utils";

export const name = "pttbbs-web/UserFavoritesPage";

export interface State extends State_t {
  theDate?: Date;
  level: string;
  startIdx: string;
  scrollTo?: any;
  scrollToRow?: number;
  lastPre: string;
  lastNext: string;
  isBusyLoading: boolean;
  list: BoardSummary_i[];
  nextIdx: string;
  isPreEnd: boolean;
  isNextEnd: boolean;
}

export const defaultState: State = {
  level: "",
  startIdx: "",
  lastPre: "",
  lastNext: "",
  isBusyLoading: false,
  list: [],
  nextIdx: "",
  isPreEnd: false,
  isNextEnd: false,

  errmsg: "",
};

export const init = (
  myID: string,
  userID: string,
  level: string,
  startIdx: string,
): Thunk<State> => {
  return async (set) => {
    const theDate = new Date();
    set(myID, { theDate, level, startIdx });
    set(getBoards(myID, userID, level, startIdx, false, false));
  };
};

export const setData = (myID: string, data: Partial<State>): Thunk<State> => {
  return async (set) => {
    set(myID, data);
  };
};

export const getBoards = (
  myID: string,
  userID: string,
  level: string,
  startIdx: string,
  desc: boolean,
  isExclude: boolean,
): Thunk<State> => {
  return async (set, get) => {
    const me = get(myID);
    if (!me) {
      return;
    }
    const myList = me.list || [];

    //check busy
    const lastPre = me.lastPre || "";
    const lastNext = me.lastNext || "";
    const isBusyLoading = me.isBusyLoading || false;
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

    const { data, errmsg, status } = await serverUtils.loadFavoriteBoards(
      userID,
      level,
      startIdx,
      desc,
    );
    if (status !== 200) {
      set(myID, { errmsg, isBusyLoading: false });
      return;
    }
    if (!data) {
      set(myID, { errmsg: "no data", isBusyLoading: false });
      return;
    }

    let dataList = data.list || [];
    dataList = dataList.map((each) => santizeBoard(each));

    const newList = mergeList(myList, dataList, desc, isExclude);

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

    console.log("doUserFavoritesPage.GetBoards: to update:", toUpdate);
    set(myID, toUpdate);
  };
};
