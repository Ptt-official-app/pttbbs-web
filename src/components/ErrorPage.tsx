import config from "config";
import type { CSSProperties, MouseEventHandler } from "react";
import { useTranslation } from "react-i18next";
import useWindowSize from "../hooks/useWindowSize";
import Header from "./Header";
import pageStyles from "./Page.module.css";

export default () => {
  const { width: innerWidth } = useWindowSize(10, 0);
  const { t } = useTranslation();

  const rootStyle: CSSProperties = {
    width: innerWidth,
  };

  const onClick: MouseEventHandler = () => {
    window.location.href = "/";
  };

  return (
    <div className={`vh-100 ${pageStyles.root}`} style={rootStyle}>
      <Header title={t("error.title")} />
      <div className="container mt-4">
        <p>{t("error.prompt")}</p>
        <div className="row">
          <button
            className="btn btn-primary mt-2"
            type="submit"
            onClick={onClick}
          >
            {t("error.backHome")} {config.BRAND}
          </button>
        </div>
      </div>
    </div>
  );
};
