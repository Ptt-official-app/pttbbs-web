import { Component } from 'react'

import styles from './ContentRenderer.module.css'

import { COLOR_FOREGROUND_WHITE, COLOR_BACKGROUND_BLACK } from '../../constants'
import { EDIT_SCREEN_WIDTH } from '../utils'

import { RuneCore } from './ContentRenderer'

export const Edit = (props) => {
  let {data, rowIndex, columnKey, selectedRow, isFocus} = props
  let runes = data[rowIndex][columnKey]
  let tail = _calcTail(runes)
  if(tail !== null) {
    runes = runes.concat([tail])
  }

  let Render = (!isFocus || rowIndex !== selectedRow) ? RuneCore : EditCore

  let background = data[rowIndex].background || COLOR_BACKGROUND_BLACK
  return (
    <div key={'edit-'+rowIndex} className={styles['c'+background]}>
      {runes.map((each, idx) => (<Render key={'edit-' + idx} rune={each} idx={idx} {...props} />))}
    </div>
  )
}

const _calcTail = (runes) => {
  let count = runes.reduce((r, x, i) => {
    r += _calcEachRune(x.text)
    return r
  }, 0)

  let n = EDIT_SCREEN_WIDTH - count
  if(n <= 0) {
    return null
  }
  let text = [...Array(n)].map(() => ' ').join('')
  return {text, color0: {foreground: COLOR_FOREGROUND_WHITE, background: COLOR_BACKGROUND_BLACK}}
}

const _calcEachRune = (text) => {
  let count = text.split('').reduce((r, x, i) => {
    if(x >= ' ' && x <= '~') {
      return r + 1
    }
    return r + 2
  }, 0)
  return count
}

export class EditCore extends Component {
  render = () => {
    let {rune, idx, selectedRow, selectedColumn, focusRef, lengthRef, editWidth, updateText, newLine, onMouseDown, upLine, nextLine, setIsCtrl, isCtrl, submit} = this.props

    if(idx !== selectedColumn) {
        return (<RuneCore rune={rune} rowIndex={selectedRow} idx={idx} onMouseDown={onMouseDown} />)
    }

    let classNames0 = RuneCore.getClassNamesFromRune(rune)
    if(rune.pullright){
      classNames0.push(styles['pull-right'])
    }
    classNames0.push(styles['input'])

    let theStyles={
      width: editWidth,
    }

    let onChangeText = (e) => {
      updateText(selectedRow, selectedColumn, e.target.value)
    }

    let onKeyDown = (e) => {
      if(e.nativeEvent.isComposing) {
        return
      }

      switch(e.key) {
      case 'Control':
        setIsCtrl(true)
        break
      case 'Enter':
        newLine()
        break
      case 'ArrowUp':
        upLine()
        break
      case 'ArrowDown':
        nextLine()
        break
      case 'x': //Ctrl-x
        if(isCtrl) {
          submit()
        }
        break
      case 'X': //Ctrl-x
        if(isCtrl) {
          submit()
        }
        break
      default:
        break
      }
    }

    let onKeyUp = (e) => {
      switch(e.key) {
      case 'Control':
        setIsCtrl(false)
        break
      default:
        break
      }
    }

    let onFocus = (e) => {
    }

    let onFocusSpan = (e) => {
    }

    let onBlur = (e) => {
      focusRef.current.focus()
    }

    let onBlurSpan = (e) => {
    }

    let className0 = classNames0.join(' ')
    let coreKey = 'edit-core-' + selectedRow + '-' + idx
    let focusKey = 'edit-core-input-' + selectedRow + '-' + idx
    let lengthKey  = 'edit-core-length-' + selectedRow + '-' + idx
    return(
      <span key={coreKey} className={className0} onBlur={onBlurSpan} onFocus={onFocusSpan}>
        <input key={focusKey} ref={focusRef} className={className0} value={rune.text} style={theStyles} onChange={onChangeText} onKeyDown={onKeyDown} onKeyUp={onKeyUp} onBlur={onBlur} onFocus={onFocus} />
        <span key={lengthKey} ref={lengthRef} className={styles['calc']} onFocus={onFocusSpan} >{rune.text}</span>
      </span>
    )
  }

  componentDidMount = () => {
    this.didUpdate()
  }

  componentDidUpdate = () => {
    this.didUpdate()
  }

  didUpdate = () => {
    const { focusRef, lengthRef, lineHeight, setEditWidth } = this.props
    let current = lengthRef.current || {}
    let offsetWidth = current.offsetWidth || 0
    let editWidth = offsetWidth + lineHeight

    focusRef.current.focus()
    setEditWidth(editWidth)
  }
}
