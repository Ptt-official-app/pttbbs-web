import React, { useEffect, useState, useRef  } from 'react'
import pageStyles from './Page.module.css'

import * as errors from './errors'

import { useWindowSize } from 'react-use'
import { useParams } from 'react-router-dom'

import { useActionDispatchReducer, getRoot, genUUID } from 'react-reducer-utils'

import * as DoUserFavoritesPage from '../reducers/userFavoritesPage'
import * as DoHeader from '../reducers/header'

import Header from './Header'
import BoardList from './BoardList'
import FunctionBar from './FunctionBar'

import QueryString from 'query-string'

export default (props) => {
  const [stateUserFavoritesPage, doUserFavoritesPage] = useActionDispatchReducer(DoUserFavoritesPage)
  const [stateHeader, doHeader] = useActionDispatchReducer(DoHeader)

  // eslint-disable-next-line
  const [errMsg, setErrMsg] = useState('')

  //init
  let { userid } = useParams()

  useEffect(() => {
    let headerID = genUUID()
    doHeader.init(headerID, doHeader, null, null)

    let userFavoritesPageID = genUUID()
    const query = QueryString.parse(window.location.search)
    const {start_idx: startIdx, level} = query

    doUserFavoritesPage.init(userFavoritesPageID, doUserFavoritesPage, null, null, userid, level, startIdx)

    if(headerRef.current !== null) setHeaderHeight(headerRef.current.clientHeight)
    if(funcbarRef.current !== null) setFuncbarHeight(funcbarRef.current.clientHeight)
  }, [])

  //get data
  let boardsPage = getRoot(stateUserFavoritesPage) || {}
  let myID = boardsPage.id || ''
  let errmsg = boardsPage.errmsg || ''
  let boards = boardsPage.list || []
  let isNextEnd = boardsPage.isNextEnd || false
  let isPreEnd = boardsPage.isPreEnd || false
  let scrollToRow = (typeof boardsPage.scrollToRow === 'undefined') ? null : boardsPage.scrollToRow
  let level = boardsPage.level || ''

  //render
  const [headerHeight, setHeaderHeight] = useState(0)
  const [funcbarHeight, setFuncbarHeight] = useState(0)
  const headerRef = useRef(null)
  const funcbarRef = useRef(null)
  const {width: innerWidth, height: innerHeight} = useWindowSize()
  const [scrollTop, setScrollTop] = useState(0)

  let width = innerWidth
  let listHeight = innerHeight - headerHeight - funcbarHeight

  let headerTitle = '我的最愛'

  let loadPre = (item) => {
    if(item.numIdx === 1 || isPreEnd) {
      return
    }

    let idx = item.idx || ''
    if(!idx) {
      return
    }
    doUserFavoritesPage.GetBoards(myID, userid, level, idx, true, true)
  }

  let loadNext = (item) => {
    if(isNextEnd) {
      return
    }

    let idx = item.idx || ''
    if(!idx) {
      return
    }

    doUserFavoritesPage.GetBoards(myID, userid, level, idx, false, true)
  }

  let onVerticalScroll = (scrollTop) => {
    setScrollTop(scrollTop)
    if(scrollToRow === null) {
      return
    }

    doUserFavoritesPage.SetData(myID, {scrollToRow: null})
  }

  // eslint-disable-next-line
  let allErrMsg = errors.mergeErr(errMsg, errmsg)

  let renderBoards = () => {
    if (boards.length === 0) {
      let style = {
        height: listHeight
      }
      return(
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
    {text: "搜尋看板", action: ()=>{}},
  ]

  let roptions = [
    {text: "熱門看板", action: ()=>{window.location.href = '/boards/popular'}},
    {text: "所有看板", action: ()=>{window.location.href = '/boards'}},
  ]

  return (
    <div className={pageStyles['root']}>
      <div ref={headerRef}>
        <Header title={headerTitle} stateHeader={stateHeader} />
      </div>
      {renderBoards()}
      <div ref={funcbarRef}>
        <FunctionBar optionsLeft={loptions} optionsRight={roptions}/>
      </div>
    </div>
  )
}