import React from 'react'
import styles from './Header.module.css'

export default (props) => {
  const {optionsLeft, optionsRight} = props

  let mapOption = (val, idx) => {
    const {text, action, url} = val
    if(url) {
      return (
        <li key={'func-'+idx} className="nav-item">
          <a className={"nav-link " + styles['navbar-link'] } href={url}>{text}</a>
        </li>
      )
    } else {
      return (
        <li key={'func-'+idx} className="nav-item">
          <button className={"nav-link " + styles['navbar-link'] } onClick={action}>{text}</button>
        </li>
      )
    }
  }

  let renderOptions = (options) => {
    return (
      <ul className="nav">
        {options.map((each, idx) => mapOption(each, idx))}
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