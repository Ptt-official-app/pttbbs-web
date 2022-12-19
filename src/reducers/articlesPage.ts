import { Thunk, init as _init, setData as _setData, createReducer, getState } from 'react-reducer-utils'

import * as ServerUtils from './ServerUtils'
import api from './api'
//import * as errors from './errors'

import { MergeIdxList } from './utils'
import { ArticleList, ArticleSummary_i, BoardSummary, Maybe, State_t } from '../types'

export const myClass = 'demo-pttbbs/ArticlesPage'

export interface State extends State_t, BoardSummary {
    theDate: Date
    title: string
    startIdx: string
    scrollTo: any
    list: ArticleSummary_i[]
    bottomArticles: ArticleSummary_i[]
    nextIdx: string
    isPreEnd: boolean
    isNextEnd: boolean
    lastSearchTitle: string
    scrollToRow?: number
}

interface State_m extends Maybe<State> { }

export const init = (myID: string, bid: string, title: string, startIdx: string): Thunk<State> => {
    return async (dispatch, _) => {
        let theDate = new Date()
        let state: State_m = {
            theDate,
            title,
            startIdx,
            scrollTo: null,
            list: [],
            bottomArticles: [],
            nextIdx: '',
            isNextEnd: false,
            isPreEnd: false,
            lastSearchTitle: '',
        }
        dispatch(_init({ myID, state }))
        let desc = startIdx ? false : true
        dispatch(GetBoardSummary(myID, bid, desc, title, startIdx))
    }
}

export const GetBoardSummary = (myID: string, bid: string, desc: boolean, title: string, startIdx: string): Thunk<State> => {
    return async (dispatch, _) => {
        // Get board information
        const { data, errmsg, status } = await api<BoardSummary>(ServerUtils.GetBoardSummary(bid))
        if (status !== 200) {
            dispatch(_setData(myID, { errmsg }))
            return
        }
        if (!data) {
            return
        }
        await dispatch(_setData(myID, data))
        dispatch(_getBottomArticles(myID, bid))
        dispatch(GetArticles(myID, bid, title, startIdx, desc, false))
    }
}

export const SetData = (myID: string, data: State_m): Thunk<State> => {
    return async (dispatch, _) => {
        dispatch(_setData(myID, data))
    }
}

const _getBottomArticles = (myID: string, bid: string): Thunk<State> => {
    return async (dispatch, getClassState) => {
        const { data, errmsg, status } = await api<ArticleList>(ServerUtils.LoadBottomArticles(bid))
        if (status !== 200) {
            dispatch(_setData(myID, { errmsg }))
            return
        }
        if (!data) {
            return
        }

        let bottomArticles = data.list
        // @ts-ignore because special treat to num-idx
        bottomArticles.map(each => each.numIdx = '★')
        bottomArticles.map(each => each.url = `/board/${bid}/article/${each.aid}`)

        let state = getClassState()
        let me = getState(state, myID)
        if (!me) {
            return
        }
        let regularArticles = me.list
        let isNextEnd = me.isNextEnd
        let lastSearchTitle = me.lastSearchTitle

        let allArticles = (isNextEnd && !lastSearchTitle) ? regularArticles.concat(bottomArticles) : regularArticles

        let toUpdate: State_m = { bottomArticles, allArticles }
        // If regular article list is already loaded, add list length to scroll position
        if (typeof me.scrollToRow !== 'undefined') {
            toUpdate.scrollToRow = me.scrollToRow + bottomArticles.length
        }

        dispatch(_setData(myID, toUpdate))
    }
}

export const GetArticles = (myID: string, bid: string, searchTitle: string, startIdx: string, desc: boolean, isExclude: false): Thunk<State> => {
    return async (dispatch, getClassState) => {
        let classState = getClassState()
        let me = getState(classState, myID)
        if (!me) {
            return
        }

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

        await dispatch(_setData(myID, { isBusyLoading: true }))

        const { data, errmsg, status } = await api(ServerUtils.LoadArticles(bid, searchTitle, startIdx, desc))
        if (status !== 200) {
            dispatch(_setData(myID, { errmsg, isBusyLoading: false }))
            return
        }
        if (!data) {
            return
        }

        classState = getClassState()
        me = getState(classState, myID)
        if (!me) {
            return
        }
        let bottomArticles = me.bottomArticles

        let dataList = data.list
        dataList.map((each) => each.url = `/board/${bid}/article/${each.aid}`)

        let defaultStartNum = desc ? me.total : 1
        let startNumIdx = data.start_num_idx || defaultStartNum

        let newList = MergeIdxList(myList, dataList, desc, startNumIdx, isExclude)

        let toUpdate: State_m = {
            lastSearchTitle: searchTitle,
            list: newList,
            nextCreateTime: data.next_create_time,
            isBusyLoading: false,
            lastPre: lastPre,
            lastNext: lastNext,
            isPreEnd: isPreEnd,
            isNextEnd: isNextEnd,
        }
        if (!desc) {
            toUpdate.nextIdx = data.next_idx
            toUpdate.lastNext = startIdx
            if (!data.next_idx) {
                toUpdate.isNextEnd = true
                isNextEnd = true
            }
            if (!startIdx) {
                toUpdate.isPreEnd = true
                isPreEnd = true
            }

        } else {
            toUpdate.scrollToRow = dataList.length - 1 //only dataList.length - 1 new items.
            toUpdate.lastPre = startIdx
            toUpdate.isBusyLoading = false
            if (!data.next_idx) {
                toUpdate.isPreEnd = true
                isPreEnd = true
            }
            if (!startIdx) {
                toUpdate.isNextEnd = true
                isNextEnd = true
            }
        }

        let allArticles = (isNextEnd && !searchTitle) ? newList.concat(bottomArticles) : newList
        toUpdate.allArticles = allArticles

        dispatch(_setData(myID, toUpdate))
    }
}

export default createReducer<State>()
