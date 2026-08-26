import "../vendors";
import "../index.css";
import config from "config";
import { type FC, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { registerThunk } from "use-thunk";
import reportWebVitals from "../reportWebVitals";
import * as DoArticlePage from "../thunks/articlePage";
import * as DoArticlesPage from "../thunks/articlesPage";
import * as DoAttemptChangeEmailPage from "../thunks/attemptChangeEmailPage";
import * as DoAttemptSetIDEmailPage from "../thunks/attemptSetIDEmailPage";
import * as DoChangeEmailPage from "../thunks/changeEmailPage";
import * as DoChangePasswdPage from "../thunks/changePasswdPage";
import * as DoClassBoardsPage from "../thunks/classBoardsPage";
import * as DoGeneralBoardsPage from "../thunks/generalBoardsPage";
import * as DoHeader from "../thunks/header";
import * as DoHomePage from "../thunks/homePage";
import * as DoHotBoardsPage from "../thunks/hotBoardsPage";
import * as DoInitPage from "../thunks/initPage";
import * as DoLoginPage from "../thunks/loginPage";
import * as DoManualPage from "../thunks/manualPage";
import * as DoManualsPage from "../thunks/manualsPage";
import * as DoNewArticlePage from "../thunks/newArticlePage";
import * as DoProfilePage from "../thunks/profilePage";
import * as DoRegisterPage from "../thunks/registerPage";
import * as DoSetIDEmailPage from "../thunks/setIDEmailPage";
import * as DoUserFavoritesPage from "../thunks/userFavoritesPage";
import "../i18n";

export default (Routes: FC) => {
  registerThunk(DoArticlePage);
  registerThunk(DoArticlesPage);
  registerThunk(DoAttemptChangeEmailPage);
  registerThunk(DoAttemptSetIDEmailPage);
  registerThunk(DoChangeEmailPage);
  registerThunk(DoChangePasswdPage);
  registerThunk(DoClassBoardsPage);
  registerThunk(DoGeneralBoardsPage);
  registerThunk(DoHeader);
  registerThunk(DoHomePage);
  registerThunk(DoHotBoardsPage);
  registerThunk(DoLoginPage);
  registerThunk(DoManualPage);
  registerThunk(DoManualsPage);
  registerThunk(DoNewArticlePage);
  registerThunk(DoRegisterPage);
  registerThunk(DoSetIDEmailPage);
  registerThunk(DoUserFavoritesPage);
  registerThunk(DoProfilePage);
  registerThunk(DoInitPage);

  //title
  document.getElementsByTagName("title")[0].innerHTML = config.BRAND;

  //react
  // biome-ignore lint/style/noNonNullAssertion: root is always in html.
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <Routes />
    </StrictMode>,
  );

  // If you want to start measuring performance in your app, pass a function
  // to log results (for example: reportWebVitals(console.log))
  // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
  reportWebVitals(console.log);
};
