import { OverlayTrigger, Tooltip, type TooltipProps } from "react-bootstrap";
import styles from "./FunctionBar.module.css";

type Props = {
  optionsLeft: Option[];
  optionsRight: Option[];
};

type Option = {
  [key: string]: any;
};

export default (props: Props) => {
  const { optionsLeft, optionsRight } = props;

  const mapOption = (val: Option, idx: number) => {
    const { text, action, url, render, hotkey } = val;

    const renderTooltip = (props: TooltipProps) => (
      <Tooltip {...props}>快速鍵：{hotkey}</Tooltip>
    );

    const renderInner = () => {
      if (render) {
        return render();
      } else if (url) {
        return (
          <a className={`${styles["navbar-link"]} nav-link`} href={url}>
            {text}
          </a>
        );
      } else if (!text) {
        return <span className={"nav-link "}></span>;
      } else {
        return (
          <button
            type="button"
            className={`${styles["navbar-link"]} nav-link`}
            onClick={action}
          >
            {text}
          </button>
        );
      }
    };

    if (hotkey) {
      return (
        <li key={`func-${idx}`} className="nav-item">
          <OverlayTrigger
            placement="top"
            trigger={["hover", "hover"]}
            overlay={renderTooltip}
          >
            {renderInner()}
          </OverlayTrigger>
        </li>
      );
    } else {
      return (
        <li key={`func-${idx}`} className="nav-item">
          {renderInner()}
        </li>
      );
    }
  };

  const renderOptions = (options: Option[]) => {
    return (
      <ul className="nav">
        {options.map((each, idx) => mapOption(each, idx))}
      </ul>
    );
  };

  return (
    <nav
      className={`fixed-buttom navbar justify-content-between ${styles.root}`}
    >
      {renderOptions(optionsLeft)}
      {renderOptions(optionsRight)}
    </nav>
  );
};
