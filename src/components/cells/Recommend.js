import { useState } from 'react'
import styles from './ContentRenderer.module.css'

import { DropdownList } from 'react-widgets'

import { OverlayTrigger, Tooltip } from 'react-bootstrap'

import { EDIT_SCREEN_WIDTH } from '../utils'

const _RECOMMEND_TYPES = [
  {value: 1, label: '1. 推'},
  {value: 2, label: '2. 噓'},
  {value: 3, label: '3. →'},
]

const MAX_RECOMMEND_LENGTH = EDIT_SCREEN_WIDTH - 2 - 11 - 15

export default (props) => {
  const { recommendType, setRecommendStyle, recommend, setRecommend, isRecommend, recommendTypeRef, submit, cancel } = props

  console.log('Recommend: recommendType:', recommendType)

  const [searchTerm, setSearchTerm] = useState('')

  let classStyle = {
    width: '150px',
    display: 'inline-block',
  }

  let style = {}
  if(!isRecommend) {
    style['display'] = 'none'
  }

  let theSetRecommend = (value) => {
    let length = _countRune(value)
    if(length >= MAX_RECOMMEND_LENGTH) {
      return
    }
    setRecommend(value)
  }

  let onKeyDown = (e) => {
      if(e.nativeEvent.isComposing) {
        return
      }

      switch(e.key) {
      case 'Enter':
        submit(recommendType, recommend)
        break
      case 'Escape':
        cancel()
        break
      default:
        break
      }
  }

  let renderSubmitTooltip = (props) => (
    <Tooltip {...props}>快捷鍵：⏎</Tooltip>
  )

  let renderCancelTooltip = (props) => (
    <Tooltip {...props}>快捷鍵：ESC</Tooltip>
  )

  let onSearch = (item) => {
    console.log('Recommend.onSearch: item:', item, 'recommendType:', recommendType)
    switch(item) {
    case '1':
    case '推':
      item = ''
      setRecommendStyle(1)
      break
    case '2':
    case '噓':
      item = ''
      setRecommendStyle(2)
      break
    case '3':
    case '→':
      item = ''
      setRecommendStyle(3)
      break
    case 'X':
      item = ''
      break
    default:
      break
    }

    setSearchTerm(item)
  }

  let onChange = (item) => {
    console.log('Recommend.onChange: item:', item)
    let value = (item || {}).value
    if(value !== 1 && value !== 2 && value !== 3) {
      value = 1
    }
    setSearchTerm('')
    setRecommendStyle(value)
  }

  let onSelect = (item) => {
    console.log('Recommend.onSelect: item:', item)
    let value = (item || {}).value
    if(value !== 1 && value !== 2 && value !== 3) {
      value = 1
    }
    setSearchTerm('')
    setRecommendStyle(value)
  }

  return (
    <div className={styles['recommend']} style={style}>
      <DropdownList ref={recommendTypeRef} style={classStyle} data={_RECOMMEND_TYPES} value={recommendType} dataKey='value' textField='label' onChange={onChange} dropUp={true} onSearch={onSearch} searchTerm={searchTerm} filter={'contains'} onSelect={onSelect} />
      <input className={styles['recommend-input'] + ' ' + styles['recommend-offset']} onChange={(e) => theSetRecommend(e.target.value)} value={recommend} onKeyDown={(e) => onKeyDown(e)} />
      <OverlayTrigger placement='top' trigger='hover' overlay={renderCancelTooltip}>
        <button className={'btn btn-secondary ' + styles['recommend-offset']}>取消</button>
      </OverlayTrigger>
      <OverlayTrigger placement='top' trigger='hover' overlay={renderSubmitTooltip}>
      <button className={'btn btn-primary ' + styles['recommend-offset']}>送出</button>
      </OverlayTrigger>
    </div>
  )
}

const _countRune = (text) => {
  let count = text.split('').reduce((r, x, i) => {
    if(x >= ' ' && x <= '~') {
      return r + 1
    }
    return r + 2
  }, 0)
  return count
}
