import config from "config";
import type {
  AccessToken,
  ArticleDetail,
  ArticleList,
  ArticleSummary,
  BoardDetail,
  BoardList,
  BoardSummary,
  CommentList,
  Content,
  Data,
  InitResult,
  ManArticle,
  ManArticleList,
  Rank,
  UserDetail,
  Username,
} from "../types";
import api from "./api";

const LIST_LIMIT = config.LIST_LIMIT || 50;

export const attemptLogin = (input: string, oidc_id: string) =>
  api<AccessToken>({
    endpoint: "/api/account/attemptlogin",
    method: "post",
    json: {
      client_id: config.CLIENT_ID,
      client_secret: config.CLIENT_SECRET,

      input,
      oidc_id,
    },
  });

export const login = (input: string, verify_code: string) =>
  api<AccessToken>({
    endpoint: "/api/account/login",
    method: "post",
    json: {
      client_id: config.CLIENT_ID,
      client_secret: config.CLIENT_SECRET,

      input,
      verify_code,
    },
  });

export const attemptRegister = (email: string) =>
  api<Username>({
    endpoint: "/api/account/attemptregister",
    method: "post",
    json: {
      email,
    },
  });

export const register = (
  username: string,
  password: string,
  password_confirm: string,
  email: string,
  over18: boolean,
  veriCode: string,
) =>
  api<AccessToken>({
    endpoint: "/api/account/register",
    method: "post",
    json: {
      client_id: config.CLIENT_ID,
      client_secret: config.CLIENT_SECRET,

      username,
      password,
      password_confirm,
      email,
      over18,
      token: veriCode,
    },
  });

export const init = (username: string, realName: string, birthDate: string) =>
  api<InitResult>({
    endpoint: "/api/user/init",
    method: "post",
    json: {
      username,
      realname: realName,
      birth_date: birthDate,
    },
  });

export const requestGovernmentID = () =>
  api<null>({
    endpoint: "/api/user/government-id",
    method: "post",
  });

export const getUserInfo = (username: string) =>
  api<UserDetail>({
    endpoint: "/api/user/" + username,
    method: "get",
  });

export const getUsername = () =>
  api<Username>({
    endpoint: "/api/username",
    method: "get",
  });

export const changePasswd = (
  username: string,
  origPassword: string,
  password: string,
  passwordConfirm: string,
) =>
  api<AccessToken>({
    endpoint: "/api/user/" + username + "/updatepasswd",
    method: "post",
    json: {
      client_id: config.CLIENT_ID,
      client_secret: config.CLIENT_SECRET,

      orig_password: origPassword,
      password,
      password_confirm: passwordConfirm,
    },
  });

export const attemptChangeEmail = (
  username: string,
  password: string,
  email: string,
) =>
  api<Username>({
    endpoint: "/api/user/" + username + "/attemptchangeemail",
    method: "post",
    json: {
      client_id: config.CLIENT_ID,
      client_secret: config.CLIENT_SECRET,

      password,
      email,
    },
  });

export const changeEmail = (username: string, token: string) =>
  api<Data>({
    endpoint: "/api/user/" + username + "/changeemail",
    method: "post",
    json: {
      client_id: config.CLIENT_ID,
      client_secret: config.CLIENT_SECRET,
      token,
    },
  });

export const attemptSetIDEmail = (
  username: string,
  password: string,
  email: string,
) =>
  api<Username>({
    endpoint: "/api/user/" + username + "/attemptsetidemail",
    method: "post",
    json: {
      client_id: config.CLIENT_ID,
      client_secret: config.CLIENT_SECRET,

      password,
      email,
    },
  });

export const setIDEmail = (username: string, token: string) =>
  api<Data>({
    endpoint: "/api/user/" + username + "/setidemail",
    method: "post",
    json: {
      client_id: config.CLIENT_ID,
      client_secret: config.CLIENT_SECRET,
      token,
    },
  });

export const getBoardSummary = (bid: string) =>
  api<BoardSummary>({
    endpoint: "/api/board/" + bid + "/summary",
    method: "get",
  });

export const getBoardDetail = (bid: string, fields: string[]) => {
  let endpoint = "/api/board/" + bid;
  if (fields.length > 0) {
    endpoint += "?fields=" + fields.join(",");
  }
  return api<BoardDetail>({
    endpoint,
    method: "get",
  });
};

export const loadFavoriteBoards = (
  username: string,
  level: string,
  startIdx: string,
  desc: boolean,
) =>
  api<BoardList>({
    endpoint: "/api/user/" + username + "/favorites",
    method: "get",
    query: {
      level_idx: level || "",
      start_idx: startIdx || "",
      asc: !desc,
      limit: LIST_LIMIT,
    },
  });

export const loadPopularBoards = () =>
  api<BoardList>({
    endpoint: "/api/boards/popular",
  });

export const loadGeneralBoardsByClass = (
  keyword: string,
  startIdx: string,
  desc: boolean,
) =>
  api<BoardList>({
    endpoint: "/api/boards/byclass",
    query: {
      keyword: keyword || "",
      start_idx: startIdx || "",
      asc: !desc,
      limit: LIST_LIMIT,
    },
  });

export const loadGeneralBoards = (
  keyword: string,
  startIdx: string,
  desc: boolean,
) =>
  api<BoardList>({
    endpoint: "/api/boards",
    query: {
      keyword: keyword || "",
      start_idx: startIdx || "",
      asc: !desc,
      limit: LIST_LIMIT,
    },
  });

export const loadClassBoards = (
  clsID: number,
  startIdx: string,
  desc: boolean,
) =>
  api<BoardList>({
    endpoint: "/api/cls/" + clsID,
    query: {
      start_idx: startIdx || "",
      asc: !desc,
      limit: LIST_LIMIT,
    },
  });

export const loadArticles = (
  bid: string,
  title: string,
  startIdx: string,
  desc: boolean,
) =>
  api<ArticleList>({
    endpoint: "/api/board/" + bid + "/articles",
    method: "get",
    query: {
      title: title || "",
      start_idx: startIdx || "",
      limit: LIST_LIMIT,
      desc: desc || false,
    },
  });

export const loadBottomArticles = (bid: string) =>
  api<ArticleList>({
    endpoint: "/api/board/" + bid + "/articles/bottom",
    method: "get",
  });

export const getArticle = (bid: string, aid: string) =>
  api<ArticleDetail>({
    endpoint: "/api/board/" + bid + "/article/" + aid,
    method: "get",
  });

export const getComments = (
  bid: string,
  aid: string,
  startIdx: string,
  desc: boolean,
) =>
  api<CommentList>({
    endpoint: "/api/board/" + bid + "/article/" + aid + "/comments",
    method: "get",
    query: {
      start_idx: startIdx || "",
      limit: LIST_LIMIT,
      desc: desc || false,
    },
  });

export const createArticle = (
  bid: string,
  theClass: string,
  title: string,
  content: Content,
) =>
  api<ArticleSummary>({
    endpoint: "/api/board/" + bid + "/article",
    method: "post",
    json: {
      class: theClass,
      title,
      content,
    },
  });

export const addRecommend = (
  bid: string,
  aid: string,
  recommendType: string,
  recommend: Content,
) =>
  api<Comment>({
    endpoint: `/api/board/${bid}/article/${aid}/comment`,
    method: "post",
    json: {
      type: recommendType,
      content: recommend,
    },
  });

export const rank = (bid: string, aid: string, rank: number) =>
  api<Rank>({
    endpoint: `/api/board/${bid}/article/${aid}/rank`,
    method: "post",
    json: {
      rank: rank,
    },
  });

export const loadManuals = (bid: string, path: string, desc: boolean) =>
  api<ManArticleList>({
    endpoint: `/api/board/${bid}/manuals`,
    method: "get",
    query: {
      level_idx: path,
      desc: desc || false,
    },
  });

export const getManual = (bid: string, path: string, startIdx: string) =>
  api<ManArticle>({
    endpoint: `/api/board/${bid}/manual/${path}`,
    method: "get",
    query: {
      start_idx: startIdx,
      limit: LIST_LIMIT,
    },
  });
