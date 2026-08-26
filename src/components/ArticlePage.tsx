import { type CSSProperties, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useKey } from "react-use";
import { useThunk } from "use-thunk";
import useWindowSize from "../hooks/useWindowSize";
import * as DoArticlePage from "../thunks/articlePage";
import type { CharMap, Line } from "../types";
import Article from "./Article";
import FunctionBar from "./FunctionBar";
import Header from "./Header";
import InitConsts from "./InitConsts";
import styles from "./Page.module.css";

export default () => {
  const [articlePage, doArticlePage, articlePageID] = useThunk<
    DoArticlePage.State,
    typeof DoArticlePage
  >(DoArticlePage);

  const {
    isInit,
    isBusyLoading,
    // errmsg,
    brdname,
    title,
    theClass,
    contentComments,
    isNextEnd,
    isPreEnd,
    scrollToRow,
    rank: _rank,
    nRecommend: _nRecommend,
    nComments: _nComments,
    comments,
  } = articlePage;

  const [isInitConsts, setIsInitConsts] = useState(false);

  //init
  const {
    bid: paramsBid,
    aid: paramsAid,
    start_idx: paramsStartIdx,
  } = useParams();
  const bid = paramsBid || "";
  const aid = paramsAid || "";
  const startIdx = paramsStartIdx || "";

  // eslint-disable-next-line
  const [_errMsg, _setErrMsg] = useState("");

  //render
  const [headerHeight, setHeaderHeight] = useState(0);
  const [funcbarHeight, setFuncbarHeight] = useState(0);
  const headerRef = useRef<HTMLDivElement>(null);
  const funcbarRef = useRef<HTMLDivElement>(null);
  const { width: innerWidth, height: innerHeight } = useWindowSize();
  console.info(
    "ArticlePage: after useWindowSize: innerWidth:",
    innerWidth,
    "innerHeight:",
    innerHeight,
  );
  const [_charMap, _setCharMap] = useState<CharMap>({
    width: innerWidth,
    height: innerHeight,
    charMap: {},
  });

  const [scrollTop, _setScrollTop] = useState(0);
  const [isRecommend, setIsRecommend] = useState(false);
  const [_recommendType, setRecommendStyle] = useState(1);
  const recommendTypeRef = useRef<HTMLDivElement>(null);
  const [_recommend, setRecommend] = useState("");
  const [isRecommending, _setIsRecommending] = useState(false);

  // the states that needs to be updated with some lazy-eval functions.
  const [stateDict, _setStateDict] = useState({ isEditing: false });
  stateDict.isEditing = isRecommending;

  //keys
  useKey("X", (_e) => {
    if (stateDict.isEditing) {
      return;
    }
    setIsRecommend(true);
  });

  useKey("Escape", (_e) => {
    if (stateDict.isEditing) {
      return;
    }
    setIsRecommend(false);
  });

  useKey("ArrowLeft", (_e) => {
    if (stateDict.isEditing) {
      return;
    }
    window.location.href = `/board/${bid}/articles`;
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: useEffect
  useEffect(() => {
    if (!isInitConsts) {
      return;
    }

    doArticlePage.init(articlePageID, bid, aid, startIdx);
  }, [isInitConsts, bid, aid, startIdx]);

  useEffect(() => {
    if (isRecommend) {
      setRecommendStyle(1);
      setRecommend("");

      if (recommendTypeRef.current) {
        recommendTypeRef.current.focus();
      }
    } else {
      setRecommendStyle(1);
      setRecommend("");
    }
  }, [isRecommend]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: useEffect
  useEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.clientHeight);
    }
    if (funcbarRef.current) {
      setFuncbarHeight(funcbarRef.current.clientHeight);
    }
  }, [headerRef.current, funcbarRef.current]);

  if (!isInit) {
    return (
      <div className={styles.root}>
        <InitConsts
          windowWidth={innerWidth}
          isMobile={false}
          isInitConsts={isInitConsts}
          setIsInitConsts={setIsInitConsts}
        />
      </div>
    );
  }

  const width = innerWidth;
  const listHeight = innerHeight - headerHeight - funcbarHeight;

  let fullTitle = theClass ? `[${theClass}] ` : "";
  fullTitle += title;
  const headerTitle = brdname ? `${brdname} - ${fullTitle}` : "";

  const loadPre = (_item: Line) => {
    if (!comments.length) {
      return;
    }
    if (isPreEnd) {
      return;
    }
    const startIdx = comments[0].idx || "";
    doArticlePage.getComments(articlePageID, bid, aid, startIdx, true, true);
  };

  const loadNext = (_item: Line) => {
    if (!comments.length) {
      return;
    }
    if (isNextEnd) {
      return;
    }
    const startIdx = comments[comments.length - 1].idx || "";
    doArticlePage.getComments(articlePageID, bid, aid, startIdx, false, true);
  };

  /*
  const onVerticalScroll = (scrollTop: number): boolean => {
    setScrollTop(scrollTop);
    if (typeof scrollToRow === "undefined") {
      return false;
    }

    doArticlePage.setData(articlePageID, { scrollToRow: undefined });

    return true;
  };
  */

  // const allErrMsg = errors.mergeErr(errMsg, errmsg);
  const renderArticle = () => {
    if (isInit && !isBusyLoading && contentComments.length === 0) {
      const style: CSSProperties = {
        width: `${width}px`,
        height: `${listHeight}px`,
      };
      return (
        <div style={style}>
          <h3 className="mx-4"> (目前無法看到文章喔～) </h3>
        </div>
      );
    }

    return (
      <Article
        lines={contentComments}
        width={width}
        height={listHeight}
        loadPre={loadPre}
        loadNext={loadNext}
        scrollToRow={scrollToRow}
        onVerticalScroll={undefined}
        scrollTop={scrollTop}
      />
    );
  };

  /*
  const startRecommend = () => {
    setIsRecommend(true);
  };
  */

  // const header = getState(classHeader);
  // const userID = header ? header.user_id : "";
  // const prefixLength = userID.length;

  /*
  const renderRecommend = () => {
    const submit = (recommendType: string, recommend: Content) => {
      if (recommend) {
        doArticlePage.addRecommend(
          articlePageID,
          bid,
          aid,
          recommendType,
          recommend,
        );
      }
      setIsRecommend(false);
    };
    const cancel = () => {
      setIsRecommend(false);
    };

    return (
      <Recommend
        recommendTypeRef={recommendTypeRef}
        isRecommend={isRecommend}
        recommendType={recommendType}
        setRecommendStyle={setRecommendStyle}
        recommend={recommend}
        setRecommend={setRecommend}
        submit={submit}
        cancel={cancel}
        prefixLength={prefixLength}
        setIsRecommending={setIsRecommending}
      />
    );
  };
  */

  /*
  const loptions = [
    { text: "推/噓", action: startRecommend, hotkey: "X" },
    { render: renderRecommend },
  ];
  */
  const roptions = [
    { text: "離開", url: `/board/${bid}/articles`, hotkey: "←" },
  ];

  return (
    <div className={styles.root}>
      <div ref={headerRef}>
        <Header title={headerTitle} />
      </div>
      {renderArticle()}
      <div ref={funcbarRef}>
        <FunctionBar optionsLeft={[]} optionsRight={roptions} />
      </div>
      <InitConsts
        windowWidth={innerWidth}
        isMobile={false}
        isInitConsts={isInitConsts}
        setIsInitConsts={setIsInitConsts}
      />
    </div>
  );
};
