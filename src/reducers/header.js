import {init as _init, setData as _setData, createReducer} from 'react-reducer-utils'

import * as ServerUtils from './ServerUtils'
import api from './api'
import * as errors from './errors'

const myClass = 'demo-pttbbs/Header'

export const init = (myID, doMe, parentID, doParent) => {
  return (dispatch, getState) => {
    dispatch(_init({myID, myClass, doMe, parentID, doParent}))
    dispatch(getData(myID))
  }
}
const getData = (myID) => {
  return (dispatch, getState) => (async () => {
    const {data, errmsg, status} = await api(ServerUtils.GetUserID())

    if(!status) {
      dispatch(_setData(myID, {errmsg: errors.ERR_NETWORK}))
      return
    }
    if (status !== 200) {
      dispatch(_setData(myID, {errmsg}))
      return
    }

    dispatch(_setData(myID, data))

  })()
}

export default createReducer()
