import { type Thunk, update } from "use-thunk";
import * as serverUtils from "./serverUtils";

//import * as errors from './errors'

import {
  COLOR_BACKGROUND_BLACK,
  COLOR_BACKGROUND_BLUE,
  COLOR_BACKGROUND_WHITE,
  COLOR_FOREGROUND_BLACK,
  COLOR_FOREGROUND_BLUE,
  COLOR_FOREGROUND_GREEN,
  COLOR_FOREGROUND_RED,
  COLOR_FOREGROUND_WHITE,
  COLOR_FOREGROUND_YELLOW,
  COMMENT_TYPE_BOO,
  COMMENT_TYPE_COMMENT,
  COMMENT_TYPE_DELETED,
  COMMENT_TYPE_EDIT,
  COMMENT_TYPE_FORWARD,
  COMMENT_TYPE_RECOMMEND,
  COMMENT_TYPE_REPLY,
} from "../constants";

import type {
  ArticleDetail,
  Comment,
  Content,
  Line,
  Rune_t,
  Runes_t,
  State as State_t,
} from "../types";
import { dateMdHM, dateYYYYMdHMS, mergeList } from "./utils";

export const name = "pttbbs-web/ArticlePage";

export interface State extends State_t, ArticleDetail {
  theDate?: Date;
  startIdx: string;
  scrollTo?: any;
  nextIdx: string;
  isPreEnd: boolean;
  isNextEnd: boolean;
  lastPre: string | null;
  lastNext: string | null;
  scrollToRow: number;
  contentLines: Line[];
  comments: Line[];
  contentComments: Line[];

  isBusyLoading: boolean;
  isInit: boolean;
}

export const defaultState: State = {
  bid: "",
  aid: "",
  deleted: false,
  filename: "",
  create_time: 0,
  modified: 0,
  recommend: 0,
  n_comments: 0,
  owner: "",
  date: "",
  title: "",
  money: 0,
  type: "",
  class: "",
  mode: 0,
  url: "",
  read: false,
  idx: "",
  rank: 0,
  subject_type: 0,
  brdname: "",
  content: [],
  prefix: [],
  nickname: "",
  ip: "",
  host: "",
  bbs: "",

  theDate: undefined,
  startIdx: "",
  scrollTo: undefined,
  nextIdx: "",
  isPreEnd: true,
  isNextEnd: false,
  lastPre: null,
  lastNext: null,
  scrollToRow: 0,
  contentLines: [],
  comments: [],
  contentComments: [],

  isBusyLoading: false,
  isInit: false,

  errmsg: "",
};

const _TYPE_RUNE_MAP: { [key: number]: Rune_t } = {
  [COMMENT_TYPE_RECOMMEND]: {
    text: "推",
    color0: {
      foreground: COLOR_FOREGROUND_WHITE,
      background: COLOR_BACKGROUND_BLACK,
      highlight: true,
    },
  },
  [COMMENT_TYPE_BOO]: {
    text: "噓",
    color0: {
      foreground: COLOR_FOREGROUND_RED,
      background: COLOR_BACKGROUND_BLACK,
      highlight: true,
    },
  },
  [COMMENT_TYPE_COMMENT]: {
    text: "→ ",
    color0: {
      foreground: COLOR_FOREGROUND_RED,
      background: COLOR_BACKGROUND_BLACK,
      highlight: false,
    },
  },
};

export const init = (
  myID: string,
  bid: string,
  aid: string,
  startIdx: string,
): Thunk<State> => {
  const theDate = new Date();
  return async (set) => {
    set(myID, { theDate, isInit: true });
    set(getArticleContent(myID, bid, aid, startIdx));
  };
};

export const setData = (myID: string, data: any): Thunk<State> => {
  return async (set) => {
    set(myID, data);
  };
};

export const addRecommend = (
  myID: string,
  bid: string,
  aid: string,
  recommendType: string,
  recommend: Content,
): Thunk<State> => {
  return async (set) => {
    const { data, errmsg, status } = await serverUtils.addRecommend(
      bid,
      aid,
      recommendType,
      recommend,
    );

    console.log(
      "articlePage.AddRecommend: after ServerUtils: bid:",
      bid,
      "aid:",
      aid,
      "recommendType:",
      recommendType,
      "recommend:",
      recommend,
      "data:",
      data,
      "errmsg:",
      errmsg,
      "status:",
      status,
    );
    if (status !== 200) {
      set(myID, { errmsg });
      return;
    }

    set(getComments(myID, bid, aid, "", true, false));
  };
};

export const rank = (
  myID: string,
  bid: string,
  aid: string,
  rank: number,
): Thunk<State> => {
  return async (set) => {
    const { data, errmsg, status } = await serverUtils.rank(bid, aid, rank);
    if (status !== 200) {
      set(myID, { errmsg });
      return;
    }
    if (!data) {
      return;
    }

    set(myID, data);
  };
};

//getComments
//
//1. 檢查 busy
//2. 拿到 comments
//3. parse comments.
//4. merge list
//5. 整合 to-update
export const getComments = (
  myID: string,
  bid: string,
  aid: string,
  startIdx: string,
  desc: boolean,
  isExclude: boolean,
): Thunk<State> => {
  return async (set, get) => {
    let me = get(myID);
    if (!me) {
      return;
    }
    const myComments = me.comments || [];

    //check busy
    const lastPre = me.lastPre;
    const lastNext = me.lastNext;
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

    set(update(myID, { isBusyLoading: true }));

    const { data, errmsg, status } = await serverUtils.getComments(
      bid,
      aid,
      startIdx,
      desc,
    );

    if (status !== 200) {
      set(update(myID, { isBusyLoading: false, errmsg }));
      return;
    }
    if (!data) {
      return;
    }

    const dataComments = parseComments(data.list);

    let newComments: Line[] = [];
    if (isExclude) {
      newComments = mergeList(myComments, dataComments, desc, isExclude);
    } else {
      newComments = desc ? dataComments.reverse() : dataComments;
    }

    //5. 整合 toUpdate
    me = get(myID);
    if (!me) {
      return;
    }
    let isPreEnd = me.isPreEnd || false;
    const contentLines = me.contentLines;

    const toUpdate: Partial<State> = {
      comments: newComments,
      isBusyLoading: false,
    };
    if (!desc) {
      toUpdate.nextIdx = data.next_idx;
      toUpdate.lastNext = startIdx;
      toUpdate.isBusyLoading = false;
      if (!data.next_idx) {
        toUpdate.isNextEnd = true;
      } else {
        toUpdate.isNextEnd = false;
      }

      if (!startIdx) {
        toUpdate.lastPre = null;
        toUpdate.isPreEnd = true;
        isPreEnd = true;
      }
    } else {
      toUpdate.lastPre = startIdx;
      toUpdate.isBusyLoading = false;
      if (!data.next_idx) {
        toUpdate.isPreEnd = true;
        isPreEnd = true;
      } else {
        toUpdate.isPreEnd = false;
        isPreEnd = false;
      }

      if (!startIdx) {
        toUpdate.lastNext = null;
        toUpdate.isNextEnd = true;
      }

      if (!isPreEnd) {
        toUpdate.scrollToRow = dataComments.length - 1;
      } else if (lastPre) {
        toUpdate.scrollToRow = contentLines.length + dataComments.length - 1;
      }
    }
    const contentComments = isPreEnd
      ? contentLines.concat(newComments)
      : newComments;
    toUpdate.contentComments = contentComments;

    set(myID, toUpdate);
  };
};

//getArticleContent
//
//1. 拿到 content.
//2. parse content.
//3. contentComments.
export const getArticleContent = (
  myID: string,
  bid: string,
  aid: string,
  startIdx: string,
): Thunk<State> => {
  console.log("articlePage.GetArticleContent: start");
  return async (set, get) => {
    console.log("articlePage.GetArticleContent: to api");

    set(myID, { isBusyLoading: true });
    const { data, errmsg, status } = await serverUtils.getArticle(bid, aid);
    set(myID, { isBusyLoading: false });

    console.log(
      "articlePage.GetArticleContent: after api: data:",
      data,
      "errmsg:",
      errmsg,
      "status:",
      status,
    );

    if (status !== 200) {
      set(myID, { errmsg });
      return;
    }
    if (!data) {
      return;
    }

    set(myID, data);

    const bbsLines = parseBBSLines(data.bbs, data.ip, data.host, bid, aid);
    let content: Content = data.content || [];
    let prefix: Content = data.prefix || [];
    prefix = parseHeader(prefix);
    content = prefix.concat(content);
    content = content.concat(bbsLines);
    const lines = parseLines(content || []);
    if (prefix.length >= 3) {
      // valid prefix
      lines[0].background = COLOR_BACKGROUND_BLUE;
      lines[1].background = COLOR_BACKGROUND_BLUE;
      lines[2].background = COLOR_BACKGROUND_BLUE;
    }

    const me = get(myID);
    if (!me) {
      return;
    }
    const isPreEnd = me.isPreEnd || false;
    const comments = me.comments || [];
    const contentComments = isPreEnd ? lines.concat(comments) : comments;

    set(myID, { contentLines: lines, contentComments });

    set(getComments(myID, bid, aid, startIdx, false, false));
  };
};

const parseHeader = (header: Content) => {
  if (header.length < 3) {
    return header;
  }

  const [authorBoard, title, theDateTime] = [header[0], header[1], header[2]];

  const [author, board] = authorBoard[0].text.split(" 看板: ");

  //author
  const authorPromptRune: Rune_t = {
    text: " 作者 ",
    color0: {
      foreground: COLOR_FOREGROUND_BLUE,
      background: COLOR_BACKGROUND_WHITE,
    },
  };
  const authorRune = {
    text: " " + author.slice(4),
    color0: {
      foreground: COLOR_FOREGROUND_WHITE,
      background: COLOR_BACKGROUND_BLUE,
    },
    extend: true,
  };

  //board
  const boardPromptRune = {
    text: " 看板 ",
    color0: {
      foreground: COLOR_FOREGROUND_BLUE,
      background: COLOR_BACKGROUND_WHITE,
    },
    pullright: true,
  };
  const boardRune = {
    text: " " + board + " ",
    color0: {
      foreground: COLOR_FOREGROUND_WHITE,
      background: COLOR_BACKGROUND_BLUE,
    },
    pullright: true,
  };

  //title
  const titlePromptRune = {
    text: " 標題 ",
    color0: {
      foreground: COLOR_FOREGROUND_BLUE,
      background: COLOR_BACKGROUND_WHITE,
    },
  };
  const titleRune = {
    text: " " + title[0].text.slice(4),
    color0: {
      foreground: COLOR_FOREGROUND_WHITE,
      background: COLOR_BACKGROUND_BLUE,
    },
  };

  //datetime
  const datetimePromptRune = {
    text: " 時間 ",
    color0: {
      foreground: COLOR_FOREGROUND_BLUE,
      background: COLOR_BACKGROUND_WHITE,
    },
  };
  const datetimeRune = {
    text: " " + theDateTime[0].text.slice(4),
    color0: {
      foreground: COLOR_FOREGROUND_WHITE,
      background: COLOR_BACKGROUND_BLUE,
    },
  };

  //emptyLine
  const emptyLine = {
    text: "",
    color0: {
      foreground: COLOR_FOREGROUND_WHITE,
      background: COLOR_BACKGROUND_BLACK,
    },
  };

  header = [
    [authorPromptRune, authorRune, boardRune, boardPromptRune],
    [titlePromptRune, titleRune],
    [datetimePromptRune, datetimeRune],
    [emptyLine],
  ];

  return header;
};

const parseLines = (lines: Content): Line[] => {
  return lines.map((runes) => ({ runes }));
};

const parseBBSLines = (
  bbs: string,
  ip: string,
  host: string,
  bid: string,
  aid: string,
): Content => {
  const location = window?.location || {};
  const emptyLine = {
    text: "",
    color0: {
      foreground: COLOR_FOREGROUND_WHITE,
      background: COLOR_BACKGROUND_BLACK,
    },
  };
  const hrLine = {
    text: "--",
    color0: {
      foreground: COLOR_FOREGROUND_WHITE,
      background: COLOR_BACKGROUND_BLACK,
    },
  };
  const bbsLine = {
    text: `※ 發信站: ${bbs}, 來自: ${ip} (${host})`,
    color0: {
      foreground: COLOR_FOREGROUND_GREEN,
      background: COLOR_BACKGROUND_BLACK,
    },
  };
  const urlLine = {
    text: `※ 文章網址: ${location.protocol}//${location.host}/board/${bid}/article/${aid}`,
    color0: {
      foreground: COLOR_FOREGROUND_GREEN,
      background: COLOR_BACKGROUND_BLACK,
    },
  };

  return [[emptyLine], [hrLine], [bbsLine], [urlLine]];
};

const parseComments = (comments: Comment[]): Line[] => {
  const commentList: Line[][] = comments.map((each) => {
    const { type: theType } = each;

    switch (theType) {
      case COMMENT_TYPE_REPLY:
        return parseReply(each);
      case COMMENT_TYPE_FORWARD:
        return parseForwardComment(each);
      case COMMENT_TYPE_EDIT:
        return parseEditedComment(each);
      case COMMENT_TYPE_DELETED:
        return parseDeletedComment(each);
      default:
        return parseRegularComment(each);
    }
  });

  return commentList.flat();
};

const parseRegularComment = (comment: Comment): Line[] => {
  const { type: theType, owner, create_time: createTime } = comment;
  let runes: Runes_t = [];
  //comment-type
  const typeRune = _TYPE_RUNE_MAP[theType];
  if (typeRune) {
    runes.push(typeRune);
  }

  //comment-owner
  const ownerRune: Rune_t = {
    text: " " + owner,
    color0: { foreground: COLOR_FOREGROUND_YELLOW, highlight: true },
  };
  runes.push(ownerRune);

  //comment-colon
  const colonRune = {
    text: ": ",
    color0: { foreground: COLOR_FOREGROUND_YELLOW },
  };
  runes.push(colonRune);

  //comment-content
  const contentRunes =
    comment.content && comment.content.length > 0 ? comment.content[0] : [];
  if (contentRunes.length > 0) {
    contentRunes[0].color0.foreground = COLOR_FOREGROUND_YELLOW;
    delete contentRunes[0].color1;
    runes = runes.concat(contentRunes);
  }

  //comment-datetime
  const datetimeStr = dateMdHM(createTime * 1000); // createTime is TS
  const datetimeRune: Rune_t = {
    text: datetimeStr,
    pullright: true,
    color0: {},
  };
  runes.push(datetimeRune);
  return [{ runes, idx: comment.idx }];
};

const parseReply = (comment: Comment): Line[] => {
  // Reply: directly return content.
  const emptyLine: Line[] = [
    {
      runes: [
        {
          text: "",
          color0: {
            foreground: COLOR_FOREGROUND_WHITE,
            background: COLOR_BACKGROUND_BLACK,
          },
        },
      ],
    },
  ];

  return emptyLine.concat(
    comment.content.map((eachRunes): Line => {
      return { runes: eachRunes, idx: comment.idx };
    }),
  );
};

const parseForwardComment = (comment: Comment): Line[] => {
  const { owner, create_time: createTime } = comment;
  const boardName = comment.content[0][0].text || "unknownBoard";
  const runes = [];

  const content =
    boardName === "某隱形看板"
      ? ": 轉錄至某隱形看板"
      : `: 轉錄至看版 ${boardName}`;

  runes.push({
    text: `※ `,
    color0: {
      foreground: COLOR_FOREGROUND_GREEN,
      background: COLOR_BACKGROUND_BLACK,
    },
  });
  runes.push({
    text: `${owner}`,
    color0: {
      foreground: COLOR_FOREGROUND_GREEN,
      highlight: true,
      background: COLOR_BACKGROUND_BLACK,
    },
  });
  runes.push({
    text: content,
    color0: {
      foreground: COLOR_FOREGROUND_GREEN,
      background: COLOR_BACKGROUND_BLACK,
    },
  });
  const datetimeStr = dateMdHM(createTime * 1000); //createTime is TS
  const datetimeRune = {
    text: datetimeStr,
    pullright: true,
    color0: {},
  };
  runes.push(datetimeRune);

  return [{ runes, idx: comment.idx }];
};

const parseDeletedComment = (comment: Comment): Line[] => {
  const { owner: deleter } = comment;
  // TODO confirm format
  const runes = [
    {
      text: `${deleter} 刪除某人的貼文`,
      color0: {
        foreground: COLOR_FOREGROUND_BLACK,
        highlight: true,
        background: COLOR_BACKGROUND_BLACK,
      },
    },
  ];
  return [{ runes, idx: comment.idx }];
};

const parseEditedComment = (comment: Comment): Line[] => {
  const {
    owner: editor = "editor",
    ip,
    host = "unknown",
    create_time: editTime,
  } = comment;
  // TODO confirm format
  const editTimeStr = dateYYYYMdHMS(editTime * 1000); //editTime is TS
  const runes = [
    {
      text: `※ 編輯: ${editor}(${ip} ${host}), ${editTimeStr}`,
      color0: {
        foreground: COLOR_FOREGROUND_GREEN,
        background: COLOR_BACKGROUND_BLACK,
      },
    },
  ];
  return [{ runes, idx: comment.idx }];
};
