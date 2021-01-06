import React, { useEffect, useState } from 'react'
import styles from './Header.module.css'

import { GoHome } from './utils'


export default (props) => {
  const {title, userID} = props

  let logout = () => {

  }

  return (
    <nav className='navbar'>
      <div className={'col ' + styles['title']}>{title}</div>
      <div className={'col-1'}>
        <button className="btn btn-primary" onClick={() => GoHome(userID)}>(回家)</button>
      </div>
      <div className='pull-right'>
        <button className="btn btn-primary" onClick={logout}>登出</button>
      </div>
    </nav>
  )
}