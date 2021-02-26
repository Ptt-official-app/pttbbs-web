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
    dispatch(_getBottomArticles(myID, bid))
    let desc = startIdx ? false : true
    dispatch(GetArticles(myID, bid, title, startIdx, desc, false))
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

const _getBottomArticles = (myID, bid) => {
  return (dispatch, getState) => (async() => {
    const {data, errmsg, status} = await api(ServerUtils.LoadBottomArticles(bid))
    if (status !== 200) {
      dispatch(_setData(myID, errmsg))
      return
    }

    let bottomArticles = data.list
    bottomArticles.map( each => each.numIdx = '★' )

    let state = getState()
    let me = getMe(state, myID)
    let regularArticles = me.list || []
    let isNextEnd = me.isNextEnd || false

    let allArticles = isNextEnd ? regularArticles.concat(bottomArticles) : regularArticles

    let toUpdate = {bottomArticles, allArticles}
    // If regular article list is already loaded, add list length to scroll position
    if (me.scrollToRow) {
      toUpdate.scrollToRow = me.scrollToRow + bottomArticles.length
    }

    dispatch(_setData(myID, toUpdate))
  })()
}

export const GetArticles = (myID, bid, title, startIdx, desc, isExclude) => {
  return (dispatch, getState) => (async() => {
    let state = getState()
    let me = getMe(state, myID)
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
    if (status !== 200) {
      dispatch(_setData(myID, {errmsg, isBusyLoading: false}))
      return
    }

    state = getState()
    me = getMe(state, myID)
    let bottomArticles = me.bottomArticles || []
    let isNextEnd = me.isNextEnd || false

    let dataList = data.list || []
    let startNumIdx = data.start_num_idx || 1

    let newList = MergeList(myList, dataList, desc, startNumIdx, isExclude)

    let toUpdate = {
      list: newList,
      nextCreateTime: data.next_create_time,
    }
    if(!desc) {
      toUpdate.nextIdx = data.next_idx
      toUpdate.lastNext = startIdx
      toUpdate.isBusyLoading = false
      if(!data.next_idx) {
        toUpdate.isNextEnd = true
        isNextEnd = true
      }
      if(!startIdx) {
        toUpdate.isPreEnd = true
      }

    } else {
      toUpdate.scrollToRow = dataList.length - 1 //only dataList.length - 1 new items.
      toUpdate.lastPre = startIdx
      toUpdate.isBusyLoading = false
      if(!data.next_idx) {
        toUpdate.isPreEnd = true
      }
      if(!startIdx) {
        toUpdate.isNextEnd = true
        isNextEnd = true
      }
    }

    let allArticles = isNextEnd ? newList.concat(bottomArticles) : newList
    toUpdate.allArticles = allArticles

    dispatch(_setData(myID, toUpdate))
  })()
}

export default createReducer()
