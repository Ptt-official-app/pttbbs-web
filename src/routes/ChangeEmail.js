import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import ChangeEmailPage from '../components/ChangeEmailPage'

export default (props) => {
  return (
    <Router>
      <Switch>
        <Route path="/user/:userid/changeemail" component={ChangeEmailPage} />
      </Switch>
    </Router>
  )
}
