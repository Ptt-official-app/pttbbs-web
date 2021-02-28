import {init as _init, setData as _setData, createReducer, getMe} from 'react-reducer-utils'

import * as ServerUtils from './ServerUtils'
import api from './api'
//import * as errors from './errors'

import { MergeList, CdateMdHM } from './utils'

import {
  COLOR_FOREGROUND_RED,
  COLOR_FOREGROUND_WHITE,
  COLOR_FOREGROUND_GREEN,
  COLOR_FOREGROUND_BLUE,
  COLOR_FOREGROUND_YELLOW,

  COLOR_BACKGROUND_BLACK,
  COLOR_BACKGROUND_BLUE,
  COLOR_BACKGROUND_WHITE,

  COMMENT_TYPE_RECOMMEND,
  COMMENT_TYPE_BOO,
  COMMENT_TYPE_COMMENT,
  COMMENT_TYPE_REPLY } from '../constants'

const myClass = 'demo-pttbbs/ArticlePage'

const _TYPE_RUNE_MAP = {
  [COMMENT_TYPE_RECOMMEND]: {
    text: '推',
    color0: {foreground: COLOR_FOREGROUND_WHITE, background: COLOR_BACKGROUND_BLACK, highlight: true},
  },
  [COMMENT_TYPE_BOO]: {
    text: '噓',
    color0: {foreground: COLOR_FOREGROUND_RED, background: COLOR_BACKGROUND_BLACK, highlight: true},
  },
  [COMMENT_TYPE_COMMENT]: {
    text: '→ ',
    color0: {foreground: COLOR_FOREGROUND_RED, background: COLOR_BACKGROUND_BLACK, highlight: false},
  },
}

export const init = (myID, doMe, parentID, doParent, bid, aid, startIdx) => {
  let theDate = new Date()
  return (dispatch, getState) => {
    dispatch(_init({myID, myClass, doMe, parentID, doParent, theDate, startIdx, scrollTo: null}))
    dispatch(GetComments(myID, bid, aid))
    dispatch(GetArticleContent(myID, bid, aid, startIdx, false, false))
  }
}

export const GetComments = (myID, bid, aid, startIdx, desc, isExclude) => {
  return (dispatch, getState) => (async() => {
    let state = getState()
    let me = getMe(state, myID)
    let myComments = me.comments || []

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

    const {data, errmsg, status} = await api(ServerUtils.GetComments(bid, aid, startIdx, desc))

    dispatch(_setData(myID, {isBusyLoading: false}))

    if (status !== 200) {
      dispatch(_setData(myID, {errmsg}))
      return
    }

    let dataComments = _parseComments(data.list || [])
    let newComments = MergeList(myComments, dataComments, desc, null, isExclude)

    state = getState()
    me = getMe(state, myID)
    let isPreEnd = me.isPreEnd || false
    let content = me.content || []

    let toUpdate = {
      comments: newComments,
    }
    if(!desc) {
      toUpdate.nextIdx = data.next_idx
      toUpdate.lastNext = startIdx
      toUpdate.isBusyLoading = false
      if(!data.next_idx) {
        toUpdate.isNextEnd = true
      }
      if(!startIdx) {
        toUpdate.isPreEnd = true
        isPreEnd = true
      }
    } else {
      toUpdate.scrollToRow = dataComments.length - 1
      toUpdate.lastPre = startIdx
      toUpdate.isBusyLoading = false
      if(!data.next_idx) {
        toUpdate.isPreEnd = true
        isPreEnd = true
      }
      if(!startIdx) {
        toUpdate.isNextEnd = true
      }
    }
    let contentComments = isPreEnd ? content.concat(newComments) : newComments
    toUpdate.contentComments = contentComments

    dispatch(_setData(myID, toUpdate))

  })()
}

export const GetArticleContent = (myID, bid, aid) => {
  return (dispatch, getState) => (async() => {
    dispatch(_setData(myID, {isBusyLoading: true}))

    const {data, errmsg, status} = await api(ServerUtils.GetArticle(bid, aid))
    dispatch(myID, {isBusyLoading: false})

    if (status !== 200) {
      dispatch(_setData(myID, {errmsg}))
      return
    }

    dispatch(_setData(myID, data))

    let bbsLines = _parseBBSLines(data.bbs, data.ip, data.host, bid, aid)
    let content = data.content || []
    let isValidContentWithHeader = _isValidContentWithHeader(content)
    if(isValidContentWithHeader) {
      content = _parseContentWithHeader(content)
    }
    content = content.concat(bbsLines)

    let lines = _parseLines(content || [])
    if(isValidContentWithHeader) {
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

const _isValidContentWithHeader = (content) => {
  if(content.length < 3) {
    return false
  }

  let authorBoard = content[0]
  if(authorBoard.length !== 1) {
    return false
  }
  if(!authorBoard[0].text.startsWith('作者:')) {
    return false
  }

  let title = content[1]
  if(title.length !== 1) {
    return false
  }
  if(!title[0].text.startsWith('標題:')) {
    return false
  }

  let datetimeStr = content[2]
  if(datetimeStr.length !== 1) {
    return false
  }
  if(!datetimeStr[0].text.startsWith('時間:')) {
    return false
  }

  return true
}

const _parseContentWithHeader = (content) => {
  let [authorBoard, title, theDateTime, theRest] = [content[0], content[1], content[2], content.slice(3)]

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

  content = [
    [authorPromptRune, authorRune, boardRune, boardPromptRune],
    [titlePromptRune, titleRune],
    [datetimePromptRune, datetimeRune],
  ].concat(theRest)

  return content
}

const _parseLines = (lines) => {
  return lines.map((runes) => ({runes}))
}

const _parseBBSLines = (bbs, ip, host, bid, aid) => {
  let bbsLine = {'text': `※ 發信站: ${bbs}, 來自: ${ip} (${host})`, color0: {foreground: COLOR_FOREGROUND_GREEN, background: COLOR_BACKGROUND_BLACK}}
  let urlLine = {'text': `※ 文章網址: ${window.location.protocol}//${window.location.host}/board/${bid}/article/${aid}`, color0: {foreground: COLOR_FOREGROUND_GREEN, background: COLOR_BACKGROUND_BLACK}}

  return [[bbsLine], [urlLine]]
}

const _parseComments = (comments) => {
  return comments.map((each) => {
    const {type: theType, owner, create_time: createTime} = each
    let runes = []
    if(theType === COMMENT_TYPE_REPLY) {
      return {runes: each.content}
    }

    //comment-type
    let typeRune = _TYPE_RUNE_MAP[theType]
    if(typeRune) {
      runes.push(typeRune)
    }

    //comment-owner
    let ownerRune = {text: ' ' + owner, color0: {foreground: COLOR_FOREGROUND_YELLOW, highlight: true}}
    runes.push(ownerRune)

    //comment-colon
    let colonRune = {text: ': ', color0: {foreground: COLOR_FOREGROUND_YELLOW}}
    runes.push(colonRune)

    //comment-content
    let contentRunes = (each.content && each.content.length > 0) ? each.content[0] : []
    if(contentRunes.length > 0) {
      contentRunes[0].color0.foreground = COLOR_FOREGROUND_YELLOW
      runes = runes.concat(contentRunes)
    }

    //comment-datetime
    let datetimeStr = CdateMdHM(createTime)
    let datetimeRune = {
      text: datetimeStr,
      pullright: true,
      color0: {},
    }
    runes.push(datetimeRune)
    return {runes}
  })
}

export default createReducer()
