import React, { useEffect } from 'react'
import pageStyles from './Page.module.css'

import { useWindowSize } from 'react-use'

import { useParams } from 'react-router-dom'

import { useReducer, getRoot, genUUID, getRootID } from 'react-reducer-utils'

import * as DoSetIDEmailPage from '../reducers/setIDEmailPage'
import * as DoHeader from '../reducers/header'

import Empty from './Empty'
import Header from './Header'

import QueryString from 'query-string'

type Props = {

}

export default (props: Props) => {
    const [stateSetIDEmailPage, doSetIDEmailPage] = useReducer(DoSetIDEmailPage)
    const [stateHeader, doHeader] = useReducer(DoHeader)

    //init
    let { userid } = useParams()

    useEffect(() => {
        const { token } = QueryString.parse(window.location.search)
        let headerID = genUUID()
        doHeader.init(headerID)

        let setIDEmailPageID = genUUID()
        doSetIDEmailPage.init(setIDEmailPageID, userid, token)
    }, [])

    //get data
    let setIDEmailPage = getRoot(stateSetIDEmailPage)
    if (!setIDEmailPage) {
        setIDEmailPage = { theDate: new Date(0), userID: '', token: '', isDone: false }
    }
    let myID = getRootID(stateSetIDEmailPage)
    let errmsg = setIDEmailPage.errmsg || ''
    let isDone = setIDEmailPage.isDone
    let data = setIDEmailPage.data

    useEffect(() => {
        if (!isDone) {
            return
        }

        doSetIDEmailPage.SleepAndRedirect(myID, userid)
    }, [isDone])

    //render
    const { height: innerHeight } = useWindowSize()
    let style = {
        height: innerHeight + 'px',
    }

    let renderData = () => {
        if (!data.idemail) {
            return (<Empty />)
        }

        return (
            <label className=''>您的認證信箱已更改為 {data.idemail} 囉～</label>
        )
    }

    let renderInfo = () => {
        if (!isDone) {
            return (<Empty />)
        }

        return (
            <label className=''>將會回到您的個人資訊</label>
        )
    }

    return (
        <div className={pageStyles['root']} style={style}>
            <div className={'container'} style={style}>
                <Header title='更改認證信箱' stateHeader={stateHeader} />
                <div className='row'>
                    <div className='col'>
                        {renderData()}
                    </div>
                    <div className='col'>
                        <label className={pageStyles['errMsg']}>{errmsg}</label>
                    </div>
                    <div className='col'>
                        {renderInfo()}
                    </div>
                </div>
            </div>
        </div>
    )
}
