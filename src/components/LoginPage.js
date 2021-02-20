import React, { useEffect, useState } from 'react'
import pageStyles from './Page.module.css'
import config from 'config'

import * as errors from './errors'

import { useActionDispatchReducer, getRoot, genUUID, Empty } from 'react-reducer-utils'

import * as DoLoginPage from '../reducers/loginPage'
import * as DoHeader from '../reducers/header'

import Header from './Header'

export default (props) => {
  const [stateLoginPage, doLoginPage] = useActionDispatchReducer(DoLoginPage)
  const [stateHeader, doHeader] = useActionDispatchReducer(DoHeader)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errMsg, setErrMsg] = useState('')

  //init
  useEffect(() => {
    let headerID = genUUID()
    doHeader.init(headerID, doHeader, null, null)

    let loginPageID = genUUID()
    doLoginPage.init(loginPageID, doLoginPage)
  }, [])

  //get data
  let loginPage = getRoot(stateLoginPage) || {}
  let myID = loginPage.id || ''
  let errmsg = loginPage.errmsg || ''

  let cleanErr = () => {
    setErrMsg('')
    doLoginPage.CleanErr(myID)
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
    doLoginPage.Login(myID, username, password)
  }

  let register = () => {
    window.location.href = "/register"
  }

  let forgotPassword = () => {
    window.location.href = "/forgetPassword"
  }

  let allErrMsg = errors.mergeErr(errMsg, errmsg)

  // -------- Component Instance ----------
  let headerTitle = `\\歡迎登入 ${config.BRAND}～/`

  if(!myID) {
    return (<Empty />)
  }
  return (
    <div className={'vh-100 ' + pageStyles['root']}>
      <Header title={headerTitle} stateHeader={stateHeader} />
      <div className={'container mt-5 '}>
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
