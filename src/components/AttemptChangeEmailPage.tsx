import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useThunk } from "use-thunk";
import useWindowSize from "../hooks/useWindowSize";
import * as DoAttemptChangeEmailPage from "../thunks/attemptChangeEmailPage";
import Empty from "./Empty";
import * as errors from "./errors";
import Header from "./Header";
import styles from "./Page.module.css";

export default () => {
  const [
    attemptChangeEmailPage,
    doAttemptChangeEmailPage,
    attemptChangeEmailPageID,
  ] = useThunk<DoAttemptChangeEmailPage.State, typeof DoAttemptChangeEmailPage>(
    DoAttemptChangeEmailPage,
  );
  const { userID, errmsg, isDone } = attemptChangeEmailPage;

  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [errMsg, setErrMsg] = useState("");

  const { userid: paramsUserID } = useParams();
  const userid = paramsUserID || "";

  //init
  // biome-ignore lint/correctness/useExhaustiveDependencies: useEffect
  useEffect(() => {
    doAttemptChangeEmailPage.init(attemptChangeEmailPageID, userid);
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: useEffect
  useEffect(() => {
    if (!isDone) {
      return;
    }

    doAttemptChangeEmailPage.sleepAndRedirect(attemptChangeEmailPageID, userid);
  }, [isDone]);

  //render
  const { height: innerHeight } = useWindowSize();
  const style = {
    height: innerHeight + "px",
  };

  const cleanErr = () => {
    setErrMsg("");
    doAttemptChangeEmailPage.cleanErr(attemptChangeEmailPageID);
  };

  const changePassword = (password: string) => {
    setPassword(password);
    cleanErr();
  };

  const changeEmail = (email: string) => {
    setEmail(email);
    cleanErr();
  };

  const submit = () => {
    if (!email) {
      setErrMsg("您是忘記您的 email 了？～");
      return;
    }
    if (!password) {
      setErrMsg("您是忘記您的密碼了？～");
      return;
    }
    doAttemptChangeEmailPage.changeEmail(
      attemptChangeEmailPageID,
      userID,
      password,
      email,
    );
    cleanErr();
  };

  const renderData = () => {
    if (!isDone) {
      return <Empty />;
    }

    return (
      <span className="">已經成功送出確認信囉～請您到您設定的信箱確認～</span>
    );
  };

  const allErrMsg = errors.mergeErr(errMsg, errmsg);

  return (
    <div className={styles.root} style={style}>
      <div className={"container"}>
        <Header title="我想換聯絡 Email" />
        <div className="row">
          <div className="col">
            <span>我是 {userID}</span>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <input
              className="form-control"
              type="text"
              placeholder="新的聯絡 Email:"
              aria-label="email"
              value={email}
              onChange={(e) => changeEmail(e.target.value)}
            />
          </div>
          <div className="col"></div>
        </div>
        <div className="row">
          <div className="col">
            <input
              className="form-control"
              type="password"
              placeholder="我的密碼:"
              aria-label="password"
              value={password}
              onChange={(e) => changePassword(e.target.value)}
            />
          </div>
          <div className="col"></div>
        </div>
        <div className="row">
          <div className="col">
            <button type="button" className="btn btn-primary" onClick={submit}>
              我確定要換聯絡 Email～
            </button>
          </div>
          <div className="col">{renderData()}</div>
          <div className="col">
            <span className={styles.errMsg}>{allErrMsg}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
