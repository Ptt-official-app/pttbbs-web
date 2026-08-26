import {
  type FocusEvent,
  type MouseEvent,
  type SubmitEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { useParams } from "react-router-dom";
import { DropdownList } from "react-widgets";
import { useThunk } from "use-thunk";
import useWindowSize from "../hooks/useWindowSize";
import * as DoNewArticlePage from "../thunks/newArticlePage";
import type { EditLine } from "../types";
import Editor from "./Editor";
import FunctionBar from "./FunctionBar";
import Header from "./Header";
import InitConsts from "./InitConsts";
import styles from "./NewArticlePage.module.css";
import pageStyles from "./Page.module.css";

export default () => {
  const [newArticlePage, doNewArticlePage, newArticlePageID] = useThunk<
    DoNewArticlePage.State,
    typeof DoNewArticlePage
  >(DoNewArticlePage);
  const { errmsg, brdname, post_type, theClass } = newArticlePage;
  const postTypes = post_type.map((each) => ({
    value: each,
    label: "[" + each + "]",
  }));

  const [headerHeight, setHeaderHeight] = useState(0);
  const [funcbarHeight, setFuncbarHeight] = useState(0);
  const headerRef = useRef<HTMLDivElement>(null);
  const funcbarRef = useRef<HTMLDivElement>(null);
  const [isShowCursor, setIsShowCursor] = useState(true);
  const isShowCursorRef = useRef(isShowCursor);

  // eslint-disable-next-line
  const [errMsg, setErrMsg] = useState("");

  const [isInitConsts, setIsInitConsts] = useState(false);

  const { bid: paramsBid } = useParams();
  const bid = paramsBid || "";

  //init
  // biome-ignore lint/correctness/useExhaustiveDependencies: useEffect
  useEffect(() => {
    doNewArticlePage.init(newArticlePageID, bid);

    const interval = setInterval(() => {
      setIsShowCursor(!isShowCursorRef.current);
    }, 500);
    return () => clearInterval(interval);
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

  const { width: innerWidth, height: innerHeight } = useWindowSize();
  const screenWidth = innerWidth;
  const screenHeight = innerHeight - headerHeight - funcbarHeight;

  const [selectedRow, setSelectedRow] = useState(0);
  const [selectedColumn, setSelectedColumn] = useState(0);

  const [title, setTitle] = useState("");

  const [content, setContent] = useState<EditLine[]>([]);

  const setTheClass = (newClass: string) => {
    doNewArticlePage.setData(newArticlePageID, { theClass: newClass });
  };

  const submit = (_e: SubmitEvent) => {
    if (!theClass) {
      showErrMsg("您忘記類別囉～");
      return;
    }
    if (!title) {
      showErrMsg("您忘記標題囉～");
      return;
    }
    doNewArticlePage.submit(newArticlePageID, bid, theClass, title, content);
  };

  const allErrMsg: string[] = [];
  if (errMsg) {
    allErrMsg.push(errMsg);
  }
  if (errmsg) {
    allErrMsg.push(errmsg);
  }
  const renderError = () => {
    return (
      <span className={"nav-link " + styles.error}>{allErrMsg.join(",")}</span>
    );
  };

  const loptions = [
    { text: "發表文章", action: submit },
    { render: renderError },
  ];
  const roptions = [
    { text: selectedRow + 1 + "," + (selectedColumn + 1) },
    { text: "離開", url: `/board/${bid}/articles` },
  ];

  const onFocus = (_e: FocusEvent) => {
    //console.log('NewArticlePage: onFocus: start')
  };

  const onBlur = (_e: FocusEvent) => {
    //console.log('NewArticlePage: onBlur: start')
  };

  const showErrMsg = (text: string) => {
    setErrMsg(text);
    setTimeout(() => cleanErrMsg(), 1000);
  };

  const cleanErrMsg = () => {
    setErrMsg("");
    doNewArticlePage.setData(newArticlePageID, { errmsg: "" });
  };

  const onMouseDownHeader = (_e: MouseEvent) => {
    //console.log('NewArticlePage: onMouseDownHeader: start')
  };

  const classStyle = {
    width: "170px",
    display: "inline-block",
  };

  const renderHeader = () => {
    return (
      <div className={"col " + styles.title}>
        <span>{brdname} - </span>
        <DropdownList
          style={classStyle}
          containerClassName={styles["title-class"]}
          data={postTypes}
          value={theClass}
          dataKey="value"
          textField="label"
          onChange={(item) => {
            setTheClass(item.value);
          }}
        />
        <input
          className={styles["title-input"]}
          onChange={(e) => setTitle(e.target.value)}
          defaultValue={title}
          onMouseDown={onMouseDownHeader}
          placeholder={"標題:"}
        />
      </div>
    );
  };

  return (
    <>
      {/* biome-ignore lint/a11y/noStaticElementInteractions: onFocus and onBlur on the whole page */}
      <div className={pageStyles.root} onFocus={onFocus} onBlur={onBlur}>
        <div ref={headerRef}>
          <Header title={""} renderHeader={renderHeader} />
        </div>

        <Editor
          contentLines={content}
          setContentLines={setContent}
          width={screenWidth}
          height={screenHeight}
          selectedRow={selectedRow}
          setSelectedRow={setSelectedRow}
          selectedColumn={selectedColumn}
          setSelectedColumn={setSelectedColumn}
        />

        <div ref={funcbarRef}>
          <FunctionBar optionsLeft={loptions} optionsRight={roptions} />
        </div>
        <InitConsts
          windowWidth={innerWidth}
          isMobile={false}
          isInitConsts={isInitConsts}
          setIsInitConsts={setIsInitConsts}
        />
      </div>
    </>
  );
};
