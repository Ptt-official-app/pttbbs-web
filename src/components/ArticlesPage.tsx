import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useKey } from "react-use";
import { useThunk } from "use-thunk";
import useWindowSize from "../hooks/useWindowSize";
import * as DoArticlesPage from "../thunks/articlesPage";
import type { ArticleSummary_i } from "../types";
import ArticleList from "./ArticleList";
import EmptyList from "./EmptyList";
import FunctionBar from "./FunctionBar";
import Header from "./Header";
import styles from "./Page.module.css";
import SearchBar from "./SearchBar";
import { getBoardParent } from "./utils";

export default () => {
  const [articlesPage, doArticlesPage, articlesPageID] = useThunk<
    DoArticlesPage.State,
    typeof DoArticlesPage
  >(DoArticlesPage);

  const {
    // errmsg,
    bid,
    brdname,
    title,
    searchTitle,
    isNextEnd,
    isPreEnd,
    scrollToRow,
    allArticles: articles,
    isBusyLoading,
    isBusyLoadingBoardSummary,
    isBusyLoadingBottom,
    isInit: articlesIsInit,
  } = articlesPage;

  //render
  const [headerHeight, setHeaderHeight] = useState(0);
  const [funcbarHeight, setFuncbarHeight] = useState(0);
  const headerRef = useRef<HTMLDivElement>(null);
  const funcbarRef = useRef<HTMLDivElement>(null);
  const { width: innerWidth, height: innerHeight } = useWindowSize();
  const [scrollTop, setScrollTop] = useState(0);
  const [searching, setSearching] = useState(false);

  //keys
  const parentPage = getBoardParent() || "/boards/popular";
  useKey("ArrowLeft", (_e) => {
    window.location.href = parentPage;
  });

  //init
  const {
    bid: paramsBid,
    start_idx: paramsStartIdx,
    title: paramsTitle,
  } = useParams();
  const startIdx = paramsStartIdx || "";

  // biome-ignore lint/correctness/useExhaustiveDependencies: useEffect
  useEffect(() => {
    const theBid = paramsBid || "";
    const searchTitle = paramsTitle || "";
    if (articlesIsInit && bid === theBid) {
      return;
    }

    if (!articlesIsInit) {
      doArticlesPage.init(articlesPageID, theBid, searchTitle, startIdx);
      return;
    }

    doArticlesPage.getBoardSummary(
      articlesPageID,
      theBid,
      true,
      searchTitle,
      startIdx,
    );
  }, [bid, articlesIsInit, paramsBid, paramsTitle, startIdx]);

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
  const headerTitle = brdname + " - " + title;

  // event handlers
  const loadPre = (item: ArticleSummary_i) => {
    if (item.numIdx === 1 || isPreEnd) {
      return;
    }

    const idx = item.idx || "";
    if (!idx) {
      return;
    }
    doArticlesPage.getArticles(
      articlesPageID,
      bid,
      searchTitle,
      idx,
      true,
      true,
    );
  };

  const loadNext = (item: ArticleSummary_i) => {
    if (isNextEnd) {
      return;
    }

    const idx = item.idx || "";
    if (!idx) {
      return;
    }

    doArticlesPage.getArticles(
      articlesPageID,
      bid,
      searchTitle,
      idx,
      false,
      true,
    );
  };

  const onVerticalScroll = (scrollTop: number): boolean => {
    setScrollTop(scrollTop);
    if (scrollToRow === null) {
      return false;
    }

    doArticlesPage.setData(articlesPageID, { scrollToRow: undefined });

    return true;
  };

  const onSearchSubmit = () => {
    searchTitle === "" ? setSearching(false) : setSearching(true);
    // clear articles
    // load more
    doArticlesPage.getArticles(
      articlesPageID,
      bid,
      searchTitle,
      "",
      true,
      false,
    );
  };

  const onSearchClear = () => {
    setSearching(false);
    const searchTitle = "";
    doArticlesPage.setData(articlesPageID, { searchTitle });
    doArticlesPage.getArticles(
      articlesPageID,
      bid,
      searchTitle,
      "",
      true,
      false,
    );
  };

  // const allErrMsg = errors.mergeErr(errMsg, errmsg);
  const renderArticles = () => {
    if (
      articlesIsInit &&
      !isBusyLoading &&
      !isBusyLoadingBoardSummary &&
      !isBusyLoadingBottom &&
      articles.length === 0
    ) {
      return (
        <EmptyList
          prompt="這個看板目前沒有文章喔～"
          width={width}
          height={listHeight}
        />
      );
    } else {
      return (
        <ArticleList
          articles={articles}
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

  /*
  const loptions = [{ text: "發表文章", url: `/board/${bid}/post` }];
  const roptions = [
    { text: "精華區", url: `/board/${bid}/manual` },
    { text: "看板設定/說明", action: () => {} },
  ];
  */

  const renderHeader = () => {
    return (
      <div
        className={"col d-flex justify-content-between align-items-center px-4"}
      >
        <div className="w-25 "></div>
        <span className="p-0" style={{ fontSize: "x-large" }}>
          {headerTitle}
        </span>
        <div className="w-25">
          <SearchBar
            text={searchTitle}
            setText={(text: string) => {
              doArticlesPage.setData(articlesPageID, { searchTitle: text });
            }}
            onSearch={onSearchSubmit}
            searching={searching}
            onClear={onSearchClear}
            prompt={"搜尋文章..."}
          />
        </div>
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
      {renderArticles()}
      <div ref={funcbarRef}>
        <FunctionBar optionsLeft={[]} optionsRight={[]} />
      </div>
    </div>
  );
};
