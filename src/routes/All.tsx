import { useEffect } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { useThunk } from "use-thunk";
import ArticlePage from "../components/ArticlePage";
import ArticlesPage from "../components/ArticlesPage";
import ClassBoardsPage from "../components/ClassBoardsPage";
import GeneralBoardsPage from "../components/GeneralBoardsPage";
import HomePage from "../components/HomePage";
import HotBoardsPage from "../components/HotBoardsPage";
import ManualsPage from "../components/ManualsPage";
import NewArticlePage from "../components/NewArticlePage";
import ProfilePage from "../components/ProfilePage";
import UserFavoritesPage from "../components/UserFavoritesPage";
import * as DoHeader from "../thunks/header";

export default () => {
  const [_, doHeader, headerID] = useThunk<DoHeader.State, typeof DoHeader>(
    DoHeader,
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: useEffect
  useEffect(() => {
    doHeader.init(headerID);
  }, []);

  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/user/:userid" element={<ProfilePage />} />
        <Route path="/user/:userid/favorites" element={<UserFavoritesPage />} />
        <Route path="/cls/:clsID" element={<ClassBoardsPage />} />
        <Route path="/boards" element={<GeneralBoardsPage />} />
        <Route path="/boards/popular" element={<HotBoardsPage />} />
        <Route path="/board/:bid/articles" element={<ArticlesPage />} />
        <Route path="/board/:bid/article/:aid" element={<ArticlePage />} />
        <Route path="/board/:bid/post" element={<NewArticlePage />} />
        <Route path="/board/:bid/manual" element={<ManualsPage />} />
        <Route path="/board/:bid/manual/:path/*" element={<ManualsPage />} />
      </Routes>
    </Router>
  );
};
