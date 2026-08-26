import QueryString from "query-string";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useThunk } from "use-thunk";
import useWindowSize from "../hooks/useWindowSize";
import * as DoSetIDEmailPage from "../thunks/setIDEmailPage";
import Empty from "./Empty";
import Header from "./Header";
import pageStyles from "./Page.module.css";

export default () => {
  const [setIDEmailPage, doSetIDEmailPage, setIDEmailPageID] = useThunk<
    DoSetIDEmailPage.State,
    typeof DoSetIDEmailPage
  >(DoSetIDEmailPage);
  const { errmsg, isDone, data } = setIDEmailPage;

  //init
  const { userid: paramsUserID } = useParams();
  const userid = paramsUserID || "";

  // biome-ignore lint/correctness/useExhaustiveDependencies: useEffect
  useEffect(() => {
    const { token: queryToken } = QueryString.parse(window.location.search);
    const token = (queryToken || "") as string;

    doSetIDEmailPage.init(setIDEmailPageID, userid, token);
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: useEffect
  useEffect(() => {
    if (!isDone) {
      return;
    }

    doSetIDEmailPage.sleepAndRedirect(setIDEmailPageID, userid);
  }, [isDone]);

  //render
  const { height: innerHeight } = useWindowSize();
  const style = {
    height: innerHeight + "px",
  };

  const renderData = () => {
    // @ts-expect-error the type of data is unknown
    if (!data.idemail) {
      return <Empty />;
    }

    // @ts-expect-error the type of data is unknown
    return <span className="">您的認證信箱已更改為 {data.idemail} 囉～</span>;
  };

  const renderInfo = () => {
    if (!isDone) {
      return <Empty />;
    }

    return <span className="">將會回到您的個人資訊</span>;
  };

  return (
    <div className={pageStyles.root} style={style}>
      <div className={"container"} style={style}>
        <Header title="更改認證信箱" />
        <div className="row">
          <div className="col">{renderData()}</div>
          <div className="col">
            <span className={pageStyles.errMsg}>{errmsg}</span>
          </div>
          <div className="col">{renderInfo()}</div>
        </div>
      </div>
    </div>
  );
};
