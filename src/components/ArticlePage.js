import React, { useEffect, useState, useRef } from 'react'
import pageStyles from './Page.module.css'

import * as errors from './errors'

import { useWindowSize, useKey } from 'react-use'
import { useParams } from 'react-router-dom'

import { useActionDispatchReducer, getRoot, genUUID, Empty } from 'react-reducer-utils'

import * as DoArticlePage from '../reducers/articlePage'
import * as DoHeader from '../reducers/header'

import Header from './Header'
import FunctionBar from './FunctionBar'

import Article from './Article'
import Recommend from './cells/Recommend'

import QueryString from 'query-string'

export default (props) => {
  const [stateArticlePage, doArticlePage] = useActionDispatchReducer(DoArticlePage)
  const [stateHeader, doHeader] = useActionDispatchReducer(DoHeader)

  // eslint-disable-next-line
  const [errMsg, setErrMsg] = useState('')

  //init
  let { bid, aid } = useParams()
  useEffect(() => {

    let headerID = genUUID()
    doHeader.init(headerID, doHeader, null, null)

    let articlePageID = genUUID()
    const query = QueryString.parse(window.location.search)
    const {start_idx: startIdx} = query

    doArticlePage.init(articlePageID, doArticlePage, null, null, bid, aid, startIdx)

    if(headerRef.current !== null) setHeaderHeight(headerRef.current.clientHeight)
    if(funcbarRef.current !== null) setFuncbarHeight(funcbarRef.current.clientHeight)

  }, [])

  //get data
  let articlePage = getRoot(stateArticlePage) || {}
  let myID = articlePage.id || ''
  let errmsg = articlePage.errmsg || ''
  let brdname = articlePage.brdname || ''
  let title = articlePage.title || ''
  let theClass = articlePage.class || ''
  let contentComments = articlePage.contentComments || []
  // eslint-disable-next-line
  let isNextEnd = articlePage.isNextEnd || false
  // eslint-disable-next-line
  let isPreEnd = articlePage.isPreEnd || false
  let scrollToRow = (typeof articlePage.scrollToRow === 'undefined') ? null : articlePage.scrollToRow

  let rank = articlePage.rank || 0
  let nRecommend = articlePage.recommend || 0
  let nComments = articlePage.n_comments || 0

  //keys
  useKey('ArrowLeft', (e) => {
    window.location.href = `/board/${bid}/articles`
  })

  useKey('X', (e) => {
    setIsRecommend(true)
  })

  useKey('Escape', (e) => {
    setIsRecommend(false)
  })

  //render
  const [headerHeight, setHeaderHeight] = useState(0)
  const [funcbarHeight, setFuncbarHeight] = useState(0)
  const headerRef = useRef(null)
  const funcbarRef = useRef(null)
  const {width: innerWidth, height: innerHeight} = useWindowSize()
  const [scrollTop, setScrollTop] = useState(0)
  const [isRecommend, setIsRecommend] = useState(false)
  const [recommendType, setRecommendStyle] = useState(1)
  const recommendTypeRef = useRef(null)
  const [recommend, setRecommend] = useState('')

  useEffect(() => {
    if(isRecommend) {
      setRecommendStyle(1)
      setRecommend('')

      console.log('ArticlePage.useEffect(isRecommend): recommendTypeRef:', recommendTypeRef)
      if(recommendTypeRef.current) {
        recommendTypeRef.current.focus()
      }
    } else {
      setRecommendStyle(1)
      setRecommend('')
      console.log('ArticlePage.useEffect(isRecommend): reset')
    }
  }, [isRecommend])

  useEffect(() => {

  }, [recommendType])


  let width = innerWidth
  let listHeight = innerHeight - headerHeight - funcbarHeight

  let fullTitle = theClass ? `[${theClass}] ` : ''
  fullTitle += title
  let headerTitle = `${brdname} - ${fullTitle}  (${rank}/${nRecommend}/${nComments})`
  let loadPre = (item) => {

  }

  let loadNext = (item) => {

  }

  let onVerticalScroll = (scrollTop) => {
    setScrollTop(scrollTop)
    if(scrollToRow === null) {
      return
    }

    doArticlePage.SetData(myID, {scrollToRow: null})
  }

  // eslint-disable-next-line
  let allErrMsg = errors.mergeErr(errMsg, errmsg)
  let renderArticle = () => {
    return (
      <Article lines={contentComments} width={width} height={listHeight} loadPre={loadPre} loadNext={loadNext} scrollToRow={scrollToRow} onVerticalScroll={onVerticalScroll} scrollTop={scrollTop} />
    )
  }

  let startRecommend = () => {
    setIsRecommend(true)
  }

  let renderRecommend = () => {
    let submit = (recommendType, recommend) => {
      if(recommend) {
        doArticlePage.AddRecommend(myID, bid, aid, recommendType, recommend)
      }
      setIsRecommend(false)
    }
    let cancel = () => {
      setIsRecommend(false)
    }

    return (
      <Recommend recommendTypeRef={recommendTypeRef} isRecommend={isRecommend} recommendType={recommendType} setRecommendStyle={setRecommendStyle} recommend={recommend} setRecommend={setRecommend} submit={submit} cancel={cancel} />
    )
  }

  let rankUp = () => {
    doArticlePage.Rank(myID, bid, aid, 1)
  }

  let rankDown = () => {
    doArticlePage.Rank(myID, bid, aid, -1)
  }

  let loptions = [
    {text: '☝', action: rankUp, hotkey: '↑'},
    {text: '☟', action: rankDown, hotkey: '↓'},
    {text: "推/噓", action: startRecommend, hotkey: 'X'},
    {render: renderRecommend}
  ]
  let roptions = [
    {text: "離開", url: `/board/${bid}/articles`, hotkey: "←"},
  ]

  return (
    <div className={pageStyles['root']}>
      <div ref={headerRef}>
        <Header title={headerTitle} stateHeader={stateHeader} />
      </div>
      {renderArticle()}
      <div ref={funcbarRef}>
        <FunctionBar optionsLeft={loptions} optionsRight={roptions}/>
      </div>
    </div>
  )
}