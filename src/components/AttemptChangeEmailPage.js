import React, { useEffect, useState } from 'react'
import pageStyles from './Page.module.css'

import * as errors from './errors'

import { useWindowSize } from 'react-use'

import { useParams } from 'react-router-dom'

import { useActionDispatchReducer, getRoot, genUUID, Empty } from 'react-reducer-utils'

import * as DoAttemptChangeEmailPage from '../reducers/attemptChangeEmailPage'
import * as DoHeader from '../reducers/header'

import Header from './Header'

export default (props) => {
  const [stateAttemptChangeEmailPage, doAttemptChangeEmailPage] = useActionDispatchReducer(DoAttemptChangeEmailPage)
  const [stateHeader, doHeader] = useActionDispatchReducer(DoHeader)

  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [errMsg, setErrMsg] = useState('')

  //init
  let { userid } = useParams()

  useEffect(() => {
    let headerID = genUUID()
    doHeader.init(headerID, doHeader, null, null)

    let attemptChangeEmailPageID = genUUID()
    doAttemptChangeEmailPage.init(attemptChangeEmailPageID, doAttemptChangeEmailPage, null, null, userid)
  }, [])

  //get data
  let attemptChangeEmailPage = getRoot(stateAttemptChangeEmailPage) || {}
  let myID = attemptChangeEmailPage.id || ''
  let userID = attemptChangeEmailPage.userID || ''
  let errmsg = attemptChangeEmailPage.errmsg || ''
  let isDone = attemptChangeEmailPage.isDone || false

  useEffect(() => {
    if (!isDone) {
      return
    }

    doAttemptChangeEmailPage.SleepAndRedirect(myID, userid)

  }, [isDone])

  //render
  const {height: innerHeight} = useWindowSize()
  let style = {
    height: innerHeight + 'px',
  }

  let cleanErr = () => {
    setErrMsg('')
    doAttemptChangeEmailPage.CleanErr(myID)
  }

  let changePassword = (password) => {
    setPassword(password)
    cleanErr()
  }

  let changeEmail = (email) => {
    setEmail(email)
    cleanErr()
  }

  let submit = () => {
    if(!email) {
      setErrMsg('您是忘記您的 email 了？～')
      return
    }
    if(!password) {
      setErrMsg('您是忘記您的密碼了？～')
      return
    }
    doAttemptChangeEmailPage.ChangeEmail(myID, userID, password, email)
    cleanErr()
  }

  let renderData = () => {
    if(!isDone) {
      return (<Empty />)
    }

    return (
      <label className=''>已經成功送出確認信囉～請您到您設定的信箱確認～</label>
    )
  }

  let allErrMsg = errors.mergeErr(errMsg, errmsg)

  return (
    <div className={pageStyles['root']} style={style}>
      <div className={'container'}>
        <Header title='我想換聯絡 Email' stateHeader={stateHeader} />
        <div className='row'>
          <div className='col'>
            <label>我是 {userID}</label>
          </div>
        </div>
        <div className='row'>
          <div className='col'>
            <input className="form-control" type="text" placeholder="新的聯絡 Email:" aria-label="email" value={email} onChange={(e) => changeEmail(e.target.value)}/>
          </div>
          <div className='col'></div>
        </div>
        <div className='row'>
          <div className='col'>
            <input className="form-control" type="password" placeholder="我的密碼:" aria-label="password" value={password} onChange={(e) => changePassword(e.target.value)}/>
          </div>
          <div className='col'></div>
        </div>
        <div className='row'>
          <div className='col'>
            <button className="btn btn-primary" onClick={submit}>我確定要換聯絡 Email～</button>
          </div>
          <div className='col'>
            {renderData()}
          </div>
          <div className='col'>
            <label className={pageStyles['errMsg']}>{allErrMsg}</label>
          </div>
        </div>
      </div>
    </div>
  )
}
