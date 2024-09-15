import { Thunk, init as _init, setData as _setData, createReducer } from 'react-reducer-utils'

import * as ServerUtils from './ServerUtils'
import api from './api'
import { State_t, UserDetail } from '../types'

export const myClass = 'pttbbs-web/UserInfoPage'

export interface State extends State_t, UserDetail {
    theDate: Date
    userID: string
}

// init
export const init = (myID: string, userID: string): Thunk<State> => {
    return async (dispatch, _) => {
        let theDate = new Date()
        dispatch(_init({ myID, state: { theDate, userID } }))
        dispatch(_getData(myID, userID))
    }
}

const _getData = (myID: string, userID: string): Thunk<State> => {
    return async (dispatch, _) => {
        const { data, errmsg, status } = await api(ServerUtils.GetUserInfo(userID))

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

export default createReducer<State>()
