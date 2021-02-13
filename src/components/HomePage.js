import React, { useEffect, useState } from 'react'
import pageStyles from './Page.module.css'

import * as errors from './errors'

import { useWindowSize } from 'react-use'

import { useActionDispatchReducer, getRoot, genUUID, Empty } from 'react-reducer-utils'

import * as DoHomePage from '../reducers/homePage'
import Header from './Header'

export default (props) => {
  const [stateHomePage, doHomePage] = useActionDispatchReducer(DoHomePage)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errMsg, setErrMsg] = useState('')

  //init
  useEffect(() => {
    let homePageID = genUUID()
    doHomePage.init(homePageID, doHomePage)
  }, [])

  //get data
  let homePage = getRoot(stateHomePage) || {}
  let myID = homePage.id || ''
  let errmsg = homePage.errmsg || ''

  //render
  const {height: innerHeight} = useWindowSize()
  let style = {
    height: innerHeight + 'px',
  }

  let cleanErr = () => {
    setErrMsg('')
    doHomePage.CleanErr(myID)
  }

  let changeUsername = (username) => {
    setUsername(username)
    cleanErr()
  }

  let changePassword = (password) => {
    setPassword(password)
    cleanErr()
  }

  // ---------- Handlers -------------

  let login = () => {
    doHomePage.Login(myID, username, password)
  }

  let register = () => {
    window.location.href = "/register"
  }

  let forgotPassword = () => {
    window.location.href = "/forgetPassword"
  }

  let allErrMsg = errors.mergeErr(errMsg, errmsg)

  // -------- Component Instance ----------
  let headerTitle = "\\歡迎登入 PTT～/"

  if(!myID) {
    return (<Empty />)
  }
  return (
    <div className={pageStyles['root']} style={style}>
      <Header title={headerTitle}/>
      <div className={'container mt-5 '} style={style}>
        <div className="row">
          <div className="col-12 col-md-6 mx-auto">

            <input className="form-control mb-3" type="text" placeholder="Username:" aria-label="Username" value={username} onChange={(e) => changeUsername(e.target.value)}/>
            <input className="form-control mb-3" type="password" placeholder="Password:" aria-label="Password" value={password} onChange={(e) => changePassword(e.target.value)} />
            <div className='d-flex justify-content-between'>
              <div>
                <button className="btn btn-primary mr-3" onClick={login}>我要登入</button>
                <button className="btn btn-primary" onClick={register}>我想註冊</button>
              </div>
              <button className="btn btn-primary" onClick={forgotPassword}>我忘記密碼了 Orz</button>
            </div>
            <label className={pageStyles['errMsg']}>{allErrMsg}</label>
          </div>
        </div>
      </div>
    </div>
  )
}
