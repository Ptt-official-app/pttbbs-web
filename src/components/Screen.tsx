import { Cell, Column, Table, type TableProps } from "fixed-data-table-2";
import { useEffect } from "react";
import type { PttColumn, TableData } from "../types";
import runeStyles from "./cells/ContentRenderer.module.css";
import LineCell from "./cells/LineCell";
import styles from "./Screen.module.css";
import { CONSTS, calcScreenScale } from "./utils";

const _DEFAULT_COLUMNS: PttColumn[] = [
  { Header: "", accessor: "", width: 0, fixed: true, type: "rest" },
  {
    Header: "",
    accessor: "line",
    width: CONSTS.BASE_COLUMN_WIDTH,
    fixed: true,
    type: "line",
  },
  { Header: "", accessor: "", width: 0, fixed: true, type: "rest" },
];

const _initBlink = () => {
  // The <body> blinking trick, inspired by PttChrome:
  // https://github.com/robertabcd/PttChrome/blob/dev/src/js/term_buf.js TermBuf.prototype.notify()
  const interval = setInterval(
    () => document.body.classList.toggle(runeStyles["hide-blink"]),
    1000,
  );
  return () => {
    clearInterval(interval);
    document.body.classList.remove(runeStyles["hide-blink"]);
  };
};

type Props = {
  width: number;
  height: number;
  columns?: PttColumn[];
  data: TableData<any>;
  // biome-ignore lint/complexity/noBannedTypes: renderCell is unknown Function
  renderCell: Function;
  // biome-ignore lint/complexity/noBannedTypes: renderHeader is unknown Function
  renderHeader?: Function;

  scrollTop?: number;
  onVerticalScroll?: (scrollPos: number) => boolean;
  scrollToRow?: number | null;
  onScrollStart?: (
    x: number,
    y: number,
    firstRowIndex: number,
    endRowIndex: number,
  ) => void;
  onScrollEnd?: (
    x: number,
    y: number,
    firstRowIndex: number,
    endRowIndex: number,
  ) => void;
};

export default (props: Props) => {
  const {
    width,
    height,
    columns: propsColumns,
    data,
    renderCell: propsRenderCell,
    renderHeader,
    scrollTop,
    onVerticalScroll,
    scrollToRow,
    onScrollStart,
    onScrollEnd,
  } = props;

  useEffect(_initBlink, []);

  const columns = propsColumns || _DEFAULT_COLUMNS;

  const { scale, lineHeight, fontSize } = calcScreenScale(width);

  //console.log('Screen: scale:', scale, 'lineHeight:', lineHeight, 'fontSize:', fontSize)
  const headerHeight = typeof renderHeader !== "undefined" ? lineHeight : 0;
  const rowHeight = lineHeight;
  const scaleWidth = columns.reduce(
    (r, x, _i) => r + Math.floor(x.width * scale),
    0,
  );
  const theRestWidth = Math.floor((width - scaleWidth) / 2);

  //render-cell
  const defaultRenderCell = (
    column: PttColumn,
    data: TableData<any>,
    fontSize: number,
  ) => {
    switch (column.type) {
      case "line":
        return <LineCell column={column} data={data} fontSize={fontSize} />;
      default:
        return <Cell className={styles.default}></Cell>;
    }
  };

  const renderCell = propsRenderCell || defaultRenderCell;

  const renderColumn = (
    column: PttColumn,
    idx: number,
    data: TableData<any>,
  ) => {
    const columnWidth =
      column.type === "rest" ? theRestWidth : Math.floor(column.width * scale);
    return (
      <Column
        key={`column${idx}`}
        columnKey={column.accessor}
        header={
          typeof renderHeader !== "undefined"
            ? renderHeader(column, fontSize)
            : null
        }
        cell={renderCell(column, data, fontSize, lineHeight)}
        fixed={column.fixed || false}
        width={columnWidth}
      />
    );
  };

  const scroll: Partial<TableProps> = {};

  scroll.scrollToRow = scrollToRow ?? undefined;
  scroll.scrollTop = scrollTop ?? undefined;

  scroll.onVerticalScroll = onVerticalScroll ?? undefined;
  scroll.onScrollStart = onScrollStart ?? undefined;
  scroll.onScrollEnd = onScrollEnd ?? undefined;
  scroll.touchScrollEnabled = true;

  console.info("Screen: Table: width:", width, "height:", height);

  return (
    <Table
      rowHeight={rowHeight}
      rowsCount={data.length}
      headerHeight={headerHeight}
      width={width}
      height={height}
      showScrollbarX={false}
      showScrollbarY={false}
      {...scroll}
    >
      {columns.map((column, idx) => renderColumn(column, idx, data))}
    </Table>
  );
};
