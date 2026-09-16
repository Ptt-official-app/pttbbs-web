import type {
  CSSProperties,
  Dispatch,
  MouseEvent,
  RefObject,
  SetStateAction,
} from "react";

import {
  COLOR_BACKGROUND_BLACK,
  COLOR_FOREGROUND_WHITE,
} from "../../constants";
import type { EditLine, EditRune_t, EditRunes_t, TableData } from "../../types";
import { SCREEN_WIDTH } from "../utils";
import styles from "./ContentRenderer.module.css";
import EditCell from "./EditCell";
import Rune from "./Rune";
import { calcRunesCount } from "./utils";

type Props = {
  data: TableData<EditLine>;
  rowIndex?: number;
  columnKey?: string;
  selectedRow: number;
  isFocus?: boolean;
  onMouseDownCell?: (e: MouseEvent, rowIndex: number, idx: number) => void;
  onMouseDownTail?: (e: MouseEvent, rowIndex: number, idx: number) => void;
  selectedColumn: number;
  newLine: () => void;
  upLine: () => number;
  nextLine: () => number;
  isCtrl: boolean;
  setIsCtrl: Dispatch<SetStateAction<boolean>>;
  submit: () => void;

  focusInputRef: RefObject<HTMLInputElement>;

  updateContent: (row: number, col: number, text: string) => void;
  deleteContent: (row: number, col: number) => void;

  inputWidth: number;
  setInputWidth: Dispatch<SetStateAction<number>>;

  leftColumn: () => number;
  rightColumn: () => number;
};

export default (props: Props) => {
  let {
    data,
    rowIndex,
    columnKey,
    selectedRow,
    selectedColumn,
    isFocus,
    onMouseDownCell,
    onMouseDownTail,
  } = props;
  rowIndex = rowIndex || 0;
  columnKey = columnKey || "";
  isFocus = isFocus || false;
  const item: EditLine = data[rowIndex];
  let runes: EditRunes_t = item.runes;
  const background = data[rowIndex].background || COLOR_BACKGROUND_BLACK;

  //console.log('Edit: rowIndex:', rowIndex, 'item:', item, 'isTail:', item.isTail)

  if (item.isTail) {
    //console.log('Edit: rowIndex:', rowIndex, 'to render tail')
    return (
      <div key={`edit-${rowIndex}`} className={styles[`c${background}`]}>
        {runes.map((each, idx) => (
          <Rune
            key={`edit-${idx}`}
            rune={each}
            idx={idx}
            onMouseDown={onMouseDownTail}
            {...props}
          />
        ))}
      </div>
    );
  }

  const tail = _calcTail(runes);
  if (tail !== null) {
    runes = runes.concat([tail]);
  }

  //console.log('Edit: rowIndex:', rowIndex, 'selectedRow:', selectedRow, 'selectedColumn:', selectedColumn, 'tail:', tail, 'runes:', runes, 'isFocus:', isFocus, 'focusInputRef:', focusInputRef.current, 'activeElement:', document.activeElement, 'focusInputRef.current === activeElement', focusInputRef.current === document.activeElement)

  const render = (rune: EditRune_t, idx: number) => {
    const isRune = rowIndex !== selectedRow || idx !== selectedColumn;
    const Render = isRune ? Rune : EditCell;

    return (
      <Render
        key={`edit-${idx}`}
        rune={rune}
        idx={idx}
        onMouseDown={onMouseDownCell}
        {...props}
      />
    );
  };

  const theStyle: CSSProperties = {
    whiteSpace: "nowrap",
    overflowX: "visible",
  };

  return (
    <div
      key={`edit-${rowIndex}`}
      className={styles[`c${background}`]}
      style={theStyle}
    >
      {runes.map((each, idx) => render(each, idx))}
    </div>
  );
};

const _calcTail = (runes: EditRunes_t): EditRune_t | null => {
  const count = calcRunesCount(runes);

  let n = SCREEN_WIDTH - count;
  if (n < 0) {
    n = 0;
  }

  return {
    text: " ".repeat(n),
    color0: {
      foreground: COLOR_FOREGROUND_WHITE,
      background: COLOR_BACKGROUND_BLACK,
    },
    isEdit: false,
    isTail: true,
  };
};
