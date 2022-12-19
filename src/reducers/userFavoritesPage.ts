import { Thunk, init as _init, setData as _setData, createReducer, getState } from 'react-reducer-utils'

import * as ServerUtils from './ServerUtils'
import api from './api'

import { MergeList, SantizeBoard } from './utils'
import { BoardSummary_i, Maybe, State_t } from '../types'

export const myClass = 'demo-pttbbs/UserFavoritesPage'

export interface State extends State_t {
    theDate: Date
    level: string
    startIdx: string
    scrollTo: any
    lastPre: string
    lastNext: string
    isBusyLoading: boolean
    list: BoardSummary_i[]
    nextIdx: string
    isPreEnd: boolean
    isNextEnd: boolean
}

export interface State_m extends Maybe<State> { }

export const init = (myID: string, userID: string, level: string, startIdx: string): Thunk<State> => {
    return async (dispatch, _) => {
        let theDate = new Date()
        let state: State = {
            theDate,
            level,
            startIdx,
            scrollTo: null,
            lastPre: '',
            lastNext: '',
            isBusyLoading: false,
            list: [],
            nextIdx: '',
            isPreEnd: false,
            isNextEnd: false,
        }
        dispatch(_init({ myID, state }))
        dispatch(GetBoards(myID, userID, level, startIdx, false, false))
    }
}

export const SetData = (myID: string, data: State_m): Thunk<State> => {
    return async (dispatch, _) => {
        dispatch(_setData(myID, data))
    }
}

export const GetBoards = (myID: string, userID: string, level: string, startIdx: string, desc: boolean, isExclude: boolean): Thunk<State> => {
    return async (dispatch, getClassState) => {
        const state = getClassState()
        const me = getState(state, myID)
        if (!me) {
            return
        }
        let myList = me.list || []

        //check busy
        let lastPre = me.lastPre || ''
        let lastNext = me.lastNext || ''
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

        const { data, errmsg, status } = await api(ServerUtils.LoadFavoriteBoards(userID, level, startIdx, desc))
        if (status !== 200) {
            dispatch(_setData(myID, { errmsg, isBusyLoading: false }))
            return
        }
        if (!data) {
            dispatch(_setData(myID, { errmsg: 'no data', isBusyLoading: false }))
            return
        }

        let dataList = data.list || []
        dataList = dataList.map((each) => SantizeBoard(each))

        let newList = MergeList(myList, dataList, desc, isExclude)

        let toUpdate: State_m = {
            list: newList,
        }
        if (!desc) {
            toUpdate.nextIdx = data.next_idx
            toUpdate.lastNext = startIdx
            toUpdate.isBusyLoading = false
            if (!data.next_idx) {
                toUpdate.isNextEnd = true
            }
        } else {
            toUpdate.scrollToRow = dataList.length - 1 //only dataList.length - 1 new items.
            toUpdate.lastPre = startIdx
            toUpdate.isBusyLoading = false
            if (!data.next_idx) {
                toUpdate.isPreEnd = true
            }
        }

        console.log('doUserFavoritesPage.GetBoards: to update:', toUpdate)
        dispatch(_setData(myID, toUpdate))
    }
}

export default createReducer<State>()
