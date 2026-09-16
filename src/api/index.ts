import { attemptLogin, attemptRegister, login, register } from "./serverUtils";

export { attemptLogin, attemptRegister, login, register };

import { init } from "./serverUtils";

export { init };

import { requestGovernmentID } from "./serverUtils";

export { requestGovernmentID };

import {
  attemptChangeEmail,
  attemptSetIDEmail,
  changeEmail,
  changePasswd,
  getUserInfo,
  getUsername,
  setIDEmail,
} from "./serverUtils";

export {
  attemptChangeEmail,
  attemptSetIDEmail,
  changeEmail,
  changePasswd,
  getUserInfo,
  getUsername,
  setIDEmail,
};

import {
  getBoardDetail,
  getBoardSummary,
  loadClassBoards,
  loadFavoriteBoards,
  loadGeneralBoards,
  loadGeneralBoardsByClass,
  loadPopularBoards,
} from "./serverUtils";

export {
  getBoardDetail,
  getBoardSummary,
  loadClassBoards,
  loadFavoriteBoards,
  loadGeneralBoards,
  loadGeneralBoardsByClass,
  loadPopularBoards,
};

import {
  getArticle,
  getComments,
  loadArticles,
  loadBottomArticles,
} from "./serverUtils";

export { getArticle, getComments, loadArticles, loadBottomArticles };

import { addRecommend, createArticle, rank } from "./serverUtils";

export { addRecommend, createArticle, rank };

import { getManual, loadManuals } from "./serverUtils";

export { getManual, loadManuals };
