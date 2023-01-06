import { init as _init, setData as _setData, createReducer, DispatchedAction, Thunk } from 'react-reducer-utils'

import * as ServerUtils from './ServerUtils'
import api from './api'
import * as errors from './errors'
import { State_t } from '../types'

export const myClass = 'demo-pttbbs/Header'


export interface State extends State_t {
    user_id: string
}

export const init = (myID: string, parentID?: string, doParent?: DispatchedAction<State>): Thunk<State> => {
    return async (dispatch, _) => {
        dispatch(_init({ myID, parentID, doParent }))
        dispatch(getData(myID))
    }
}

const getData = (myID: string): Thunk<State> => {
    return async (dispatch, _) => {
        const { data, errmsg, status } = await api(ServerUtils.GetUserID())

        if (!status) {
            dispatch(_setData(myID, { errmsg: errors.ERR_NETWORK }))
            return
        }
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
