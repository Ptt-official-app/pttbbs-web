import config from "config";
import { type CSSProperties, useEffect, useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useThunk } from "use-thunk";
import useWindowSize from "../hooks/useWindowSize";
import * as DoHeader from "../thunks/header";
import * as DoProfilePage from "../thunks/profilePage";
import * as errors from "./errors";
import Header from "./Header";
import pageStyles from "./Page.module.css";
import { tsToDateTimeStr } from "./utils";

export default () => {
  const [profilePage, doProfilePage, profilePageID] = useThunk<
    DoProfilePage.State,
    typeof DoProfilePage
  >(DoProfilePage);
  const {
    nickname,

    is_government_id,
    over18,

    posts,
    bad_post,

    errmsg,
  } = profilePage;

  const [header] = useThunk<DoHeader.State, typeof DoHeader>(DoHeader);
  const { username } = header;

  const { width: innerWidth } = useWindowSize(10, 0);
  const { t } = useTranslation();

  const [errMsg, _setErrMsg] = useState("");

  //init
  // biome-ignore lint/correctness/useExhaustiveDependencies: useEffect
  useEffect(() => {
    doProfilePage.init(profilePageID);
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: useEffect
  useEffect(() => {
    if (!username) {
      return;
    }
    doProfilePage.getData(profilePageID, username);
  }, [username]);

  // event handlers
  const onClickGovernmentID = () => {
    window.location.href = config.ZK_URL;
  };

  // renderers
  const renderPost = () => {
    const badposts = !bad_post ? "" : " (被退 " + bad_post + " 篇)";

    return (
      <span>
        我已經 po 了 {posts} 篇文章{badposts}
      </span>
    );
  };

  const renderOver18 = () => {
    const isOver18Str = !over18 ? "還沒" : "已經";
    const isOver18Suffix = !over18 ? "捏" : "囉";

    return (
      <span>
        我{isOver18Str}18歲{isOver18Suffix}～
      </span>
    );
  };

  const allErrMsg = errors.mergeErr(errMsg, errmsg);

  const title = "我的資訊";

  const rootStyle: CSSProperties = {
    width: innerWidth,
  };

  const classNameGovernmentID = is_government_id ? "" : "hide";
  const classNameBtnGovernmentID = is_government_id
    ? "hide"
    : "btn btn-primary";

  //render
  return (
    <div className={"vh-100 " + pageStyles.root} style={rootStyle}>
      <Header title={title} />
      <div className={"container"}>
        <div className="row">
          <div className="col">
            <span>
              我是 {username} ({nickname})
            </span>
            <span> </span>
            <OverlayTrigger
              overlay={<Tooltip>{t("profile.withGovernmentID")}</Tooltip>}
            >
              <span className={classNameGovernmentID}>😄</span>
            </OverlayTrigger>
            <button
              className={classNameBtnGovernmentID}
              type="button"
              onClick={onClickGovernmentID}
            >
              我想通過政府認證的 ID
            </button>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <span>我有 {profilePage.money} P 幣～</span>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <span>我已經上站 {profilePage.login_days} 天了～</span>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <span>
              我上次上站的 IP: {profilePage.last_ip} ({profilePage.last_host})
              時間: {tsToDateTimeStr(profilePage.last_login)}
            </span>
          </div>
        </div>
        <div className="row">
          <div className="col">{renderPost()}</div>
        </div>
        <div className="row">
          <div className="col">{renderOver18()}</div>
        </div>
        <div className="row">
          <div className="col">
            <span>
              我的五子棋: 贏: {profilePage.five_win} 輸: {profilePage.five_lose}{" "}
              和: {profilePage.five_tie}
            </span>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <span>
              我的六子棋: 贏: {profilePage.conn6_win} 輸:{" "}
              {profilePage.conn6_lose} 和: {profilePage.conn6_tie}
            </span>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <span>
              我的象棋: 贏: {profilePage.chc_win} 輸: {profilePage.chc_lose} 和:{" "}
              {profilePage.chc_tie} 等級: {profilePage.chess_rank}
            </span>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <span>
              我的暗棋: 贏: {profilePage.dark_win} 輸: {profilePage.dark_lose}{" "}
              和: {profilePage.dark_tie}
            </span>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <span>
              我的圍棋: 贏: {profilePage.go_win} 輸: {profilePage.go_lose} 和:{" "}
              {profilePage.go_tie}
            </span>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <span className={pageStyles.errMsg}>{allErrMsg}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
