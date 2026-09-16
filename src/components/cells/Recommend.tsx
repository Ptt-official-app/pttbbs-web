import {
  type CSSProperties,
  type Dispatch,
  type KeyboardEvent,
  type RefObject,
  type SetStateAction,
  useState,
} from "react";
import { OverlayTrigger, Tooltip, type TooltipProps } from "react-bootstrap";
import { DropdownList } from "react-widgets";
import type { RecommendType } from "../../types";
import { EDIT_SCREEN_WIDTH } from "../utils";
import styles from "./ContentRenderer.module.css";

const _RECOMMEND_TYPES = [
  { value: 1, label: "1. 推" },
  { value: 2, label: "2. 噓" },
  { value: 3, label: "3. →" },
];

const MAX_RECOMMEND_LENGTH = EDIT_SCREEN_WIDTH - 3 - 12 - 2;

type Props = {
  recommendType: number;
  setRecommendStyle: Dispatch<SetStateAction<number>>;
  recommend: string;
  setRecommend: Dispatch<SetStateAction<string>>;
  isRecommend: boolean;
  recommendTypeRef: RefObject<HTMLDivElement | null>;
  // biome-ignore lint/complexity/noBannedTypes: submit is unknown function.
  submit: Function;
  // biome-ignore lint/complexity/noBannedTypes: cancels is unknown function.
  cancel: Function;
  prefixLength: number;
  setIsRecommending: Dispatch<SetStateAction<boolean>>;
};

export default (props: Props) => {
  const {
    recommendType,
    setRecommendStyle,
    recommend,
    setRecommend,
    isRecommend,
    recommendTypeRef,
    submit,
    cancel,
    prefixLength,
    setIsRecommending,
  } = props;

  const [searchTerm, setSearchTerm] = useState("");

  const classStyle = {
    width: "150px",
    display: "inline-block",
  };

  const style: CSSProperties = {};
  if (!isRecommend) {
    style.display = "none";
  }

  const renderSubmitTooltip = (props: TooltipProps) => (
    <Tooltip {...props}>快速鍵：⏎</Tooltip>
  );

  const renderCancelTooltip = (props: TooltipProps) => (
    <Tooltip {...props}>快速鍵：ESC</Tooltip>
  );

  const theSetRecommend = (value: string) => {
    const length = _countRune(value);
    if (length >= MAX_RECOMMEND_LENGTH - prefixLength) {
      console.log(
        "theSetRecommend: length > threshold: length:",
        length,
        "prefixLength:",
        prefixLength,
        "threshold:",
        MAX_RECOMMEND_LENGTH - prefixLength,
      );
      return;
    }
    setRecommend(value);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.nativeEvent.isComposing) {
      return;
    }

    switch (e.key) {
      case "Enter":
        submit(recommendType, recommend);
        break;
      case "Escape":
        cancel();
        break;
      default:
        break;
    }
  };

  const onSearch = (item: string) => {
    console.log(
      "Recommend.onSearch: item:",
      item,
      "recommendType:",
      recommendType,
    );
    switch (item) {
      case "1":
      case "推":
        item = "";
        setRecommendStyle(1);
        break;
      case "2":
      case "噓":
        item = "";
        setRecommendStyle(2);
        break;
      case "3":
      case "→":
        item = "";
        setRecommendStyle(3);
        break;
      case "X":
        item = "";
        break;
      default:
        break;
    }

    setSearchTerm(item);
  };

  const onChange = (item: RecommendType | null) => {
    console.log("Recommend.onChange: item:", item);
    let value = item?.value;
    if (value !== 1 && value !== 2 && value !== 3) {
      value = 1;
    }
    setSearchTerm("");
    setRecommendStyle(value);
  };

  const onSelect = (item: RecommendType | null) => {
    console.log("Recommend.onSelect: item:", item);
    let value = item?.value;
    if (value !== 1 && value !== 2 && value !== 3) {
      value = 1;
    }
    setSearchTerm("");
    setRecommendStyle(value);
  };

  const onClickCancel = () => {
    cancel();
  };

  const onClickSubmit = () => {
    submit(recommendType, recommend);
  };

  const onFocusInput = () => {
    setIsRecommending(true);
  };

  const onBlurInput = () => {
    setIsRecommending(false);
  };

  return (
    <div className={styles.recommend} style={style}>
      <DropdownList
        ref={recommendTypeRef}
        style={classStyle}
        data={_RECOMMEND_TYPES}
        value={recommendType}
        dataKey="value"
        textField="label"
        onChange={onChange}
        dropUp={true}
        onSearch={onSearch}
        searchTerm={searchTerm}
        filter={"contains"}
        onSelect={onSelect}
      />
      <input
        className={`${styles["recommend-input"]} ${styles["recommend-offset"]}`}
        onChange={(e) => theSetRecommend(e.target.value)}
        value={recommend}
        onKeyDown={(e) => onKeyDown(e)}
        onFocus={onFocusInput}
        onBlur={onBlurInput}
      />
      <OverlayTrigger placement="top" overlay={renderCancelTooltip}>
        <button
          type="button"
          className={`btn btn-secondary ${styles["recommend-offset"]}`}
          onClick={onClickCancel}
        >
          取消
        </button>
      </OverlayTrigger>
      <OverlayTrigger placement="top" overlay={renderSubmitTooltip}>
        <button
          type="button"
          className={`btn btn-primary ${styles["recommend-offset"]}`}
          onClick={onClickSubmit}
        >
          送出
        </button>
      </OverlayTrigger>
    </div>
  );
};

const _countRune = (text: string) => {
  const count = text.split("").reduce((r, x) => {
    if (x < " ") {
      return r;
    }
    if (x >= " " && x <= "~") {
      return r + 1;
    }
    return r + 2;
  }, 0);
  return count;
};
