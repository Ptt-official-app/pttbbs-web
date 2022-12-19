import React, { useEffect } from 'react'
import pageStyles from './Page.module.css'

import { useWindowSize } from 'react-use'

import { useParams } from 'react-router-dom'

import { useReducer, getRoot, genUUID, getRootID } from 'react-reducer-utils'

import * as DoChangeEmailPage from '../reducers/changeEmailPage'
import * as DoHeader from '../reducers/header'

import Header from './Header'
import Empty from './Empty'

import QueryString from 'query-string'

type Props = {

}

export default (props: Props) => {
    const [stateChangeEmailPage, doChangeEmailPage] = useReducer(DoChangeEmailPage)
    const [stateHeader, doHeader] = useReducer(DoHeader)

    //init
    let { userid } = useParams()

    useEffect(() => {
        const { token } = QueryString.parse(window.location.search)

        let headerID = genUUID()
        doHeader.init(headerID)

        let changeEmailPageID = genUUID()
        doChangeEmailPage.init(changeEmailPageID, userid, token)
    }, [])

    //get data
    let changeEmailPage = getRoot(stateChangeEmailPage)
    if (!changeEmailPage) {
        changeEmailPage = { theDate: new Date(0), userID: '', token: '', isDone: false }
    }
    let myID = getRootID(stateChangeEmailPage)
    let errmsg = changeEmailPage.errmsg || ''
    let isDone = changeEmailPage.isDone
    let data = changeEmailPage.data

    useEffect(() => {
        if (!isDone) {
            return
        }

        doChangeEmailPage.SleepAndRedirect(myID, userid)

    }, [isDone])


    //render
    const { height: innerHeight } = useWindowSize()
    let style = {
        height: innerHeight + 'px',
    }

    let renderData = () => {
        if (!data.email) {
            return (<Empty />)
        }

        return (
            <label className=''>您的聯絡信箱已更改為 {data.email} 囉～(將會回到您的個人資訊)</label>
        )
    }

    if (errmsg) {
        errmsg += ' (將會回到您的個人資訊)'
    }

    return (
        <div className={pageStyles['root']} style={style}>
            <div className={'container'} style={style}>
                <Header title='更改聯絡信箱' stateHeader={stateHeader} />
                <div className='row'>
                    <div className='col'>
                        {renderData()}
                    </div>
                    <div className='col'>
                        <label className={pageStyles['errMsg']}>{errmsg}</label>
                    </div>
                </div>
            </div>
        </div>
    )
}
