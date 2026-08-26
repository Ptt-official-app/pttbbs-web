import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useKey } from "react-use";
import { useThunk } from "use-thunk";
import useWindowSize from "../hooks/useWindowSize";
import * as DoManualsPage from "../thunks/manualsPage";
import type { ManArticleSummary_i, PttOption } from "../types";
import EmptyList from "./EmptyList";
import FunctionBar from "./FunctionBar";
import Header from "./Header";
import ManualList from "./ManualList";
import styles from "./Page.module.css";

export default () => {
  const [manualsPage, doManualsPage, manualsPageID] = useThunk<
    DoManualsPage.State,
    typeof DoManualsPage
  >(DoManualsPage);
  const { brdname, title, scrollToRow, allManuals: manuals } = manualsPage;

  const {
    bid: paramsBid,
    path: paramsPath,
    start_idx: paramsStartIdx,
    title: paramsTitle,
  } = useParams();
  const bid = paramsBid || "";
  const path = paramsPath || "";
  const pathList = path.split("/");
  const dirname = pathList.slice(0, pathList.length - 1).join("/");
  const parentUrl = `/board/${bid}/manual${dirname === "" ? "" : "/" + dirname}`;

  const [_errMsg, _setErrMsg] = useState("");

  //keys
  useKey("ArrowLeft", (_e) => {
    window.location.href = parentUrl;
  });

  const [headerHeight, setHeaderHeight] = useState(0);
  const [funcbarHeight, setFuncbarHeight] = useState(0);
  const headerRef = useRef<HTMLDivElement>(null);
  const funcbarRef = useRef<HTMLDivElement>(null);
  const { width: innerWidth, height: innerHeight } = useWindowSize();
  const [scrollTop, setScrollTop] = useState(0);

  // biome-ignore lint/correctness/useExhaustiveDependencies: useEffect
  useEffect(() => {
    const searchTitle = (paramsTitle || "") as string;
    const startIdx = (paramsStartIdx || "") as string;

    doManualsPage.init(manualsPageID, bid, path, searchTitle, startIdx);
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

  // const errmsg = manualsPage.errmsg || "";

  const width = innerWidth;
  const listHeight = innerHeight - headerHeight - funcbarHeight;

  const headerTitle = "(精華區) " + brdname + " - " + title;

  const loadPre = (_item: ManArticleSummary_i) => {};

  const loadNext = (_item: ManArticleSummary_i) => {};

  const onVerticalScroll = (scrollTop: number): boolean => {
    setScrollTop(scrollTop);
    if (scrollToRow === null) {
      return false;
    }

    doManualsPage.setData(manualsPageID, { scrollToRow: undefined });
    return true;
  };

  // const allErrMsg = errors.mergeErr(errMsg, errmsg);
  const renderManuals = () => {
    if (manuals.length === 0) {
      return (
        <EmptyList
          prompt="這個精華區目前沒有文章喔～"
          width={width}
          height={listHeight}
        />
      );
    } else {
      return (
        <ManualList
          manuals={manuals}
          width={width}
          height={listHeight}
          loadPre={loadPre}
          loadNext={loadNext}
          scrollToRow={scrollToRow}
          onVerticalScroll={onVerticalScroll}
          scrollTop={scrollTop}
        />
      );
    }
  };

  const loptions: PttOption[] = [];
  let roptions: PttOption[] = [
    { text: "看板", url: `/board/${bid}/articles` },
    { text: "看板設定/說明", action: () => {} },
  ];
  if (path !== "") {
    const roptions_p: PttOption[] = [
      { text: "離開", url: parentUrl, hotkey: "←" },
    ];
    roptions = roptions_p.concat(roptions);
  }

  const renderHeader = () => {
    return (
      <div
        className={"col d-flex justify-content-between align-items-center px-4"}
      >
        <div className="w-25 "></div>
        <span className="p-0" style={{ fontSize: "x-large" }}>
          {headerTitle}
        </span>
        <div className="w-25"></div>
      </div>
    );
  };

  // NOTE: ref can only be used directly on html tags to get element attributes
  // Will fail if used on React components.
  return (
    <div className={styles.root}>
      <div ref={headerRef}>
        <Header title={headerTitle} renderHeader={renderHeader} />
      </div>
      {renderManuals()}
      <div ref={funcbarRef}>
        <FunctionBar optionsLeft={loptions} optionsRight={roptions} />
      </div>
    </div>
  );
};
