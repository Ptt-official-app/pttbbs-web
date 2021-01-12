import React, { useEffect, useState } from 'react'
import pageStyles from './Page.module.css'

import * as errors from './errors'

import { useWindowSize } from 'react-use'

import { useParams } from 'react-router-dom'

import { useActionDispatchReducer, getRoot, genUUID } from 'react-reducer-utils'

import * as DoUserPage from '../reducers/userInfoPage'

import { TSToDateTimeStr } from './utils'

import Header from './Header'

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
    window.location.href = "/user/"+userid+"/resetpassword"
  }

  let changeEmail = () => {
    window.location.href = "/user/"+userid+"/attemptchangeemail"
  }

  let setIDEmail = () => {
    window.location.href = "/user/"+userid+"/attemptsetidemail"
  }

  let renderPttEmail = () => {
    if(!userPage.pttemail) {
      return (<label>我在 Ptt 的 Email 是 (還沒有設定～)</label>)
    }
    if (!userPage.justify) {
      return (<label>我在 Ptt 的 Email 是 {userPage.pttemail} (審核: 還沒有通過)</label>)
    }

    return (<label>我在 Ptt 的 Email 是 {userPage.pttemail} (審核: {userPage.justify})</label>)
  }

  let renderPost = () => {
    let badposts = (!userPage.bad_post) ? '' : ' (被退 ' + userPage.bad_post + ' 篇)'

    return (<label>我已經 po 了 {userPage.posts} 篇文章{badposts}</label>)
  }

  let allErrMsg = errors.mergeErr(errMsg, errmsg)

  let headerTitle = userid + '的資訊'

  let email = userPage.email || '(還沒有設定～)'
  if(userPage.email && !userPage.email_set) {
    email += '(正在設定～)'
  }

  let idemail = userPage.idemail || '(還沒有設定～)'
  if(userPage.idemail && !userPage.idemail_set) {
    idemail += '(正在設定～)'
  }

  let career = userPage.Career || '(某個角落)'

  return (
    <div className={pageStyles['root']} style={style}>
      <div className={'container'} style={style}>
        <Header title={headerTitle} userID={userid} />
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
            {renderPttEmail()}
          </div>
        </div>
        <div className='row'>
          <div className='col'>
            <label>我平常聯絡的 Email 是 {email}</label>
          </div>
          <div className='col'>
            <button className="btn btn-primary" onClick={changeEmail}>我想換聯絡 Email</button>
          </div>
        </div>
        <div className='row'>
          <div className='col'>
            <label>我認證的 Email 是 {idemail}</label>
          </div>
          <div className='col'>
            <button className="btn btn-primary" onClick={setIDEmail}>我想換認證 Email</button>
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
            <label>我上次上站的 IP: {userPage.last_ip} ({userPage.last_host}) 時間: {TSToDateTimeStr(userPage.last_login)}</label>
          </div>
        </div>
        <div className='row'>
          <div className='col'>
            {renderPost()}
          </div>
        </div>
        <div className='row'>
          <div className='col'>
            <label>我平常在 {career} 畫圈圈～</label>
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