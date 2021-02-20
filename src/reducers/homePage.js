import {init as _init, createReducer} from 'react-reducer-utils'

const myClass = 'demo-pttbbs/HomePage'

// init
export const init = (myID, doMe, parentID, doParent) => {
  let theDate = new Date()
  return (dispatch, getState) => {
    dispatch(_init({myID, myClass, doMe, parentID, doParent, theDate}))
  }
}


export default createReducer()
