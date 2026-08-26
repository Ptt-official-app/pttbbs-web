import type { Thunk } from "use-thunk";
import type { EditLine, State as State_t } from "../types";
import * as serverUtils from "./serverUtils";

export const name = "pttbbs-web/NewArticlePage";

const _DEFAULT_POST_TYPES = [
  "問題",
  "建議",
  "討論",
  "心得",
  "閒聊",
  "請益",
  "情報",
  "公告",
];

export interface State extends State_t {
  theDate?: Date;
  bid: string;
  scrollTo?: any;
  content: EditLine[];
  brdname: string;
  post_type: string[];
  theClass: string;
}

export const defaultState: State = {
  bid: "",
  content: [],
  brdname: "",
  post_type: [],
  theClass: "",

  errmsg: "",
};

export const init = (myID: string, bid: string): Thunk<State> => {
  const theDate = new Date();
  return async (set) => {
    set(myID, { theDate });
    set(getBoardSummary(myID, bid));
  };
};

const getBoardSummary = (myID: string, bid: string): Thunk<State> => {
  return async (set) => {
    // Get board information
    const fields = ["brdname", "post_type"];
    const { data, errmsg, status } = await serverUtils.getBoardDetail(
      bid,
      fields,
    );
    if (status !== 200) {
      set(myID, { errmsg });
      return;
    }
    if (!data) {
      return;
    }

    data.post_type = data.post_type || _DEFAULT_POST_TYPES;
    const toUpdate: Partial<State> = Object.assign({}, data);
    const postTypes = data.post_type || [];
    if (postTypes.length > 0) {
      toUpdate.theClass = postTypes[0];
    } else {
      toUpdate.theClass = "";
    }

    set(myID, toUpdate);
  };
};

export const updateContent = (
  myID: string,
  content: EditLine[],
): Thunk<State> => {
  return (set) => {
    set(myID, { content });
  };
};

export const setData = (myID: string, data: Partial<State>): Thunk<State> => {
  return (set) => {
    return set(myID, data);
  };
};

export const submit = (
  myID: string,
  bid: string,
  theClass: string,
  title: string,
  content: EditLine[],
): Thunk<State> => {
  return async (set) => {
    const uploadContent = content.map((each) => each.runes);
    const { errmsg, status } = await serverUtils.createArticle(
      bid,
      theClass,
      title,
      uploadContent,
    );
    if (status !== 200) {
      set(myID, { errmsg });
      return;
    }

    window.location.href = "/board/" + bid + "/articles";
  };
};
