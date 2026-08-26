import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useThunk } from "use-thunk";
import useWindowSize from "../hooks/useWindowSize";
import * as DoChangePasswdPage from "../thunks/changePasswdPage";
import * as errors from "./errors";
import Header from "./Header";
import styles from "./Page.module.css";

export default () => {
  const [changePasswdPage, doChangePasswdPage, changePasswdPageID] = useThunk<
    DoChangePasswdPage.State,
    typeof DoChangePasswdPage
  >(DoChangePasswdPage);
  const { userID, errmsg } = changePasswdPage;

  const [origPasswd, setOrigPasswd] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [errMsg, setErrMsg] = useState("");

  const { userid: paramsUserID } = useParams();
  const userid = paramsUserID || "";

  //init

  // biome-ignore lint/correctness/useExhaustiveDependencies: useEffect
  useEffect(() => {
    doChangePasswdPage.init(changePasswdPageID, userid);
  }, []);

  //render
  const { height: innerHeight } = useWindowSize();
  const style = {
    height: innerHeight + "px",
  };

  const cleanErr = () => {
    setErrMsg("");
    doChangePasswdPage.cleanErr(changePasswdPageID);
  };

  const changeOrigPasswd = (origPasswd: string) => {
    setOrigPasswd(origPasswd);
    cleanErr();
  };

  const changePassword = (password: string) => {
    setPassword(password);
    cleanErr();
  };

  const changePasswordConfirm = (passwordConfirm: string) => {
    setPasswordConfirm(passwordConfirm);
    cleanErr();
  };

  const submit = () => {
    if (password !== passwordConfirm) {
      setErrMsg("新的密碼不相符合喔～");
      return;
    }

    doChangePasswdPage.changePasswd(
      changePasswdPageID,
      userID,
      origPasswd,
      password,
      passwordConfirm,
    );
  };

  const allErrMsg = errors.mergeErr(errMsg, errmsg);

  return (
    <div className={styles.root} style={style}>
      <div className={"container"} style={style}>
        <Header title="我想換密碼" />
        <div className="row">
          <div className="col">
            <span>我是 {userID}</span>
          </div>
        </div>
        <div className="row">
          <input
            className="form-control"
            type="password"
            placeholder="原本的密碼:"
            aria-label="OrigPasswd"
            value={origPasswd}
            onChange={(e) => changeOrigPasswd(e.target.value)}
          />
        </div>

        <div className="row">
          <input
            className="form-control"
            type="password"
            placeholder="新的密碼:"
            aria-label="Password"
            value={password}
            onChange={(e) => changePassword(e.target.value)}
          />
        </div>

        <div className="row">
          <input
            className="form-control"
            type="password"
            placeholder="確認新的密碼:"
            aria-label="Password"
            value={passwordConfirm}
            onChange={(e) => changePasswordConfirm(e.target.value)}
          />
        </div>

        <div className="row">
          <div>
            <button type="button" className="btn btn-primary" onClick={submit}>
              我確定要改密碼～
            </button>
          </div>
          <div className="col">
            <span className={styles.errMsg}>{allErrMsg}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
