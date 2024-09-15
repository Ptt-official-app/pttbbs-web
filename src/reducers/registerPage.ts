import { Thunk, init as _init, setData as _setData, createReducer } from 'react-reducer-utils'

import * as ServerUtils from './ServerUtils'
import api from './api'
import * as errors from './errors'

import { GoUserHome } from './utils'
import { State_t } from '../types'


export const myClass = 'pttbbs-web/RegisterPage'

export interface State extends State_t {
    theDate: Date
    infomsg?: string
    isSetVerifyEmail: boolean
}

// init
export const init = (myID: string): Thunk<State> => {
    return async (dispatch, _) => {
        let theDate = new Date()
        dispatch(_init({ myID, state: { theDate } }))
    }
}

export const VerifyEmail = (myID: string, username: string, email: string): Thunk<State> => {
    return async (dispatch, _) => {
        const { errmsg, status } = await api(ServerUtils.AttemptRegister(username, email))

        if (!status) {
            dispatch(_setData(myID, { errmsg: errors.ERR_NETWORK }))
            return
        }

        if (status !== 200) {
            dispatch(_setData(myID, { errmsg }))
            return
        }

        dispatch(_setData(myID, { infomsg: errors.INFO_VERIFY_EMAIL, isSetVerifyEmail: true }))

    }
}

export const Register = (myID: string, username: string, password: string, passwordConfirm: string, email: string, over18: boolean, verifyCode: string): Thunk<State> => {
    return async (dispatch, _) => {

        const { data, errmsg, status } = await api(ServerUtils.Register(username, password, passwordConfirm, email, over18, verifyCode))

        if (!status) {
            dispatch(_setData(myID, { errmsg: errors.ERR_NETWORK }))
            return
        }

        if (status === 400) {
            dispatch(_setData(myID, { errmsg: errors.ERR_REGISTER }))
            return
        }

        if (status !== 200) {
            dispatch(_setData(myID, { errmsg }))
            return
        }
        if (!data) {
            return
        }

        const { user_id } = data

        GoUserHome(user_id)
    }
}

export const CleanMsg = (myID: string): Thunk<State> => {
    return async (dispatch, _) => {
        dispatch(_setData(myID, { infomsg: '', errmsg: '' }))
    }
}

export default createReducer<State>()
