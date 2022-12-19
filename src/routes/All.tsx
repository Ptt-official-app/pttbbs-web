import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import HomePage from '../components/HomePage'
import HotBoardsPage from '../components/HotBoardsPage'
import ArticlesPage from '../components/ArticlesPage'
import GeneralBoardsPage from '../components/GeneralBoardsPage'
import UserFavoritesPage from '../components/UserFavoritesPage'
import ArticlePage from '../components/ArticlePage'
import NewArticlePage from '../components/NewArticlePage'
import ClassBoardsPage from '../components/ClassBoardsPage'
import ManualsPage from '../components/ManualsPage'

type Props = {

}

export default (props: Props) => {
    return (
        <Router>
            <Routes>
                <Route path="/">
                    <HomePage />
                </Route>

                <Route path="/cls/:clsID">
                    <ClassBoardsPage />
                </Route>
                <Route path="/boards">
                    <GeneralBoardsPage />
                </Route>
                <Route path="/boards/popular">
                    <HotBoardsPage />
                </Route>
                <Route path="/board/:bid/articles">
                    <ArticlesPage />
                </Route>
                <Route path="/user/:userid/favorites">
                    <UserFavoritesPage />
                </Route>
                <Route path="/board/:bid/article/:aid">
                    <ArticlePage />
                </Route>
                <Route path="/board/:bid/post">
                    <NewArticlePage />
                </Route>

                <Route path="/board/:bid/manual">
                    <ManualsPage />
                </Route>

                <Route path="/board/:bid/manual/:path*">
                    <ManualsPage />
                </Route>

            </Routes>
        </Router>
    )
}
