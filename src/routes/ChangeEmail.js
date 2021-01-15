import React from 'react'
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
