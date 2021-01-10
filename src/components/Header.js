import React, { useEffect, useState } from 'react'
import styles from './Header.module.css'

export default (props) => {
  const {title, userID} = props

  let logout = () => {

  }

  let goHome = () => {
    window.location.href = '/'
  }

  let goUserHome = (userID) => {
    window.location.href = '/user/' + userID
  }

  return (
    <nav className='navbar'>
      <a className={'navbar-brand ' + styles['home']} onClick={() => goHome()}>(回家)</a>
      <div className={'col ' + styles['title']}>{title}</div>
      <a className={'pull-right ' + styles['home']} onClick={() => goUserHome(userID)}>(回我家)</a>
      <div className='pull-right'>
        <button className="btn btn-primary" onClick={logout}>登出</button>
      </div>
    </nav>
  )
}