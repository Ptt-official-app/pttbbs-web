import React from 'react'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import HomePage from '../components/HomePage'
import HotBoardsPage from '../components/HotBoardsPage'

export default (props) => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route exact path="/boards/popular" component={HotBoardsPage} />
      </Switch>
    </Router>
  )
}
