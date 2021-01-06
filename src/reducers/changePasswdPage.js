import {init as _init, setData as _setData, createReducer} from 'react-reducer-utils'

import * as ServerUtils from './ServerUtils'
import api from './api'
import * as errors from './errors'

const myClass = 'demo-pttbbs/ChangePasswdPage'

// init
export const init = (myID, doMe, parentID, doParent, userID) => {
  let theDate = new Date()
  return (dispatch, getState) => {
    dispatch(_init({myID, myClass, doMe, parentID, doParent, theDate, userID}))
  }
}

export const ChangePasswd = (myID, userID, origPassword, password, passwordConfirm) => {
  return (dispatch, getState) => (async() => {
    const {data, errmsg, status} = await api(ServerUtils.ChangePasswd(userID, origPassword, password, passwordConfirm))

    let accessToken = ((data||{}).access_token) || ''

    if (!status) {
      dispatch(_setData(myID, {errmsg: errors.ERR_NETWORK}))
      return
    }

    if (status === 403) {
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
