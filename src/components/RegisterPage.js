import React, { useEffect, useState } from 'react'
import pageStyles from './Page.module.css'

import * as errors from './errors'

import { useActionDispatchReducer, getRoot, genUUID } from 'react-reducer-utils'

import * as DoRegisterPage from '../reducers/registerPage'

export default (props) => {
  const [stateRegitsterPage, doRegPage] = useActionDispatchReducer(DoRegisterPage)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [password_confirm, setPasswordConfirm] = useState('')
  const [errMsg, setErrMsg] = useState('')

  //init
  useEffect(() => {
    let registerPageID = genUUID()
    doRegPage.init(registerPageID, doRegPage)
  }, [])

  //get data
  let registerPage = getRoot(stateRegitsterPage) || {}
  let myID = registerPage.id || ''
  let errmsg = registerPage.errmsg || ''

  let cleanErr = () => {
    setErrMsg('')
  }

  let changeUsername = (username) => {
    setUsername(username)
    cleanErr()
  }

  let changePassword = (password) => {
    setPassword(password)
    cleanErr()
  }

  let changeConfirm = (pwd) => {
    setPasswordConfirm(pwd);
    if (pwd !== password) {
      setErrMsg(errors.WARNING_PSD_UNMATCH);
    } else {
      cleanErr()
    }
  }
  // ---------- Handlers -------------

  let _isInitSuccessful = () => {
    if(!myID) {
      setErrMsg(errors.ERR_SYS_INIT)
      return false
    }
    return true
  }

  let submit = () => {
    if(!_isInitSuccessful()) return
    doRegPage.Register(myID, username, password, password_confirm, document.getElementById("over18Field").checked)
  }

  let allErrMsg = errors.mergeErr(errMsg, errmsg)

  // -------- Component Instance ----------
  return (
    <div className={pageStyles['root']}>
      <div className='container vh-100'>
        <div className="row">
          <div className="col-12 col-md-6 mx-auto">

            <div className="form-group">
              <label htmlFor="accountField">帳號</label>
              <input id="accountField" className="form-control " type="text" placeholder="Username:" aria-label="Username" value={username} onChange={(e) => changeUsername(e.target.value)}/>
            </div>
            <div className="form-group">
              <label htmlFor="passwordField">密碼</label>
              <input id="passwordField" className="form-control" type="password" placeholder="Password:" aria-label="Password" value={password} onChange={(e) => changePassword(e.target.value)} />
            </div>
            <div className="form-group">
              <label htmlFor="confirmField">確認密碼</label>
              <input id="confirmField" className="form-control" type="password" placeholder="Confirm Password:" aria-label="Password Confirm" value={password_confirm} onChange={(e) => changeConfirm(e.target.value)} />
            </div>
            <div className="form-group form-check">
              <input id="over18Field" className="form-check-input" type="checkbox" aria-label="Confirm age over 18"/>
              <label htmlFor="over18Field" className="form-check-label">我已年滿18歲</label>
            </div>

            <div className='d-flex'>
              <div className='following-item col'>
                <label className={pageStyles['errMsg']}>{allErrMsg}</label>
              </div>
              <div className='pull-right'>
                <button className="btn btn-primary" onClick={submit}>註冊帳號</button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
