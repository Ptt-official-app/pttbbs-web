import { useEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useKey } from "react-use";
import { useThunk } from "use-thunk";
import useWindowSize from "../hooks/useWindowSize";
import * as DoManualPage from "../thunks/manualPage";
import type { Line, PttOption } from "../types";
import Article from "./Article";
import FunctionBar from "./FunctionBar";
import Header from "./Header";
import styles from "./Page.module.css";

export default () => {
  const [manualPage, doManualPage, manualPageID] = useThunk<
    DoManualPage.State,
    typeof DoManualPage
  >(DoManualPage);
  const { brdname, title, content, scrollToRow } = manualPage;

  const { bid: paramsBid, path: paramsPath } = useParams();
  const bid = paramsBid || "";
  const path = paramsPath || "";
  const pathList = path.split("/");
  const dirname = pathList.slice(0, pathList.length - 1).join("/");
  let parentUrl = `/board/${bid}/manual`;
  if (dirname !== "") {
    parentUrl += "/" + dirname;
  }

  const [searchParams] = useSearchParams();

  const [headerHeight, setHeaderHeight] = useState(0);
  const [funcbarHeight, setFuncbarHeight] = useState(0);
  const headerRef = useRef<HTMLDivElement>(null);
  const funcbarRef = useRef<HTMLDivElement>(null);
  const { width: innerWidth, height: innerHeight } = useWindowSize();
  const [scrollTop, setScrollTop] = useState(0);

  // biome-ignore lint/correctness/useExhaustiveDependencies: useEffect
  useEffect(() => {
    const startIdx = searchParams.get("start_idx") || "";

    doManualPage.init(manualPageID, bid, path, startIdx);
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: useEffect
  useEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.clientHeight);
    }
    if (funcbarRef.current) {
      setFuncbarHeight(funcbarRef.current.clientHeight);
    }
  }, [headerRef.current, funcbarRef.current]);

  useKey("ArrowLeft", (_e) => {
    window.location.href = parentUrl;
  });

  const width = innerWidth;
  const listHeight = innerHeight - headerHeight - funcbarHeight;

  let fullTitle = "";
  fullTitle += title;
  const headerTitle = `(精華區) ${brdname} - ${fullTitle}`;

  const loadPre = (_item: Line) => {};
  const loadNext = (_item: Line) => {};

  const onVerticalScroll = (scrollTop: number): boolean => {
    setScrollTop(scrollTop);
    if (scrollToRow === null) {
      return false;
    }

    doManualPage.setData(manualPageID, { scrollToRow: undefined });

    return true;
  };

  // const allErrMsg = errors.mergeErr(errMsg, errmsg);
  const renderManual = () => {
    return (
      <Article
        lines={content}
        width={width}
        height={listHeight}
        loadPre={loadPre}
        loadNext={loadNext}
        scrollToRow={scrollToRow}
        onVerticalScroll={onVerticalScroll}
        scrollTop={scrollTop}
      />
    );
  };

  const loptions: PttOption[] = [];

  const roptions: PttOption[] = [{ text: "離開", url: parentUrl, hotkey: "←" }];

  return (
    <div className={styles.root}>
      <div ref={headerRef}>
        <Header title={headerTitle} />
      </div>
      {renderManual()}
      <div ref={funcbarRef}>
        <FunctionBar optionsLeft={loptions} optionsRight={roptions} />
      </div>
    </div>
  );
};
