import { Cell } from "fixed-data-table-2";
import type { CSSProperties, JSX } from "react";
import type { TableData } from "../types";

type Props = {
  data: TableData<any>;
  fontSize: number;
  rowIndex?: number;
  columnKey?: string | number;
  content: JSX.Element;
  // biome-ignore lint/complexity/noBannedTypes: setRowNum is unknown Function.
  setRowNum: Function;
  highlightRow: number;
  highlightStyle: CSSProperties;
  [key: string]: any;
};

export default (props: Props) => {
  const {
    data,
    fontSize,
    rowIndex: propsRowIndex,
    columnKey,
    content: Content,
    setRowNum,
    highlightRow,
    highlightStyle,
    ...params
  } = props;
  const rowIndex = propsRowIndex || 0;

  const render = () => (
    <>
      {/* @ts-expect-error Content is a JSX.Element */}
      <Content
        data={data}
        rowIndex={rowIndex}
        columnKey={columnKey}
        {...params}
      />
    </>
  );

  let style: CSSProperties = {
    display: "block",
    height: "100%",
    fontSize: `${fontSize}px`,
  };
  if (!rowIndex) {
    style.display = "none";
  }

  if (rowIndex === highlightRow) {
    // assume that we will need to use different highlight for different cell
    style = { ...style, ...highlightStyle };
  }

  const link = data[rowIndex].url;

  return (
    <a href={link} style={style}>
      <Cell style={style}>{render()}</Cell>
    </a>
  );
};
