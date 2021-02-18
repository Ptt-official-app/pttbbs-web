import React from 'react'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import LoginPage from '../components/LoginPage'

export default (props) => {
  return (
    <Router>
      <Switch>
        <Route exact path="/login" component={LoginPage} />
      </Switch>
    </Router>
  )
}
