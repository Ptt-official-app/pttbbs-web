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
  const [password_confirm, setPasswordConfirm] = useState('')
  const [over18, setOver18] = useState(false)
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
    if(username.length > constants.IDLEN) {
      setErrMsg(errors.ERR_USERNAME_TOO_LONG)
      return
    }
    setUsername(username)
  }

  let _checkPassword = (password, password_confirm) => {
    if (password !== password_confirm) {
      setErrMsg(errors.WARNING_PSD_UNMATCH)
      return false
    } else {
      cleanErr()
      return true
    }
  }

  let changePassword = (password) => {
    setPassword(password)
  }

  let changeConfirm = (pwd) => {
    setPasswordConfirm(pwd);
    _checkPassword(password, pwd)
  }

  let changeOver18 = () => {
    setOver18(!over18)
    cleanErr()
  }

  let _isCheckSubmit = () => {
    if(username.length < 2) {
      setErrMsg(errors.ERR_USERNAME_TOO_SHORT)
      return false
    }

    if(password.length < 6) {
      setErrMsg(errors.ERR_PASSWD_TOO_SHORT)
      return false
    }

    if(password !== password_confirm) {
      setErrMsg(errors.WARNING_PSD_UNMATCH)
      return false
    }

    return true
  }

  let submit = () => {
    if(!_isCheckSubmit()) return
    doRegPage.Register(myID, username, password, password_confirm, over18)
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
            <div className="form-group">
              <label htmlFor="accountField">我的帳號:</label>
              <input id="accountField" className="form-control " type="text" placeholder="Username" aria-label="Username" value={username} onChange={(e) => changeUsername(e.target.value)}/>
            </div>
            <div className="form-group">
              <label htmlFor="passwordField">我的密碼:</label>
              <input id="passwordField" className="form-control" type="password" placeholder="Password" aria-label="Password" value={password} onChange={(e) => changePassword(e.target.value)} />
            </div>
            <div className="form-group">
              <label htmlFor="confirmField">再次確認密碼:</label>
              <input id="confirmField" className="form-control" type="password" placeholder="Confirm Password" aria-label="Password Confirm" value={password_confirm} onChange={(e) => changeConfirm(e.target.value)} />
            </div>
            <div className="form-group form-check">
              <input id="over18Field" className="form-check-input" type="checkbox" aria-label="Confirm age over 18" value={over18} onChange={changeOver18}/>
              <label htmlFor="over18Field" className="form-check-label">我已經 18 歲囉～</label>
            </div>

            <div className='d-flex'>
              <div className='following-item col'>
                <label className={pageStyles['errMsg']}>{allErrMsg}</label>
              </div>
              <div className='pull-right'>
                <button className="btn btn-primary" onClick={submit}>我要註冊帳號</button>
              </div>
            </form>

          </div>
        </div>
      </div>
    </div>
  )
}
