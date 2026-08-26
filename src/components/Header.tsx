import config from "config";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { useThunk } from "use-thunk";
import { GITHUB_LINK } from "../constants";
import * as DoHeader from "../thunks/header";
import Empty from "./Empty";
import styles from "./Header.module.css";
import { validateUsername } from "./utils";

type Props = {
  title: string | (() => ReactNode);
  renderHeader?: () => ReactNode;
};

export default (props: Props) => {
  const { title: paramsTitle, renderHeader: propsRenderHeader } = props;

  const [header] = useThunk<DoHeader.State, typeof DoHeader>(DoHeader);
  const { username } = header;

  const { t } = useTranslation();

  // Links
  const renderUserHome = () => {
    const isValidUsername = validateUsername(username);
    const text = isValidUsername
      ? `hi~ ${username}`
      : t("header.loginRegister");
    const url = isValidUsername ? `/profile` : "/login";

    return (
      <a className={"pull-right " + styles["navbar-link"]} href={url}>
        {text}
      </a>
    );
  };

  const renderHeader = () => {
    if (propsRenderHeader) {
      return propsRenderHeader();
    }

    const title =
      (typeof paramsTitle === "function" ? paramsTitle() : paramsTitle) || "";

    return <div className={`col ${styles.title}`}>{title}</div>;
  };

  const renderTerm = () => {
    if (!config.TERM_URL) {
      return <Empty />;
    }

    return (
      <a className={styles["navbar-link"]} href={config.TERM_URL}>
        Term
      </a>
    );
  };

  return (
    <nav className={"navbar navbar-dark " + styles.root}>
      <a
        className={
          styles["navbar-brand"] + " " + "navbar-brand " + styles["navbar-link"]
        }
        href={"/"}
      >
        {config.BRAND}
      </a>
      {renderTerm()}
      {renderHeader()}
      {renderUserHome()}
      <a className={styles["navbar-link"]} href={GITHUB_LINK}>
        <i className={"ml-3 bi bi-github " + styles.logo}></i>
      </a>
    </nav>
  );
};
