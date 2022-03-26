import {init as _init, setData as _setData, createReducer, getMe} from 'react-reducer-utils'

import * as ServerUtils from './ServerUtils'
import api from './api'
//import * as errors from './errors'

import { MergeList } from './utils'

const myClass = 'demo-pttbbs/ManualsPage'

export const init = (myID, doMe, parentID, doParent, bid, path, title, startIdx) => {
  let theDate = new Date()
  return (dispatch, getState) => {

    console.log('init: bid:', bid, 'path:', path)
    dispatch(_init({myID, myClass, doMe, parentID, doParent, theDate, title, startIdx, scrollTo: null}))
    dispatch(_getBoardSummary(myID, bid, path, false, title, startIdx))
  }
}

const _getBoardSummary = (myID, bid, path, desc, title, startIdx) => {
  return (dispatch, getState) => (async() => {
    // Get board information
    const {data, errmsg, status} = await api(ServerUtils.GetBoardSummary(bid))
    if (status !== 200) {
      dispatch(_setData(myID, {errmsg}))
      return
    }
    dispatch(_setData(myID, data))
    dispatch(GetManuals(myID, bid, path, title, startIdx, desc, false))
  })()
}

export const SetData = (myID, data) => {
  return (dispatch, getState) => {
    dispatch(_setData(myID, data))
  }
}

export const GetManuals = (myID, bid, path, searchTitle, startIdx, desc, isExclude) => {
  return (dispatch, getState) => (async() => {
    let state = getState()
    let me = getMe(state, myID)
    let myList = me.list || []

    //check busy
    let lastPre = me.lastPre || ''
    let lastNext = me.lastNext || ''
    let isBusyLoading = me.isBusyLoading || false
    let isPreEnd = me.isPreEnd || false
    let isNextEnd = me.isNextEnd || false

    searchTitle = searchTitle || ''
    let myLastSearchTitle = me.lastSearchTitle || ''
    if (searchTitle !== myLastSearchTitle) {
      myList = []
      lastPre = ''
      lastNext = ''
      isPreEnd = false
      isNextEnd = false
    }

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

    console.log('GetManuals: bid:', bid, 'path:', path)

    const {data, errmsg, status} = await api(ServerUtils.LoadManuals(bid, path, desc))
    if (status !== 200) {
      dispatch(_setData(myID, {errmsg, isBusyLoading: false}))
      return
    }

    state = getState()
    me = getMe(state, myID)

    let dataList = data.list || []
    dataList.map((each) => each.url = `/board/${bid}/manual/${each.aid}`)

    let defaultStartNum = desc ? me.total : 1
    let startNumIdx = data.start_num_idx || defaultStartNum

    let newList = MergeList(myList, dataList, desc, startNumIdx, isExclude)

    let toUpdate = {
      lastSearchTitle: searchTitle,
      list: newList,
      nextCreateTime: data.next_create_time,
      isBusyLoading: false,
      lastPre: lastPre,
      lastNext: lastNext,
      isPreEnd: isPreEnd,
      isNextEnd: isNextEnd,
    }
    if(!desc) {
      toUpdate.nextIdx = data.next_idx
      toUpdate.lastNext = startIdx
      if(!data.next_idx) {
        toUpdate.isNextEnd = true
        isNextEnd = true
      }
      if(!startIdx) {
        toUpdate.isPreEnd = true
        isPreEnd = true
      }

    } else {
      toUpdate.scrollToRow = dataList.length - 1 //only dataList.length - 1 new items.
      toUpdate.lastPre = startIdx
      toUpdate.isBusyLoading = false
      if(!data.next_idx) {
        toUpdate.isPreEnd = true
        isPreEnd = true
      }
      if(!startIdx) {
        toUpdate.isNextEnd = true
        isNextEnd = true
      }
    }

    let allManuals = newList
    toUpdate.allManuals = allManuals

    dispatch(_setData(myID, toUpdate))
  })()
}

export default createReducer()
