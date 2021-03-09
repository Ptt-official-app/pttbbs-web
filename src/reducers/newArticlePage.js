import {init as _init, setData as _setData, createReducer} from 'react-reducer-utils'

import * as ServerUtils from './ServerUtils'
import api from './api'

import { COLOR_FOREGROUND_WHITE, COLOR_BACKGROUND_BLACK } from '../constants'

const myClass = 'demo-pttbbs/NewArticlePage'

export const init = (myID, doMe, parentID, doParent, bid) => {
  let theDate = new Date()
  return (dispatch, getState) => {
    dispatch(_init({myID, myClass, doMe, parentID, doParent, theDate, bid, scrollTo: null, content: [{'runes': [{'text': '', color0: {foreground: COLOR_FOREGROUND_WHITE, background: COLOR_BACKGROUND_BLACK}}]}]}))
    dispatch(_getBoardSummary(myID, bid))
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

export const UpdateContent = (myID, content) => {
  return (dispatch, getState) => {
    dispatch(_setData(myID, {content}))
  }
}

export const setData = (myID, data) => {
  return (dispatch, getState) => {
    return dispatch(_setData(myID, data))
  }
}

export const Submit = (myID, bid, theClass, title, content) => {
  return (dispatch, getState) => (async() => {
    let uploadContent = content.map((each) => each.runes)
    const {errmsg, status} = await api(ServerUtils.CreateArticle(bid, theClass, title, uploadContent))
    if (status !== 200) {
      dispatch(_setData(myID, {errmsg}))
      return
    }

    window.location.href = '/board/' + bid + '/articles'
  })()
}

export default createReducer()
