import React, { useEffect, useState } from 'react'
import pageStyles from './Page.module.css'

import * as errors from './errors'

import { useWindowSize } from 'react-use'

import { useParams } from 'react-router-dom'

import { useReducer, getRoot, genUUID, getRootID } from 'react-reducer-utils'

import * as DoChangePasswdPage from '../reducers/changePasswdPage'
import * as DoHeader from '../reducers/header'

import Header from './Header'
import Empty from './Empty'

type Props = {

}

export default (props: Props) => {
    const [stateChangePasswdPage, doChangePasswdPage] = useReducer(DoChangePasswdPage)
    const [stateHeader, doHeader] = useReducer(DoHeader)

    const [origPasswd, setOrigPasswd] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirm, setPasswordConfirm] = useState('')
    const [errMsg, setErrMsg] = useState('')

    //init
    let { userid } = useParams()

    useEffect(() => {
        let headerID = genUUID()
        doHeader.init(headerID)

        let changePasswdPageID = genUUID()
        doChangePasswdPage.init(changePasswdPageID, userid)
    }, [])

    //get data
    let changePasswdPage = getRoot(stateChangePasswdPage)
    if (!changePasswdPage) {
        return (<Empty />)
    }
    let myID = getRootID(stateChangePasswdPage)
    let userID = changePasswdPage.userID
    let errmsg = changePasswdPage.errmsg || ''

    //render
    const { height: innerHeight } = useWindowSize()
    let style = {
        height: innerHeight + 'px',
    }

    let cleanErr = () => {
        setErrMsg('')
        doChangePasswdPage.CleanErr(myID)
    }

    let changeOrigPasswd = (origPasswd: string) => {
        setOrigPasswd(origPasswd)
        cleanErr()
    }

    let changePassword = (password: string) => {
        setPassword(password)
        cleanErr()
    }

    let changePasswordConfirm = (passwordConfirm: string) => {
        setPasswordConfirm(passwordConfirm)
        cleanErr()
    }

    let submit = () => {
        if (password !== passwordConfirm) {
            setErrMsg("新的密碼不相符合喔～")
            return
        }

        doChangePasswdPage.ChangePasswd(myID, userID, origPasswd, password, passwordConfirm)
    }

    let allErrMsg = errors.mergeErr(errMsg, errmsg)

    return (
        <div className={pageStyles['root']} style={style}>
            <div className={'container'} style={style}>
                <Header title='我想換密碼' stateHeader={stateHeader} />
                <div className='row'>
                    <div className='col'>
                        <label>我是 {userID}</label>
                    </div>
                </div>
                <div className='row'>
                    <input className="form-control" type="password" placeholder="原本的密碼:" aria-label="OrigPasswd" value={origPasswd} onChange={(e) => changeOrigPasswd(e.target.value)} />
                </div>

                <div className='row'>
                    <input className="form-control" type="password" placeholder="新的密碼:" aria-label="Password" value={password} onChange={(e) => changePassword(e.target.value)} />
                </div>

                <div className='row'>
                    <input className="form-control" type="password" placeholder="確認新的密碼:" aria-label="Password" value={passwordConfirm} onChange={(e) => changePasswordConfirm(e.target.value)} />
                </div>

                <div className='row'>
                    <div>
                        <button className="btn btn-primary" onClick={submit}>我確定要改密碼～</button>
                    </div>
                    <div className='col'>
                        <label className={pageStyles['errMsg']}>{allErrMsg}</label>
                    </div>
                </div>
            </div>
        </div>
    )
}