import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import AttemptSetIDEmailPage from '../components/AttemptSetIDEmailPage'

export default (props) => {
  return (
    <Router>
      <Switch>
        <Route path="/user/:userid/attemptsetidemail" component={AttemptSetIDEmailPage} />
      </Switch>
    </Router>
  )
}
