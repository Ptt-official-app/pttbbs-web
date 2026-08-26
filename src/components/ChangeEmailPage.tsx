import { useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useThunk } from "use-thunk";
import useWindowSize from "../hooks/useWindowSize";
import * as DoChangeEmailPage from "../thunks/changeEmailPage";
import Empty from "./Empty";
import Header from "./Header";
import pageStyles from "./Page.module.css";

export default () => {
  const [changeEmailPage, doChangeEmailPage, changeEmailPageID] = useThunk<
    DoChangeEmailPage.State,
    typeof DoChangeEmailPage
  >(DoChangeEmailPage);
  const { errmsg, isDone, data } = changeEmailPage;

  //init
  const { userid: paramsUserID } = useParams();
  const userid = paramsUserID || "";
  const [searchParams] = useSearchParams();

  // biome-ignore lint/correctness/useExhaustiveDependencies: useEffect
  useEffect(() => {
    if (!paramsUserID) {
      return;
    }
    const token = searchParams.get("token") || "";

    doChangeEmailPage.init(changeEmailPageID, paramsUserID, token);
  }, [paramsUserID, searchParams]);

  //get data

  // biome-ignore lint/correctness/useExhaustiveDependencies: useEffect
  useEffect(() => {
    if (!isDone) {
      return;
    }

    doChangeEmailPage.sleepAndRedirect(changeEmailPageID, userid);
  }, [isDone]);

  //render
  const { height: innerHeight } = useWindowSize();
  const style = {
    height: innerHeight + "px",
  };

  const renderData = () => {
    // @ts-expect-error data is unknown
    if (!data.email) {
      return <Empty />;
    }

    return (
      <span className="">
        {/* @ts-expect-error data is unknown */}
        您的聯絡信箱已更改為 {data.email} 囉～(將會回到您的個人資訊)
      </span>
    );
  };

  const displayErrMsg = errmsg ? `${errmsg} (將會回到您的個人資訊)` : "";

  return (
    <div className={pageStyles.root} style={style}>
      <div className={"container"} style={style}>
        <Header title="更改聯絡信箱" />
        <div className="row">
          <div className="col">{renderData()}</div>
          <div className="col">
            <span className={pageStyles.errMsg}>{displayErrMsg}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
