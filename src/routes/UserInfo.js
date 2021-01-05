import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import UserInfoPage from '../components/UserInfoPage'

export default (props) => {
  return (
    <Router>
      <Switch>
        <Route path="/user/:userid" component={UserInfoPage} />
      </Switch>
    </Router>
  )
}
