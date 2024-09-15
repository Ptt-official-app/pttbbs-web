import { init as _init, setData as _setData, createReducer, DispatchedAction, Thunk } from 'react-reducer-utils'

import * as ServerUtils from './ServerUtils'
import api from './api'
import * as errors from './errors'
import { State_t, Maybe } from '../types'

export const myClass = 'pttbbs-web/Header'


export interface State extends State_t {
    user_id: string
}


interface State_m extends Maybe<State> { }

export const init = (myID: string, parentID?: string, doParent?: DispatchedAction<State>): Thunk<State> => {
    return async (dispatch, _) => {
        let state: State_m = {
            user_id: '',
        }
        dispatch(_init({ myID, parentID, doParent, state }))
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
