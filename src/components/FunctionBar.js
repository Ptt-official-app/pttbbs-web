import React from 'react'
import styles from './Header.module.css'

export default (props) => {
  const {optionsLeft, optionsRight} = props

  let mapOption = (val) => {
    const {text, action} = val
    return (
      <li className="nav-item">
        <button className={"nav-link " + styles['navbar-link'] } onClick={action}>{text}</button>
      </li>
    )
  }

  let renderOptions = (options) => {
    return (
      <ul className="nav">
        {options.map(mapOption)}
      </ul>
    )
  }

  return (
    <nav className={'fixed-buttom navbar justify-content-between ' + styles['root']}>
      {renderOptions(optionsLeft)}
      {renderOptions(optionsRight)}
    </nav>
  )
}