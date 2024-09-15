import { Thunk, init as _init, setData as _setData, createReducer } from 'react-reducer-utils'

import * as ServerUtils from './ServerUtils'
import api from './api'
import * as errors from './errors'

import { GoUserHome } from './utils'
import { State_t } from '../types'

export const myClass = 'pttbbs-web/attemptSetIDEmailPage'

export interface State extends State_t {
    theDate: Date
    userID: string
    isDone: boolean
}

// init
export const init = (myID: string, userID: string): Thunk<State> => {
    let theDate = new Date()
    return async (dispatch, _) => {
        let state: State = {
            theDate,
            userID,
            isDone: false,
        }
        dispatch(_init({ myID, state }))
    }
}

export const SetIDEmail = (myID: string, userID: string, password: string, email: string): Thunk<State> => {
    return async (dispatch, _) => {
        const { errmsg, status } = await api(ServerUtils.AttemptSetIDEmail(userID, password, email))

        if (!status) {
            dispatch(_setData(myID, { errmsg: errors.ERR_NETWORK }))
            return
        }

        if (status === 403) {
            let theErrMsg = errors.ERR_PASSWD
            if (errmsg === 'already exists') {
                theErrMsg = errors.ERR_EMAIL_ALREADY_EXISTS
            }
            dispatch(_setData(myID, { errmsg: theErrMsg }))
            return
        }

        if (status !== 200) {
            dispatch(_setData(myID, { errmsg }))
            return
        }

        dispatch(_setData(myID, { isDone: true }))
    }
}

export const SleepAndRedirect = (myID: string, userID: string): Thunk<State> => {
    return async (dispatch, _) => {
        setTimeout(() => {
            GoUserHome(userID)
        }, 5000)
    }
}

export const CleanErr = (myID: string): Thunk<State> => {
    return async (dispatch, _) => {
        dispatch(_setData(myID, { errmsg: '' }))
    }
}

export default createReducer<State>()
