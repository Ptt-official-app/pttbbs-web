import type { Thunk } from "use-thunk";
import type {
  ArticleSummary_i,
  BoardSummary,
  State as State_t,
} from "../types";
import * as serverUtils from "./serverUtils";
import { mergeIdxList } from "./utils";

export const name = "pttbbs-web/ArticlesPage";

export interface State extends State_t, BoardSummary {
  theDate?: Date;
  title: string;
  searchTitle: string;
  startIdx: string;
  scrollTo?: any;
  list: ArticleSummary_i[];
  allArticles: ArticleSummary_i[];
  bottomArticles: ArticleSummary_i[];
  nextIdx: string;
  isPreEnd: boolean;
  isNextEnd: boolean;
  lastSearchTitle: string;
  scrollToRow?: number;

  isBusyLoading: boolean;
  isBusyLoadingBoardSummary: boolean;
  isBusyLoadingBottom: boolean;

  isInit: boolean;
}

export const defaultState: State = {
  bid: "",
  brdname: "",
  title: "",
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
  url: undefined,
  pttbid: 0,
  idx: "",

  theDate: undefined,
  searchTitle: "",
  startIdx: "",
  scrollTo: undefined,
  list: [],
  allArticles: [],
  bottomArticles: [],
  nextIdx: "",
  isPreEnd: false,
  isNextEnd: false,
  lastSearchTitle: "",
  scrollToRow: undefined,

  isBusyLoading: false,
  isBusyLoadingBoardSummary: false,
  isBusyLoadingBottom: false,

  isInit: false,

  errmsg: "",
};

export const init = (
  myID: string,
  bid: string,
  title: string,
  startIdx: string,
): Thunk<State> => {
  return async (set) => {
    const theDate = new Date();
    set(myID, { theDate, title, startIdx, isInit: true });
    const isDesc = !startIdx;
    set(getBoardSummary(myID, bid, isDesc, title, startIdx));
  };
};

export const getBoardSummary = (
  myID: string,
  bid: string,
  desc: boolean,
  title: string,
  startIdx: string,
): Thunk<State> => {
  return async (set) => {
    // Get board information
    set(myID, { isBusyLoadingBoardSummary: true });
    const { data, errmsg, status } = await serverUtils.getBoardSummary(bid);
    set(myID, { errmsg, isBusyLoadingBoardSummary: false });
    if (status !== 200) {
      return;
    }
    if (!data) {
      return;
    }
    set(myID, data as Partial<State>);
    set(getBottomArticles(myID, bid));
    set(getArticles(myID, bid, title, startIdx, desc, false));
  };
};

export const setData = (myID: string, data: Partial<State>): Thunk<State> => {
  return async (set) => {
    set(myID, data);
  };
};

const getBottomArticles = (myID: string, bid: string): Thunk<State> => {
  return async (set, get) => {
    set(myID, { isBusyLoadingBottom: true });
    const { data, errmsg, status } = await serverUtils.loadBottomArticles(bid);
    set(myID, { isBusyLoadingBottom: false });
    if (status !== 200) {
      set(myID, { errmsg });
      return;
    }
    if (!data) {
      return;
    }

    const bottomArticles = data.list;
    // @ts-expect-error because special treat to num-idx
    bottomArticles.map((each) => (each.numIdx = "★"));
    bottomArticles.map(
      (each) => (each.url = `/board/${bid}/article/${each.aid}`),
    );

    const me = get(myID);
    if (!me) {
      return;
    }
    const regularArticles = me.list;
    const isNextEnd = me.isNextEnd;
    const lastSearchTitle = me.lastSearchTitle;

    const allArticles =
      isNextEnd && !lastSearchTitle
        ? regularArticles.concat(bottomArticles)
        : regularArticles;

    const toUpdate: Partial<State> = { bottomArticles, allArticles };
    // If regular article list is already loaded, add list length to scroll position
    if (typeof me.scrollToRow !== "undefined") {
      toUpdate.scrollToRow = me.scrollToRow + bottomArticles.length;
    }

    set(myID, toUpdate);
  };
};

export const getArticles = (
  myID: string,
  bid: string,
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

    let {
      lastPre,
      lastNext,
      isBusyLoading,
      isPreEnd,
      isNextEnd,
      lastSearchTitle: myLastSearchTitle,
      list: myList,
    } = me;

    /*
    console.info(
      "articlesPage: getArticles: start: isBusyLoading:",
      isBusyLoading,
      "desc:",
      desc,
      "lastPre:",
      lastPre,
    );
    */

    //check busy
    searchTitle = searchTitle || "";
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

    console.info("articlesPage: getArticles: to set isBusyLoading");
    set(myID, { isBusyLoading: true });

    const { data, errmsg, status } = await serverUtils.loadArticles(
      bid,
      searchTitle,
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

    me = get(myID);
    if (!me) {
      return;
    }
    const bottomArticles = me.bottomArticles;

    const dataList = data.list;
    dataList.map((each) => (each.url = `/board/${bid}/article/${each.aid}`));

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

    const allArticles =
      isNextEnd && !searchTitle ? newList.concat(bottomArticles) : newList;
    toUpdate.allArticles = allArticles;

    set(myID, toUpdate);
  };
};
