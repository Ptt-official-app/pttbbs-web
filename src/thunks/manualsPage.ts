import type { Thunk } from "use-thunk";
import * as serverUtils from "./serverUtils";

//import * as errors from './errors'

import type {
  BoardSummary,
  ManArticleSummary_i,
  State as State_t,
} from "../types";
import { mergeIdxList } from "./utils";

export const name = "pttbbs-web/ManualsPage";

export interface State extends State_t, BoardSummary {
  theDate?: Date;
  title: string;
  startIdx: string;
  scrollTo?: any;
  list: ManArticleSummary_i[];
  lastPre: string;
  lastNext: string;
  isBusyLoading: boolean;
  isPreEnd: boolean;
  isNextEnd: boolean;
  nextCreateTime: number;
  nextIdx: string;
  scrollToRow: number;
  allManuals: ManArticleSummary_i[];
}

export const defaultState: State = {
  title: "",
  startIdx: "",
  list: [],
  lastPre: "",
  lastNext: "",
  isBusyLoading: false,
  isPreEnd: false,
  isNextEnd: false,
  nextCreateTime: 0,
  nextIdx: "",
  scrollToRow: 0,
  allManuals: [],

  bid: "",
  brdname: "",
  flag: 0,
  type: "",
  class: "",
  nuser: 0,
  moderators: [],
  reason: "",
  read: false,
  total: 0,
  last_post_time: 0,
  stat_attr: 0,
  level_idx: "",
  gid: 0,
  pttbid: 0,
  idx: "",

  errmsg: "",
};

export const init = (
  myID: string,
  bid: string,
  path: string,
  title: string,
  startIdx: string,
): Thunk<State> => {
  const theDate = new Date();
  return async (set) => {
    set(myID, { theDate, title, startIdx });
    set(getBoardSummary(myID, bid, path, false, title, startIdx));
  };
};

const getBoardSummary = (
  myID: string,
  bid: string,
  path: string,
  desc: boolean,
  title: string,
  startIdx: string,
): Thunk<State> => {
  return async (set) => {
    // Get board information
    const { data, errmsg, status } = await serverUtils.getBoardSummary(bid);
    if (status !== 200) {
      set(myID, { errmsg });
      return;
    }
    if (!data) {
      return;
    }
    set(myID, data as Partial<State>);
    set(getManuals(myID, bid, path, title, startIdx, desc, false));
  };
};

export const setData = (myID: string, data: Partial<State>): Thunk<State> => {
  return (set) => {
    set(myID, data);
  };
};

export const getManuals = (
  myID: string,
  bid: string,
  path: string,
  searchTitle: string,
  startIdx: string,
  desc: boolean,
  isExclude: boolean,
): Thunk<State> => {
  return async (set, get) => {
    let me = get(myID);
    if (!me) {
      return;
    }
    let myList = me.list || [];

    //check busy
    let lastPre = me.lastPre || "";
    let lastNext = me.lastNext || "";
    const isBusyLoading = me.isBusyLoading || false;
    let isPreEnd = me.isPreEnd || false;
    let isNextEnd = me.isNextEnd || false;

    searchTitle = searchTitle || "";
    const myLastSearchTitle = me.lastSearchTitle || "";
    if (searchTitle !== myLastSearchTitle) {
      myList = [];
      lastPre = "";
      lastNext = "";
      isPreEnd = false;
      isNextEnd = false;
    }

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

    const { data, errmsg, status } = await serverUtils.loadManuals(
      bid,
      path,
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

    me = get(myID);
    if (!me) {
      set(myID, { errmsg: "no me", isBusyLoading: false });
      return;
    }

    const dataList = data.list;
    dataList.map((each) => (each.url = `/board/${bid}/manual/${each.aid}`));

    const defaultStartNum = desc ? me.total : 1;
    const startNumIdx = data.start_num_idx || defaultStartNum;

    const newList = mergeIdxList(
      myList,
      dataList,
      desc,
      startNumIdx,
      isExclude,
    );

    const toUpdate: Partial<State> = {
      lastSearchTitle: searchTitle,
      list: newList,
      nextCreateTime: data.next_create_time,
      isBusyLoading: false,
      lastPre: lastPre,
      lastNext: lastNext,
      isPreEnd: isPreEnd,
      isNextEnd: isNextEnd,
    };
    if (!desc) {
      toUpdate.nextIdx = data.next_idx;
      toUpdate.lastNext = startIdx;
      if (!data.next_idx) {
        toUpdate.isNextEnd = true;
        isNextEnd = true;
      }
      if (!startIdx) {
        toUpdate.isPreEnd = true;
        isPreEnd = true;
      }
    } else {
      toUpdate.scrollToRow = dataList.length - 1; //only dataList.length - 1 new items.
      toUpdate.lastPre = startIdx;
      toUpdate.isBusyLoading = false;
      if (!data.next_idx) {
        toUpdate.isPreEnd = true;
        isPreEnd = true;
      }
      if (!startIdx) {
        toUpdate.isNextEnd = true;
        isNextEnd = true;
      }
    }

    const allManuals = newList;
    toUpdate.allManuals = allManuals;

    set(myID, toUpdate);
  };
};
