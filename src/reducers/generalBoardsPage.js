import {init as _init, setData as _setData, createReducer, getMe} from 'react-reducer-utils'

import * as ServerUtils from './ServerUtils'
import api from './api'

import { MergeList } from './utils'

const myClass = 'demo-pttbbs/GeneralBoardsPage'

export const init = (myID, doMe, parentID, doParent, title, startIdx, isByClass) => {
  let theDate = new Date()
  return (dispatch, getState) => {
    dispatch(_init({myID, myClass, doMe, parentID, doParent, theDate, title, startIdx, scrollTo: null}))
    dispatch(GetBoards(myID, title, startIdx, false, false, isByClass))
  }
}

export const SetData = (myID, data) => {
  return (dispatch, getState) => {
    dispatch(_setData(myID, data))
  }
}

export const GetBoards = (myID, title, startIdx, desc, isExclude, isByClass) => {
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

    let loadBoards = isByClass ? ServerUtils.LoadGeneralBoardsByClass : ServerUtils.LoadGeneralBoards

    const {data, errmsg, status} = await api(loadBoards(title, startIdx, desc))
    console.log('doGeneralBoardsPage.GetBoards: after loadBoards: data:', data)
    if (status !== 200) {
      dispatch(_setData(myID, {errmsg, isBusyLoading: false}))
      return
    }

    let dataList = data.list || []
    dataList.map((each) => each.url = `/board/${each.bid}/articles`)

    let newList = MergeList(myList, dataList, desc, null, isExclude)

    let toUpdate = {
      list: newList,
    }
    if(!desc) {
      toUpdate.nextIdx = data.next_idx
      toUpdate.lastNext = startIdx
      toUpdate.isBusyLoading = false
      if(!data.next_idx) {
        toUpdate.isNextEnd = true
      }

    } else {
      toUpdate.scrollToRow = dataList.length - 1 //only dataList.length - 1 new items.
      toUpdate.lastPre = startIdx
      toUpdate.isBusyLoading = false
      if(!data.next_idx) {
        toUpdate.isPreEnd = true
      }
    }

    console.log('doGeneralBoardsPage.GetBoards: to update:', toUpdate)
    dispatch(_setData(myID, toUpdate))
  })()
}

export default createReducer()
