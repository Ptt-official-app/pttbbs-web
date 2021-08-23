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
    dispatch(_init({myID, myClass, doMe, parentID, doParent, theDate, startIdx, scrollTo: null, isPreEnd: true}))
    dispatch(GetArticleContent(myID, bid, aid, startIdx))
  }
}

export const SetData = (myID, data) => {
  return (dispatch, getState) => {
    dispatch(_setData(myID, data))
  }
}

export const AddRecommend = (myID, bid, aid, recommendType, recommend) => {
  return (dispatch, getState) => (async() => {
    const {data, errmsg, status} = await api(ServerUtils.AddRecommend(bid, aid, recommendType, recommend))

    console.log('articlePage.AddRecommend: after ServerUtils: bid:', bid, 'aid:', aid, 'recommendType:', recommendType, 'recommend:', recommend, 'data:', data, 'errmsg:', errmsg, 'status:', status)
    if(status !== 200) {
      dispatch(_setData(myID, {errmsg}))
      return
    }

    dispatch(GetComments(myID, bid, aid, '', true, false))
  })()
}

export const Rank = (myID, bid, aid, rank) => {
  return (dispatch, getState) => (async() => {
    const {data, errmsg, status} = await api(ServerUtils.Rank(bid, aid, rank))
    console.log('articlePage.Rank: afterServerUtils: bid:', bid, 'aid:', aid, 'rank:', rank, 'data:', data, 'errmsg:', errmsg, 'status:', status)
    if(status !== 200) {
      dispatch(_setData(myID, {errmsg}))
      return
    }

    dispatch(_setData(myID, data))
  })()
}

//GetComments
//
//1. 檢查 busy
//2. 拿到 comments
//3. parse comments.
//4. merge list
//5. 整合 to-update
export const GetComments = (myID, bid, aid, startIdx, desc, isExclude) => {
  return (dispatch, getState) => (async() => {
    let state = getState()
    let me = getMe(state, myID)
    let myComments = me.comments || []

    //check busy
    let lastPre = me.lastPre
    let lastNext = me.lastNext
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
        console.log('articlePage.GetComments: lastNext == startIdx: lastNext:', lastNext, 'startIdx:', startIdx)
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

    let newComments = []
    if(isExclude) {
      newComments = MergeList(myComments, dataComments, desc, null, isExclude)
    } else {
      newComments = desc ? dataComments.reverse() : dataComments
    }

    //5. 整合 toUpdate
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
      } else {
        toUpdate.isNextEnd = false
      }

      if(!startIdx) {
        toUpdate.lastPre = null
        toUpdate.isPreEnd = true
        isPreEnd = true
      }
    } else {
      toUpdate.lastPre = startIdx
      toUpdate.isBusyLoading = false
      if(!data.next_idx) {
        toUpdate.isPreEnd = true
        isPreEnd = true
      } else {
        toUpdate.isPreEnd = false
        isPreEnd = false
      }

      if(!startIdx) {
        toUpdate.lastNext = null
        toUpdate.isNextEnd = true
      }

      if(!isPreEnd) {
        toUpdate.scrollToRow = dataComments.length - 1
      } else if(lastPre) {
        toUpdate.scrollToRow = content.length + dataComments.length - 1
      }
    }
    console.log('articlePage.GetComments: startIdx:', startIdx, 'desc:', desc, 'nextIdx:', data.next_idx, 'isPreEnd:', isPreEnd)
    let contentComments = isPreEnd ? content.concat(newComments) : newComments
    toUpdate.contentComments = contentComments

    dispatch(_setData(myID, toUpdate))

  })()
}

//GetArticleContent
//
//1. 拿到 content.
//2. parse content.
//3. contentComments.
export const GetArticleContent = (myID, bid, aid, startIdx) => {
  return (dispatch, getState) => (async() => {
    const {data, errmsg, status} = await api(ServerUtils.GetArticle(bid, aid))

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

    dispatch(GetComments(myID, bid, aid, startIdx, false, false))
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

  //emptyLine
  let emptyLine = {'text': '', color0: {foreground: COLOR_FOREGROUND_WHITE, background: COLOR_BACKGROUND_BLACK}}

  content = [
    [authorPromptRune, authorRune, boardRune, boardPromptRune],
    [titlePromptRune, titleRune],
    [datetimePromptRune, datetimeRune],
    [emptyLine],
  ].concat(theRest)

  return content
}

const _parseLines = (lines) => {
  return lines.map((runes) => ({runes}))
}

const _parseBBSLines = (bbs, ip, host, bid, aid) => {
  let location = ((window || {}).location) || {}
  let emptyLine = {'text': '', color0: {foreground: COLOR_FOREGROUND_WHITE, background: COLOR_BACKGROUND_BLACK}}
  let hrLine = {'text': '--', color0: {foreground: COLOR_FOREGROUND_WHITE, background: COLOR_BACKGROUND_BLACK}}
  let bbsLine = {'text': `※ 發信站: ${bbs}, 來自: ${ip} (${host})`, color0: {foreground: COLOR_FOREGROUND_GREEN, background: COLOR_BACKGROUND_BLACK}}
  let urlLine = {'text': `※ 文章網址: ${location.protocol}//${location.host}/board/${bid}/article/${aid}`, color0: {foreground: COLOR_FOREGROUND_GREEN, background: COLOR_BACKGROUND_BLACK}}

  return [[emptyLine], [hrLine], [bbsLine], [urlLine]]
}

const _parseComments = (comments) => {
  let commentList = comments.map((each) => {
    const {type: theType} = each

    switch(theType) {
      case COMMENT_TYPE_REPLY:
        return _parseReply(each)
      case COMMENT_TYPE_FORWARD:
        return _parseForwardComment(each)
      case COMMENT_TYPE_EDIT:
        return _parseEditedComment(each)
      case COMMENT_TYPE_DELETED:
        return _parseDeletedComment(each)
      default:
        return _parseRegularComment(each)
    }
  })

  return commentList.reduce((r, x, i) => {
    r = r.concat(x)
    return r
  }, [])
}

const _parseRegularComment = (each) => {
  const {type: theType, owner, create_time: createTime} = each
  let runes = []
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
    delete contentRunes[0].color1
    runes = runes.concat(contentRunes)
  }

  //comment-datetime
  let datetimeStr = CdateMdHM(createTime * 1000) // createTime is TS
  let datetimeRune = {
    text: datetimeStr,
    pullright: true,
    color0: {},
  }
  runes.push(datetimeRune)
  return [{runes, idx: each.idx}]
}

const _parseReply = (each) => {
  // Reply: directly return content.
  let emptyLine = [{runes: [{'text': '', color0: {foreground: COLOR_FOREGROUND_WHITE, background: COLOR_BACKGROUND_BLACK}}]}]

  return emptyLine.concat(each.content.map((eachContent) => {
    return {runes: eachContent, idx: each.idx}
  }))
}

const _parseForwardComment = (each) => {
  const {owner, create_time: createTime} = each
  let boardName = each.content[0][0].text || 'unknownBoard'
  let runes = []

  let content = 'boardName' === '某隱形看板' ? ': 轉錄至某隱形看板' : `: 轉錄至看版 ${boardName}`

  runes.push({
    text: `※ `,
    color0: {foreground: COLOR_FOREGROUND_GREEN, background: COLOR_BACKGROUND_BLACK}
  })
  runes.push({
    text: `${owner}`,
    color0: {foreground: COLOR_FOREGROUND_GREEN, highlight:true, background: COLOR_BACKGROUND_BLACK}
  })
  runes.push({
    text: content,
    color0: {foreground: COLOR_FOREGROUND_GREEN, background: COLOR_BACKGROUND_BLACK}
  })
  let datetimeStr = CdateMdHM(createTime * 1000) //createTime is TS
  let datetimeRune = {
    text: datetimeStr,
    pullright: true,
    color0: {},
  }
  runes.push(datetimeRune)

  return [{runes, idx: each.idx}]
}

const _parseDeletedComment = (each) => {
  const {owner: deleter} = each
  // TODO confirm format
  let runes = [{
    text: `${deleter} 刪除某人的貼文`,
    color0: {foreground: COLOR_FOREGROUND_BLACK, highlight: true, background: COLOR_BACKGROUND_BLACK}
  }]
  return [{runes, idx: each.idx}]
}

const _parseEditedComment = (each) => {
  const {owner: editor = 'editor', ip, host = 'unknown', create_time: editTime} = each
  // TODO confirm format
  let editTimeStr = CdateYYYYMdHMS(editTime * 1000) //editTime is TS
  let runes = [{
    text: `※ 編輯: ${editor}(${ip} ${host}), ${editTimeStr}`,
    color0: {foreground: COLOR_FOREGROUND_GREEN, background: COLOR_BACKGROUND_BLACK}
  }]
  return [{runes, idx: each.idx}]
}

export default createReducer()
