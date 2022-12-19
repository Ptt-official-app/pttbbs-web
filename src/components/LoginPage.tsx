import React, { useEffect, useState } from 'react'
import pageStyles from './Page.module.css'
import config from 'config'

import * as errors from './errors'

import { useReducer, getRoot, genUUID, getRootID } from 'react-reducer-utils'

import * as DoLoginPage from '../reducers/loginPage'
import * as DoHeader from '../reducers/header'

import { State as LoginPage_s } from '../reducers/loginPage'

import Empty from './Empty'
import Header from './Header'

type Props = {

}

export default (props: Props) => {
    const [stateLoginPage, doLoginPage] = useReducer(DoLoginPage)
    const [stateHeader, doHeader] = useReducer(DoHeader)

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [errMsg, setErrMsg] = useState('')

    //init
    useEffect(() => {
        let headerID = genUUID()
        doHeader.init(headerID)

        let loginPageID = genUUID()
        doLoginPage.init(loginPageID)
    }, [])

    //get data
    // @ts-ignore
    let loginPage: LoginPage_s = getRoot(stateLoginPage) || {}
    let myID = getRootID(stateLoginPage)
    let errmsg = loginPage.errmsg || ''

    let cleanErr = () => {
        setErrMsg('')
        doLoginPage.CleanErr(myID)
    }

    let changeUsername = (username: string) => {
        setUsername(username)
        cleanErr()
    }

    let changePassword = (password: string) => {
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

    if (!myID) {
        return (<Empty />)
    }
    return (
        <div className={'vh-100 ' + pageStyles['root']}>
            <Header title={headerTitle} stateHeader={stateHeader} />
            <div className={'container mt-5 '}>
                <div className="row">
                    <div className="col-12 col-md-6 mx-auto">

                        <input className="form-control mb-3" type="text" placeholder="Username:" aria-label="Username" value={username} onChange={(e) => changeUsername(e.target.value)} />
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
