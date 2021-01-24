import {init as _init, setData as _setData, createReducer} from 'react-reducer-utils'

import * as ServerUtils from './ServerUtils'
import api from './api'
import * as errors from './errors'

import { GoUserHome } from './utils'


const myClass = 'demo-pttbbs/RegisterPage'

// init
export const init = (myID, doMe, parentID, doParent) => {
  let theDate = new Date()
  return (dispatch, getState) => {
    dispatch(_init({myID, myClass, doMe, parentID, doParent, theDate}))
  }
}

export const VerifyEmail = (myID, username, email) => {
  return (dispatch, getState) => (async() => {
    const {errmsg, status} = await api(ServerUtils.AttemptRegister(username, email))

    if (!status) {
      dispatch(_setData(myID, {errmsg: errors.ERR_NETWORK}))
      return
    }

    if (status !== 200) {
      dispatch(_setData(myID, {errmsg}))
    }

    dispatch(_setData(myID, {infomsg: errors.INFO_VERIFY_EMAIL, isSetVerifyEmail: true}))

  })()
}

export const Register = (myID, username, password, passwordConfirm, email, over18, veriCode) => {
  return (dispatch, getState) => (async() => {

    const {data, errmsg, status} = await api(ServerUtils.Register(username, password, passwordConfirm, email, over18, veriCode))

    if (!status) {
      dispatch(_setData(myID, {errmsg: errors.ERR_NETWORK}))
      return
    }

    if (status === 400) {
      dispatch(_setData(myID, {errmsg: errors.ERR_REGISTER}))
      return
    }

    if (status !== 200) {
      dispatch(_setData(myID, {errmsg}))
      return
    }

    const { user_id } = data

    GoUserHome(user_id)
  })()
}

export default createReducer()
