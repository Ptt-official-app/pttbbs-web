import { Cell } from "fixed-data-table-2";
import { type CSSProperties, useState } from "react";
import type { ArticleSummary_i, PttColumn } from "../types";
import Category from "./cells/Category";
import CommNum from "./cells/CommNum";
import Idx from "./cells/Idx";
import PlainText from "./cells/PlainText";
import PostDate from "./cells/PostDate";
import RowHighlightedCell from "./cells/RowHighlightedCell";
import State from "./cells/State";

import Screen from "./Screen";
import screenStyles from "./Screen.module.css";
import { CHAR_WIDTH } from "./utils";

const _COLUMNS: PttColumn[] = [
  { Header: "", accessor: "", width: 0, fixed: true, type: "rest" },
  //{ Header: "", accessor: "read", width: CHAR_WIDTH * 2, fixed: true },
  { Header: "", accessor: "recommend", width: CHAR_WIDTH * 2, fixed: true },
  {
    Header: "日期",
    accessor: "create_time",
    width: CHAR_WIDTH * 5,
    fixed: true,
  },
  { Header: "類別", accessor: "class", width: CHAR_WIDTH * 6, fixed: true },
  {
    Header: "標 題",
    accessor: "title",
    width: CHAR_WIDTH * 48,
    fixed: true,
    headerTextAlign: "left",
  },
  { Header: "作者", accessor: "owner", width: CHAR_WIDTH * 14, fixed: true },
  { Header: "編號", accessor: "numIdx", width: CHAR_WIDTH * 6, fixed: true },
  { Header: "", accessor: "", width: 0, fixed: true, type: "rest" },
];

type Props = {
  articles: ArticleSummary_i[];
  width: number;
  height: number;
  // biome-ignore lint/complexity/noBannedTypes: loadPre is unknown function.
  loadPre: Function;
  // biome-ignore lint/complexity/noBannedTypes: loadNext is unknown function.
  loadNext: Function;
  scrollToRow?: number;
  onVerticalScroll: (scrollPos: number) => boolean;
  scrollTop: number;
};

export default (props: Props) => {
  const {
    articles,
    width,
    height,
    loadPre,
    loadNext,
    scrollToRow,
    onVerticalScroll,
    scrollTop,
  } = props;

  const [selectedRow, setSeletedRow] = useState(-1);

  // assume that we will need to use different highlight for different cell
  const defaultHighlight = {
    backgroundColor: "#333",
  };

  const renderCell = (
    column: PttColumn,
    data: ArticleSummary_i[],
    fontSize: number,
  ) => {
    let renderer = null;

    switch (column.accessor) {
      case "numIdx":
        renderer = Idx;
        break;
      case "read":
        renderer = State;
        break;
      case "recommend":
        renderer = CommNum;
        break;
      case "create_time":
        renderer = PostDate;
        break;
      case "class":
        renderer = Category;
        break;
      case "title":
        renderer = PlainText;
        break;
      case "owner":
        renderer = PlainText;
        break;
      default:
        return <Cell className={screenStyles.default}></Cell>;
    }
    return (
      <RowHighlightedCell
        column={column}
        data={data}
        fontSize={fontSize}
        content={renderer}
        setRowNum={setSeletedRow}
        highlightRow={selectedRow}
        highlightStyle={defaultHighlight}
        loadPre={loadPre}
        loadNext={loadNext}
      />
    );
  };

  const renderHeader = (column: PttColumn, fontSize: number) => {
    const style: CSSProperties = {
      fontSize: `${fontSize}px`,
    };
    const textAlign = column.headerTextAlign;
    if (typeof textAlign !== "undefined") {
      style.textAlign = textAlign;
    }

    return (
      <Cell className={screenStyles.header} style={style}>
        {column.Header}
      </Cell>
    );
  };

  if (articles.length === 0) {
    const style: CSSProperties = {
      width: `${width}px`,
      height: `${height}px`,
    };
    return <div style={style}></div>;
  }

  return (
    <Screen
      width={width}
      height={height}
      columns={_COLUMNS}
      data={articles}
      renderCell={renderCell}
      renderHeader={renderHeader}
      scrollToRow={scrollToRow}
      onVerticalScroll={onVerticalScroll}
      scrollTop={scrollTop}
    />
  );
};
