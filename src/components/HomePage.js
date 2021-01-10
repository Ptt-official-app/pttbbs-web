import React, { useEffect, useState } from 'react'
import pageStyles from './Page.module.css'
import styles from './HomePage.module.css'

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

  let login = () => {
    if(!myID) {
      setErrMsg(errors.ERR_SYS_INIT)
      return
    }

    doHomePage.Login(myID, username, password)
  }

  let register = () => {
  }

  let forgotPassword = () => {

  }

  let allErrMsg = errors.mergeErr(errMsg, errmsg)

  return (
    <div className={pageStyles['root']} style={style}>
      <div className={'container'} style={style}>
        <div className='row'>
          <input className="form-control" type="text" placeholder="Username:" aria-label="Username" value={username} onChange={(e) => changeUsername(e.target.value)}/>
        </div>

        <div className='row'>
          <input className="form-control" type="password" placeholder="Password:" aria-label="Password" value={password} onChange={(e) => changePassword(e.target.value)} />
        </div>

        <div className='row'>
          <div>
            <button className="btn btn-primary" onClick={login}>我要登入</button>
          </div>
          <div className={styles['following-item']}>
            <button className="btn btn-primary" onClick={register}>我想註冊</button>
          </div>
          <div className={'col'}>
            <label className={pageStyles['errMsg']}>{allErrMsg}</label>
          </div>
          <div className='pull-right'>
            <button className="btn btn-primary" onClick={forgotPassword}>我忘記密碼了 Orz</button>
          </div>
        </div>
      </div>
    </div>
  )
}
