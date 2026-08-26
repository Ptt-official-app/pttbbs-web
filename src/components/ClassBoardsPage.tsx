import config from "config";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useThunk } from "use-thunk";
import useWindowSize from "../hooks/useWindowSize";
import * as DoClassBoardsPage from "../thunks/classBoardsPage";
import * as DoHeader from "../thunks/header";
import type { BoardSummary_i } from "../types";
import BoardList from "./BoardList";
import FunctionBar from "./FunctionBar";
import Header from "./Header";
import pageStyles from "./Page.module.css";

export default () => {
  const [classBoardsPage, doClassBoardsPage, classBoardsPageID] = useThunk<
    DoClassBoardsPage.State,
    typeof DoClassBoardsPage
  >(DoClassBoardsPage);
  const { list: boards, isNextEnd, isPreEnd, scrollToRow } = classBoardsPage;

  const [header] = useThunk<DoHeader.State, typeof DoHeader>(DoHeader);
  const { userID } = header;

  // eslint-disable-next-line
  const [_errMsg, _setErrMsg] = useState("");

  //render
  const [headerHeight, setHeaderHeight] = useState(0);
  const [funcbarHeight, setFuncbarHeight] = useState(0);
  const headerRef = useRef<HTMLDivElement>(null);
  const funcbarRef = useRef<HTMLDivElement>(null);
  const { width: innerWidth, height: innerHeight } = useWindowSize();
  const [scrollTop, setScrollTop] = useState(0);

  const { clsID: paramsClsID, start_idx: paramsStartIdx } = useParams();
  const clsID = parseInt(paramsClsID || "0", 10);
  const startIdx = paramsStartIdx || "";

  //init
  // biome-ignore lint/correctness/useExhaustiveDependencies: useEffect
  useEffect(() => {
    doClassBoardsPage.init(classBoardsPageID, clsID, startIdx);
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

  const width = innerWidth;
  const listHeight = innerHeight - headerHeight - funcbarHeight;

  const title = "分類看板";

  const loadPre = (item: BoardSummary_i) => {
    if (item.numIdx === 1 || isPreEnd) {
      return;
    }

    const idx = item.idx || "";
    if (!idx) {
      return;
    }
    doClassBoardsPage.getBoards(classBoardsPageID, clsID, idx, true, true);
  };

  const loadNext = (item: BoardSummary_i) => {
    if (isNextEnd) {
      return;
    }

    const idx = item.idx || "";
    if (!idx) {
      return;
    }

    doClassBoardsPage.getBoards(classBoardsPageID, clsID, idx, false, true);
  };

  const onVerticalScroll = (scrollTop: number): boolean => {
    setScrollTop(scrollTop);
    if (typeof scrollToRow === "undefined") {
      return false;
    }

    doClassBoardsPage.setData(classBoardsPageID, { scrollToRow: undefined });
    return true;
  };

  // eslint-disable-next-line
  // const allErrMsg = errors.mergeErr(errMsg, errmsg);
  const renderBoards = () => {
    if (boards.length === 0) {
      const style = {
        height: listHeight,
      };
      return (
        <div className="container" style={style}>
          <h3 className="mx-4">目前找不到看板喔～</h3>
        </div>
      );
    } else {
      return (
        <BoardList
          boards={boards}
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

  const loptions = [{ text: "搜尋看板", action: () => {} }];

  const roptions = [];
  if (userID && userID !== config.PTT_GUEST) {
    roptions.push({
      text: "我的最愛",
      action: () => {
        window.location.href = "/user/" + userID + "/favorites";
      },
    });
  }
  roptions.push({
    text: "熱門看板",
    action: () => {
      window.location.href = "/boards/popular";
    },
  });
  roptions.push({
    text: "所有看板",
    action: () => {
      window.location.href = "/boards";
    },
  });

  return (
    <div className={pageStyles.root}>
      <div ref={headerRef}>
        <Header title={title} />
      </div>
      {renderBoards()}
      <div ref={funcbarRef}>
        <FunctionBar optionsLeft={loptions} optionsRight={roptions} />
      </div>
    </div>
  );
};
