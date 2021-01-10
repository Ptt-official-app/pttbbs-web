import React, { useEffect, useState } from 'react'
import pageStyles from './Page.module.css'

import * as errors from './errors'

import { useWindowSize } from 'react-use'

import { useParams } from 'react-router-dom'

import { useActionDispatchReducer, getRoot, genUUID, Empty } from 'react-reducer-utils'

import * as DoSetIDEmailPage from '../reducers/setIDEmailPage'

import Header from './Header'

import QueryString from 'query-string'

export default (props) => {
  const [stateSetIDEmailPage, doSetIDEmailPage] = useActionDispatchReducer(DoSetIDEmailPage)

  //init
  let { userid } = useParams()

  useEffect(() => {
  const { token } = QueryString.parse(window.location.search)

    let setIDEmailPageID = genUUID()
    doSetIDEmailPage.init(setIDEmailPageID, doSetIDEmailPage, null, null, userid, token)
  }, [])

  //get data
  let setIDEmailPage = getRoot(stateSetIDEmailPage) || {}
  let myID = setIDEmailPage.id || ''
  let errmsg = setIDEmailPage.errmsg || ''
  let isDone = setIDEmailPage.isDone || false
  let data = setIDEmailPage.data || {}

  useEffect(() => {
    if(!isDone){
      return
    }

    doSetIDEmailPage.SleepAndRedirect(myID, userid)
  }, [isDone])

  //render
  const {height: innerHeight} = useWindowSize()
  let style = {
    height: innerHeight + 'px',
  }

  let renderData = () => {
    if(!data.idemail) {
      return (<Empty />)
    }

    return (
      <label className=''>您的認證信箱已更改為 {data.idemail} 囉～</label>
    )
  }

  let renderInfo = () => {
    if(!isDone) {
      return (<Empty />)
    }

    return (
      <label className=''>將會回到您的個人資訊</label>
    )
  }

  return (
    <div className={pageStyles['root']} style={style}>
      <div className={'container'} style={style}>
        <Header title='更改認證信箱' userID={userid} />
        <div className='row'>
          <div className='col'>
            {renderData()}
          </div>
          <div className='col'>
            <label className={pageStyles['errMsg']}>{errmsg}</label>
          </div>
          <div className='col'>
            {renderInfo()}
          </div>
        </div>
      </div>
    </div>
  )
}
