import { Cell } from "fixed-data-table-2";
import { type CSSProperties, useState } from "react";
import type { ManArticleSummary_i, PttColumn, TableData } from "../types";
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
  {
    Header: "標 題",
    accessor: "title",
    width: CHAR_WIDTH * 48,
    fixed: true,
    headerTextAlign: "left",
  },
  { Header: "", accessor: "", width: 0, fixed: true, type: "rest" },
];

type Props = {
  manuals: ManArticleSummary_i[];
  width: number;
  height: number;
  // biome-ignore lint/complexity/noBannedTypes: loadPre is unknown function
  loadPre: Function;
  // biome-ignore lint/complexity/noBannedTypes: loadNext is unknown function
  loadNext: Function;
  scrollToRow: number;
  onVerticalScroll: (scrollPos: number) => boolean;
  scrollTop: number;
};

export default (props: Props) => {
  const {
    manuals,
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
    data: TableData<any>,
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
    if (textAlign) {
      style.textAlign = textAlign;
    }

    return (
      <Cell className={screenStyles.header} style={style}>
        {column.Header}
      </Cell>
    );
  };

  if (manuals.length === 0) {
    return <div className="container">這個精華區目前沒有文章喔～</div>;
  }

  return (
    <Screen
      width={width}
      height={height}
      columns={_COLUMNS}
      data={manuals}
      renderCell={renderCell}
      renderHeader={renderHeader}
      scrollToRow={scrollToRow}
      onVerticalScroll={onVerticalScroll}
      scrollTop={scrollTop}
    />
  );
};
