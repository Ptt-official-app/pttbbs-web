import { Thunk, init as _init, setData as _setData, createReducer } from 'react-reducer-utils'

import * as ServerUtils from './ServerUtils'
import api from './api'
import * as errors from './errors'
import { State_t } from '../types'

export const myClass = 'demo-pttbbs/ChangePasswdPage'

export interface State extends State_t {
    theDate: Date
    userID: string
}

// init
export const init = (myID: string, userID: string): Thunk<State> => {
    let theDate = new Date()
    return async (dispatch, _) => {
        dispatch(_init({ myID, state: { theDate, userID } }))
    }
}

export const ChangePasswd = (myID: string, userID: string, origPassword: string, password: string, passwordConfirm: string): Thunk<State> => {
    return async (dispatch, _) => {
        const { data, errmsg, status } = await api(ServerUtils.ChangePasswd(userID, origPassword, password, passwordConfirm))

        if (!status) {
            dispatch(_setData(myID, { errmsg: errors.ERR_NETWORK }))
            return
        }

        if (status === 403) {
            dispatch(_setData(myID, { errmsg: errors.ERR_PASSWD }))
            return
        }

        if (status !== 200) {
            dispatch(_setData(myID, { errmsg }))
            return
        }
        if (!data) {
            return
        }

        window.location.href = "/user/" + data.user_id
    }
}

export const CleanErr = (myID: string): Thunk<State> => {
    return async (dispatch, _) => {
        dispatch(_setData(myID, { errmsg: '' }))
    }
}

export default createReducer<State>()
