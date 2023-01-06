import { Thunk, init as _init, setData as _setData, createReducer } from 'react-reducer-utils'

import * as ServerUtils from './ServerUtils'
import api from './api'

import { GoUserHome } from './utils'
import { State_t } from '../types'

export const myClass = 'demo-pttbbs/ChangeEmailPage'

export interface State extends State_t {
    theDate: Date
    userID: string
    token: string
    isDone: boolean
}

// init
export const init = (myID: string, userID: string, token: string): Thunk<State> => {
    let theDate = new Date()
    return async (dispatch, _) => {
        let state: State = {
            theDate,
            userID,
            token,
            isDone: false
        }
        dispatch(_init({ myID, state: state }))
        dispatch(_getData(myID, userID, token))
    }
}

const _getData = (myID: string, userID: string, token: string): Thunk<State> => {
    return async (dispatch, _) => {
        const { data, errmsg, status } = await api(ServerUtils.ChangeEmail(userID, token))

        if (status !== 200) {
            dispatch(_setData(myID, { errmsg, isDone: true }))
            return
        }

        dispatch(_setData(myID, { data, isDone: true }))
    }
}

export const SleepAndRedirect = (myID: string, userID: string): Thunk<State> => {
    return async (_, _1) => {
        setTimeout(() => {
            GoUserHome(userID)
        }, 5000)
    }
}

export default createReducer<State>()
