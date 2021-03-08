import { Component } from 'react'
import styles from './ContentRenderer.module.css'
import moment from 'moment'

import { COLOR_FOREGROUND_WHITE, COLOR_BACKGROUND_BLACK } from '../../constants'
import { EDIT_SCREEN_WIDTH } from '../utils'

export const PlainText = (props) => {
  const {data, rowIndex, columnKey} = props
  let text = data[rowIndex][columnKey]

  return (<div>{text}</div>)
}

export const Runes = (props) => {
  const {data, rowIndex, columnKey, onMouseDown} = props
  let runes = data[rowIndex][columnKey]
  let background = data[rowIndex].background || COLOR_BACKGROUND_BLACK

  return (
    <div className={styles['c'+background]}>
      {runes.map((each, idx) => (<RuneCore key={'runes-'+idx} rune={each} rowIndex={rowIndex} idx={idx} onMouseDown={onMouseDown} />))}
    </div>
  )
}

export const RuneCore = (props) => {
  const {rune, rowIndex, idx, onMouseDown} = props
  let classNames0 = [styles['rune']]
  if(rune.color0.foreground) {
    if(rune.color0.highlight) {
      classNames0.push(styles['h'+rune.color0.foreground])
    } else {
      classNames0.push(styles['c'+rune.color0.foreground])
    }
  }
  if(rune.color0.background) {
    classNames0.push(styles['c'+rune.color0.background])
  }
  if(rune.pullright){
    classNames0.push(styles['pull-right'])
  }

  let className0 = classNames0.join(' ')
  let runeKey = 'rune-' + rowIndex + '-' + idx
  let _onMouseDown = (e) => {
    if(!onMouseDown) {
      return
    }
    onMouseDown(e, rowIndex, idx)
  }

  return (
    <span key={runeKey} className={className0} onMouseDown={_onMouseDown}>{rune.text}</span>
  )
}

export const PostDate = (props) => {
  const {data, rowIndex, columnKey} = props
  let item = data[rowIndex]
  let text = moment(item[columnKey] * 1000).format('MM/DD') //js is milli-ts based.

  return (<div>{text}</div>)
}

export class Idx extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  static getDerivedStateFromProps = (props, state) => {
    const {data, rowIndex, loadPre, loadNext} = props
    let item = data[rowIndex]

    if(rowIndex === 0 && loadPre) {
      loadPre(item)
    }
    if(rowIndex === data.length - 1 && loadNext) {
      loadNext(item)
    }

    return true
  }

  render = () => {
    const {data, rowIndex, columnKey} = this.props
    let item = data[rowIndex]
    let text = item[columnKey]

    let styleClasses = styles['idx']
    if (text === '★') {
      styleClasses += (' ' + styles['bottomArticle'])
    }

    return (<div className={styleClasses}>{text}</div>)
  }
}

export const State = (props) => {
  const {data, rowIndex, columnKey} = props

  let item = data[rowIndex]
  let text = (item[columnKey] === true) ? '+' : ''

  let style = {
    color : (item[columnKey] === true) ? '#fff' : '#000'
  }
  return (
    <div style={style}>{text}</div>
  )
}

export const CommNum = (props) => {
  const {data, rowIndex, columnKey} = props

  let item = data[rowIndex]
  let color = 'green'

  let text = item[columnKey] || 0
  let num = parseInt(text)
  if(num === 0) {
    return (<div></div>)
  }
  if (Number.isInteger(num)) {
    if (num > 9) {
      color = 'yellow'
    }
    if (num > 99) {
      color = 'red'
      text = '爆'
    }
  }

  let style = {
    color: color,
  }

  return (
    <div style={style}>{text}</div>
  )
}

export const Category = (props) => {
  const {data, rowIndex, columnKey} = props
  let item = data[rowIndex]

  let text = item[columnKey] || ''
  if(text === '') {
    return ''
  }

  return (<div>{'[' + text + ']'}</div>)
}

export const Moderators = (props) => {
  const {data, rowIndex, columnKey} = props

  let item = data[rowIndex]
  let moderators = item[columnKey] || []
  return(<div>{moderators.join('/')}</div>)
}
