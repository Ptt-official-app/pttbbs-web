import React from 'react'
import styles from './Header.module.css'
import config from 'config'

import { PTT_GUEST, GITHUB_LINK } from '../constants'

import { Empty } from 'react-reducer-utils'

export default (props) => {
  const {title: paramsTitle, userID, renderHeader: paramsRenderHander} = props

  // Links
  let goHome = () => {
    window.location.href = '/'
  }

  let goTerm = () => {
    window.location.href = config.TERM_URL
  }

  let goUserHome = () => {
    window.location.href = '/user/' + userID
  }

  let renderUserHome = () => {
    if(!userID || userID === PTT_GUEST) {
      return <Empty />
    }
    return (
      <button className={'pull-right ' + styles['navbar-link']} onClick={() => goUserHome()}>hi～{userID}</button>
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
        <div className={'logo-github ' + styles['logo']}></div>
        </a>
    </nav>
  )
}