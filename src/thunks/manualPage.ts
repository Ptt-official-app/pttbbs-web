import type { Thunk } from "use-thunk";
import * as serverUtils from "./serverUtils";
//import * as errors from './errors'

import type { Content, Line, State as State_t } from "../types";

export const name = "pttbbs-web/ManualPage";

export interface State extends State_t {
  theDate?: Date;
  scrollTo?: any;
  isPreEnd: boolean;
  comments: Line[];
  scrollToRow?: number;
  content: Line[];
}

export const defaultState: State = {
  isPreEnd: true,
  comments: [],
  content: [],
  errmsg: "",
};

export const init = (
  myID: string,
  bid: string,
  path: string,
  startIdx: string,
): Thunk<State> => {
  return async (set) => {
    const theDate = new Date();
    set(myID, { theDate });
    set(getManualContent(myID, bid, path, startIdx));
  };
};

export const setData = (myID: string, data: Partial<State>): Thunk<State> => {
  return async (set) => {
    set(myID, data);
  };
};

//getManualContent
//
//1. 拿到 content.
//2. parse content.
//3. contentComments.
export const getManualContent = (
  myID: string,
  bid: string,
  path: string,
  startIdx: string,
): Thunk<State> => {
  return async (set, get) => {
    const { data, errmsg, status } = await serverUtils.getManual(
      bid,
      path,
      startIdx,
    );

    console.log(
      "getManualContent: data:",
      data,
      "status:",
      status,
      "myID:",
      myID,
    );

    if (status !== 200) {
      set(myID, { errmsg });
      return;
    }
    if (!data) {
      return;
    }

    // @ts-expect-error ManArticle is Partial<State>
    set(myID, data);

    const content = data.content;
    const lines = parseLines(content);

    const me = get(myID);
    if (!me) {
      return;
    }

    const isPreEnd = me.isPreEnd || false;
    const comments = me.comments || [];
    const contentComments = isPreEnd ? lines.concat(comments) : comments;

    set(myID, { content: lines, contentComments });
  };
};

const parseLines = (content: Content): Line[] => {
  return content.map((runes) => ({ runes }));
};
