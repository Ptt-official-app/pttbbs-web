import React from 'react'
import styles from './Header.module.css'
import config from 'config'

import { PTT_GUEST, GITHUB_LINK } from '../constants'

import { Empty, getRoot } from 'react-reducer-utils'

export default (props) => {
  const {title: paramsTitle, userID: paramsUserID, renderHeader: paramsRenderHander, stateHeader} = props

  let me = getRoot(stateHeader)
  let meUserID = me ? me.user_id : ''
  let userID = paramsUserID || meUserID || ''

  // Links
  let goHome = () => {
    window.location.href = '/'
  }

  let goTerm = () => {
    window.location.href = config.TERM_URL
  }

  let renderUserHome = () => {
    let text = userID
    let url = '/user/' + userID
    if(!userID || userID === PTT_GUEST) {
      text = "guest"
      url = '/login'
    }
    return (
      <a className={'pull-right ' + styles['navbar-link']} href={url}>hi~{text}</a>
    )
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

    return (<button className={styles['navbar-link']} onClick={() => goTerm()}>Term</button>)

  }

  return (
    <nav className={'navbar ' + styles['root']}>
      <button className={'navbar-brand ' + styles['navbar-link']} onClick={() => goHome()}>{config.BRAND}</button>
      {renderTerm()}
      {renderHeader()}
      {renderUserHome()}
      <a className={styles['navbar-link']} href={GITHUB_LINK}>
        <div className={'ml-3 logo-github ' + styles['logo']}></div>
        </a>
    </nav>
  )
}