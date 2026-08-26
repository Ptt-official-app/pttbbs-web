import {
  type ChangeEventHandler,
  type CSSProperties,
  type SubmitEventHandler,
  useEffect,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { useThunk } from "use-thunk";
import useWindowSize from "../hooks/useWindowSize";
import * as DoHeader from "../thunks/header";
import * as DoInitPage from "../thunks/initPage";
import { mergeErr } from "./errors";
import Header from "./Header";
import styles from "./Page.module.css";
import { checkUsername } from "./utils";

export default () => {
  const [_initPage, doInitPage, initPageID] = useThunk<
    DoInitPage.State,
    typeof DoInitPage
  >(DoInitPage);

  const [header, doHeader, headerID] = useThunk<
    DoHeader.State,
    typeof DoHeader
  >(DoHeader);
  const { username, errmsg } = header;

  const { width: innerWidth } = useWindowSize(10, 0);
  const { t } = useTranslation();

  const [realName, setRealName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [errMsg, setErrMsg] = useState("");

  const rootStyle: CSSProperties = {
    width: innerWidth,
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: useEffect
  useEffect(() => {
    doInitPage.init(initPageID);
  }, []);

  const onSubmit: SubmitEventHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!username) {
      setErrMsg(t("init.errmsg.noUsername"));
      return;
    }
    const errmsg = checkUsername(username);
    if (errmsg) {
      setErrMsg(t(errmsg));
      return;
    }

    doInitPage.submit(initPageID, username, realName, birthDate);
  };

  const onChangeUsername: ChangeEventHandler = (e) => {
    setErrMsg("");
    doInitPage.cleanErr(initPageID);

    // @ts-expect-error value exists in e.target
    doHeader.setUsername(headerID, e.target.value);
  };

  const usernamePlaceHolder =
    'username: only alphanumber characters and "." are allowed, with maximum 40 characters.';

  const allErrMsg = mergeErr(errMsg, errmsg);
  const classNameErrMsg = `${styles.errMsg} mt-2`;

  return (
    <div className={"vh-100 " + styles.root} style={rootStyle}>
      <Header title={t("init.title")} />
      <div className="container mt-4">
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <input
              className="form-control"
              type="text"
              placeholder={usernamePlaceHolder}
              aria-label="Username"
              value={username}
              onChange={onChangeUsername}
              required
            />
            <input
              className="form-control"
              type="text"
              placeholder={`${t("init.realName")}:`}
              aria-label="realName"
              value={realName}
              onChange={(e) => setRealName(e.target.value)}
              required
            />
            <input
              className="form-control"
              type="text"
              placeholder={`${t("init.birthDate")}:`}
              aria-label="birthdate"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              required
            />
            <div className="row">
              <button
                className="btn btn-primary mt-2"
                type="submit"
                // disabled={isDisabledButton}
              >
                {t("init.submit")}
              </button>
            </div>

            <div className="row">
              <span className={classNameErrMsg}>{allErrMsg}</span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
