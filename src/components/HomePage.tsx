import config from "config";
import { type CSSProperties, useEffect } from "react";
import { useThunk } from "use-thunk";
import useWindowSize from "../hooks/useWindowSize";
import * as DoHeader from "../thunks/header";
import * as DoHomePage from "../thunks/homePage";
import Header from "./Header";
import pageStyles from "./Page.module.css";

export default () => {
  const [_homePage, doHomePage, homePageID] = useThunk<
    DoHomePage.State,
    typeof DoHomePage
  >(DoHomePage);

  const [header] = useThunk<DoHeader.State, typeof DoHeader>(DoHeader);
  const { username } = header;

  const { width: innerWidth, height: innerHeight } = useWindowSize();

  //init
  // biome-ignore lint/correctness/useExhaustiveDependencies: useEffect
  useEffect(() => {
    doHomePage.init(homePageID);
  }, []);

  useEffect(() => {
    if (!username) {
      return;
    }

    if (username === config.PTT_GUEST) {
      window.location.href = "/boards/popular";
    } else {
      window.location.href = "/user/" + username + "/favorites";
    }
  }, [username]);

  //get data

  const style: CSSProperties = {
    width: innerWidth,
    height: innerHeight,
  };

  return (
    <div className={pageStyles.root} style={style}>
      <Header title={""} />
    </div>
  );
};
