import React from 'react'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import RegisterPage from '../components/RegisterPage'

export default (props) => {
  return (
    <Router>
      <Switch>
        <Route path="/register" component={RegisterPage} />
      </Switch>
    </Router>
  )
}
