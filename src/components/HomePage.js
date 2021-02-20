import React, { useEffect } from 'react'
import pageStyles from './Page.module.css'

import { useActionDispatchReducer, getRoot, genUUID, Empty } from 'react-reducer-utils'

import { PTT_GUEST } from '../constants'

import * as DoHomePage from '../reducers/homePage'
import Header from './Header'
import * as DoHeader from '../reducers/header'

export default (props) => {
  const [stateHomePage, doHomePage] = useActionDispatchReducer(DoHomePage)
  const [stateHeader, doHeader] = useActionDispatchReducer(DoHeader)

  //init
  useEffect(() => {
    let headerID = genUUID()
    doHeader.init(headerID, doHeader, null, null)

    let homePageID = genUUID()
    doHomePage.init(homePageID, doHomePage)

  }, [])

  let header = getRoot(stateHeader) || {}
  let userID = header.user_id || ''

  useEffect(() => {

    if(!userID) {
      return
    }

    if(userID === PTT_GUEST) {
      window.location.href = '/boards/popular'
    } else {
      window.location.href = '/user/' + userID + '/favorites'
    }
  }, [userID])

  //get data
  let homePage = getRoot(stateHomePage) || {}
  let myID = homePage.id || ''

  if(!myID) {
    return (<Empty />)
  }
  return (
    <div className={'vh-100 ' + pageStyles['root']}>
      <Header title={''} stateHeader={stateHeader} />
    </div>
  )
}
