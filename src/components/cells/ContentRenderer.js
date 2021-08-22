import { Component } from 'react'
import styles from './ContentRenderer.module.css'
import moment from 'moment'

import { COLOR_BACKGROUND_BLACK } from '../../constants'

export const PlainText = (props) => {
  const {data, rowIndex, columnKey} = props
  let text = data[rowIndex][columnKey]

  return (<div>{text}</div>)
}

export class Runes extends Component {
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
    const {data, rowIndex, columnKey, onMouseDown} = this.props
    let runes = data[rowIndex][columnKey]
    let background = data[rowIndex].background || COLOR_BACKGROUND_BLACK

    return (
      <div className={styles['c'+background]}>
        {runes.map((each, idx) => (<RuneCore key={'runes-'+idx} rune={each} rowIndex={rowIndex} idx={idx} onMouseDown={onMouseDown} />))}
      </div>
    )
  }
}

const _runeAttrs = ['foreground', 'background', 'blink', 'highlight']

export class RuneCore extends Component {
  static getClassNamesFromColor = (color, part = '') => {
    let classNames = []
    if(color.foreground) {
      if(color.highlight) {
        classNames.push(styles[part+'h'+color.foreground])
      } else {
        classNames.push(styles[part+'c'+color.foreground])
      }
    }
    if(color.background) {
      classNames.push(styles[part+'c'+color.background])
    }
    return classNames
  }

  static getClassNamesFromRune = (rune) => {
    let classNames0 = [styles['rune']]
    let color0 = rune.color0 || {}
    classNames0.push(...RuneCore.getClassNamesFromColor(color0))
    const twoColors = rune.color1 && _runeAttrs.some((attr) => color0[attr] !== rune.color1[attr])
    if(twoColors) {
      // Treat the two halves of a character with two colors separately
      const color1 = rune.color1 || color0
      classNames0.push(styles['halves'])
      classNames0.push(...RuneCore.getClassNamesFromColor(color1, 'r'))
    }
    return [classNames0, twoColors]
  }

  render = () => {
    const {rune, rowIndex, idx, onMouseDown} = this.props
    let [classNames0, twoColors] = RuneCore.getClassNamesFromRune(rune)
    let classNamesGroup = rune.pullright ? [styles['pull-right']] : []
    let runeKey = 'rune-' + rowIndex + '-' + idx
    let _onMouseDown = (e) => {
      if(!onMouseDown) {
        return
      }
      onMouseDown(e, rowIndex, idx)
    }

    if (twoColors) {
      // Render a string where each character having two colors into an array of characters
      classNamesGroup.push(styles['halves-group'])
      const classNameGroup = classNamesGroup.join(' ')
      const className0 = classNames0.join(' ')
      return (
        <span className={classNameGroup}>
          {[...rune.text].map((ch, idx) => (
            <span key={`${runeKey}-${idx}`} className={className0} onMouseDown={_onMouseDown} data-text={ch}>{ch}</span>
          ))}
        </span>
      )
    }
    classNames0.push(...classNamesGroup)
    const className0 = classNames0.join(' ')
    return (
      <span key={runeKey} className={className0} onMouseDown={_onMouseDown}>{rune.text}</span>
    )
  }
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
