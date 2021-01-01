import {init as _init, setData as _setData, createReducer} from 'react-reducer-utils'

import * as ServerUtils from './ServerUtils'
import api from './api'
import * as errors from './errors'


const myClass = 'demo-pttbbs/HomePage'

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

    let accessToken = ((data||{}).AccessToken) || ''

    if (!status) {
      dispatch(_setData(myID, {errmsg: errors.ERR_NETWORK}))
      return
    }

    if (status === 401) {
      dispatch(_setData(myID, {errmsg: errors.ERR_LOGIN}))
      return
    }

    if (status !== 200) {
      dispatch(_setData(myID, {errmsg}))
      return
    }

    console.log('doHomePage.Login: data:', data)
    dispatch(_setData(myID, {accessToken}))
  })()
}

export const CleanErr = (myID) => {
  return (dispatch, getState) => {
    dispatch(_setData(myID, {errmsg: ''}))
  }
}

export default createReducer()
