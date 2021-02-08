import React, { useEffect, useState } from 'react'
import pageStyles from './Page.module.css'

import * as errors from './errors'

import { useWindowSize } from 'react-use'
import { useParams } from 'react-router-dom'

import { useActionDispatchReducer, getRoot, genUUID } from 'react-reducer-utils'

import * as DoArticlesPage from '../reducers/articlesPage'

import Header from './Header'
import ArticleList from './ArticleList'

import QueryString from 'query-string'

export default (props) => {
  const [stateArticlesPage, doArticlesPage] = useActionDispatchReducer(DoArticlesPage)

  // eslint-disable-next-line
  const [errMsg, setErrMsg] = useState('')

  //init
  let { bid } = useParams()
  useEffect(() => {
    let articlesPageID = genUUID()
    const query = QueryString.parse(window.location.search)
    const {start_idx: startIdx} = query

    doArticlesPage.init(articlesPageID, doArticlesPage, null, null, bid, null, startIdx)
  }, [])

  //get data
  let articlesPage = getRoot(stateArticlesPage) || {}
  let myID = articlesPage.id || ''
  let errmsg = articlesPage.errmsg || ''
  let articles = articlesPage.list || []
  let brdname = articlesPage.brdname || ''
  let title = articlesPage.title || ''
  let nextIdx = articlesPage.nextIdx || ''
  let nextCreateTime = articlesPage.nextCreateTime || 0
  let scrollToRow = (typeof articlesPage.scrollToRow === 'undefined') ? null : articlesPage.scrollToRow

  //render
  const {width: innerWidth, height: innerHeight} = useWindowSize()
  const [scrollTop, setScrollTop] = useState(0)

  let width = innerWidth
  let listHeight = innerHeight * 0.9

  let headerTitle = brdname + ' - ' + title

  let loadPre = (item) => {
    if(item.numIdx === 1) {
      return
    }

    let idx = item.idx || ''
    if(!idx) {
      return
    }
    doArticlesPage.GetArticles(myID, bid, title, idx, true)
  }

  let loadNext = (item) => {
    if(!nextIdx) {
      return
    }
    doArticlesPage.GetArticles(myID, bid, title, nextIdx, false)
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

  return (
    <div className={pageStyles['root']}>
      <Header title={headerTitle} />
      {renderArticles()}
    </div>
  )
}
