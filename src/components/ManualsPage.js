import React, { useEffect, useState, useRef } from 'react'
import pageStyles from './Page.module.css'

import * as errors from './errors'

import { useWindowSize, useKey } from 'react-use'
import { useParams } from 'react-router-dom'

import { useActionDispatchReducer, getRoot, genUUID } from 'react-reducer-utils'

import * as DoManualsPage from '../reducers/manualsPage'
import * as DoHeader from '../reducers/header'

import ManualPage from './ManualPage'

import Header from './Header'
import ManualList from './ManualList'
import FunctionBar from './FunctionBar'
import SearchBar from './SearchBar'
import EmptyList from './EmptyList'

import QueryString from 'query-string'

import { GetBoardParent } from './utils'

export default (props) => {
  //init
  let { bid, path: _path } = useParams()
  let path = _path || ''
  let pathList = path.split('/')
  let dirname = pathList.slice(0, pathList.length-1).join('/')
  let parentUrl = `/board/${bid}/manual`
  console.log('ManualsPage: path:', path, 'dirname:', dirname)
  if(dirname !== '') {
    parentUrl += '/' + dirname
  }

  let basename = pathList[pathList.length-1]
  if(basename[0] === 'M') {
    return <ManualPage {...props} />
  }

  const [stateManualsPage, doManualsPage] = useActionDispatchReducer(DoManualsPage)
  const [stateHeader, doHeader] = useActionDispatchReducer(DoHeader)

  // eslint-disable-next-line
  const [errMsg, setErrMsg] = useState('')

  useEffect(() => {
    let headerID = genUUID()
    doHeader.init(headerID, doHeader, null, null)

    let manualsPageID = genUUID()
    const query = QueryString.parse(window.location.search)
    const {start_idx: startIdx, title: queryTitle} = query
    let searchTitle = queryTitle || ''

    doManualsPage.init(manualsPageID, doManualsPage, null, null, bid, path, searchTitle, startIdx)

    if(headerRef.current !== null) setHeaderHeight(headerRef.current.clientHeight)
    if(funcbarRef.current !== null) setFuncbarHeight(funcbarRef.current.clientHeight)
  }, [])

  //get data
  let manualsPage = getRoot(stateManualsPage) || {}
  let myID = manualsPage.id || ''
  let errmsg = manualsPage.errmsg || ''
  let brdname = manualsPage.brdname || ''
  let title = manualsPage.title || ''
  let isNextEnd = manualsPage.isNextEnd || false
  let isPreEnd = manualsPage.isPreEnd || false
  //let nextCreateTime = manualsPage.nextCreateTime || 0
  let scrollToRow = (typeof manualsPage.scrollToRow === 'undefined') ? null : manualsPage.scrollToRow
  let manuals = manualsPage.allManuals || []

  //keys
  useKey('ArrowLeft', (e) => {
    window.location.href = parentUrl
  })

  //render
  const [headerHeight, setHeaderHeight] = useState(0)
  const [funcbarHeight, setFuncbarHeight] = useState(0)
  const headerRef = useRef(null)
  const funcbarRef = useRef(null)
  const {width: innerWidth, height: innerHeight} = useWindowSize()
  const [scrollTop, setScrollTop] = useState(0)
  const [searching, setSearching] = useState(false)

  let width = innerWidth
  let listHeight = innerHeight - headerHeight - funcbarHeight

  let headerTitle = '(精華區) ' + brdname + ' - ' + title

  console.log('ManualsPage: manualsPage:', manualsPage, 'brdname:', brdname, 'headerTitle:', headerTitle)

  let loadPre = (item) => {
  }

  let loadNext = (item) => {
  }

  let onVerticalScroll = (scrollTop) => {
    setScrollTop(scrollTop)
    if(scrollToRow === null) {
      return
    }

    doManualsPage.SetData(myID, {scrollToRow: null})
  }

  // eslint-disable-next-line
  let allErrMsg = errors.mergeErr(errMsg, errmsg)
  let renderManuals = () => {
    if (manuals.length === 0) {
      return(
        <EmptyList prompt="這個精華區目前沒有文章喔～" width={width} height={listHeight} />
      )
    } else {
      return (
        <ManualList manuals={manuals} width={width} height={listHeight} loadPre={loadPre} loadNext={loadNext} scrollToRow={scrollToRow} onVerticalScroll={onVerticalScroll} scrollTop={scrollTop} />
      )
    }
  }

  let loptions = [
  ]
  let roptions = [
    {text: "看板", url: `/board/${bid}/articles`},
    {text: "看板設定/說明", action: ()=>{}},
  ]
  if(path !== '') {
    roptions = [{text: '離開', url: parentUrl, hotkey: "←"}].concat(roptions)
  }

  const renderHeader = (params) => {
    return (
      <div className={'col d-flex justify-content-between align-items-center px-4'}>
        <div className="w-25 "></div>
        <span className="p-0" style={{fontSize: "x-large"}}>{headerTitle}</span>
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
        <FunctionBar optionsLeft={loptions} optionsRight={roptions}/>
      </div>
    </div>
  )
}
