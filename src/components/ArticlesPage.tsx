import React, { useEffect, useState, useRef, MutableRefObject } from 'react'
import pageStyles from './Page.module.css'

import * as errors from './errors'

import { useWindowSize, useKey } from 'react-use'
import { useParams } from 'react-router-dom'

import { useReducer, getRoot, genUUID, getRootID } from 'react-reducer-utils'

import * as DoArticlesPage from '../reducers/articlesPage'
import * as DoHeader from '../reducers/header'

import Header from './Header'
import ArticleList from './ArticleList'
import FunctionBar from './FunctionBar'
import SearchBar from './SearchBar'

import EmptyList from './EmptyList'

import QueryString from 'query-string'

import { GetBoardParent } from './utils'
import Empty from './Empty'
import { ArticleSummary_i } from '../types'

type Props = {

}

export default (props: Props) => {
    const [stateArticlesPage, doArticlesPage] = useReducer(DoArticlesPage)
    const [stateHeader, doHeader] = useReducer(DoHeader)

    // eslint-disable-next-line
    const [errMsg, setErrMsg] = useState('')

    //render
    const [headerHeight, setHeaderHeight] = useState(0)
    const [funcbarHeight, setFuncbarHeight] = useState(0)
    const headerRef: MutableRefObject<HTMLDivElement | null> = useRef(null)
    const funcbarRef: MutableRefObject<HTMLDivElement | null> = useRef(null)
    const { width: innerWidth, height: innerHeight } = useWindowSize()
    const [scrollTop, setScrollTop] = useState(0)
    const [searching, setSearching] = useState(false)

    //keys
    let parentPage = GetBoardParent() || '/boards/popular'
    useKey('ArrowLeft', (e) => {
        window.location.href = parentPage
    })

    //init
    let { bid } = useParams()
    useEffect(() => {
        let headerID = genUUID()
        doHeader.init(headerID, doHeader, null, null)

        let articlesPageID = genUUID()

        let query = QueryString.parse(window.location.search)
        const { start_idx: startIdx, title: queryTitle } = query
        let searchTitle = queryTitle || ''

        doArticlesPage.init(articlesPageID, bid, searchTitle, startIdx)
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
    let articlesPage = getRoot(stateArticlesPage)
    if (!articlesPage) {
        return (<Empty />)
    }
    let myID = getRootID(stateArticlesPage)
    let errmsg = articlesPage.errmsg || ''
    let brdname = articlesPage.brdname || ''
    let title = articlesPage.title || ''
    let searchTitle = articlesPage.searchTitle || ''
    let isNextEnd = articlesPage.isNextEnd || false
    let isPreEnd = articlesPage.isPreEnd || false
    //let nextCreateTime = articlesPage.nextCreateTime || 0
    let scrollToRow = articlesPage.scrollToRow
    let articles = articlesPage.allArticles || []

    console.log('ArticlesPage: articlesPage:', articlesPage, 'brdname:', brdname)

    let width = innerWidth
    let listHeight = innerHeight - headerHeight - funcbarHeight

    let headerTitle = brdname + ' - ' + title

    console.log('ArticlesPage: headerTitle:', headerTitle)

    let loadPre = (item: ArticleSummary_i) => {
        if (item.numIdx === 1 || isPreEnd) {
            return
        }

        let idx = item.idx || ''
        if (!idx) {
            return
        }
        doArticlesPage.GetArticles(myID, bid, searchTitle, idx, true, true)
    }

    let loadNext = (item: ArticleSummary_i) => {
        if (isNextEnd) {
            return
        }

        let idx = item.idx || ''
        if (!idx) {
            return
        }

        doArticlesPage.GetArticles(myID, bid, searchTitle, idx, false, true)
    }

    let onVerticalScroll = (scrollTop: number): boolean => {
        setScrollTop(scrollTop)
        if (scrollToRow === null) {
            return false
        }

        doArticlesPage.SetData(myID, { scrollToRow: null })

        return true
    }

    const onSearchSubmit = () => {
        searchTitle === '' ? setSearching(false) : setSearching(true)
        // clear articles
        // load more
        doArticlesPage.GetArticles(myID, bid, searchTitle, null, true, false)
    }

    const onSearchClear = () => {
        setSearching(false)
        searchTitle = ''
        doArticlesPage.SetData(myID, { searchTitle: searchTitle })
        doArticlesPage.GetArticles(myID, bid, searchTitle, null, true, false)
    }

    // eslint-disable-next-line
    let allErrMsg = errors.mergeErr(errMsg, errmsg)
    let renderArticles = () => {
        if (articles.length === 0) {
            return (
                <EmptyList prompt="這個看板目前沒有文章喔～" width={width} height={listHeight} />
            )
        } else {
            return (
                <ArticleList articles={articles} width={width} height={listHeight} loadPre={loadPre} loadNext={loadNext} scrollToRow={scrollToRow} onVerticalScroll={onVerticalScroll} scrollTop={scrollTop} />
            )
        }
    }

    let loptions = [
        { text: "發表文章", url: `/board/${bid}/post` },
    ]
    let roptions = [
        { text: "精華區", url: `/board/${bid}/manual` },
        { text: "看板設定/說明", action: () => { } },
    ]

    const renderHeader = () => {
        return (
            <div className={'col d-flex justify-content-between align-items-center px-4'}>
                <div className="w-25 "></div>
                <span className="p-0" style={{ fontSize: "x-large" }}>{headerTitle}</span>
                <div className="w-25">
                    <SearchBar
                        text={searchTitle}
                        setText={(text: string) => {
                            doArticlesPage.SetData(myID, { searchTitle: text })
                        }}
                        onSearch={onSearchSubmit}
                        searching={searching}
                        onClear={onSearchClear}
                    />
                </div>
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
            {renderArticles()}
            <div ref={funcbarRef}>
                <FunctionBar optionsLeft={loptions} optionsRight={roptions} />
            </div>
        </div>
    )
}
