import {init as _init, setData as _setData, createReducer, getMe} from 'react-reducer-utils'

import * as ServerUtils from './ServerUtils'
import api from './api'
//import * as errors from './errors'

import { MergeList } from './utils'

const myClass = 'demo-pttbbs/ArticlesPage'

export const init = (myID, doMe, parentID, doParent, bid, title, startIdx) => {
  let theDate = new Date()
  return (dispatch, getState) => {
    dispatch(_init({myID, myClass, doMe, parentID, doParent, theDate, title, startIdx, scrollTo: null}))
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

export const SetData = (myID, data) => {
  return (dispatch, getState) => {
    dispatch(_setData(myID, data))
  }
}

export const GetArticles = (myID, bid, title, startIdx, desc) => {
  return (dispatch, getState) => (async() => {
    const state = getState()
    const me = getMe(state, myID)
    let myList = me.list || []

    //check busy
    let lastPre = me.lastPre || ''
    let lastNext = me.lastNext || ''
    let isBusyLoading = me.isBusyLoading || false
    if(isBusyLoading) {
      return
    }
    if(desc) {
      if(lastPre === startIdx) {
        return
      }

    } else {
      if(lastNext === startIdx) {
        return
      }

    }

    dispatch(_setData(myID, {isBusyLoading: true}))

    const {data, errmsg, status} = await api(ServerUtils.LoadArticles(bid, title, startIdx, desc))
    console.log('doArticlesPage.GetArticles: after LoadArticles: data:', data)
    if (status !== 200) {
      dispatch(_setData(myID, {errmsg, isBusyLoading: false}))
      return
    }

    let dataList = data.list || []
    let startNumIdx = data.start_num_idx || 1

    let newList = MergeList(myList, dataList, desc, startNumIdx)

    let toUpdate = {
      list: newList,
      nextCreateTime: data.next_create_time,
    }
    if(!desc) {
      toUpdate.nextIdx = data.next_idx
      toUpdate.lastNext = startIdx
      toUpdate.isBusyLoading = false
    } else {
      toUpdate.scrollToRow = dataList.length - 1 //only dataList.length - 1 new items.
      toUpdate.lastPre = startIdx
      toUpdate.isBusyLoading = false
    }

    console.log('doArticlesPage.GetArticles: to update:', toUpdate)
    dispatch(_setData(myID, toUpdate))
  })()
}

export default createReducer()
