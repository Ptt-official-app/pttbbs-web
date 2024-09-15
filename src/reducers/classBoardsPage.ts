import { Thunk, init as _init, setData as _setData, createReducer, getState } from 'react-reducer-utils'

import * as ServerUtils from './ServerUtils'
import api from './api'

import { MergeList, SantizeBoard } from './utils'

import { BoardSummary_i, Maybe, State_t } from '../types'

export const myClass = 'pttbbs-web/ClassBoardsPage'

export interface State extends State_t {
    theDate: Date
    clsID: number
    startIdx: string
    scrollTo: any
    list: BoardSummary_i[]
    lastPre: string
    lastNext: string
    isBusyLoading: boolean
    nextIdx: string
    scrollToRow: number
    isPreEnd: boolean
    isNextEnd: boolean
}

export interface State_m extends Maybe<State> { }

export const init = (myID: string, clsID: number, startIdx: string): Thunk<State> => {
    let theDate = new Date()
    return async (dispatch, _) => {
        let state: State = {
            theDate,
            clsID,
            startIdx,
            scrollTo: null,
            list: [],
            lastPre: '',
            lastNext: '',
            isBusyLoading: false,
            nextIdx: '',
            scrollToRow: 0,
            isPreEnd: false,
            isNextEnd: false,
        }
        dispatch(_init({ myID, state }))
        dispatch(GetBoards(myID, clsID, startIdx, false, false))
    }
}

export const SetData = (myID: string, data: State_m): Thunk<State> => {
    return async (dispatch, _) => {
        dispatch(_setData(myID, data))
    }
}

export const GetBoards = (myID: string, clsID: number, startIdx: string, desc: boolean, isExclude: boolean): Thunk<State> => {
    clsID = clsID || 1 //clsID default by 1. (no clsID == 0)
    return async (dispatch, getClassState) => {
        const state = getClassState()
        const me = getState(state, myID)
        if (!me) {
            return
        }
        let myList = me.list

        //check busy
        let lastPre = me.lastPre
        let lastNext = me.lastNext
        let isBusyLoading = me.isBusyLoading
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

        // api
        const { data, errmsg, status } = await api(ServerUtils.LoadClassBoards(clsID, startIdx, desc))
        if (status !== 200) {
            dispatch(_setData(myID, { errmsg, isBusyLoading: false }))
            return
        }
        if (!data) {
            return
        }

        // integrate list
        let dataList = data.list
        dataList = dataList.map((each) => SantizeBoard(each))

        let newList = MergeList(myList, dataList, desc, isExclude)

        // to update
        let toUpdate: State_m = {
            list: newList
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

        dispatch(_setData(myID, toUpdate))
    }
}

export default createReducer<State>()
