import React, { useEffect } from 'react'
import pageStyles from './Page.module.css'

import { useReducer, getRoot, genUUID, getRootID } from 'react-reducer-utils'

import { PTT_GUEST } from 'config'

import Empty from './Empty'
import * as DoHomePage from '../reducers/homePage'
import Header from './Header'
import * as DoHeader from '../reducers/header'
import { State as Header_s } from '../reducers/header'

type Props = {

}

export default (props: Props) => {
    const [stateHomePage, doHomePage] = useReducer(DoHomePage)
    const [stateHeader, doHeader] = useReducer(DoHeader)

    //init
    useEffect(() => {
        let headerID = genUUID()
        doHeader.init(headerID)

        let homePageID = genUUID()
        doHomePage.init(homePageID)
    }, [])

    let header: Header_s = getRoot(stateHeader) || { user_id: '' }
    let userID = header.user_id

    useEffect(() => {
        if (!userID) {
            return
        }

        if (userID === PTT_GUEST) {
            window.location.href = '/boards/popular'
        } else {
            window.location.href = '/user/' + userID + '/favorites'
        }
    }, [userID])

    //get data
    let myID = getRootID(stateHomePage)

    if (!myID) {
        return (<Empty />)
    }
    return (
        <div className={'vh-100 ' + pageStyles['root']}>
            <Header title={''} stateHeader={stateHeader} />
        </div>
    )
}
