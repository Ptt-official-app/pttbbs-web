import {init as _init, setData as _setData, createReducer, getMe} from 'react-reducer-utils'

import * as ServerUtils from './ServerUtils'
import api from './api'
//import * as errors from './errors'

import { MergeList } from './utils'

const myClass = 'demo-pttbbs/ArticlesPage'

export const init = (myID, doMe, parentID, doParent, bid, title, startIdx) => {
  let theDate = new Date()
  return (dispatch, getState) => {
    dispatch(_init({myID, myClass, doMe, parentID, doParent, theDate, title, startIdx}))
    dispatch(_getBoardSummary(myID, bid))
    dispatch(GetArticles(myID, bid, title, startIdx, false))
  }
}

const _getBoardSummary = (myID, bid) => {
  return (dispatch, getState) => (async() => {

    // Get board information
    const {data, errmsg, status} = await api(ServerUtils.GetBoardSummary(bid))
    if (status !== 200) {
      dispatch(_setData(myID, {errmsg}))
      return
    }
    dispatch(_setData(myID, data))
  })()
}

const GetArticles = (myID, bid, title, startIdx, desc) => {
  return (dispatch, getState) => (async() => {
    const state = getState()
    const me = getMe(state, myID)
    let myList = me.list || []

    const {data, errmsg, status} = await api(ServerUtils.LoadArticles(bid, title, startIdx, desc))
    if (status !== 200) {
      dispatch(_setData(myID, {errmsg}))
      return
    }

    let dataList = data.list || []
    let isReverse = desc === true
    let isAppend = desc === false
    let isIncludeStartIdx = desc === false
    let startNumIdx = data.start_num_idx || 1

    let newList = MergeList(myList, dataList, isReverse, isAppend, isIncludeStartIdx, startNumIdx)

    let toUpdate = {
      list: newList,
      next_idx: data.next_idx,
    }

    console.log('GetArticles: to _setData: dataList:', dataList, 'toUpdate:', toUpdate)
    dispatch(_setData(myID, toUpdate))
  })()
}

export default createReducer()
