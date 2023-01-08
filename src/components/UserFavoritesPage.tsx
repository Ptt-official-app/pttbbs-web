import React, { useEffect, useState, useRef, MutableRefObject } from 'react'
import pageStyles from './Page.module.css'

import * as errors from './errors'

import { useWindowSize } from 'react-use'
import { useParams } from 'react-router-dom'

import { useReducer, getRoot, genUUID, getRootID } from 'react-reducer-utils'

import * as DoUserFavoritesPage from '../reducers/userFavoritesPage'
import * as DoHeader from '../reducers/header'

import Header from './Header'
import BoardList from './BoardList'
import FunctionBar from './FunctionBar'

import QueryString from 'query-string'
import Empty from './Empty'
import { BoardSummary_i } from '../types'

type Props = {

}

export default (props: Props) => {
    const [stateUserFavoritesPage, doUserFavoritesPage] = useReducer(DoUserFavoritesPage)
    const [stateHeader, doHeader] = useReducer(DoHeader)

    // eslint-disable-next-line
    const [errMsg, setErrMsg] = useState('')

    //init
    let { userid } = useParams()

    //render
    const [headerHeight, setHeaderHeight] = useState(0)
    const [funcbarHeight, setFuncbarHeight] = useState(0)
    const headerRef: MutableRefObject<HTMLDivElement | null> = useRef(null)
    const funcbarRef: MutableRefObject<HTMLDivElement | null> = useRef(null)
    const { width: innerWidth, height: innerHeight } = useWindowSize()
    const [scrollTop, setScrollTop] = useState(0)

    useEffect(() => {
        let headerID = genUUID()
        doHeader.init(headerID, doHeader, null, null)

        let userFavoritesPageID = genUUID()
        const query = QueryString.parse(window.location.search)
        const { start_idx: startIdx, level } = query

        doUserFavoritesPage.init(userFavoritesPageID, userid, level, startIdx)
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
    let boardsPage = getRoot(stateUserFavoritesPage)
    if (!boardsPage) {
        return (<Empty />)
    }
    let myID = getRootID(stateUserFavoritesPage)
    let errmsg = boardsPage.errmsg || ''
    let boards = boardsPage.list
    let isPreEnd = boardsPage.isPreEnd
    let isNextEnd = boardsPage.isNextEnd
    let scrollToRow = boardsPage.scrollToRow
    let level = boardsPage.level

    let width = innerWidth
    let listHeight = innerHeight - headerHeight - funcbarHeight

    let headerTitle = '我的最愛'

    let loadPre = (item: BoardSummary_i) => {
        if (item.numIdx === 1 || isPreEnd) {
            return
        }

        let idx = item.idx || ''
        if (!idx) {
            return
        }
        doUserFavoritesPage.GetBoards(myID, userid, level, idx, true, true)
    }

    let loadNext = (item: BoardSummary_i) => {
        if (isNextEnd) {
            return
        }

        let idx = item.idx || ''
        if (!idx) {
            return
        }

        doUserFavoritesPage.GetBoards(myID, userid, level, idx, false, true)
    }

    let onVerticalScroll = (scrollTop: number): boolean => {
        setScrollTop(scrollTop)
        if (typeof scrollToRow === 'undefined') {
            return false
        }

        doUserFavoritesPage.SetData(myID, { scrollToRow: undefined })
        return true
    }

    // eslint-disable-next-line
    let allErrMsg = errors.mergeErr(errMsg, errmsg)

    let renderBoards = () => {
        if (boards.length === 0) {
            let style = {
                height: listHeight
            }
            return (
                <div className="container" style={style}>
                    <h3 className="mx-4">目前找不到看板喔～</h3>
                </div>
            )
        } else {
            return (
                <BoardList boards={boards} width={width} height={listHeight} loadPre={loadPre} loadNext={loadNext} scrollToRow={scrollToRow} onVerticalScroll={onVerticalScroll} scrollTop={scrollTop} />
            )
        }
    }

    let loptions = [
        { text: "搜尋看板", action: () => { } },
    ]

    let roptions = [
        { text: "熱門看板", action: () => { window.location.href = '/boards/popular' } },
        { text: "所有看板", action: () => { window.location.href = '/boards' } },
        { text: "分類看板", action: () => { window.location.href = '/cls/1' } },
    ]

    return (
        <div className={pageStyles['root']}>
            <div ref={headerRef}>
                <Header title={headerTitle} stateHeader={stateHeader} />
            </div>
            {renderBoards()}
            <div ref={funcbarRef}>
                <FunctionBar optionsLeft={loptions} optionsRight={roptions} />
            </div>
        </div>
    )
}