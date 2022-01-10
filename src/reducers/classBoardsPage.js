import {init as _init, setData as _setData, createReducer, getMe} from 'react-reducer-utils'

import * as ServerUtils from './ServerUtils'
import api from './api'

import { MergeList, SantizeBoard } from './utils'

const myClass = 'demo-pttbbs/ClassBoardsPage'

export const init = (myID, doMe, parentID, doParent, clsID, startIdx) => {
  let theDate = new Date()
  return (dispatch, getState) => {
    dispatch(_init({myID, myClass, doMe, parentID, doParent, theDate, clsID, startIdx, scrollTo: null}))
    dispatch(GetBoards(myID, clsID, startIdx, false, false))
  }
}

export const SetData = (myID, data) => {
  return (dispatch, getState) => {
    dispatch(_setData(myID, data))
  }
}

export const GetBoards = (myID, clsID, startIdx, desc, isExclude) => {

  clsID = clsID || 1 //clsID default by 1. (no clsID == 0)

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

    // api
    const {data, errmsg, status} = await api(ServerUtils.LoadClassBoards(clsID, startIdx, desc))
    if (status !== 200) {
      dispatch(_setData(myID, {errmsg, isBusyLoading: false}))
      return
    }

    // integrate list
    let dataList = data.list || []
    dataList = dataList.map((each) => SantizeBoard(each))

    let newList = MergeList(myList, dataList, desc, null, isExclude)

    // to update
    let toUpdate = {
      list: newList
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

    dispatch(_setData(myID, toUpdate))

  })()
}

export default createReducer()
