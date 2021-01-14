import {init as _init, setData as _setData, createReducer} from 'react-reducer-utils'

import * as ServerUtils from './ServerUtils'
import api from './api'
import * as errors from './errors'

import { GoUserHome } from './utils'

const myClass = 'demo-pttbbs/attemptChangeEmailPage'

// init
export const init = (myID, doMe, parentID, doParent, userID) => {
  let theDate = new Date()
  return (dispatch, getState) => {
    dispatch(_init({myID, myClass, doMe, parentID, doParent, theDate, userID}))
  }
}

export const ChangeEmail = (myID, userID, password, email) => {
  return (dispatch, getState) => (async() => {
    const {errmsg, status} = await api(ServerUtils.AttemptChangeEmail(userID, password, email))

    if (!status) {
      dispatch(_setData(myID, {errmsg: errors.ERR_NETWORK}))
      return
    }

    if (status === 403) {
      let theErrMsg = errors.ERR_PASSWD
      if(errmsg === 'already exists') {
        theErrMsg = errors.ERR_EMAIL_ALREADY_EXISTS
      }
      dispatch(_setData(myID, {errmsg: theErrMsg}))
      return
    }

    if (status !== 200) {
      dispatch(_setData(myID, {errmsg}))
      return
    }

    dispatch(_setData(myID, {isDone: true}))
  })()
}

export const SleepAndRedirect = (myID, userID) => {
  return (dispatch, getState) => {
    setTimeout(() => {
      GoUserHome(userID)
    }, 5000)
  }
}

export const CleanErr = (myID) => {
  return (dispatch, getState) => {
    dispatch(_setData(myID, {errmsg: ''}))
  }
}

export default createReducer()


