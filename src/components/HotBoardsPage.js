import React, { useEffect, useState, useRef  } from 'react'
import pageStyles from './Page.module.css'

import * as errors from './errors'

import { useWindowSize } from 'react-use'

import { useActionDispatchReducer, getRoot, genUUID } from 'react-reducer-utils'

import { PTT_GUEST } from '../constants'

import * as DoHotBoardsPage from '../reducers/hotBoardsPage'
import * as DoHeader from '../reducers/header'

import HotKeys from './HotKeys'
import Header from './Header'
import BoardList from './BoardList'
import FunctionBar from './FunctionBar'

export default (props) => {
  const [stateHotBoardsPage, doHotBoardsPage] = useActionDispatchReducer(DoHotBoardsPage)
  const [stateHeader, doHeader] = useActionDispatchReducer(DoHeader)

  // eslint-disable-next-line
  const [errMsg, setErrMsg] = useState('')

  //init

  useEffect(() => {
    let headerID = genUUID()
    doHeader.init(headerID, doHeader, null, null)

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

  let header = getRoot(stateHeader) || {}
  let myUserID = header.user_id || ''

  //render
  const [headerHeight, setHeaderHeight] = useState(0)
  const [funcbarHeight, setFuncbarHeight] = useState(0)
  const headerRef = useRef(null)
  const funcbarRef = useRef(null)
  const {width: innerWidth, height: innerHeight} = useWindowSize()

  let width = innerWidth
  //let boardListHeight = innerHeight * SCREEN_RATIO
  let listHeight = innerHeight - headerHeight - funcbarHeight

  let headerTitle = '熱門看板'

  // eslint-disable-next-line
  let allErrMsg = errors.mergeErr(errMsg, errmsg)

  let renderBoardList = () => {
    if(boards.length === 0) {
      let style = {
        height: listHeight
      }
      return(
        <div className="container" style={style}>
          <h3 className="mx-4">還沒有熱門看板喔～</h3>
        </div>
      )
    }
    else {
      return (<BoardList boards={boards} width={width} height={listHeight}/>)
    }
  }

  let loptions = [
    {text: "搜尋看板", action: ()=>{}},
  ]
  let roptions = []
  if(myUserID && myUserID !== PTT_GUEST) {
    roptions.push({text: "我的最愛", action: ()=>{window.location.href = '/user/' + myUserID + '/favorites'}})
  }

  roptions.push({text: "全部看板", action: ()=>{window.location.href = '/boards'}})

  // NOTE: ref can only be used directly on html tags to get element attributes
  // Will fail if used on React components. e.g. Header
  return (
    <div className={pageStyles['root']}>
      <HotKeys>
      <div ref={headerRef}>
        <Header title={headerTitle} stateHeader={stateHeader} />
      </div>
      {renderBoardList()}
      <div ref={funcbarRef}>
        <FunctionBar optionsLeft={loptions} optionsRight={roptions}/>
      </div>
      </HotKeys>
    </div>
  )
}
