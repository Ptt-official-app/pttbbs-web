import React, { useEffect, useState, useRef } from 'react'
import pageStyles from './Page.module.css'
import styles from './NewArticlePage.module.css'

// eslint-disable-next-line
import * as errors from './errors'

import { useWindowSize } from 'react-use'
import { useParams } from 'react-router-dom'

import { DropdownList } from 'react-widgets'

import { useActionDispatchReducer, getRoot, genUUID } from 'react-reducer-utils'

import * as DoNewArticlePage from '../reducers/newArticlePage'
import * as DoHeader from '../reducers/header'

import Header from './Header'
import FunctionBar from './FunctionBar'

import Editor from './Editor'

import { COLOR_FOREGROUND_WHITE, COLOR_BACKGROUND_BLACK } from '../constants'

const _DEFAULT_CLASSES = [
  {value: '問題', label: '[問題]'},
  {value: '建議', label: '[建議]'},
  {value: '討論', label: '[討論]'},
  {value: '心得', label: '[心得]'},
  {value: '閒聊', label: '[閒聊]'},
  {value: '請益', label: '[請益]'},
  {value: '情報', label: '[情報]'},
  {value: '公告', label: '[公告]'},
  {value: '爆卦', label: '[爆卦]'},
  {value: '問卦', label: '[問卦]'},
  {value: '活動', label: '[活動]'},
]

export default (props) => {
  const [stateNewArticlePage, doNewArticlePage] = useActionDispatchReducer(DoNewArticlePage)
  const [stateHeader, doHeader] = useActionDispatchReducer(DoHeader)

  const [headerHeight, setHeaderHeight] = useState(0)
  const [funcbarHeight, setFuncbarHeight] = useState(0)
  const headerRef = useRef(null)
  const funcbarRef = useRef(null)
  const [isShowCursor, setIsShowCursor] = useState(true)
  const isShowCursorRef = useRef(isShowCursor)

  const focusRef = useRef(null)
  const lengthRef = useRef(null)
  const [editWidth, setEditWidth] = useState(0)
  const [isFocusTitle, setIsFocusTitle] = useState(false)

  // eslint-disable-next-line
  const [errMsg, setErrMsg] = useState('')

  //init
  let { bid } = useParams()
  useEffect(() => {
    let headerID = genUUID()
    doHeader.init(headerID, doHeader, null, null)

    let newArticlePageID = genUUID()

    doNewArticlePage.init(newArticlePageID, doNewArticlePage, null, null, bid)

    const interval = setInterval(() => {
      setIsShowCursor(!isShowCursorRef.current)
    }, 500)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if(headerRef === null || headerRef.current === null) {
      return
    }
    setHeaderHeight(headerRef.current.clientHeight)

  }, [headerRef])

  useEffect(() => {
    if(funcbarRef === null || funcbarRef.current === null) {
      return
    }

    setFuncbarHeight(funcbarRef.current.clientHeight)
  }, [funcbarRef])

  useEffect(() => {
    if(focusRef.current === null) {
      return
    }
    focusRef.current.focus()
  }, [focusRef.current])

  //get data
  let newArticlePage = getRoot(stateNewArticlePage) || {}
  let myID = newArticlePage.id || ''
  let errmsg = newArticlePage.errmsg || ''
  let brdname = newArticlePage.brdname || ''

  let content = newArticlePage.content || [{'runes': [{'text': '', color0: {foreground: COLOR_FOREGROUND_WHITE, background: COLOR_BACKGROUND_BLACK}}]}]

  const [selectedRow, setSelectedRow] = useState(0)
  const [selectedColumn, setSelectedColumn] = useState(0)

  const [title, setTitle] = useState('')
  const [theClass, setTheClass] = useState('問題')

  useEffect(() => {
    if(!errmsg) {
      return
    }

    setTimeout(() => cleanErrMsg(), 1000)
  }, [errmsg])

  //render
  let updateText = (row, col, text) => {
    let newRune = Object.assign({}, content[row].runes[col])
    newRune.text = text
    content[row].runes[col] = newRune
    let newContent = content.map((each) => each)
    doNewArticlePage.UpdateContent(myID, newContent)
  }

  let newLine = () => {
    let contentNewLine = [{'runes': [{'text': '', color0: {foreground: COLOR_FOREGROUND_WHITE, background: COLOR_BACKGROUND_BLACK}}]}]
    let row = selectedRow + 1
    let contentPre = content.slice(0, row)
    let contentNext = content.slice(row)
    let newContent = contentPre.concat(contentNewLine).concat(contentNext)
    doNewArticlePage.UpdateContent(myID, newContent)
    setSelectedRow(row)
    setSelectedColumn(0)
  }

  let upLine = () => {
    if(selectedRow === 0) {
      return
    }

    setSelectedRow(selectedRow - 1)
    return
  }

  let nextLine = () => {
    if(selectedRow === content.length - 1) {
      return
    }

    setSelectedRow(selectedRow + 1)
    return
  }

  const {width: innerWidth, height: innerHeight} = useWindowSize()
  let screenWidth = innerWidth
  let screenHeight = innerHeight - headerHeight - funcbarHeight

  let submit = (e) => {
    if(!theClass) {
      showErrMsg('您忘記類別囉～')
      return
    }
    if(!title) {
      showErrMsg('您忘記標題囉～')
      return
    }
    doNewArticlePage.Submit(myID, bid, theClass, title, content)
  }

  let allErrMsg = []
  if(errMsg) {
    allErrMsg.push(errMsg)
  }
  if(errmsg) {
    allErrMsg.push(errmsg)
  }
  let renderError = () => {
    return (<span className={'nav-link ' + styles['error']}>{allErrMsg.join(',')}</span>)
  }

  let loptions = [
    {text: "發表文章", action: submit},
    {render: renderError},
  ]
  let roptions = [
    {text: "離開", url: `/board/${bid}/articles`},
  ]

  let onFocus = (e) => {
  }

  let onBlur = (e) => {
  }

  let showErrMsg = (text) => {
    setErrMsg(text)
    setTimeout(() => cleanErrMsg(), 1000)
  }

  let cleanErrMsg = () => {
    setErrMsg('')
    doNewArticlePage.setData(myID, {errmsg: ''})
  }

  let onMouseDown = (e) => {
    setIsFocusTitle(true)
  }

  let classStyle = {
    width: '150px',
    display: 'inline-block',
  }

  let renderHeader = () => {
    return (
      <div className={'col ' + styles['title']}>
        <span>{brdname} - </span>
        <DropdownList style={classStyle} containerClassName={styles['title-class']}  data={_DEFAULT_CLASSES} value={theClass} valueField='value' textField='label' onChange={(item) => {setTheClass(item.value)}} />
        <input className={styles['title-input']} onChange={(e) => setTitle(e.target.value)} value={title} onMouseDown={onMouseDown} placeholder={'標題:'} />
      </div>
    )
  }

  return (
    <div className={pageStyles['root']} onFocus={onFocus} onBlur={onBlur}>
      <div ref={headerRef} >
        <Header renderHeader={renderHeader} stateHeader={stateHeader} />
      </div>

      <Editor lines={content} width={screenWidth} height={screenHeight} selectedRow={selectedRow} setSelectedRow={setSelectedRow} selectedColumn={selectedColumn} setSelectedColumn={setSelectedColumn} focusRef={focusRef} lengthRef={lengthRef} editWidth={editWidth} setEditWidth={setEditWidth} updateText={updateText} newLine={newLine} upLine={upLine} nextLine={nextLine} isFocus={!isFocusTitle} setIsFocus={(val) => setIsFocusTitle(!val)} />

      <div ref={funcbarRef}>
        <FunctionBar optionsLeft={loptions} optionsRight={roptions} />
      </div>
    </div>
  )
}
