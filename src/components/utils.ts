import config from "config";
import moment from "moment-timezone";
import type { Err } from "../types";

export const tsToDateTimeStr = (ts: number) => {
  const datetimeStr = moment.unix(ts).format("YYYY-MM-DD HH:mm:ss");
  return datetimeStr;
};

//board-list: 特殊記號+已讀+看板+類別+種類+中文敘述+人氣+板主
export const CHAR_WIDTH = 10;

export const SCREEN_WIDTH = 90;
export const EDIT_SCREEN_WIDTH = 80;

const MAX_SCALE = 1.5;

const DEFAULT_CHAR_WIDTH = 10;
const DEFAULT_SCREEN_WIDTH = 90;

export const CONSTS = {
  FONT_SIZE: 20,
  HALF_FONT_SIZE: 10,
  SCALE: 1,
  WINDOW_WIDTH: 3840,
  SCREEN_WIDTH: 90,
  CHAR_WIDTH: 10,
  EDIT_SCREEN_WIDTH: 80,
  LINE_HEIGHT: 25,
  IS_MOBILE: false,
  IS_INIT: false,
  BASE_COLUMN_WIDTH: 10 * 90, // CHAR_WIDTH * SCREEN_WIDTH
};

const calcScreenWidth = (windowWidth: number, isMobile: boolean) => {
  if (!isMobile) {
    if (windowWidth > DEFAULT_SCREEN_WIDTH * DEFAULT_CHAR_WIDTH) {
      return DEFAULT_SCREEN_WIDTH;
    } else {
      return Math.floor(windowWidth / DEFAULT_CHAR_WIDTH);
    }
  } else {
    return 15;
  }
};

const calcScale = (
  windowWidth: number,
  isMobile: boolean,
  screenWidth: number,
) => {
  if (CONSTS.IS_INIT) {
    return CONSTS.SCALE;
  }
  if (!isMobile) {
    const scale = windowWidth / (DEFAULT_CHAR_WIDTH * screenWidth);
    return scale < MAX_SCALE ? scale : MAX_SCALE;
  } else {
    return 1;
  }
};

export const calcFontSizeScaleScreenWidth = (
  windowWidth: number,
  isMobile: boolean,
) => {
  if (CONSTS.IS_INIT) {
    return {
      fontSize: CONSTS.FONT_SIZE,
      scale: CONSTS.SCALE,
      screenWidth: CONSTS.SCREEN_WIDTH,
    };
  }
  if (!isMobile) {
    const screenWidth = calcScreenWidth(windowWidth, isMobile);
    const scale = calcScale(windowWidth, isMobile, screenWidth);
    const fontSize = Math.floor(scale * DEFAULT_CHAR_WIDTH * 2);
    return { fontSize, scale, screenWidth };
  } else {
    return { fontSize: 15, scale: 1, screenWidth: 20 };
  }
};

export const initCONSTS = (
  windowWidth: number,
  lineHeight: number,
  isMobile: boolean,
  fontSize: number,
  scale: number,
  screenWidth: number,
) => {
  const halfFontSize = Math.floor(fontSize / 2);
  const toUpdate = {
    WINDOW_WIDTH: windowWidth,
    IS_MOBILE: isMobile,

    FONT_SIZE: fontSize,
    HALF_FONT_SIZE: halfFontSize,
    SCALE: scale,
    SCREEN_WIDTH: screenWidth,

    CHAR_WIDTH: halfFontSize,

    LINE_HEIGHT: lineHeight,

    IS_INIT: true,

    BASE_COLUMN_WIDTH: halfFontSize * screenWidth,
  };
  Object.assign(CONSTS, toUpdate);

  console.log("utils.InitCONSTS: CONSTS:", CONSTS);
};

export const calcScreenScale = (width: number) => {
  let scale = width / (DEFAULT_CHAR_WIDTH * CONSTS.SCREEN_WIDTH);
  scale = scale < MAX_SCALE ? scale : MAX_SCALE;
  const lineHeight = CONSTS.LINE_HEIGHT;
  const fontSize = CONSTS.FONT_SIZE;

  return { scale, lineHeight, fontSize };
};

export const getBoardParent = () => {
  //XXX TODO: imagine that there should be a session data remembering the last board list visited
  // If the board is visited directly by url there will be no record => return ""
  return "";
};

export const validateEmail = (text: string) => {
  return (
    text.indexOf("@") !== -1 &&
    text[0] !== "@" &&
    text[text.length - 1] !== "@" &&
    text[0] !== "." &&
    text[text.length - 1] !== "."
  );
};

export const validateUsername = (username: string) => {
  return username && username !== config.PTT_GUEST;
};

export const checkUsername = (username: string): Err => {
  if (!/^[0-9A-Za-z.]+$/.test(username)) {
    return "errmsg.usernameInvalidChars";
  }

  if (username[0] === ".") {
    return "errmsg.usernameStartsWithDot";
  }

  if (username[username.length - 1] === ".") {
    return "errmsg.usernameEndsWithDot";
  }

  return "";
};
