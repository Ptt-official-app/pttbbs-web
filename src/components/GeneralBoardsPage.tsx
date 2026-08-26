import config from "config";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useThunk } from "use-thunk";
import useWindowSize from "../hooks/useWindowSize";
import * as DoGeneralBoardsPage from "../thunks/generalBoardsPage";
import * as DoHeader from "../thunks/header";
import type { BoardSummary_i } from "../types";
import BoardList from "./BoardList";
import FunctionBar from "./FunctionBar";
import Header from "./Header";
import pageStyles from "./Page.module.css";
import SearchBar from "./SearchBar";

export default () => {
  const [generalBoardsPage, doGeneralBoardsPage, generalBoardsPageID] =
    useThunk<DoGeneralBoardsPage.State, typeof DoGeneralBoardsPage>(
      DoGeneralBoardsPage,
    );

  const {
    list: boards,
    isNextEnd,
    isPreEnd,
    scrollToRow,
    searchKeyword,
  } = generalBoardsPage;

  const [header] = useThunk<DoHeader.State, typeof DoHeader>(DoHeader);
  const { userID } = header;

  // eslint-disable-next-line
  const [_errMsg, _setErrMsg] = useState("");

  // eslint-disable-next-line
  const [isByClass, _setIsByClass] = useState(true);

  //render
  const [headerHeight, setHeaderHeight] = useState(0);
  const [funcbarHeight, setFuncbarHeight] = useState(0);
  const headerRef = useRef<HTMLDivElement>(null);
  const funcbarRef = useRef<HTMLDivElement>(null);
  const { width: innerWidth, height: innerHeight } = useWindowSize();
  const [scrollTop, setScrollTop] = useState(0);
  const [searching, setSearching] = useState(false);

  const { start_idx: paramsStartIdx, title: paramsTitle } = useParams();
  const startIdx = paramsStartIdx || "";

  //init
  // biome-ignore lint/correctness/useExhaustiveDependencies: useEffect
  useEffect(() => {
    const searchKeyword = paramsTitle || "";

    doGeneralBoardsPage.init(
      generalBoardsPageID,
      searchKeyword,
      startIdx,
      isByClass,
    );
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

  //get data

  const width = innerWidth;
  const listHeight = innerHeight - headerHeight - funcbarHeight;

  const title = "所有看板";

  const loadPre = (item: BoardSummary_i) => {
    if (item.numIdx === 1 || isPreEnd) {
      return;
    }

    const idx = item.idx || "";
    if (!idx) {
      return;
    }
    doGeneralBoardsPage.getBoards(
      generalBoardsPageID,
      searchKeyword,
      idx,
      true,
      true,
      isByClass,
    );
  };

  const loadNext = (item: BoardSummary_i) => {
    if (isNextEnd) {
      return;
    }

    const idx = item.idx || "";
    if (!idx) {
      return;
    }

    doGeneralBoardsPage.getBoards(
      generalBoardsPageID,
      searchKeyword,
      idx,
      false,
      true,
      isByClass,
    );
  };

  const onVerticalScroll = (scrollTop: number): boolean => {
    setScrollTop(scrollTop);
    if (typeof scrollToRow === "undefined") {
      return false;
    }

    doGeneralBoardsPage.setData(generalBoardsPageID, {
      scrollToRow: undefined,
    });
    return true;
  };

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
    text: "分類看板",
    action: () => {
      window.location.href = "/cls/1";
    },
  });

  const onSearchSubmit = () => {
    searchKeyword === "" ? setSearching(false) : setSearching(true);
    // clear articles
    // load more
    doGeneralBoardsPage.getBoards(
      generalBoardsPageID,
      searchKeyword,
      "",
      false,
      false,
      isByClass,
    );
  };

  const onSearchClear = () => {
    setSearching(false);
    doGeneralBoardsPage.setData(generalBoardsPageID, { searchKeyword: "" });
    doGeneralBoardsPage.getBoards(
      generalBoardsPageID,
      "",
      "",
      false,
      false,
      isByClass,
    );
  };

  const renderHeader = () => {
    return (
      <div
        className={"col d-flex justify-content-between align-items-center px-4"}
      >
        <div className="w-25 "></div>
        <span className="p-0" style={{ fontSize: "x-large" }}>
          {title}
        </span>
        <div className="w-25">
          <SearchBar
            text={searchKeyword}
            setText={(text: string) => {
              doGeneralBoardsPage.setData(generalBoardsPageID, {
                searchKeyword: text,
              });
            }}
            onSearch={onSearchSubmit}
            searching={searching}
            onClear={onSearchClear}
            prompt={"搜尋板名..."}
          />
        </div>
      </div>
    );
  };

  return (
    <div className={pageStyles.root}>
      <div ref={headerRef}>
        <Header title={title} renderHeader={renderHeader} />
      </div>
      {renderBoards()}
      <div ref={funcbarRef}>
        <FunctionBar optionsLeft={loptions} optionsRight={roptions} />
      </div>
    </div>
  );
};
