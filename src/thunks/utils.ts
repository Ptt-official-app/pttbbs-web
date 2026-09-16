import moment from "moment-timezone";
import { NBRD_BOARD, NBRD_FAV, NBRD_FOLDER, NBRD_LINE } from "../constants";

import type { BoardSummary, IdxData } from "../types";

export const goUserHome = (userID: string) => {
  window.location.href = `/user/${userID}`;
};

export const goHome = () => {
  window.location.href = "/";
};

export const mergeList = (
  origList: any[],
  newList: any[],
  desc: boolean,
  isExclude: boolean = false,
) => {
  if (isExclude) {
    //desc not include start-item
    newList = newList.slice(1);
  }

  if (newList.length === 0) {
    return origList;
  }

  if (desc) {
    newList = newList.reverse();
    return newList.concat(origList);
  } else {
    return origList.concat(newList);
  }
};

export const mergeIdxList = <D extends IdxData>(
  origList: D[],
  newList: D[],
  desc: boolean,
  startNumIdx: number,
  isExclude: boolean = false,
) => {
  if (isExclude) {
    //desc not include start-item
    newList = newList.slice(1);
  }

  if (newList.length === 0) {
    return origList;
  }

  if (desc) {
    if (startNumIdx !== null) {
      const newStartNumIdx = origList.length
        ? origList[0].numIdx - 1
        : startNumIdx;
      newList.map((each, idx) => (each.numIdx = newStartNumIdx - idx));
    }

    newList = newList.reverse();

    return newList.concat(origList);
  } else {
    if (startNumIdx !== null) {
      const newStartNumIdx = origList.length
        ? origList[origList.length - 1].numIdx + 1
        : startNumIdx;
      newList.map((each, idx) => (each.numIdx = newStartNumIdx + idx));
    }

    return origList.concat(newList);
  }
};

export const santizeBoard = <B extends BoardSummary>(board?: B | null): B => {
  if (!board) {
    // @ts-expect-error because simplified BoardSummary for invalid board
    return { title: "<目前無法看到此板>" };
  }

  board.url = getBoardURL(board);

  if (board.type === "Σ") {
    if (board.gid === 1) {
      board.brdname = "";
      board.class = "";
    }
    board.nuser = " ";
    return board;
  }

  switch (board.stat_attr) {
    case NBRD_LINE:
      board.brdname = "------------";
      board.title = "--------------------------------------------------";
      board.nuser = "--";
      board.moderators = ["-----------"];
      board.type = "--";
      break;
    case NBRD_FOLDER:
      board.type = "□";
      board.brdname = "MyFavFolder";
      board.nuser = "-";
      break;
    default:
      break;
  }

  return board;
};

export const getBoardURL = (board: BoardSummary) => {
  if (board.type === "Σ") {
    return `/cls/${board.pttbid}`;
  }

  switch (board.stat_attr) {
    case NBRD_LINE:
      return "";
    case NBRD_FAV:
      return `/board/${board.bid}/articles`;
    case NBRD_BOARD:
      return `/board/${board.bid}/articles`;
    case NBRD_FOLDER:
      return `${window.location.pathname}?level=${board.level_idx}`;
    default:
      return "";
  }
};

export const dateMdHM = (milliTS: number) => {
  return moment(milliTS).tz("Asia/Taipei").format("MM/DD hh:mm");
};

export const dateYYYYMdHMS = (milliTS: number) => {
  return moment(milliTS).tz("Asia/Taipei").format("YYYY/MM/DD hh:mm:ss");
};
