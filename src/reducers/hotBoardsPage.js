import {init as _init, setData as _setData, createReducer} from 'react-reducer-utils'

import * as ServerUtils from './ServerUtils'
import api from './api'
//import * as errors from './errors'

import { MergeList } from './utils'

const myClass = 'demo-pttbbs/HotBoardsPage'

export const init = (myID, doMe, parentID, doParent) => {
  let theDate = new Date()
  return (dispatch, getState) => {
    dispatch(_init({myID, myClass, doMe, parentID, doParent, theDate}))
    dispatch(_getData(myID))
  }
}


const _getData = (myID) => {
  return (dispatch, getState) => (async() => {
    const {data, errmsg, status} = await api(ServerUtils.LoadPopularBoards())

    if(status !== 200) {
      dispatch(_setData(myID, {errmsg}))
      return
    }

    let dataList = data.list || []
    dataList.map((each) => each.url = `/board/${each.bid}/articles`)

    let newList = MergeList([], dataList, false, 1)

    data.list = newList

    dispatch(_setData(myID, data))
  })()
}

export default createReducer()
