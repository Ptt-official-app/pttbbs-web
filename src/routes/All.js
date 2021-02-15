import React from 'react'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import HomePage from '../components/HomePage'
import HotBoardsPage from '../components/HotBoardsPage'
import ArticlesPage from '../components/ArticlesPage'

export default (props) => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route exact path="/login" component={HomePage} />
        <Route exact path="/boards/popular" component={HotBoardsPage} />
        <Route exact path="/board/:bid/articles" component={ArticlesPage} />
      </Switch>
    </Router>
  )
}
