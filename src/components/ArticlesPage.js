import React, { useEffect, useState, useRef } from 'react'
import pageStyles from './Page.module.css'

import * as errors from './errors'

import { useWindowSize } from 'react-use'
import { useParams } from 'react-router-dom'

import { useActionDispatchReducer, getRoot, genUUID } from 'react-reducer-utils'

import * as DoArticlesPage from '../reducers/articlesPage'
import * as DoHeader from '../reducers/header'

import Header from './Header'
import ArticleList from './ArticleList'
import FunctionBar from './FunctionBar'

import QueryString from 'query-string'

export default (props) => {
  const [stateArticlesPage, doArticlesPage] = useActionDispatchReducer(DoArticlesPage)
  const [stateHeader, doHeader] = useActionDispatchReducer(DoHeader)

  // eslint-disable-next-line
  const [errMsg, setErrMsg] = useState('')

  //init
  let { bid } = useParams()
  useEffect(() => {
    let headerID = genUUID()
    doHeader.init(headerID, doHeader, null, null)

    let articlesPageID = genUUID()
    const query = QueryString.parse(window.location.search)
    const {start_idx: startIdx, title: queryTitle} = query
    let searchTitle = queryTitle || ''

    doArticlesPage.init(articlesPageID, doArticlesPage, null, null, bid, searchTitle, startIdx)

    if(headerRef.current !== null) setHeaderHeight(headerRef.current.clientHeight)
    if(funcbarRef.current !== null) setFuncbarHeight(funcbarRef.current.clientHeight)
  }, [])


  //get data
  let articlesPage = getRoot(stateArticlesPage) || {}
  let myID = articlesPage.id || ''
  let errmsg = articlesPage.errmsg || ''
  let brdname = articlesPage.brdname || ''
  let title = articlesPage.title || ''
  let searchTitle = articlesPage.searchTitle || ''
  let isNextEnd = articlesPage.isNextEnd || false
  let isPreEnd = articlesPage.isPreEnd || false
  //let nextCreateTime = articlesPage.nextCreateTime || 0
  let scrollToRow = (typeof articlesPage.scrollToRow === 'undefined') ? null : articlesPage.scrollToRow
  let articles = articlesPage.allArticles || []

  //render
  const [headerHeight, setHeaderHeight] = useState(0)
  const [funcbarHeight, setFuncbarHeight] = useState(0)
  const headerRef = useRef(null)
  const funcbarRef = useRef(null)
  const {width: innerWidth, height: innerHeight} = useWindowSize()
  const [scrollTop, setScrollTop] = useState(0)

  let width = innerWidth
  let listHeight = innerHeight - headerHeight - funcbarHeight

  let headerTitle = brdname + ' - ' + title

  let loadPre = (item) => {
    if(item.numIdx === 1 || isPreEnd) {
      return
    }

    let idx = item.idx || ''
    if(!idx) {
      return
    }
    doArticlesPage.GetArticles(myID, bid, searchTitle, idx, true, true)
  }

  let loadNext = (item) => {
    if(isNextEnd) {
      return
    }

    let idx = item.idx || ''
    if(!idx) {
      return
    }

    doArticlesPage.GetArticles(myID, bid, searchTitle, idx, false, true)
  }

  let onVerticalScroll = (scrollTop) => {
    setScrollTop(scrollTop)
    if(scrollToRow === null) {
      return
    }

    doArticlesPage.SetData(myID, {scrollToRow: null})
  }

  // eslint-disable-next-line
  let allErrMsg = errors.mergeErr(errMsg, errmsg)
  let renderArticles = () => {
    if (articles.length === 0) {
      return(
        <div className="container vh-100">
          <h3 className="mx-4">這個看板目前沒有文章喔～</h3>
        </div>
      )
    } else {
      return (
        <ArticleList articles={articles} width={width} height={listHeight} loadPre={loadPre} loadNext={loadNext} scrollToRow={scrollToRow} onVerticalScroll={onVerticalScroll} scrollTop={scrollTop} />
      )
    }
  }

  let loptions = [
    {text: "發表文章", action: ()=>{}},
  ]
  let roptions = [
    {text: "精華區", action: ()=>{}},
    {text: "看板設定/說明", action: ()=>{}},
  ]

  // NOTE: ref can only be used directly on html tags to get element attributes
  // Will fail if used on React components.
  return (
    <div className={pageStyles['root']}>
      <div ref={headerRef}>
        <Header title={headerTitle} stateHeader={stateHeader} />
      </div>
      {renderArticles()}
      <div ref={funcbarRef}>
        <FunctionBar optionsLeft={loptions} optionsRight={roptions}/>
      </div>
    </div>
  )
}
