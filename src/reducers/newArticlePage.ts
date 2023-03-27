import { Thunk, init as _init, setData as _setData, createReducer } from 'react-reducer-utils'

import * as ServerUtils from './ServerUtils'
import api from './api'

import { COLOR_FOREGROUND_WHITE, COLOR_BACKGROUND_BLACK } from '../constants'
import { Line, Maybe, State_t } from '../types'

export const myClass = 'demo-pttbbs/NewArticlePage'

const _DEFAULT_POST_TYPES = [
    '問題',
    '建議',
    '討論',
    '心得',
    '閒聊',
    '請益',
    '情報',
    '公告',
]

export interface State extends State_t {
    theDate: Date
    bid: string
    scrollTo: any
    content: Line[]
    brdname: string
    post_type: string[]
}

export interface State_m extends Maybe<State> { }

export const init = (myID: string, bid: string): Thunk<State> => {
    let theDate = new Date()
    return async (dispatch, _) => {
        let state: State_m = {
            theDate,
            bid,
            scrollTo: null,
            content: [
                {
                    'runes': [
                        {
                            'text': '',
                            color0: {
                                foreground: COLOR_FOREGROUND_WHITE,
                                background: COLOR_BACKGROUND_BLACK,
                            }
                        }]
                }],
            brdname: '',
            post_type: _DEFAULT_POST_TYPES,
        }
        dispatch(_init({ myID, state }))
        dispatch(_getBoardSummary(myID, bid))
    }
}

const _getBoardSummary = (myID: string, bid: string): Thunk<State> => {
    return async (dispatch, _) => {

        // Get board information
        let fields = ['brdname', 'post_type']
        const { data, errmsg, status } = await api(ServerUtils.GetBoardDetail(bid, fields))
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

export const UpdateContent = (myID: string, content: Line[]): Thunk<State> => {
    return async (dispatch, _) => {
        dispatch(_setData(myID, { content }))
    }
}

export const setData = (myID: string, data: State_m): Thunk<State> => {
    return async (dispatch, _) => {
        return dispatch(_setData(myID, data))
    }
}

export const Submit = (myID: string, bid: string, theClass: string, title: string, content: Line[]): Thunk<State> => {
    return async (dispatch, _) => {
        let uploadContent = content.map((each) => each.runes)
        const { errmsg, status } = await api(ServerUtils.CreateArticle(bid, theClass, title, uploadContent))
        if (status !== 200) {
            dispatch(_setData(myID, { errmsg }))
            return
        }

        window.location.href = '/board/' + bid + '/articles'
    }
}

export default createReducer<State>()
