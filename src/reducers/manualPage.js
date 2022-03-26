import {init as _init, setData as _setData, createReducer, getMe} from 'react-reducer-utils'

import * as ServerUtils from './ServerUtils'
import api from './api'
//import * as errors from './errors'

import { MergeList, CdateMdHM, CdateYYYYMdHMS } from './utils'

import {
  COLOR_FOREGROUND_RED,
  COLOR_FOREGROUND_WHITE,
  COLOR_FOREGROUND_GREEN,
  COLOR_FOREGROUND_BLUE,
  COLOR_FOREGROUND_YELLOW,
  COLOR_FOREGROUND_BLACK,

  COLOR_BACKGROUND_BLACK,
  COLOR_BACKGROUND_BLUE,
  COLOR_BACKGROUND_WHITE,

  COMMENT_TYPE_RECOMMEND,
  COMMENT_TYPE_BOO,
  COMMENT_TYPE_COMMENT,
  COMMENT_TYPE_FORWARD,
  COMMENT_TYPE_EDIT,
  COMMENT_TYPE_DELETED,
  COMMENT_TYPE_REPLY } from '../constants'

const myClass = 'demo-pttbbs/ManualPage'

export const init = (myID, doMe, parentID, doParent, bid, path, startIdx) => {
  let theDate = new Date()
  console.log('manualPage: to start: bid:', bid, 'path:', path)
  return (dispatch, getState) => {
    console.log('manualPage: to _init: bid:', bid, 'path:', path)
    dispatch(_init({myID, myClass, doMe, parentID, doParent, theDate, startIdx, scrollTo: null, isPreEnd: true}))
    console.log('manualPage: to GetManualContent: bid:', bid, 'path:', path)
    dispatch(GetManualContent(myID, bid, path, startIdx))
  }
}

export const SetData = (myID, data) => {
  return (dispatch, getState) => {
    dispatch(_setData(myID, data))
  }
}

//GetManualContent
//
//1. 拿到 content.
//2. parse content.
//3. contentComments.
export const GetManualContent = (myID, bid, path, startIdx) => {
  return (dispatch, getState) => (async() => {
    const {data, errmsg, status} = await api(ServerUtils.GetManual(bid, path))

    console.log('GetManualContent: data:', data, 'status:', status, 'myID:', myID)

    if (status !== 200) {
      dispatch(_setData(myID, {errmsg}))
      return
    }

    console.log('GetManualContent: to _setData: data:', data)

    dispatch(_setData(myID, data))

    console.log('GetManualContent: after _setData:', data)

    let bbsLines = _parseBBSLines(data.bbs, data.ip, data.host, bid, path)
    let content = data.content || []
    let prefix = data.prefix || []
    prefix = _parseHeader(prefix)
    content = prefix.concat(content)
    content = content.concat(bbsLines)
    let lines = _parseLines(content || [])
    if(prefix.length >= 3) { // valid prefix
      lines[0].background = COLOR_BACKGROUND_BLUE
      lines[1].background = COLOR_BACKGROUND_BLUE
      lines[2].background = COLOR_BACKGROUND_BLUE
    }

    let state = getState()
    let me = getMe(state, myID)

    let isPreEnd = me.isPreEnd || false
    let comments = me.comments || []
    let contentComments = isPreEnd ? lines.concat(comments) : comments

    dispatch(_setData(myID, {content: lines, contentComments}))
  })()
}

const _parseBBSLines = (bbs, ip, host, bid, path) => {
  let location = ((window || {}).location) || {}
  let emptyLine = {'text': '', color0: {foreground: COLOR_FOREGROUND_WHITE, background: COLOR_BACKGROUND_BLACK}}
  let hrLine = {'text': '--', color0: {foreground: COLOR_FOREGROUND_WHITE, background: COLOR_BACKGROUND_BLACK}}
  let bbsLine = {'text': `※ 發信站: ${bbs}, 來自: ${ip} (${host})`, color0: {foreground: COLOR_FOREGROUND_GREEN, background: COLOR_BACKGROUND_BLACK}}
  let urlLine = {'text': `※ 文章網址: ${location.protocol}//${location.host}/board/${bid}/manual/${path}`, color0: {foreground: COLOR_FOREGROUND_GREEN, background: COLOR_BACKGROUND_BLACK}}

  return [[emptyLine], [hrLine], [bbsLine], [urlLine]]
}

const _parseHeader = (header) => {
  if(header.length < 3) {
    return header
  }

  let [authorBoard, title, theDateTime] = [header[0], header[1], header[2]]

  let [author, board] = authorBoard[0].text.split(' 看板: ')

  //author
  let authorPromptRune = {text: ' 作者 ', color0: {foreground: COLOR_FOREGROUND_BLUE, background: COLOR_BACKGROUND_WHITE}}
  let authorRune = {text: ' ' + author.slice(4), color0: {foreground: COLOR_FOREGROUND_WHITE, background: COLOR_BACKGROUND_BLUE}, extend: true}

  //board
  let boardPromptRune = {text: ' 看板 ', color0: {foreground: COLOR_FOREGROUND_BLUE, background: COLOR_BACKGROUND_WHITE}, pullright: true}
  let boardRune = {text: ' ' + board + ' ', color0: {foreground: COLOR_FOREGROUND_WHITE, background: COLOR_BACKGROUND_BLUE}, pullright: true}

  //title
  let titlePromptRune = {text: ' 標題 ', color0: {foreground: COLOR_FOREGROUND_BLUE, background: COLOR_BACKGROUND_WHITE}}
  let titleRune = {text: ' ' + title[0].text.slice(4), color0: {foreground: COLOR_FOREGROUND_WHITE, background: COLOR_BACKGROUND_BLUE}}

  //datetime
  let datetimePromptRune = {text: ' 時間 ', color0: {foreground: COLOR_FOREGROUND_BLUE, background: COLOR_BACKGROUND_WHITE}}
  let datetimeRune = {text: ' ' + theDateTime[0].text.slice(4), color0: {foreground: COLOR_FOREGROUND_WHITE, background: COLOR_BACKGROUND_BLUE}}

  //emptyLine
  let emptyLine = {'text': '', color0: {foreground: COLOR_FOREGROUND_WHITE, background: COLOR_BACKGROUND_BLACK}}

  header = [
    [authorPromptRune, authorRune, boardRune, boardPromptRune],
    [titlePromptRune, titleRune],
    [datetimePromptRune, datetimeRune],
    [emptyLine],
  ]

  return header
}

const _parseLines = (lines) => {
  return lines.map((runes) => ({runes}))
}

export default createReducer()