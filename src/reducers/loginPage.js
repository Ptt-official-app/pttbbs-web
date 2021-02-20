import {init as _init, setData as _setData, createReducer} from 'react-reducer-utils'

import * as ServerUtils from './ServerUtils'
import api from './api'
import * as errors from './errors'


const myClass = 'demo-pttbbs/LoginPage'

// init
export const init = (myID, doMe, parentID, doParent) => {
  let theDate = new Date()
  return (dispatch, getState) => {
    dispatch(_init({myID, myClass, doMe, parentID, doParent, theDate}))
  }
}

export const Login = (myID, username, password) => {
  return (dispatch, getState) => (async() => {
    const {data, errmsg, status} = await api(ServerUtils.Login(username, password))

    if (!status) {
      dispatch(_setData(myID, {errmsg: errors.ERR_NETWORK}))
      return
    }

    if (status === 401) {
      dispatch(_setData(myID, {errmsg: errors.ERR_PASSWD}))
      return
    }

    if (status !== 200) {
      dispatch(_setData(myID, {errmsg}))
      return
    }

    window.location.href = "/user/" + data.user_id
  })()
}

export const CleanErr = (myID) => {
  return (dispatch, getState) => {
    dispatch(_setData(myID, {errmsg: ''}))
  }
}

export default createReducer()
