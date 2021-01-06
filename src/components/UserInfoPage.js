import React, { useEffect, useState } from 'react'
import pageStyles from './Page.module.css'
import styles from './UserInfoPage.module.css'

import * as errors from './errors'

import { useWindowSize } from 'react-use'

import { useParams } from 'react-router-dom'

import { useActionDispatchReducer, getRoot, genUUID } from 'react-reducer-utils'

import * as DoUserPage from '../reducers/userInfoPage'

export default (props) => {
  const [stateUserPage, doUserPage] = useActionDispatchReducer(DoUserPage)

  const [errMsg, setErrMsg] = useState('')

  //init
  let { userid } = useParams()

  useEffect(() => {
    let userPageID = genUUID()
    doUserPage.init(userPageID, doUserPage, null, null, userid)
  }, [])

  //get data
  let userPage = getRoot(stateUserPage) || {}
  let myID = userPage.id || ''
  let errmsg = userPage.errmsg || ''

  //render
  const {height: innerHeight} = useWindowSize()
  let style = {
    height: innerHeight + 'px',
  }

  let changePassword = () => {
    window.location.href="/user/"+userid+"/resetpassword"
  }

  let logout = () => {

  }

  let changeEmail = () => {

  }

  let verifyEmail = () => {

  }


  let allErrMsg = errors.mergeErr(errMsg, errmsg)

  return (
    <div className={pageStyles['root']} style={style}>
      <div className={'container ' + styles['root']} style={style}>
        <div className='row'>
          <div className='col'></div>
          <div className='pull-right'>
            <button className="btn btn-primary" onClick={logout}>登出</button>
          </div>
        </div>
        <div className='row'>
          <div className='col'>
            <label>我是 {userPage.username}({userPage.nickname}) {userPage.realname}</label>
          </div>
          <div className='col'>
            <button className="btn btn-primary" onClick={changePassword}>我想換密碼～</button>
          </div>
        </div>
        <div className='row'>
          <div className='col'>
            <label>我在 Ptt 的 Email 是 {userPage.PttEmail} (審核: {userPage.justify})</label>
          </div>
        </div>
        <div className='row'>
          <div className='col'>
            <label>我認證的 Email 是 {userPage.email} ({userPage.email_ts})</label>
          </div>
          <div className='col'>
            <button className="btn btn-primary" onClick={changeEmail}>我想換 Email</button>
          </div>
        </div>
        <div className='row'>
          <div className='col'>
            <label>我認證的 Email {userPage.email_verified}通過認證 ({userPage.email_verified_ts})</label>
          </div>
          <div className='col'>
            <button className="btn btn-primary" onClick={verifyEmail}>我想再一次認證 Email</button>
          </div>
        </div>
        <div className='row'>
          <div className='col'>
            <label>我有 {userPage.money} P 幣～</label>
          </div>
        </div>
        <div className='row'>
          <div className='col'>
            <label>我已經上站 {userPage.login_days} 天了～</label>
          </div>
        </div>
        <div className='row'>
          <div className='col'>
            <label>我上次上站的 IP: {userPage.last_ip} ({userPage.last_host}) 時間: {userPage.last_login}</label>
          </div>
        </div>
        <div className='row'>
          <div className='col'>
            <label>我平常在 {userPage.career} 玩耍～</label>
          </div>
        </div>
        <div className='row'>
          <div className='col'>
            <label>我的五子棋: 贏: {userPage.five_win} 輸: {userPage.five_lose} 和: {userPage.five_tie}</label>
          </div>
        </div>
        <div className='row'>
          <div className='col'>
            <label>我的六子棋: 贏: {userPage.conn6_win} 輸: {userPage.conn6_lose} 和: {userPage.conn6_tie}</label>
          </div>
        </div>
        <div className='row'>
          <div className='col'>
            <label>我的象棋: 贏: {userPage.chc_win} 輸: {userPage.chc_lose} 和: {userPage.chc_tie} 等級: {userPage.chess_rank}</label>
          </div>
        </div>
        <div className='row'>
          <div className='col'>
            <label>我的暗棋: 贏: {userPage.dark_win} 輸: {userPage.dark_lose} 和: {userPage.dark_tie}</label>
          </div>
        </div>
        <div className='row'>
          <div className='col'>
            <label>我的圍棋: 贏: {userPage.go_win} 輸: {userPage.go_lose} 和: {userPage.go_tie}</label>
          </div>
        </div>
      </div>
    </div>
  )
}