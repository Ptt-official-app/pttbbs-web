import React from 'react'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import AttemptChangeEmailPage from '../components/AttemptChangeEmailPage'

export default (props) => {
  return (
    <Router>
      <Switch>
        <Route path="/user/:userid/attemptchangeemail" component={AttemptChangeEmailPage} />
      </Switch>
    </Router>
  )
}
