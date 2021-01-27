import React from 'react'
import styles from './Header.module.css'
import config from 'config'

export default (props) => {
  const {title, userID} = props

  let goHome = () => {
    window.location.href = '/'
  }

  let goUserHome = (userID) => {
    window.location.href = '/user/' + userID
  }

  return (
    <nav className={'navbar ' + styles['root']}>
      <button className={'navbar-brand ' + styles['home']} onClick={() => goHome()}>{config.BRAND}</button>
      <div className={'col ' + styles['title']}>{title}</div>
      <button className={'pull-right ' + styles['home']} onClick={() => goUserHome(userID)}>hi～ {userID}</button>
    </nav>
  )
}