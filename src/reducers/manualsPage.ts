import { Thunk, init as _init, setData as _setData, createReducer, getState } from 'react-reducer-utils'

import * as ServerUtils from './ServerUtils'
import api from './api'
//import * as errors from './errors'

import { MergeIdxList } from './utils'
import { ManArticleSummary_i, Maybe, State_t } from '../types'

export const myClass = 'demo-pttbbs/ManualsPage'

export interface State extends State_t {
    theDate: Date
    title: string
    startIdx: string
    scrollTo: any
    list: ManArticleSummary_i[]
    lastPre: string
    lastNext: string
    isBusyLoading: boolean
    isPreEnd: boolean
    isNextEnd: boolean
    nextCreateTime: number
    nextIdx: string
    scrollToRow: number
    allManuals: ManArticleSummary_i[]
}

export interface State_m extends Maybe<State> { }

export const init = (myID: string, bid: string, path: string, title: string, startIdx: string): Thunk<State> => {
    let theDate = new Date()
    return async (dispatch, _) => {
        let state: State = {
            theDate,
            title,
            startIdx,
            scrollTo: null,
            list: [],
            lastPre: '',
            lastNext: '',
            isBusyLoading: false,
            isPreEnd: false,
            isNextEnd: false,
            nextCreateTime: 0,
            nextIdx: '',
            scrollToRow: 0,
            allManuals: []
        }
        dispatch(_init({ myID, state: state }))
        dispatch(_getBoardSummary(myID, bid, path, false, title, startIdx))
    }
}

const _getBoardSummary = (myID: string, bid: string, path: string, desc: boolean, title: string, startIdx: string): Thunk<State> => {
    return async (dispatch, _) => {
        // Get board information
        const { data, errmsg, status } = await api(ServerUtils.GetBoardSummary(bid))
        if (status !== 200) {
            dispatch(_setData(myID, { errmsg }))
            return
        }
        if (!data) {
            return
        }
        dispatch(_setData(myID, data))
        dispatch(GetManuals(myID, bid, path, title, startIdx, desc, false))
    }
}

export const SetData = (myID: string, data: State_m): Thunk<State> => {
    return async (dispatch, _) => {
        dispatch(_setData(myID, data))
    }
}

export const GetManuals = (myID: string, bid: string, path: string, searchTitle: string, startIdx: string, desc: boolean, isExclude: boolean): Thunk<State> => {
    return async (dispatch, getClassState) => {
        let state = getClassState()
        let me = getState(state, myID)
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

        dispatch(_setData(myID, { isBusyLoading: true }))

        const { data, errmsg, status } = await api(ServerUtils.LoadManuals(bid, path, desc))
        if (status !== 200) {
            dispatch(_setData(myID, { errmsg, isBusyLoading: false }))
            return
        }
        if (!data) {
            dispatch(_setData(myID, { errmsg: 'no data', isBusyLoading: false }))
            return
        }

        state = getClassState()
        me = getState(state, myID)
        if (!me) {
            dispatch(_setData(myID, { errmsg: 'no me', isBusyLoading: false }))
            return
        }

        let dataList = data.list
        dataList.map((each) => each.url = `/board/${bid}/manual/${each.aid}`)

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

        let allManuals = newList
        toUpdate.allManuals = allManuals

        dispatch(_setData(myID, toUpdate))
    }
}

export default createReducer<State>()
