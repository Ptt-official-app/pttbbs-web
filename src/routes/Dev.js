import React from 'react'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
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

export default (props) => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route exact path="/login" component={LoginPage} />
        <Route exact path="/register" component={RegisterPage} />
        <Route exact path="/user/:userid" component={UserInfoPage} />
        <Route exact path="/user/:userid/resetpassword" component={ChangePasswdPage} />
        <Route exact path="/user/:userid/attemptchangeemail" component={AttemptChangeEmailPage} />
        <Route exact path="/user/:userid/changeemail" component={ChangeEmailPage} />
        <Route exact path="/user/:userid/attemptsetidemail" component={AttemptSetIDEmailPage} />
        <Route exact path="/user/:userid/setidemail" component={SetIDEmailPage} />

        <Route exact path="/user/:userid/favorites" component={UserFavoritesPage} />

        <Route exact path="/cls/:clsID" component={ClassBoardsPage} />

        <Route exact path="/boards" component={GeneralBoardsPage} />
        <Route exact path="/boards/popular" component={HotBoardsPage} />
        <Route exact path="/board/:bid/articles" component={ArticlesPage} />
        <Route exact path="/board/:bid/article/:aid" component={ArticlePage} />
        <Route exact path="/board/:bid/post" component={NewArticlePage} />

        <Route exact path="/board/:bid/manual" component={ManualsPage} />
        <Route path="/board/:bid/manual/:path*" component={ManualsPage} />

      </Switch>
    </Router>
  )
}
