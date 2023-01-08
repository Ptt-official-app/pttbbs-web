import React, { useEffect, useState, useRef, MutableRefObject } from 'react'
import pageStyles from './Page.module.css'

import * as errors from './errors'

import { useWindowSize, useKey } from 'react-use'
import { useParams } from 'react-router-dom'

import { useReducer, getRoot, genUUID, getRootID } from 'react-reducer-utils'

import * as DoManualsPage from '../reducers/manualsPage'
import * as DoHeader from '../reducers/header'

import ManualPage from './ManualPage'

import Header from './Header'
import ManualList from './ManualList'
import FunctionBar from './FunctionBar'
import EmptyList from './EmptyList'

import QueryString from 'query-string'
import Empty from './Empty'
import { ManArticleSummary_i, PttOption } from '../types'

type Props = {

}

type HeaderProps = {

}

export default (props: Props) => {
    //init
    let { bid, path: _path } = useParams()
    let path = _path || ''
    let pathList = path.split('/')
    let dirname = pathList.slice(0, pathList.length - 1).join('/')
    let parentUrl = `/board/${bid}/manual`
    if (dirname !== '') {
        parentUrl += '/' + dirname
    }

    let basename = pathList[pathList.length - 1]
    if (basename[0] === 'M') {
        return <ManualPage {...props} />
    }

    const [stateManualsPage, doManualsPage] = useReducer(DoManualsPage)
    const [stateHeader, doHeader] = useReducer(DoHeader)

    // eslint-disable-next-line
    const [errMsg, setErrMsg] = useState('')

    //keys
    useKey('ArrowLeft', (e) => {
        window.location.href = parentUrl
    })

    //render
    const [headerHeight, setHeaderHeight] = useState(0)
    const [funcbarHeight, setFuncbarHeight] = useState(0)
    const headerRef: MutableRefObject<HTMLDivElement | null> = useRef(null)
    const funcbarRef: MutableRefObject<HTMLDivElement | null> = useRef(null)
    const { width: innerWidth, height: innerHeight } = useWindowSize()
    const [scrollTop, setScrollTop] = useState(0)

    useEffect(() => {
        let headerID = genUUID()
        doHeader.init(headerID)

        let manualsPageID = genUUID()
        const query = QueryString.parse(window.location.search)
        const { start_idx: startIdx, title: queryTitle } = query
        let searchTitle = queryTitle || ''

        doManualsPage.init(manualsPageID, bid, path, searchTitle, startIdx)

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

    //get data
    let manualsPage = getRoot(stateManualsPage)
    if (!manualsPage) {
        return (<Empty />)
    }
    let myID = getRootID(stateManualsPage)
    let errmsg = manualsPage.errmsg || ''
    let brdname = manualsPage.brdname
    let title = manualsPage.title
    let scrollToRow = manualsPage.scrollToRow
    let manuals = manualsPage.allManuals

    let width = innerWidth
    let listHeight = innerHeight - headerHeight - funcbarHeight

    let headerTitle = '(精華區) ' + brdname + ' - ' + title

    let loadPre = (item: ManArticleSummary_i) => {
    }

    let loadNext = (item: ManArticleSummary_i) => {
    }

    let onVerticalScroll = (scrollTop: number): boolean => {
        setScrollTop(scrollTop)
        if (scrollToRow === null) {
            return false
        }

        doManualsPage.SetData(myID, { scrollToRow: null })
        return true
    }

    // eslint-disable-next-line
    let allErrMsg = errors.mergeErr(errMsg, errmsg)
    let renderManuals = () => {
        if (manuals.length === 0) {
            return (
                <EmptyList prompt="這個精華區目前沒有文章喔～" width={width} height={listHeight} />
            )
        } else {
            return (
                <ManualList manuals={manuals} width={width} height={listHeight} loadPre={loadPre} loadNext={loadNext} scrollToRow={scrollToRow} onVerticalScroll={onVerticalScroll} scrollTop={scrollTop} />
            )
        }
    }

    let loptions: PttOption[] = [
    ]
    let roptions: PttOption[] = [
        { text: "看板", url: `/board/${bid}/articles` },
        { text: "看板設定/說明", action: () => { } },
    ]
    if (path !== '') {
        let roptions_p: PttOption[] = [{ text: '離開', url: parentUrl, hotkey: "←" }]
        roptions = roptions_p.concat(roptions)
    }

    const renderHeader = (props: HeaderProps) => {
        return (
            <div className={'col d-flex justify-content-between align-items-center px-4'}>
                <div className="w-25 "></div>
                <span className="p-0" style={{ fontSize: "x-large" }}>{headerTitle}</span>
                <div className="w-25"></div>
            </div>
        )
    }

    // NOTE: ref can only be used directly on html tags to get element attributes
    // Will fail if used on React components.
    return (
        <div className={pageStyles['root']}>
            <div ref={headerRef}>
                <Header
                    title={headerTitle}
                    stateHeader={stateHeader}
                    renderHeader={renderHeader}
                />
            </div>
            {renderManuals()}
            <div ref={funcbarRef}>
                <FunctionBar optionsLeft={loptions} optionsRight={roptions} />
            </div>
        </div>
    )
}
