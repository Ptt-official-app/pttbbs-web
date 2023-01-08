import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import HomePage from '../components/HomePage'
import UserInfoPage from '../components/UserInfoPage'
import ChangePasswdPage from '../components/ChangePasswdPage'
import AttemptChangeEmailPage from '../components/AttemptChangeEmailPage'
import ChangeEmailPage from '../components/ChangeEmailPage'
import AttemptSetIDEmailPage from '../components/AttemptSetIDEmailPage'
import SetIDEmailPage from '../components/SetIDEmailPage'
import RegisterPage from '../components/RegisterPage'
import HotBoardsPage from '../components/HotBoardsPage'
import ArticlesPage from '../components/ArticlesPage'
import LoginPage from '../components/LoginPage'
import GeneralBoardsPage from '../components/GeneralBoardsPage'
import UserFavoritesPage from '../components/UserFavoritesPage'
import ArticlePage from '../components/ArticlePage'
import NewArticlePage from '../components/NewArticlePage'
import ClassBoardsPage from '../components/ClassBoardsPage'
import ManualsPage from '../components/ManualsPage'

type Props = {}

export default (props: Props) => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/user/:userid" element={<UserInfoPage />} />
                <Route path="/user/:userid/resetpassword" element={<ChangePasswdPage />} />
                <Route path="/user/:userid/attemptchangeemail" element={<AttemptChangeEmailPage />} />
                <Route path="/user/:userid/changeemail" element={<ChangeEmailPage />} />
                <Route path="/user/:userid/attemptsetidemail" element={<AttemptSetIDEmailPage />} />
                <Route path="/user/:userid/setidemail" element={<SetIDEmailPage />} />
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
    )
}
