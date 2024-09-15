import { init as _init, setData as _setData, createReducer, getState, Thunk } from 'react-reducer-utils'

import * as ServerUtils from './ServerUtils'
import api from './api'
//import * as errors from './errors'

import { MergeList, CdateMdHM, CdateYYYYMdHMS } from './utils'

import { ArticleDetail, Comment, Content, Line, Maybe, Rune_t, Runes_t, State_t } from '../types'

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
    COMMENT_TYPE_REPLY
} from '../constants'

export const myClass = 'pttbbs-web/ArticlePage'

export interface State extends State_t, ArticleDetail {
    theDate: Date
    startIdx: string
    scrollTo: any
    isBusyLoading: boolean
    nextIdx: string
    isPreEnd: boolean
    isNextEnd: boolean
    lastPre: string | null
    lastNext: string | null
    scrollToRow: number
    contentLines: Line[]
    comments: Line[]
    contentComments: Line[]
}

interface State_m extends Maybe<State> { }

const _TYPE_RUNE_MAP: { [key: number]: Rune_t } = {
    [COMMENT_TYPE_RECOMMEND]: {
        text: '推',
        color0: { foreground: COLOR_FOREGROUND_WHITE, background: COLOR_BACKGROUND_BLACK, highlight: true },
    },
    [COMMENT_TYPE_BOO]: {
        text: '噓',
        color0: { foreground: COLOR_FOREGROUND_RED, background: COLOR_BACKGROUND_BLACK, highlight: true },
    },
    [COMMENT_TYPE_COMMENT]: {
        text: '→ ',
        color0: { foreground: COLOR_FOREGROUND_RED, background: COLOR_BACKGROUND_BLACK, highlight: false },
    },
}

export const init = (myID: string, bid: string, aid: string, startIdx: string): Thunk<State> => {
    let theDate = new Date()
    return async (dispatch, _) => {
        let state: State_m = {
            theDate,
            startIdx,
            scrollTo: null,
            isBusyLoading: false,
            nextIdx: '',
            isPreEnd: true,
            isNextEnd: false,
            lastPre: null,
            lastNext: null,
            scrollToRow: 0,
            contentLines: [],
            comments: [],
            contentComments: [],
        }
        dispatch(_init({ myID, state }))
        dispatch(GetArticleContent(myID, bid, aid, startIdx))
    }
}

export const SetData = (myID: string, data: any): Thunk<State> => {
    return async (dispatch, _) => {
        dispatch(_setData(myID, data))
    }
}

export const AddRecommend = (myID: string, bid: string, aid: string, recommendType: string, recommend: Content): Thunk<State> => {
    return async (dispatch, _) => {
        const { data, errmsg, status } = await api(ServerUtils.AddRecommend(bid, aid, recommendType, recommend))

        console.log('articlePage.AddRecommend: after ServerUtils: bid:', bid, 'aid:', aid, 'recommendType:', recommendType, 'recommend:', recommend, 'data:', data, 'errmsg:', errmsg, 'status:', status)
        if (status !== 200) {
            dispatch(_setData(myID, { errmsg }))
            return
        }

        dispatch(GetComments(myID, bid, aid, '', true, false))
    }
}

export const Rank = (myID: string, bid: string, aid: string, rank: number): Thunk<State> => {
    return async (dispatch, _) => {
        const { data, errmsg, status } = await api(ServerUtils.Rank(bid, aid, rank))
        if (status !== 200) {
            dispatch(_setData(myID, { errmsg }))
            return
        }
        if (!data) {
            return
        }

        dispatch(_setData(myID, data))
    }
}

//GetComments
//
//1. 檢查 busy
//2. 拿到 comments
//3. parse comments.
//4. merge list
//5. 整合 to-update
export const GetComments = (myID: string, bid: string, aid: string, startIdx: string, desc: boolean, isExclude: boolean): Thunk<State> => {
    return async (dispatch, getClassState) => {
        let state = getClassState()
        let me = getState(state, myID)
        if (!me) {
            return
        }
        let myComments = me.comments || []

        //check busy
        let lastPre = me.lastPre
        let lastNext = me.lastNext
        let isBusyLoading = me.isBusyLoading || false

        if (isBusyLoading) {
            return
        }
        if (desc) {
            if (lastPre === startIdx) {
                return
            }
        } else {
            if (lastNext === startIdx) {
                return
            }
        }

        dispatch(_setData(myID, { isBusyLoading: true }))

        const { data, errmsg, status } = await api(ServerUtils.GetComments(bid, aid, startIdx, desc))

        if (status !== 200) {
            dispatch(_setData(myID, { isBusyLoading: false, errmsg }))
            return
        }
        if (!data) {
            return
        }

        let dataComments = _parseComments(data.list)

        let newComments: Line[] = []
        if (isExclude) {
            newComments = MergeList(myComments, dataComments, desc, isExclude)
        } else {
            newComments = desc ? dataComments.reverse() : dataComments
        }

        //5. 整合 toUpdate
        state = getClassState()
        me = getState(state, myID)
        if (!me) {
            return
        }
        let isPreEnd = me.isPreEnd || false
        let contentLines = me.contentLines

        let toUpdate: State_m = {
            comments: newComments,
            isBusyLoading: false,
        }
        if (!desc) {
            toUpdate.nextIdx = data.next_idx
            toUpdate.lastNext = startIdx
            toUpdate.isBusyLoading = false
            if (!data.next_idx) {
                toUpdate.isNextEnd = true
            } else {
                toUpdate.isNextEnd = false
            }

            if (!startIdx) {
                toUpdate.lastPre = null
                toUpdate.isPreEnd = true
                isPreEnd = true
            }
        } else {
            toUpdate.lastPre = startIdx
            toUpdate.isBusyLoading = false
            if (!data.next_idx) {
                toUpdate.isPreEnd = true
                isPreEnd = true
            } else {
                toUpdate.isPreEnd = false
                isPreEnd = false
            }

            if (!startIdx) {
                toUpdate.lastNext = null
                toUpdate.isNextEnd = true
            }

            if (!isPreEnd) {
                toUpdate.scrollToRow = dataComments.length - 1
            } else if (lastPre) {
                toUpdate.scrollToRow = contentLines.length + dataComments.length - 1
            }
        }
        let contentComments = isPreEnd ? contentLines.concat(newComments) : newComments
        toUpdate.contentComments = contentComments

        dispatch(_setData(myID, toUpdate))

    }
}

//GetArticleContent
//
//1. 拿到 content.
//2. parse content.
//3. contentComments.
export const GetArticleContent = (myID: string, bid: string, aid: string, startIdx: string): Thunk<State> => {
    console.log('articlePage.GetArticleContent: start')
    return async (dispatch, getClassState) => {
        console.log('articlePage.GetArticleContent: to api')
        const { data, errmsg, status } = await api(ServerUtils.GetArticle(bid, aid))

        console.log('articlePage.GetArticleContent: after api: data:', data, 'errmsg:', errmsg, 'status:', status)

        if (status !== 200) {
            dispatch(_setData(myID, { errmsg }))
            return
        }
        if (!data) {
            return
        }

        dispatch(_setData(myID, data))

        let bbsLines = _parseBBSLines(data.bbs, data.ip, data.host, bid, aid)
        let content: Content = data.content || []
        let prefix: Content = data.prefix || []
        prefix = _parseHeader(prefix)
        content = prefix.concat(content)
        content = content.concat(bbsLines)
        let lines = _parseLines(content || [])
        if (prefix.length >= 3) { // valid prefix
            lines[0].background = COLOR_BACKGROUND_BLUE
            lines[1].background = COLOR_BACKGROUND_BLUE
            lines[2].background = COLOR_BACKGROUND_BLUE
        }

        let state = getClassState()
        let me = getState(state, myID)
        if (!me) {
            return
        }
        let isPreEnd = me.isPreEnd || false
        let comments = me.comments || []
        let contentComments = isPreEnd ? lines.concat(comments) : comments

        dispatch(_setData(myID, { contentLines: lines, contentComments }))

        dispatch(GetComments(myID, bid, aid, startIdx, false, false))
    }
}

const _parseHeader = (header: Content) => {
    if (header.length < 3) {
        return header
    }

    let [authorBoard, title, theDateTime] = [header[0], header[1], header[2]]

    let [author, board] = authorBoard[0].text.split(' 看板: ')

    //author
    let authorPromptRune: Rune_t = { text: ' 作者 ', color0: { foreground: COLOR_FOREGROUND_BLUE, background: COLOR_BACKGROUND_WHITE } }
    let authorRune = { text: ' ' + author.slice(4), color0: { foreground: COLOR_FOREGROUND_WHITE, background: COLOR_BACKGROUND_BLUE }, extend: true }

    //board
    let boardPromptRune = { text: ' 看板 ', color0: { foreground: COLOR_FOREGROUND_BLUE, background: COLOR_BACKGROUND_WHITE }, pullright: true }
    let boardRune = { text: ' ' + board + ' ', color0: { foreground: COLOR_FOREGROUND_WHITE, background: COLOR_BACKGROUND_BLUE }, pullright: true }

    //title
    let titlePromptRune = { text: ' 標題 ', color0: { foreground: COLOR_FOREGROUND_BLUE, background: COLOR_BACKGROUND_WHITE } }
    let titleRune = { text: ' ' + title[0].text.slice(4), color0: { foreground: COLOR_FOREGROUND_WHITE, background: COLOR_BACKGROUND_BLUE } }

    //datetime
    let datetimePromptRune = { text: ' 時間 ', color0: { foreground: COLOR_FOREGROUND_BLUE, background: COLOR_BACKGROUND_WHITE } }
    let datetimeRune = { text: ' ' + theDateTime[0].text.slice(4), color0: { foreground: COLOR_FOREGROUND_WHITE, background: COLOR_BACKGROUND_BLUE } }

    //emptyLine
    let emptyLine = { 'text': '', color0: { foreground: COLOR_FOREGROUND_WHITE, background: COLOR_BACKGROUND_BLACK } }

    header = [
        [authorPromptRune, authorRune, boardRune, boardPromptRune],
        [titlePromptRune, titleRune],
        [datetimePromptRune, datetimeRune],
        [emptyLine],
    ]

    return header
}

const _parseLines = (lines: Content): Line[] => {
    return lines.map((runes) => ({ runes }))
}

const _parseBBSLines = (bbs: string, ip: string, host: string, bid: string, aid: string): Content => {
    let location = ((window || {}).location) || {}
    let emptyLine = { 'text': '', color0: { foreground: COLOR_FOREGROUND_WHITE, background: COLOR_BACKGROUND_BLACK } }
    let hrLine = { 'text': '--', color0: { foreground: COLOR_FOREGROUND_WHITE, background: COLOR_BACKGROUND_BLACK } }
    let bbsLine = { 'text': `※ 發信站: ${bbs}, 來自: ${ip} (${host})`, color0: { foreground: COLOR_FOREGROUND_GREEN, background: COLOR_BACKGROUND_BLACK } }
    let urlLine = { 'text': `※ 文章網址: ${location.protocol}//${location.host}/board/${bid}/article/${aid}`, color0: { foreground: COLOR_FOREGROUND_GREEN, background: COLOR_BACKGROUND_BLACK } }

    return [[emptyLine], [hrLine], [bbsLine], [urlLine]]
}

const _parseComments = (comments: Comment[]): Line[] => {
    let commentList: Line[][] = comments.map((each) => {
        const { type: theType } = each

        switch (theType) {
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

    return commentList.flatMap((each) => each)
}

const _parseRegularComment = (comment: Comment): Line[] => {
    const { type: theType, owner, create_time: createTime } = comment
    let runes: Runes_t = []
    //comment-type
    let typeRune = _TYPE_RUNE_MAP[theType]
    if (typeRune) {
        runes.push(typeRune)
    }

    //comment-owner
    let ownerRune: Rune_t = { text: ' ' + owner, color0: { foreground: COLOR_FOREGROUND_YELLOW, highlight: true } }
    runes.push(ownerRune)

    //comment-colon
    let colonRune = { text: ': ', color0: { foreground: COLOR_FOREGROUND_YELLOW } }
    runes.push(colonRune)

    //comment-content
    let contentRunes = (comment.content && comment.content.length > 0) ? comment.content[0] : []
    if (contentRunes.length > 0) {
        contentRunes[0].color0.foreground = COLOR_FOREGROUND_YELLOW
        delete contentRunes[0].color1
        runes = runes.concat(contentRunes)
    }

    //comment-datetime
    let datetimeStr = CdateMdHM(createTime * 1000) // createTime is TS
    let datetimeRune: Rune_t = {
        text: datetimeStr,
        pullright: true,
        color0: {},
    }
    runes.push(datetimeRune)
    return [{ runes, idx: comment.idx }]
}

const _parseReply = (comment: Comment): Line[] => {
    // Reply: directly return content.
    let emptyLine: Line[] = [{ runes: [{ 'text': '', color0: { foreground: COLOR_FOREGROUND_WHITE, background: COLOR_BACKGROUND_BLACK } }] }]

    return emptyLine.concat(comment.content.map((eachRunes): Line => {
        return { runes: eachRunes, idx: comment.idx }
    }))
}

const _parseForwardComment = (comment: Comment): Line[] => {
    const { owner, create_time: createTime } = comment
    let boardName = comment.content[0][0].text || 'unknownBoard'
    let runes = []

    let content = boardName === '某隱形看板' ? ': 轉錄至某隱形看板' : `: 轉錄至看版 ${boardName}`

    runes.push({
        text: `※ `,
        color0: { foreground: COLOR_FOREGROUND_GREEN, background: COLOR_BACKGROUND_BLACK }
    })
    runes.push({
        text: `${owner}`,
        color0: { foreground: COLOR_FOREGROUND_GREEN, highlight: true, background: COLOR_BACKGROUND_BLACK }
    })
    runes.push({
        text: content,
        color0: { foreground: COLOR_FOREGROUND_GREEN, background: COLOR_BACKGROUND_BLACK }
    })
    let datetimeStr = CdateMdHM(createTime * 1000) //createTime is TS
    let datetimeRune = {
        text: datetimeStr,
        pullright: true,
        color0: {},
    }
    runes.push(datetimeRune)

    return [{ runes, idx: comment.idx }]
}

const _parseDeletedComment = (comment: Comment): Line[] => {
    const { owner: deleter } = comment
    // TODO confirm format
    let runes = [{
        text: `${deleter} 刪除某人的貼文`,
        color0: { foreground: COLOR_FOREGROUND_BLACK, highlight: true, background: COLOR_BACKGROUND_BLACK }
    }]
    return [{ runes, idx: comment.idx }]
}

const _parseEditedComment = (comment: Comment): Line[] => {
    const { owner: editor = 'editor', ip, host = 'unknown', create_time: editTime } = comment
    // TODO confirm format
    let editTimeStr = CdateYYYYMdHMS(editTime * 1000) //editTime is TS
    let runes = [{
        text: `※ 編輯: ${editor}(${ip} ${host}), ${editTimeStr}`,
        color0: { foreground: COLOR_FOREGROUND_GREEN, background: COLOR_BACKGROUND_BLACK }
    }]
    return [{ runes, idx: comment.idx }]
}

export default createReducer<State>()
