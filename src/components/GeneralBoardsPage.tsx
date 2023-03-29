import React, { useEffect, useState, useRef, MutableRefObject } from 'react'
import pageStyles from './Page.module.css'

import * as errors from './errors'

import { useWindowSize } from 'react-use'

import { useReducer, getRoot, genUUID, getRootID } from 'react-reducer-utils'

import { PTT_GUEST } from 'config'

import * as DoGeneralBoardsPage from '../reducers/generalBoardsPage'
import * as DoHeader from '../reducers/header'

import Header from './Header'
import BoardList from './BoardList'
import FunctionBar from './FunctionBar'
import SearchBar from './SearchBar'

import QueryString from 'query-string'
import Empty from './Empty'
import { BoardSummary_i, Menu_t } from '../types'

type Props = {

}

export default (props: Props) => {
    const [stateGeneralBoardsPage, doGeneralBoardsPage] = useReducer(DoGeneralBoardsPage)
    const [stateHeader, doHeader] = useReducer(DoHeader)

    // eslint-disable-next-line
    const [errMsg, setErrMsg] = useState('')

    // eslint-disable-next-line
    const [isByClass, setIsByClass] = useState(true)

    //render
    const [headerHeight, setHeaderHeight] = useState(0)
    const [funcbarHeight, setFuncbarHeight] = useState(0)
    const headerRef: MutableRefObject<HTMLDivElement | null> = useRef(null)
    const funcbarRef: MutableRefObject<HTMLDivElement | null> = useRef(null)
    const bodyRef: MutableRefObject<HTMLDivElement | null> = useRef(null)
    const { width: innerWidth, height: innerHeight } = useWindowSize()
    const [scrollTop, setScrollTop] = useState(0)
    const [searching, setSearching] = useState(false)

    //init
    useEffect(() => {
        let headerID = genUUID()
        doHeader.init(headerID)

        let generalBoardsPageID = genUUID()
        const query = QueryString.parse(window.location.search)
        const { start_idx: startIdx, title: queryTitle } = query
        let searchKeyword = queryTitle || ''

        doGeneralBoardsPage.init(generalBoardsPageID, searchKeyword, startIdx, isByClass)
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
    let boardsPage = getRoot(stateGeneralBoardsPage)
    if (!boardsPage) {
        return (<Empty />)
    }
    let myID = getRootID(stateGeneralBoardsPage)
    let errmsg = boardsPage.errmsg || ''
    let boards = boardsPage.list
    let searchKeyword = boardsPage.searchKeyword
    let isNextEnd = boardsPage.isNextEnd
    let isPreEnd = boardsPage.isPreEnd
    let scrollToRow = boardsPage.scrollToRow

    let header = getRoot(stateHeader)
    if (!header) {
        return (<Empty />)
    }
    let myUserID = header.user_id

    let width = innerWidth
    let listHeight = innerHeight - headerHeight - funcbarHeight

    let headerTitle = '所有看板'

    let loadPre = (item: BoardSummary_i) => {
        if (item.numIdx === 1 || isPreEnd) {
            return
        }

        let idx = item.idx || ''
        if (!idx) {
            return
        }
        doGeneralBoardsPage.GetBoards(myID, searchKeyword, idx, true, true, isByClass)
    }

    let loadNext = (item: BoardSummary_i) => {
        if (isNextEnd) {
            return
        }

        let idx = item.idx || ''
        if (!idx) {
            return
        }

        doGeneralBoardsPage.GetBoards(myID, searchKeyword, idx, false, true, isByClass)
    }

    let onVerticalScroll = (scrollTop: number): boolean => {
        setScrollTop(scrollTop)
        if (typeof scrollToRow === 'undefined') {
            return false
        }

        doGeneralBoardsPage.SetData(myID, { scrollToRow: undefined })
        return true
    }

    // eslint-disable-next-line
    let allErrMsg = errors.mergeErr(errMsg, errmsg)

    let addFavorite = (item: any, data: any[], rowIndex: number, columnKey: string) => {
        console.log('GeneralBoardsPage: addFavorite: item:', item)
    }

    let menu: Menu_t[] = [{
        prompt: '加入最愛',
        handle: addFavorite,
    }]
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
                <BoardList boards={boards} width={width} height={listHeight} loadPre={loadPre} loadNext={loadNext} scrollToRow={scrollToRow} onVerticalScroll={onVerticalScroll} scrollTop={scrollTop} menu={menu} containerRef={bodyRef} />
            )
        }
    }

    let loptions = [
        { text: "搜尋看板", action: () => { } },
    ]

    let roptions = []
    if (myUserID && myUserID !== PTT_GUEST) {
        roptions.push({ text: "我的最愛", action: () => { window.location.href = '/user/' + myUserID + '/favorites' } })
    }
    roptions.push({ text: "熱門看板", action: () => { window.location.href = '/boards/popular' } })
    roptions.push({ text: "分類看板", action: () => { window.location.href = '/cls/1' } })

    const onSearchSubmit = () => {
        searchKeyword === '' ? setSearching(false) : setSearching(true)
        // clear articles
        // load more
        doGeneralBoardsPage.GetBoards(myID, searchKeyword, null, false, false)
    }


    const onSearchClear = () => {
        setSearching(false)
        searchKeyword = ''
        doGeneralBoardsPage.SetData(myID, { searchKeyword })
        doGeneralBoardsPage.GetBoards(myID, searchKeyword, null, false, false)
    }

    const renderHeader = () => {
        return (
            <div className={'col d-flex justify-content-between align-items-center px-4'}>
                <div className="w-25 "></div>
                <span className="p-0" style={{ fontSize: "x-large" }}>{headerTitle}</span>
                <div className="w-25">
                    <SearchBar
                        text={searchKeyword}
                        setText={(text: string) => {
                            doGeneralBoardsPage.SetData(myID, { searchKeyword: text })
                        }}
                        onSearch={onSearchSubmit}
                        searching={searching}
                        onClear={onSearchClear}
                        prompt={'搜尋板名...'}
                    />
                </div>
            </div>
        )
    }

    return (
        <div className={pageStyles['root']}>
            <div ref={headerRef}>
                <Header title={headerTitle} stateHeader={stateHeader} renderHeader={renderHeader} />
            </div>
            <div ref={bodyRef}>
                {renderBoards()}
            </div>
            <div ref={funcbarRef}>
                <FunctionBar optionsLeft={loptions} optionsRight={roptions} />
            </div>
        </div>
    )
}