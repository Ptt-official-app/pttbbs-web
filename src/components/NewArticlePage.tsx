import React, { useEffect, useState, useRef, MutableRefObject, FormEvent, FocusEvent, MouseEvent } from 'react'
import pageStyles from './Page.module.css'
import styles from './NewArticlePage.module.css'

// eslint-disable-next-line
import * as errors from './errors'

import { useWindowSize } from 'react-use'
import { useParams } from 'react-router-dom'

import { DropdownList } from 'react-widgets'

import { useReducer, getRoot, genUUID, getRootID } from 'react-reducer-utils'

import * as DoNewArticlePage from '../reducers/newArticlePage'
import * as DoHeader from '../reducers/header'

import Header from './Header'
import FunctionBar from './FunctionBar'

import Editor from './Editor'

import { COLOR_FOREGROUND_WHITE, COLOR_BACKGROUND_BLACK } from '../constants'
import { Line } from '../types'
import Empty from './Empty'
import InitConsts from './InitConsts'


type Props = {

}


export default (props: Props) => {
    const [stateNewArticlePage, doNewArticlePage] = useReducer(DoNewArticlePage)
    const [stateHeader, doHeader] = useReducer(DoHeader)

    const [headerHeight, setHeaderHeight] = useState(0)
    const [funcbarHeight, setFuncbarHeight] = useState(0)
    const headerRef: MutableRefObject<HTMLDivElement | null> = useRef(null)
    const funcbarRef: MutableRefObject<HTMLDivElement | null> = useRef(null)
    const [isShowCursor, setIsShowCursor] = useState(true)
    const isShowCursorRef = useRef(isShowCursor)

    const focusRef: MutableRefObject<HTMLDivElement | null> = useRef(null)
    const lengthRef: MutableRefObject<HTMLDivElement | null> = useRef(null)
    const [editWidth, setEditWidth] = useState(0)
    const [isFocusTitle, setIsFocusTitle] = useState(false)

    // eslint-disable-next-line
    const [errMsg, setErrMsg] = useState('')

    const [isInitConsts, setIsInitConsts] = useState(false)

    //init
    let { bid } = useParams()
    useEffect(() => {
        let headerID = genUUID()
        doHeader.init(headerID)

        let newArticlePageID = genUUID()

        doNewArticlePage.init(newArticlePageID, bid)

        const interval = setInterval(() => {
            setIsShowCursor(!isShowCursorRef.current)
        }, 500)
        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        if (headerRef.current === null) {
            return
        }
        setHeaderHeight(headerRef.current.clientHeight)

    }, [headerRef.current])

    useEffect(() => {
        if (funcbarRef.current === null) {
            return
        }
        setFuncbarHeight(funcbarRef.current.clientHeight)
    }, [funcbarRef.current])

    useEffect(() => {
        if (focusRef.current === null) {
            return
        }
        focusRef.current.focus()
    }, [focusRef.current])

    const { width: innerWidth, height: innerHeight } = useWindowSize()
    let screenWidth = innerWidth
    let screenHeight = innerHeight - headerHeight - funcbarHeight

    const [selectedRow, setSelectedRow] = useState(0)
    const [selectedColumn, setSelectedColumn] = useState(0)

    const [title, setTitle] = useState('')
    const [theClass, setTheClass] = useState('問題')

    //get data
    let newArticlePage = getRoot(stateNewArticlePage)
    if (!newArticlePage) {
        return (<Empty />)
    }
    let myID = getRootID(stateNewArticlePage)
    let errmsg = newArticlePage.errmsg || ''
    let brdname = newArticlePage.brdname
    let postTypes = newArticlePage.post_type.map(each => ({ value: each, label: '[' + each + ']' }))

    let content: Line[] = newArticlePage.content || [{ 'runes': [{ 'text': '', color0: { foreground: COLOR_FOREGROUND_WHITE, background: COLOR_BACKGROUND_BLACK } }] }]

    //render
    let updateText = (row: number, col: number, text: string) => {
        let newRune = Object.assign({}, content[row].runes[col])
        newRune.text = text
        content[row].runes[col] = newRune
        let newContent = content.map((each) => each)
        doNewArticlePage.UpdateContent(myID, newContent)
    }

    let newLine = () => {
        let contentNewLine = [{ 'runes': [{ 'text': '', color0: { foreground: COLOR_FOREGROUND_WHITE, background: COLOR_BACKGROUND_BLACK } }] }]
        let row = selectedRow + 1
        let contentPre = content.slice(0, row)
        let contentNext = content.slice(row)
        let newContent = contentPre.concat(contentNewLine).concat(contentNext)
        doNewArticlePage.UpdateContent(myID, newContent)
        setSelectedRow(row)
        setSelectedColumn(0)
    }

    let upLine = () => {
        if (selectedRow === 0) {
            return
        }

        setSelectedRow(selectedRow - 1)
        return
    }

    let nextLine = () => {
        if (selectedRow === content.length - 1) {
            return
        }

        setSelectedRow(selectedRow + 1)
        return
    }

    let submit = (e: FormEvent) => {
        if (!theClass) {
            showErrMsg('您忘記類別囉～')
            return
        }
        if (!title) {
            showErrMsg('您忘記標題囉～')
            return
        }
        doNewArticlePage.Submit(myID, bid, theClass, title, content)
    }

    let allErrMsg: string[] = []
    if (errMsg) {
        allErrMsg.push(errMsg)
    }
    if (errmsg) {
        allErrMsg.push(errmsg)
    }
    let renderError = () => {
        return (<span className={'nav-link ' + styles['error']}>{allErrMsg.join(',')}</span>)
    }

    let loptions = [
        { text: "發表文章", action: submit },
        { render: renderError },
    ]
    let roptions = [
        { text: "離開", url: `/board/${bid}/articles` },
    ]

    let onFocus = (e: FocusEvent) => {
    }

    let onBlur = (e: FocusEvent) => {
    }

    let showErrMsg = (text: string) => {
        setErrMsg(text)
        setTimeout(() => cleanErrMsg(), 1000)
    }

    let cleanErrMsg = () => {
        setErrMsg('')
        doNewArticlePage.setData(myID, { errmsg: '' })
    }

    let onMouseDown = (e: MouseEvent) => {
        setIsFocusTitle(true)
    }

    let classStyle = {
        width: '170px',
        display: 'inline-block',
    }

    let renderHeader = () => {
        return (
            <div className={'col ' + styles['title']}>
                <span>{brdname} - </span>
                <DropdownList style={classStyle} containerClassName={styles['title-class']} data={postTypes} value={theClass} dataKey='value' textField='label' onChange={(item) => { setTheClass(item.value) }} />
                <input className={styles['title-input']} onChange={(e) => setTitle(e.target.value)} value={title} onMouseDown={onMouseDown} placeholder={'標題:'} />
            </div>
        )
    }

    return (
        <div className={pageStyles['root']} onFocus={onFocus} onBlur={onBlur}>
            <div ref={headerRef} >
                <Header title={''} renderHeader={renderHeader} stateHeader={stateHeader} />
            </div>

            <Editor lines={content} width={screenWidth} height={screenHeight} selectedRow={selectedRow} setSelectedRow={setSelectedRow} selectedColumn={selectedColumn} setSelectedColumn={setSelectedColumn} focusRef={focusRef} lengthRef={lengthRef} editWidth={editWidth} setEditWidth={setEditWidth} updateText={updateText} newLine={newLine} upLine={upLine} nextLine={nextLine} isFocus={!isFocusTitle} setIsFocus={(val) => setIsFocusTitle(!val)} />

            <div ref={funcbarRef}>
                <FunctionBar optionsLeft={loptions} optionsRight={roptions} />
            </div>
            <InitConsts windowWidth={innerWidth} isMobile={false} isInitConsts={isInitConsts} setIsInitConsts={setIsInitConsts} />
        </div>
    )
}
