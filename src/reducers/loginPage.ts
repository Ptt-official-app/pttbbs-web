import { DispatchedAction, init as _init, setData as _setData, createReducer, Thunk } from 'react-reducer-utils'

import * as ServerUtils from './ServerUtils'
import api from './api'
import * as errors from './errors'

import { State_t } from '../types'


export const myClass = 'demo-pttbbs/LoginPage'

export interface State extends State_t {
    theDate: Date
}

// init
export const init = (myID: string, parentID: string, doParent: DispatchedAction<any>): Thunk<State> => {
    let theDate = new Date()
    return async (dispatch, _) => {
        dispatch(_init({ myID, parentID, doParent, state: { theDate } }))
    }
}

export const Login = (myID: string, username: string, password: string): Thunk<State> => {
    return async (dispatch, _) => {
        const { data, errmsg, status } = await api(ServerUtils.Login(username, password))

        if (!status) {
            dispatch(_setData(myID, { errmsg: errors.ERR_NETWORK }))
            return
        }

        if (status === 401) {
            dispatch(_setData(myID, { errmsg: errors.ERR_PASSWD }))
            return
        }

        if (status !== 200) {
            dispatch(_setData(myID, { errmsg }))
            return
        }
        if (!data) {
            dispatch(_setData(myID, { errmsg: 'no data' }))
            return
        }

        window.location.href = "/user/" + data.user_id + '/favorites'
    }
}

export const CleanErr = (myID: string): Thunk<State> => {
    return async (dispatch, _) => {
        dispatch(_setData(myID, { errmsg: '' }))
    }
}

export default createReducer<State>()
