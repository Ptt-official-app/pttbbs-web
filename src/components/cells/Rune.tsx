import type { MouseEvent } from "react";
import styles from "./ContentRenderer.module.css";
import { getClassNamesFromRune } from "./utils";

type Props = {
  rune: any;
  rowIndex?: number;
  idx: number;
  onMouseDown?: (e: MouseEvent, rowIndex: number, idx: number) => void;
  [key: string]: any;
};

export default (props: Props) => {
  let { rune, rowIndex, idx, onMouseDown } = props;
  const [classNames0, isTwoColor] = getClassNamesFromRune(rune);
  const classNamesGroup = rune.pullright ? [styles["pull-right"]] : [];
  const runeKey = `rune-${rowIndex}-${idx}`;
  const _onMouseDown = (e: MouseEvent) => {
    if (!onMouseDown) {
      return;
    }

    rowIndex = rowIndex || 0;
    onMouseDown(e, rowIndex, idx);
  };
  classNames0.push(...classNamesGroup);
  const className0 = classNames0.join(" ");
  if (isTwoColor) {
    return (
      <>
        {[...rune.text].map((ch, idx) => (
          // biome-ignore lint/a11y/noStaticElementInteractions: interaction with the text
          <span
            key={`${runeKey}-${idx}`}
            className={className0}
            onMouseDown={_onMouseDown}
            data-text={ch}
          >
            {ch}
          </span>
        ))}
      </>
    );
  } else {
    return (
      // biome-ignore lint/a11y/noStaticElementInteractions: interaction with the text
      <span key={runeKey} className={className0} onMouseDown={_onMouseDown}>
        {rune.text}
      </span>
    );
  }
};
