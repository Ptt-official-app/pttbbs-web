import React from 'react'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import SetIDEmailPage from '../components/SetIDEmailPage'

export default (props) => {
  return (
    <Router>
      <Switch>
        <Route path="/user/:userid/setidemail" component={SetIDEmailPage} />
      </Switch>
    </Router>
  )
}
