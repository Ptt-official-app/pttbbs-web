import {init as _init, setData as _setData, createReducer} from 'react-reducer-utils'

import * as ServerUtils from './ServerUtils'
import api from './api'
import * as errors from './errors'

const myClass = 'demo-pttbbs/UserInfoPage'

// init
export const init = (myID, doMe, parentID, doParent, userID) => {
  let theDate = new Date()
  return (dispatch, getState) => {
    dispatch(_init({myID, myClass, doMe, parentID, doParent, theDate, userID}))
    dispatch(_getData(myID, userID))
  }
}

const _getData = (myID, userID) => {
  return (dispatch, getState) => (async() => {
    const {data, errmsg, status} = await api(ServerUtils.GetUserInfo(userID))

    console.log('doUserInfoPage._getData: after GetUserInfo: data:', data, 'errmsg:', errmsg, 'status:', status)

    if (status !== 200) {
      dispatch(_setData(myID, {errmsg}))
    }

    dispatch(_setData(myID, data))
  })()
}

export default createReducer()
