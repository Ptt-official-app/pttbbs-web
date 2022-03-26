import React, { useEffect, useState, useRef } from 'react'
import pageStyles from './Page.module.css'

import * as errors from './errors'

import { useWindowSize, useKey } from 'react-use'
import { useParams } from 'react-router-dom'

import { useActionDispatchReducer, getRoot, genUUID, } from 'react-reducer-utils'

import * as DoManualPage from '../reducers/manualPage'
import * as DoHeader from '../reducers/header'

import Header from './Header'
import FunctionBar from './FunctionBar'

import Article from './Article'
import Recommend from './cells/Recommend'

import QueryString from 'query-string'

export default (props) => {
  const [stateManualPage, doManualPage] = useActionDispatchReducer(DoManualPage)
  const [stateHeader, doHeader] = useActionDispatchReducer(DoHeader)

  // eslint-disable-next-line
  const [errMsg, setErrMsg] = useState('')

  //init
  let { bid, path } = useParams()

  let pathList = path.split('/')
  let dirname = pathList.slice(0, pathList.length-1).join('/')
  let parentUrl = `/board/${bid}/manual`
  if(dirname !== '') {
    parentUrl += '/' + dirname
  }

  useEffect(() => {

    let headerID = genUUID()
    doHeader.init(headerID, doHeader, null, null)

    let manualPageID = genUUID()
    const query = QueryString.parse(window.location.search)
    let startIdx = query.start_idx || ''

    console.log('ManualPage.useEffect: to init: bid:', bid, 'path:', path)
    doManualPage.init(manualPageID, doManualPage, null, null, bid, path, startIdx)

    if(headerRef.current !== null) setHeaderHeight(headerRef.current.clientHeight)
    if(funcbarRef.current !== null) setFuncbarHeight(funcbarRef.current.clientHeight)

  }, [])

  //get data
  let manualPage = getRoot(stateManualPage) || {}
  let myID = manualPage.id || ''
  let errmsg = manualPage.errmsg || ''
  let brdname = manualPage.brdname || ''
  let title = manualPage.title || ''
  let content = manualPage.content || ''
  // eslint-disable-next-line
  let isNextEnd = manualPage.isNextEnd || false
  // eslint-disable-next-line
  let isPreEnd = manualPage.isPreEnd || false
  let scrollToRow = (typeof manualPage.scrollToRow === 'undefined') ? null : manualPage.scrollToRow

  //keys

  //render
  const [headerHeight, setHeaderHeight] = useState(0)
  const [funcbarHeight, setFuncbarHeight] = useState(0)
  const headerRef = useRef(null)
  const funcbarRef = useRef(null)
  const {width: innerWidth, height: innerHeight} = useWindowSize()
  const [scrollTop, setScrollTop] = useState(0)

  useKey('ArrowLeft', (e) => {
    window.location.href = parentUrl
  })

  let width = innerWidth
  let listHeight = innerHeight - headerHeight - funcbarHeight

  let fullTitle = ''
  fullTitle += title
  let headerTitle = `(精華區) ${brdname} - ${fullTitle}`

  let loadPre = (item) => {}
  let loadNext = (item) => {}

  let onVerticalScroll = (scrollTop) => {
    setScrollTop(scrollTop)
    if(scrollToRow === null) {
      return
    }

    doManualPage.SetData(myID, {scrollToRow: null})
  }

  // eslint-disable-next-line
  let allErrMsg = errors.mergeErr(errMsg, errmsg)
  let renderManual = () => {
    return (
      <Article lines={content} width={width} height={listHeight} loadPre={loadPre} loadNext={loadNext} scrollToRow={scrollToRow} onVerticalScroll={onVerticalScroll} scrollTop={scrollTop} />
    )
  }

  let loptions = [
  ]

  let roptions = [
    {text: "離開", url: parentUrl, hotkey: "←"},
  ]

  return (
    <div className={pageStyles['root']}>
      <div ref={headerRef}>
        <Header title={headerTitle} stateHeader={stateHeader} />
      </div>
      {renderManual()}
      <div ref={funcbarRef}>
        <FunctionBar optionsLeft={loptions} optionsRight={roptions}/>
      </div>
    </div>
  )
}