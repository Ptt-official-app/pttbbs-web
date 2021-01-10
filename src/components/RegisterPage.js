import React, { useEffect, useState } from 'react'
import pageStyles from './Page.module.css'

import * as errors from './errors'

import { useActionDispatchReducer, getRoot, genUUID } from 'react-reducer-utils'

import * as DoRegisterPage from '../reducers/registerPage'

export default (props) => {
  const [stateRegitsterPage, doRegPage] = useActionDispatchReducer(DoRegisterPage)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [email, setEmail] = useState('')
  const [errMsg, setErrMsg] = useState('')

  // for form validation
  const [validating, setValidating] = useState('')

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

  // ---------- Helper functions ---------
  let _isInitSuccessful = () => {
    if(!myID) {
      setErrMsg(errors.ERR_SYS_INIT)
      return false
    }
    return true
  }

  let _confirmPassword = (pwd, pwdConfirm) => {
    if (pwd !== pwdConfirm) {
      setErrMsg(errors.WARNING_PSD_UNMATCH);
    } else {
      cleanErr()
    }
  }

  // ---------- Input Field Handlers -------------
  let changeUsername = (username) => {
    setUsername(username)
  }

  let changePassword = (pwd) => {
    setPassword(pwd)
    _confirmPassword(pwd, passwordConfirm);
  }

  let changeConfirm = (pwd) => {
    setPasswordConfirm(pwd);
    _confirmPassword(password, pwd);
  }

  let changeEmail = (text) => {
    setEmail(text);
    if (
      text.indexOf('@') === -1 ||
      text[0] === '@' || text[text.length - 1] === '@' ||
      text[0] === '.' || text[text.length - 1] === '.'
    ) {
      setErrMsg(errors.WARNING_EMAIL_WRONGFORMAT);
    } else {
      cleanErr();
    }
  }

  let submit = () => {
    if(!_isInitSuccessful()) return
    // if there's other err
    if(allErrMsg.length > 0) return
    cleanErr()

    doRegPage.Register(myID, username, password, passwordConfirm, email, document.getElementById("over18Field").checked)
  }

  let allErrMsg = errors.mergeErr(errMsg, errmsg)

  // -------- Component Instance ----------
  return (
    <div className={pageStyles['root']}>
      <div className='container vh-100'>
        <div className="row">
          <div className="col-12 col-md-6 mx-auto">

            <form action="javascript:void(0);" className={validating} onSubmit={submit} novalidate>
              <div className="form-group">
                <label htmlFor="accountField">帳號</label>
                <input id="accountField" className="form-control " type="text" placeholder="Username:" aria-label="Username" value={username} onChange={(e) => changeUsername(e.target.value)} required/>
                <div className="invalid-feedback">請填寫帳號</div>
              </div>
              <div className="form-group">
                <label htmlFor="passwordField">密碼</label>
                <input id="passwordField" className="form-control" type="password" placeholder="Password:" aria-label="Password" value={password} onChange={(e) => changePassword(e.target.value)} required/>
                <div className="invalid-feedback">請填寫密碼</div>
              </div>
              <div className="form-group">
                <label htmlFor="confirmField">確認密碼</label>
                <input id="confirmField" className="form-control" type="password" placeholder="Confirm Password:" aria-label="Password Confirm" value={passwordConfirm} onChange={(e) => changeConfirm(e.target.value)} required/>
                <div className="invalid-feedback">請確認密碼</div>
              </div>
              <div className="form-group">
                <label htmlFor="emailField">連絡信箱</label>
                <input id="emailField" className="form-control " type="email" placeholder="Email:" aria-label="Email" value={email} onChange={(e) => changeEmail(e.target.value)} required/>
                <div className="invalid-feedback">請填寫連絡信箱</div>
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
                  <button className="btn btn-primary" type="submit" onClick={() => setValidating("was-validated")}>註冊帳號</button>
                </div>
              </div>
            </form>

          </div>
        </div>
      </div>
    </div>
  )
}
