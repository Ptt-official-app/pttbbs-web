import { Thunk, init as _init, setData as _setData, createReducer } from 'react-reducer-utils'

import * as ServerUtils from './ServerUtils'
import api from './api'
//import * as errors from './errors'

import { MergeIdxList, SantizeBoard } from './utils'
import { BoardSummary_i, Maybe, State_t } from '../types'

export const myClass = 'pttbbs-web/HotBoardsPage'

export interface State extends State_t {
    theDate: Date
    list: BoardSummary_i[]
    isBusyLoading: boolean
}

export interface State_m extends Maybe<State> { }

export const init = (myID: string): Thunk<State> => {
    let theDate = new Date()
    return async (dispatch, _) => {
        let state: State = {
            theDate,
            list: [],
            isBusyLoading: false,
        }
        dispatch(_init({ myID, state }))
        dispatch(_getData(myID))
    }
}

const _getData = (myID: string): Thunk<State> => {
    return async (dispatch, _) => {
        dispatch(_setData(myID, { isBusyLoading: true }))
        const { data, errmsg, status } = await api(ServerUtils.LoadPopularBoards())

        if (status !== 200) {
            dispatch(_setData(myID, { errmsg, isBusyLoading: false }))
            return
        }
        if (!data) {
            dispatch(_setData(myID, { errmsg: 'no data', isBusyLoading: false }))
            return
        }

        let dataList: BoardSummary_i[] = data.list || []
        dataList = dataList.map((each) => SantizeBoard(each))

        let newList = MergeIdxList([], dataList, false, 1)

        let toUpdate: State_m = {
            list: newList,
            isBusyLoading: false,
        }

        dispatch(_setData(myID, toUpdate))
    }
}

export default createReducer<State>()
