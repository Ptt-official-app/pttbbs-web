import { Thunk, init as _init, setData as _setData, createReducer, getState } from 'react-reducer-utils'

import * as ServerUtils from './ServerUtils'
import api from './api'
//import * as errors from './errors'

import { Content, Line, Maybe, State_t } from '../types'

export const myClass = 'demo-pttbbs/ManualPage'

export interface State extends State_t {
    theDate: Date
    scrollTo: any
    isPreEnd: boolean

}

export interface State_m extends Maybe<State> { }

export const init = (myID: string, bid: string, path: string): Thunk<State> => {
    return async (dispatch, _) => {
        let theDate = new Date()
        let state: State = {
            theDate,
            scrollTo: null,
            isPreEnd: true,
        }
        dispatch(_init({ myID, state }))
        dispatch(GetManualContent(myID, bid, path))
    }
}

export const SetData = (myID: string, data: State_m): Thunk<State> => {
    return async (dispatch, _) => {
        dispatch(_setData(myID, data))
    }
}

//GetManualContent
//
//1. 拿到 content.
//2. parse content.
//3. contentComments.
export const GetManualContent = (myID: string, bid: string, path: string): Thunk<State> => {
    return async (dispatch, getClassState) => {
        const { data, errmsg, status } = await api(ServerUtils.GetManual(bid, path))

        console.log('GetManualContent: data:', data, 'status:', status, 'myID:', myID)

        if (status !== 200) {
            dispatch(_setData(myID, { errmsg }))
            return
        }
        if (!data) {
            return
        }

        dispatch(_setData(myID, data))

        let content = data.content
        let lines = _parseLines(content)

        let state = getClassState()
        let me = getState(state, myID)
        if (!me) {
            return
        }

        let isPreEnd = me.isPreEnd || false
        let comments = me.comments || []
        let contentComments = isPreEnd ? lines.concat(comments) : comments

        dispatch(_setData(myID, { content: lines, contentComments }))
    }
}

const _parseLines = (content: Content): Line[] => {
    return content.map((runes) => ({ runes }))
}

export default createReducer<State>()
