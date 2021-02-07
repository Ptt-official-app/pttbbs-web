import React, { useEffect, useState } from 'react'
import pageStyles from './Page.module.css'

import * as errors from './errors'

import { useWindowSize } from 'react-use'

import { useActionDispatchReducer, getRoot, genUUID } from 'react-reducer-utils'

import * as DoHotBoardsPage from '../reducers/hotBoardsPage'

import Header from './Header'
import BoardList from './BoardList'
import EmptyBoardList from './EmptyBoardList'

export default (props) => {
  const [stateHotBoardsPage, doHotBoardsPage] = useActionDispatchReducer(DoHotBoardsPage)

  // eslint-disable-next-line
  const [errMsg, setErrMsg] = useState('')

  //init

  useEffect(() => {
    let hotBoardsPageID = genUUID()
    doHotBoardsPage.init(hotBoardsPageID, doHotBoardsPage, null, null)
  }, [])

  //get data
  let hotBoardsPage = getRoot(stateHotBoardsPage) || {}
  //let myID = hotBoardsPage.id || ''
  let errmsg = hotBoardsPage.errmsg || ''
  let boards = hotBoardsPage.list || []

  //render
  const {width: innerWidth, height: innerHeight} = useWindowSize()

  let width = innerWidth
  let boardListHeight = innerHeight * 0.9

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

  return (
    <div className={pageStyles['root']}>
      <Header title={headerTitle} />
      {renderBoardList()}
    </div>
  )
}
