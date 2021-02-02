import React from 'react'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import ArticlesPage from '../components/ArticlesPage'

export default (props) => {
  return (
    <Router>
      <Switch>
        <Route exact path="/board/:bid/articles" component={ArticlesPage} />
      </Switch>
    </Router>
  )
}
