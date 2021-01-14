import React, { useEffect, useState } from 'react'
import pageStyles from './Page.module.css'

import * as errors from './errors'

import { useWindowSize } from 'react-use'

import { useActionDispatchReducer, getRoot, genUUID } from 'react-reducer-utils'

import * as DoHomePage from '../reducers/homePage'

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
  let accessToken = homePage.AccessToken || ''

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

  let _isInit = () => {
    if(!myID) {
      setErrMsg(errors.ERR_SYS_INIT)
      return false
    }
    return true
  }
  let login = () => {
    if(!_isInit()) return
    doHomePage.Login(myID, username, password)
  }

  let register = () => {
    if(!_isInit()) return
    window.location.href = "/register"
  }

  let forgotPassword = () => {
    window.location.href = "/forgetPassword"
  }

  let allErrMsg = errors.mergeErr(errMsg, errmsg)

  // -------- Component Instance ----------
  return (
    <div className={pageStyles['root']} style={style}>
      <div className={'container'} style={style}>
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
