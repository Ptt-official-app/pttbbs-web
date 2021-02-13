import React, { useEffect, useState, useRef  } from 'react'
import pageStyles from './Page.module.css'

import * as errors from './errors'

import { useWindowSize } from 'react-use'

import { useActionDispatchReducer, getRoot, genUUID } from 'react-reducer-utils'

import * as DoHotBoardsPage from '../reducers/hotBoardsPage'

import Header from './Header'
import BoardList from './BoardList'
import EmptyBoardList from './EmptyBoardList'
import FunctionBar from './FunctionBar'

export default (props) => {
  const [stateHotBoardsPage, doHotBoardsPage] = useActionDispatchReducer(DoHotBoardsPage)

  // eslint-disable-next-line
  const [errMsg, setErrMsg] = useState('')

  //init

  useEffect(() => {
    let hotBoardsPageID = genUUID()
    doHotBoardsPage.init(hotBoardsPageID, doHotBoardsPage, null, null)

    if(headerRef.current !== null) setHeaderHeight(headerRef.current.clientHeight)
    if(funcbarRef.current !== null) setFuncbarHeight(funcbarRef.current.clientHeight)
  }, [])

  //get data
  let hotBoardsPage = getRoot(stateHotBoardsPage) || {}
  //let myID = hotBoardsPage.id || ''
  let errmsg = hotBoardsPage.errmsg || ''
  let boards = hotBoardsPage.list || []

  //render
  const [headerHeight, setHeaderHeight] = useState(0)
  const [funcbarHeight, setFuncbarHeight] = useState(0)
  const headerRef = useRef(null)
  const funcbarRef = useRef(null)
  const {width: innerWidth, height: innerHeight} = useWindowSize()

  let width = innerWidth
  //let boardListHeight = innerHeight * SCREEN_RATIO
  let boardListHeight = innerHeight - headerHeight - funcbarHeight

  let headerTitle = '熱門看板'

  // eslint-disable-next-line
  let allErrMsg = errors.mergeErr(errMsg, errmsg)

  let renderBoardList = () => {
    if(boards.length === 0) {
      //return (<BoardList boards={boards} width={width} height={boardListHeight}/>)
      return (<EmptyBoardList width={width} height={boardListHeight} prompt={"還沒有熱門看板囉～"} />)
    }
    else {
      return (<BoardList boards={boards} width={width} height={boardListHeight}/>)
    }
  }

  console.log('hotBoardsPage: to render: boards:', boards)

  let loptions = [
    {text: "搜尋看板", action: ()=>{}},
    {text: "排序", action: ()=>{}},
  ]
  let roptions = [
    {text: "我的最愛", action: ()=>{}},
    {text: "全部看板", action: ()=>{}},
  ]

  // NOTE: ref can only be used directly on html tags to get element attributes
  // Will fail if used on React components. e.g. Header
  return (
    <div className={pageStyles['root']}>
      <div ref={headerRef}>
        <Header title={headerTitle} />
      </div>
      {renderBoardList()}
      <div ref={funcbarRef}>
        <FunctionBar optionsLeft={loptions} optionsRight={roptions}/>
      </div>
    </div>
  )
}
