import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import HomePage from '../components/HomePage'
import UserInfoPage from '../components/UserInfoPage'
import ChangePasswdPage from '../components/ChangePasswdPage'
import AttemptChangeEmailPage from '../components/AttemptChangeEmailPage'
import ChangeEmailPage from '../components/ChangeEmailPage'
import AttemptSetIDEmailPage from '../components/AttemptSetIDEmailPage'
import SetIDEmailPage from '../components/SetIDEmailPage'

export default (props) => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={HomePage} />
      </Switch>
      <Switch>
        <Route exact path="/user/:userid" component={UserInfoPage} />
      </Switch>
      <Switch>
        <Route path="/user/:userid/resetpassword" component={ChangePasswdPage} />
      </Switch>
      <Switch>
        <Route path="/user/:userid/attemptchangeemail" component={AttemptChangeEmailPage} />
      </Switch>
      <Switch>
        <Route path="/user/:userid/changeemail" component={ChangeEmailPage} />
      </Switch>
      <Switch>
        <Route path="/user/:userid/attemptsetidemail" component={AttemptSetIDEmailPage} />
      </Switch>
      <Switch>
        <Route path="/user/:userid/setidemail" component={SetIDEmailPage} />
      </Switch>
    </Router>
  )
}
