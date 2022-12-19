import { init as _init, createReducer, State as rState, Thunk } from 'react-reducer-utils'

export const myClass = 'demo-pttbbs/HomePage'

export interface State extends rState {
    theDate: Date,
}

// init
export const init = (myID: string): Thunk<State> => {
    let theDate = new Date()
    return async (dispatch, _) => {
        dispatch(_init({ myID, state: { theDate } }))
    }
}

export default createReducer<State>()
