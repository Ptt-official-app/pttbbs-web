import {init as _init, setData as _setData, createReducer} from 'react-reducer-utils'

import * as ServerUtils from './ServerUtils'
import api from './api'

import { GoUserHome } from './utils'

const myClass = 'demo-pttbbs/ChangeEmailPage'

// init
export const init = (myID, doMe, parentID, doParent, userID, token) => {
  let theDate = new Date()
  return (dispatch, getState) => {
    dispatch(_init({myID, myClass, doMe, parentID, doParent, theDate, userID, token}))
    dispatch(_getData(myID, userID, token))
  }
}

const _getData = (myID, userID, token) => {
  return (dispatch, getState) => (async() => {
    const {data, errmsg, status} = await api(ServerUtils.ChangeEmail(userID, token  ))

    if (status !== 200) {
      dispatch(_setData(myID, {errmsg, isDone: true}))
      return
    }

    dispatch(_setData(myID, {data, isDone: true}))
  })()
}

export const SleepAndRedirect = (myID, userID) => {
  return (dispatch, getState) => {
    setTimeout(() => {
      GoUserHome(userID)
    }, 5000)
  }
}

export default createReducer()
