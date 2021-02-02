import {init as _init, setData as _setData, createReducer} from 'react-reducer-utils'

import * as ServerUtils from './ServerUtils'
import api from './api'
//import * as errors from './errors'

const myClass = 'demo-pttbbs/ArticlesPage'

export const init = (myID, doMe, parentID, doParent, bid) => {
  let theDate = new Date()
  return (dispatch, getState) => {
    dispatch(_init({myID, myClass, doMe, parentID, doParent, theDate}))
    dispatch(_getData(myID, bid))
  }
}

const _getData = (myID, bid) => {
  return (dispatch, getState) => (async() => {

    // Get board information
    const {data, errmsg, status} = await api(ServerUtils.GetBoardSummary(bid))
    if (status !== 200) {
      dispatch(_setData(myID, {errmsg}))
    }
    dispatch(_setData(myID, data))

    // TODO: use the real API
    // Load articles
    fetch('/articles.json',
    {
      headers : {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
       }
    })
    .then(function(response){
        console.log(response)
        return response.json();
    })
    .then(function(json) {
      console.log(json.list);
      dispatch(_setData(myID, json))
    })
    .catch( (err) => {
      console.log(err);
      dispatch(_setData(myID, {errmsg: err}))
    })

  })()
}

export const getBoardDetail = (myID, bid) => {
  return (dispatch, getState) => (async() => {
    const {data, errmsg, status} = await api(ServerUtils.GetBoardSummary(bid))

    if (status !== 200) {
      dispatch(_setData(myID, {errmsg}))
      return
    }
    dispatch(_setData(myID, data))
  })()
}

export default createReducer()
