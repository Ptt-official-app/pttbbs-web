import config from "config";
import { type CSSProperties, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { useThunk } from "use-thunk";
import { OIDC_AUTH_REQUEST_ID } from "../constants";
import useWindowSize from "../hooks/useWindowSize";
import * as DoLoginPage from "../thunks/loginPage";
import * as errors from "./errors";
import Header from "./Header";
import styles from "./Page.module.css";

export default () => {
  const [loginPage, doLoginPage, loginPageID] = useThunk<
    DoLoginPage.State,
    typeof DoLoginPage
  >(DoLoginPage);
  const { errmsg, isRequested } = loginPage;

  const [searchParams, _setSearchParams] = useSearchParams();
  const authRequestID = searchParams.get(OIDC_AUTH_REQUEST_ID) || "";

  const [theInput, setTheInput] = useState("");
  const [code0, setCode0] = useState("");
  const code0Ref = useRef<HTMLInputElement>(null);

  const [code1, setCode1] = useState("");
  const code1Ref = useRef<HTMLInputElement>(null);

  const [code2, setCode2] = useState("");
  const code2Ref = useRef<HTMLInputElement>(null);

  const [code3, setCode3] = useState("");
  const code3Ref = useRef<HTMLInputElement>(null);

  const [code4, setCode4] = useState("");
  const code4Ref = useRef<HTMLInputElement>(null);

  const [code5, setCode5] = useState("");
  const code5Ref = useRef<HTMLInputElement>(null);

  const loginBtnRef = useRef<HTMLButtonElement>(null);

  const [errMsg, setErrMsg] = useState("");
  const { t } = useTranslation();
  const { width: innerWidth } = useWindowSize(10, 0);

  const setList = [setCode0, setCode1, setCode2, setCode3, setCode4, setCode5];
  const nextRefList = [
    code1Ref,
    code2Ref,
    code3Ref,
    code4Ref,
    code5Ref,
    loginBtnRef,
  ];

  //init
  // biome-ignore lint/correctness/useExhaustiveDependencies: useEffect
  useEffect(() => {
    doLoginPage.init(loginPageID);
  }, []);

  const withReset = (setFunc: (theStr: string) => void, theStr: string) => {
    setFunc(theStr);

    setErrMsg("");
    doLoginPage.reset(loginPageID);
  };

  const onChangeCode = (theStr: string, idx: number) => {
    if (!theStr) {
      const setFunc = setList[idx];
      setFunc(theStr);
      return;
    }

    const theStrList = theStr.split("");
    // biome-ignore lint/suspicious/useIterableCallbackReturn: no need the ret.
    theStrList.map((eachStr, eachIdx) => {
      const theIdx = eachIdx + idx;
      if (theIdx >= setList.length) {
        return;
      }

      const setFunc = setList[theIdx];
      setFunc(eachStr);
    });

    setErrMsg("");
    doLoginPage.cleanErr(loginPageID);

    const nextRefIdx = theStrList.length - 1 + idx;
    const nextRef =
      nextRefIdx >= nextRefList.length
        ? nextRefList[nextRefList.length - 1]
        : nextRefList[nextRefIdx];

    if (!nextRef.current) {
      return;
    }

    nextRef.current.focus();
  };

  const onAttemptLogin = () => {
    doLoginPage.attemptLogin(loginPageID, theInput, authRequestID);
  };

  const onLogin = () => {
    const verifyCode = `${code0}${code1}${code2}${code3}${code4}${code5}`;
    doLoginPage.login(loginPageID, theInput, verifyCode);
  };

  const onRegister = () => {
    window.location.href = "/register";
  };

  const allErrMsg = errors.mergeErr(errMsg, errmsg);

  const title = `${t("login.titlePrefix")}${config.BRAND}${t("login.titlePostfix")}`;

  const rootStyle: CSSProperties = {
    width: innerWidth,
  };

  const classNameVerifyCode = isRequested ? "" : "hide";

  const isDisabledLogin2 =
    !code0 || !code1 || !code2 || !code3 || !code4 || !code5;

  const classNameCode = "col";
  const classNameCodeSide =
    "col-3 d-none d-sm-none d-md-block d-lg-block d-xl-block";

  return (
    <div className={"vh-100 " + styles.root} style={rootStyle}>
      <Header title={title} />
      <div className={"container mt-5 "}>
        <div className="row">
          <div className="col-12 col-md-6 mx-auto">
            <input
              className="form-control mb-3"
              type="text"
              placeholder="Email or Username:"
              aria-label="Username"
              value={theInput}
              onChange={(e) => withReset(setTheInput, e.target.value)}
            />
            <div className="d-flex justify-content-center">
              <button
                type="button"
                className="btn btn-primary me-2"
                onClick={onAttemptLogin}
              >
                {t("login.login")}
              </button>
              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={onRegister}
              >
                {t("login.register")}
              </button>
            </div>
            <span className={styles.errMsg}>{allErrMsg}</span>
          </div>
        </div>
        <div className={classNameVerifyCode}>
          <div className="row">
            <div className="col-12 col-md-6 mx-auto">{t("login.info")}</div>
          </div>
          <div className="row">
            <div className={classNameCodeSide}></div>
            <div className={classNameCode}>
              <input
                className={`form-control ${styles["center-input"]}`}
                type="text"
                placeholder=""
                aria-label="code0"
                value={code0}
                ref={code0Ref}
                onChange={(e) => onChangeCode(e.target.value, 0)}
              />
            </div>
            <div className={classNameCode}>
              <input
                className={`form-control ${styles["center-input"]}`}
                type="text"
                placeholder=""
                aria-label="code1"
                value={code1}
                ref={code1Ref}
                onChange={(e) => onChangeCode(e.target.value, 1)}
              />
            </div>
            <div className={classNameCode}>
              <input
                className={`form-control ${styles["center-input"]}`}
                type="text"
                placeholder=""
                aria-label="code2"
                value={code2}
                ref={code2Ref}
                onChange={(e) => onChangeCode(e.target.value, 2)}
              />
            </div>
            <div className={classNameCode}>
              <input
                className={`form-control ${styles["center-input"]}`}
                type="text"
                placeholder=""
                aria-label="code3"
                value={code3}
                ref={code3Ref}
                onChange={(e) => onChangeCode(e.target.value, 3)}
              />
            </div>
            <div className={classNameCode}>
              <input
                className={`form-control ${styles["center-input"]}`}
                type="text"
                placeholder=""
                aria-label="code4"
                value={code4}
                ref={code4Ref}
                onChange={(e) => onChangeCode(e.target.value, 4)}
              />
            </div>
            <div className={classNameCode}>
              <input
                className={`form-control ${styles["center-input"]}`}
                type="text"
                placeholder=""
                aria-label="code5"
                value={code5}
                ref={code5Ref}
                onChange={(e) => onChangeCode(e.target.value, 5)}
              />
            </div>
            <div className={classNameCodeSide}></div>
          </div>
          <div className="d-flex justify-content-center mt-2">
            <button
              type="button"
              className="btn btn-primary"
              onClick={onLogin}
              ref={loginBtnRef}
              disabled={isDisabledLogin2}
            >
              {t("login.submit")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
