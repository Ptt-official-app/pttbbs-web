import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import ChangePasswdPage from '../components/ChangePasswdPage'

export default (props) => {
  return (
    <Router>
      <Switch>
        <Route path="/user/:userid/resetpassword" component={ChangePasswdPage} />
      </Switch>
    </Router>
  )
}
