import React, { useEffect, useState } from 'react'
import pageStyles from './Page.module.css'

import * as errors from './errors'

import { useActionDispatchReducer, getRoot, genUUID, Empty } from 'react-reducer-utils'

import * as DoRegisterPage from '../reducers/registerPage'
import * as DoHeader from '../reducers/header'

import Header from './Header'

import * as constants from '../constants'

export default (props) => {
  const [stateRegitsterPage, doRegPage] = useActionDispatchReducer(DoRegisterPage)
  const [stateHeader, doHeader] = useActionDispatchReducer(DoHeader)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [email, setEmail] = useState('')
  const [veriCode, setVeriCode] = useState('')
  const [over18, setOver18] = useState(false)

  // error message
  const [errMsg, setErrMsg] = useState('')
  const [errUsername, setErrUsername] = useState(errors.ERR_USERNAME_MISSING)
  const [errPassword, setErrPassword] = useState(errors.ERR_PASSWD_MISSING)
  const [errEmail, setErrEmail] = useState(errors.ERR_EMAIL_MISSING)

  // for form validation
  const [validating, setValidating] = useState('')
  const [isValid, setIsValid] = useState('form-control')

  //init
  useEffect(() => {
    let headerID = genUUID()
    doHeader.init(headerID, doHeader, null, null)

    let registerPageID = genUUID()
    doRegPage.init(registerPageID, doRegPage)
  }, [])

  //get data
  let registerPage = getRoot(stateRegitsterPage) || {}
  let myID = registerPage.id || ''
  let errmsg = registerPage.errmsg || ''
  let infomsg = registerPage.infomsg || ''
  let isSetVerifyEmail = registerPage.isSetVerifyEmail || false

  let cleanErr = () => {
    setErrMsg('')
    doRegPage.CleanMsg(myID)
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
      setErrMsg(errors.ERR_PSD_UNMATCH);
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
    if(username.length < constants.MIN_IDLEN) {
      setErrUsername(errors.ERR_USERNAME_TOO_SHORT)
      setErrMsg(errors.ERR_USERNAME_TOO_SHORT)
    } else {
      setErrUsername(errors.ERR_USERNAME_MISSING)
      cleanErr()
    }
    setUsername(username)
  }

  let changePassword = (pwd) => {
    setPassword(pwd)
    if(pwd.length < constants.MIN_PWLEN) {
      setErrPassword(errors.ERR_PASSWD_TOO_SHORT)
      setErrMsg(errors.ERR_PASSWD_TOO_SHORT)
      return
    } else {
      setErrPassword(errors.ERR_PASSWD_MISSING)
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
    setEmail(text)
    if (
      text.indexOf('@') === -1 ||
      text[0] === '@' || text[text.length - 1] === '@' ||
      text[0] === '.' || text[text.length - 1] === '.'
    ) {
      setErrEmail(errors.ERR_EMAIL_WRONGFORMAT)
      setErrMsg(errors.ERR_EMAIL_WRONGFORMAT)
    } else {
      setErrEmail(errors.ERR_EMAIL_MISSING)
      cleanErr()
    }
  }

  let changeVeriCode = (code) => {
    setVeriCode(code)
  }

  let submit = () => {
    if(!_isInit()) return
    if(!_checkPassword(password, passwordConfirm)) return

    cleanErr()

    setValidating('was-validated')
    doRegPage.Register(myID, username, password, passwordConfirm, email, over18, veriCode)
  }

  let verifyEmail = () => {
    doRegPage.VerifyEmail(myID, username, email)
    cleanErr('')
  }

  let onSubmitForm = (e) => {
    e.preventDefault()
  }

  let allErrMsg = errors.mergeErr(errMsg, errmsg)

  // -------- Component Instance ----------
  let headerTitle = "註冊新帳號"

  if(!myID) {
    return (<Empty />)
  }

  return (
    <div className={pageStyles['root']}>
      <Header title={headerTitle} stateHeader={stateHeader} />
      <div className='container vh-100 mt-4'>
        <div className="row">
          <div className="col-12 col-md-6 mx-auto">

            <form onSubmit={onSubmitForm} className={validating} noValidate>
              <div className="form-group">
                <label htmlFor="accountField">我的帳號: <small className="text-muted">(長度2-12，可含英數字)</small></label>
                <input
                  id="accountField" className="form-control " type="text" placeholder="Username:"
                  aria-label="Username" value={username} onChange={(e) => changeUsername(e.target.value)}
                  minLength={constants.MIN_IDLEN} maxLength={constants.MAX_IDLEN} pattern="[\w\d]+" required
                />
                <div className="invalid-feedback">{errUsername}</div>
              </div>
              <div className="form-group">
                <label htmlFor="passwordField">我的密碼: <small className="text-muted">(長度6-30，可含英數字/特殊符號)</small></label>
                <input
                  id="passwordField" className="form-control" type="password" placeholder="Password:"
                  aria-label="Password" value={password} onChange={(e) => changePassword(e.target.value)}
                  minLength={constants.MIN_PWLEN} maxLength={constants.MAX_PWLEN} pattern="[\w\d\!\?\$\^%@#-]+" required
                />
                <div className="invalid-feedback">{errPassword}</div>
              </div>
              <div className="mm-group">
                <label htmlFor="confirmField">確認密碼:</label>
                <input
                  id="confirmField" className={isValid} type="password" placeholder="Confirm Password:"
                  aria-label="Password Confirm" value={passwordConfirm} onChange={(e) => changeConfirm(e.target.value)}
                  minLength={constants.MIN_PWLEN} maxLength={constants.MAX_PWLEN} pattern="[\w\d\!\?\$\^%@#-]+" required
                />
                <div className="invalid-feedback">{errors.ERR_PSD_UNMATCH}</div>
              </div>
              <div className="form-group">
                <label htmlFor="emailField">連絡信箱:</label>
                <div className="input-group">
                  <input
                    id="emailField" className="form-control" type="email" placeholder="Email:"
                    aria-label="Email" value={email} readOnly={isSetVerifyEmail}  onChange={(e) => changeEmail(e.target.value)} required/>
                  <div className="input-group-append">
                    <button role="button" className="btn btn-primary" onClick={verifyEmail}>寄出確認碼</button>
                  </div>
                  <div className="invalid-feedback">{errEmail}</div>
                </div>
              </div>
              <div className="form-group">
                <div className="d-flex align-items-center">
                  <label htmlFor="verifyCodeField" className="mr-3 flex-shrink-0">請輸入確認碼:</label>
                  <input
                    id="verifyCodeField" className="form-control" type="text" placeholder="Verification Code:"
                    aria-label="verificationCode" value={veriCode} onChange={(e) => changeVeriCode(e.target.value)} required/>
                </div>
              </div>
              <div className="form-group form-check">
                <input id="over18Field" className="form-check-input" type="checkbox" aria-label="Confirm age over 18" checked={over18} onChange={(e) => changeOver18(e.target.checked)} />
                <label htmlFor="over18Field" className="form-check-label">我已經 18 歲囉～</label>
              </div>
              <div className='row'>
                <div className='col'>
                  <label className={pageStyles['infoMsg']}>{infomsg}</label>
                </div>
              </div>
              <div className='d-flex'>
                <div className='following-item col'>
                  <label className={pageStyles['errMsg']}>{allErrMsg}</label>
                </div>
                <div className='pull-right'>
                  <button className="btn btn-primary" type="submit" onClick={submit}>我要註冊帳號</button>
                </div>
              </div>
            </form>

          </div>
        </div>
      </div>
    </div>
  )
}
