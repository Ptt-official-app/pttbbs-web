import React from 'react'
import styles from './Header.module.css'

import { OverlayTrigger, Tooltip } from 'react-bootstrap'

export default (props) => {
  const {optionsLeft, optionsRight} = props

  let mapOption = (val, idx) => {
    let {text, action, url, render, hotkey} = val

    let renderTooltip = (props) => (
      <Tooltip {...props}>快捷鍵：{hotkey}</Tooltip>
    )

    let renderInner = () => {
      if(render) {
        return render()

      } else if(url) {
        return (
          <a className={'nav-link ' + styles['navbar-link']} href={url}>{text}</a>
        )
      } else {
        return (
          <button className={'nav-link ' + styles['navbar-link']} onClick={action}>{text}</button>
        )
      }
    }

    if (hotkey) {
      return (
        <li key={'func-'+idx} className="nav-item">
          <OverlayTrigger placement='top' trigger='hover' overlay={renderTooltip}>
            {renderInner()}
          </OverlayTrigger>
        </li>
      )
    } else {
      return (
        <li key={'func-'+idx} className="nav-item">
          {renderInner()}
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