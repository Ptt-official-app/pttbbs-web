import React, { useEffect, useState, useRef, MutableRefObject } from 'react'
import pageStyles from './Page.module.css'

import * as errors from './errors'

import { useWindowSize, useKey } from 'react-use'
import { useParams } from 'react-router-dom'

import { useReducer, getRoot, genUUID, getRootID } from 'react-reducer-utils'

import * as DoManualPage from '../reducers/manualPage'
import * as DoHeader from '../reducers/header'

import Header from './Header'
import FunctionBar from './FunctionBar'

import Article from './Article'

import QueryString from 'query-string'
import Empty from './Empty'
import { Line, PttOption } from '../types'

type Props = {

}

export default (props: Props) => {
    const [stateManualPage, doManualPage] = useReducer(DoManualPage)
    const [stateHeader, doHeader] = useReducer(DoHeader)

    // eslint-disable-next-line
    const [errMsg, setErrMsg] = useState('')

    //init
    let { bid, path } = useParams()
    path = path || ''

    let pathList = path.split('/')
    let dirname = pathList.slice(0, pathList.length - 1).join('/')
    let parentUrl = `/board/${bid}/manual`
    if (dirname !== '') {
        parentUrl += '/' + dirname
    }

    useEffect(() => {
        let headerID = genUUID()
        doHeader.init(headerID)

        let manualPageID = genUUID()
        const query = QueryString.parse(window.location.search)
        let startIdx = query.start_idx || ''

        doManualPage.init(manualPageID, bid, path, startIdx)

        if (headerRef.current !== null) setHeaderHeight(headerRef.current.clientHeight)
        if (funcbarRef.current !== null) setFuncbarHeight(funcbarRef.current.clientHeight)

    }, [])

    //render
    const [headerHeight, setHeaderHeight] = useState(0)
    const [funcbarHeight, setFuncbarHeight] = useState(0)
    const headerRef: MutableRefObject<HTMLDivElement | null> = useRef(null)
    const funcbarRef: MutableRefObject<HTMLDivElement | null> = useRef(null)
    const { width: innerWidth, height: innerHeight } = useWindowSize()
    const [scrollTop, setScrollTop] = useState(0)

    useKey('ArrowLeft', (e) => {
        window.location.href = parentUrl
    })

    //get data
    let manualPage = getRoot(stateManualPage)
    if (!manualPage) {
        return (<Empty />)
    }
    let myID = getRootID(stateManualPage)
    let errmsg = manualPage.errmsg || ''
    let brdname = manualPage.brdname
    let title = manualPage.title
    let content = manualPage.content
    let scrollToRow = (typeof manualPage.scrollToRow === 'undefined') ? null : manualPage.scrollToRow

    //keys

    let width = innerWidth
    let listHeight = innerHeight - headerHeight - funcbarHeight

    let fullTitle = ''
    fullTitle += title
    let headerTitle = `(精華區) ${brdname} - ${fullTitle}`

    let loadPre = (item: Line) => { }
    let loadNext = (item: Line) => { }

    let onVerticalScroll = (scrollTop: number): boolean => {
        setScrollTop(scrollTop)
        if (scrollToRow === null) {
            return false
        }

        doManualPage.SetData(myID, { scrollToRow: null })

        return true
    }

    // eslint-disable-next-line
    let allErrMsg = errors.mergeErr(errMsg, errmsg)
    let renderManual = () => {
        return (
            <Article lines={content} width={width} height={listHeight} loadPre={loadPre} loadNext={loadNext} scrollToRow={scrollToRow} onVerticalScroll={onVerticalScroll} scrollTop={scrollTop} />
        )
    }

    let loptions: PttOption[] = [
    ]

    let roptions: PttOption[] = [
        { text: "離開", url: parentUrl, hotkey: "←" },
    ]

    return (
        <div className={pageStyles['root']}>
            <div ref={headerRef}>
                <Header title={headerTitle} stateHeader={stateHeader} />
            </div>
            {renderManual()}
            <div ref={funcbarRef}>
                <FunctionBar optionsLeft={loptions} optionsRight={roptions} />
            </div>
        </div>
    )
}
