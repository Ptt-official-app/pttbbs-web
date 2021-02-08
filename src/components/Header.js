import React from 'react'
import styles from './Header.module.css'
import config from 'config'

import { PTT_GUEST } from '../constants'

import { Empty } from 'react-reducer-utils'

export default (props) => {
  const {title: paramsTitle, userID, renderHeader: paramsRenderHander} = props

  let goHome = () => {
    window.location.href = '/'
  }

  let goTerm = () => {
    window.location.href = config.TERM_URL
  }

  let goUserHome = (userID) => {
    if(!userID || userID === PTT_GUEST) {
      return
    }
    window.location.href = '/user/' + userID
  }

  let renderHeader = () => {
    if(paramsRenderHander) {
      return paramsRenderHander()
    }

    let title = paramsTitle || ''
    return <div className={'col ' + styles['title']}>{title}</div>
  }

  let renderTerm = () => {
    if(!config.TERM_URL) {
      return (<Empty />)
    }

    return (<button className={styles['home']} onClick={() => goTerm()}>Term</button>)

  }

  return (
    <nav className={'navbar ' + styles['root']}>
      <button className={'navbar-brand ' + styles['home']} onClick={() => goHome()}>{config.BRAND}</button>
      {renderTerm()}
      {renderHeader()}
      <button className={'pull-right ' + styles['home']} onClick={() => goUserHome(userID)}>hi～ {userID}</button>
    </nav>
  )
}