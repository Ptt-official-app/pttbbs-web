import React, { useEffect, useState } from 'react'
import pageStyles from './Page.module.css'

import * as errors from './errors'

import { useActionDispatchReducer, getRoot, genUUID, Empty } from 'react-reducer-utils'

import * as DoRegisterPage from '../reducers/registerPage'

import * as constants from '../constants'

export default (props) => {
  const [stateRegitsterPage, doRegPage] = useActionDispatchReducer(DoRegisterPage)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [email, setEmail] = useState('')
  const [over18, setOver18] = useState(false)
  const [errMsg, setErrMsg] = useState('')

  // for form validation
  const [validating, setValidating] = useState('')
  const [isValid, setIsValid] = useState('form-control')

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
  let _isInit = () => {
    if(!myID) {
      setErrMsg(errors.ERR_SYS_INIT)
      return false
    }
    return true
  }

  let _checkPassword = (pwd, pwdConfirm) => {
    if (pwd !== pwdConfirm) {
      setErrMsg(errors.WARNING_PSD_UNMATCH);
      setIsValid('form-control is-invalid')
      return false
    } else {
      cleanErr()
      setIsValid('form-control is-valid')
      return true
    }
  }

  // ---------- Input Field Handlers -------------
  let changeUsername = (username) => {
    if(username.length > constants.MAX_IDLEN) {
      setErrMsg(errors.ERR_USERNAME_TOO_LONG)
      return
    }
    if(username.length < constants.MIN_IDLEN) {
      setErrMsg(errors.ERR_USERNAME_TOO_SHORT)
    } else {
      cleanErr()
    }
    setUsername(username)
  }

  let changePassword = (pwd) => {
    setPassword(pwd)
    if(pwd.length < constants.MIN_PWLEN) {
      setErrMsg(errors.ERR_PASSWD_TOO_SHORT)
      return
    } else {
      cleanErr()
      _checkPassword(pwd, passwordConfirm);
    }
  }

  let changeConfirm = (pwd) => {
    setPasswordConfirm(pwd);
    _checkPassword(password, pwd)
  }

  let changeOver18 = (checked) => {
    setOver18(checked)
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
    if(!_isInit()) return
    if(!_checkPassword(password, passwordConfirm)) return

    cleanErr()

    doRegPage.Register(myID, username, password, passwordConfirm, email, over18)
  }

  let allErrMsg = errors.mergeErr(errMsg, errmsg)

  // -------- Component Instance ----------
  if(!myID) {
    return (<Empty />)
  }
  return (
    <div className={pageStyles['root']}>
      <div className='container vh-100'>
        <div className="row">
          <div className="col-12 col-md-6 mx-auto">

            <form action="javascript:void(0);" className={validating} onSubmit={submit} novalidate>
              <div className="form-group">
                <label htmlFor="accountField">我的帳號:</label>
                <input
                  id="accountField" className="form-control " type="text" placeholder="Username:"
                  aria-label="Username" value={username} onChange={(e) => changeUsername(e.target.value)}
                  minLength={constants.MIN_IDLEN} maxLength={constants.MAX_IDLEN} required
                />
                <div className="invalid-feedback">請填寫帳號(長度大於2個/小於12個英文字母)</div>
              </div>
              <div className="form-group">
                <label htmlFor="passwordField">我的密碼:</label>
                <input
                  id="passwordField" className="form-control" type="password" placeholder="Password:"
                  aria-label="Password" value={password} onChange={(e) => changePassword(e.target.value)}
                  minLength={constants.MIN_PWLEN} required/>
                <div className="invalid-feedback">請填寫密碼(長度大於6英文字母)</div>
              </div>
              <div className="form-group">
                <label htmlFor="confirmField">確認密碼:</label>
                <input
                  id="confirmField" className={isValid} type="password" placeholder="Confirm Password:"
                  aria-label="Password Confirm" value={passwordConfirm} onChange={(e) => changeConfirm(e.target.value)}
                  minLength={constants.MIN_PWLEN} required/>
                <div className="invalid-feedback">請確認密碼是否相同～</div>
              </div>
              <div className="form-group">
                <label htmlFor="emailField">連絡信箱:</label>
                <input id="emailField" className="form-control" type="email" placeholder="Email:" aria-label="Email" value={email} onChange={(e) => changeEmail(e.target.value)} required/>
                <div className="invalid-feedback">請填寫連絡信箱～</div>
              </div>
              <div className="form-group form-check">
                <input id="over18Field" className="form-check-input" type="checkbox" aria-label="Confirm age over 18" checked={over18} onChange={(e) => changeOver18(e.target.checked)} />
                <label htmlFor="over18Field" className="form-check-label">我已經 18 歲囉～</label>
              </div>

              <div className='d-flex'>
                <div className='following-item col'>
                  <label className={pageStyles['errMsg']}>{allErrMsg}</label>
                </div>
                <div className='pull-right'>
                  <button className="btn btn-primary" type="submit" onClick={() => setValidating("was-validated")}>我要註冊帳號</button>
                </div>
              </div>
            </form>

          </div>
        </div>
      </div>
    </div>
  )
}
