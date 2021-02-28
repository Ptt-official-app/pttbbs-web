import React from 'react'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import HomePage from '../components/HomePage'
import HotBoardsPage from '../components/HotBoardsPage'
import ArticlesPage from '../components/ArticlesPage'
import GeneralBoardsPage from '../components/GeneralBoardsPage'
import UserFavoritesPage from '../components/UserFavoritesPage'
import ArticlePage from '../components/ArticlePage'

export default (props) => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={HomePage} />

        <Route exact path="/boards" component={GeneralBoardsPage} />
        <Route exact path="/boards/popular" component={HotBoardsPage} />
        <Route exact path="/board/:bid/articles" component={ArticlesPage} />
        <Route exact path="/user/:userid/favorites" component={UserFavoritesPage} />

        <Route exact path="/board/:bid/article/:aid" component={ArticlePage} />

      </Switch>
    </Router>
  )
}
