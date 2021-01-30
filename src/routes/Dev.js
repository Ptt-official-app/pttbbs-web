import React from 'react'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import HomePage from '../components/HomePage'
import UserInfoPage from '../components/UserInfoPage'
import ChangePasswdPage from '../components/ChangePasswdPage'
import AttemptChangeEmailPage from '../components/AttemptChangeEmailPage'
import ChangeEmailPage from '../components/ChangeEmailPage'
import AttemptSetIDEmailPage from '../components/AttemptSetIDEmailPage'
import SetIDEmailPage from '../components/SetIDEmailPage'
import RegisterPage from '../components/RegisterPage'
import HotBoardsPage from '../components/HotBoardsPage'

export default (props) => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route exact path="/register" component={RegisterPage} />
        <Route exact path="/user/:userid" component={UserInfoPage} />
        <Route exact path="/user/:userid/resetpassword" component={ChangePasswdPage} />
        <Route exact path="/user/:userid/attemptchangeemail" component={AttemptChangeEmailPage} />
        <Route exact path="/user/:userid/changeemail" component={ChangeEmailPage} />
        <Route exact path="/user/:userid/attemptsetidemail" component={AttemptSetIDEmailPage} />
        <Route exact path="/user/:userid/setidemail" component={SetIDEmailPage} />
        <Route exact path="/boards/popular" component={HotBoardsPage} />
      </Switch>
    </Router>
  )
}
