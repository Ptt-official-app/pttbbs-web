import React from 'react'

import { Cell } from 'fixed-data-table-2'

import screenStyles from './Screen.module.css'

import TextCell from './cells/TextCell'
import ModeratorsCell from './cells/ModeratorsCell'

import Screen from './Screen'


import { CHAR_WIDTH } from './utils'

const _COLUMNS = [
  {Header: '', accessor: '', width: 0, fixed: true, type: 'rest'},
  {Header: '編號', accessor: 'idx', width: CHAR_WIDTH*6, fixed: true},
  {Header: '', accessor: 'read', width: CHAR_WIDTH*4, fixed: true, type: 'read'},
  {Header: '看板', accessor: 'brdname', width: CHAR_WIDTH*12, fixed: true},
  {Header: '類別', accessor: 'class', width: CHAR_WIDTH*4, fixed: true},
  {Header: '', accessor: 'type', width: CHAR_WIDTH*4, fixed: true},
  {Header: '中文敘述', accessor: 'title', width: CHAR_WIDTH*48, fixed: true},
  {Header: '人氣', accessor: 'nuser', width: CHAR_WIDTH*5, fixed: true},
  {Header: '板主', accessor: 'moderators', width: CHAR_WIDTH*38, fixed: true, type: 'moderator'},
  {Header: '', accessor: '', width: 0, fixed: true, type: 'rest'},
]

export default (props) => {
  const {boards, width, height} = props

  let renderCell = (column, data, fontSize) => {
    switch(column.accessor) {
    case 'idx':
      return <TextCell column={column} data={data} fontSize={fontSize}/>
    case 'read':
      return <TextCell column={column} data={data} fontSize={fontSize}/>
    case 'brdname':
      return <TextCell column={column} data={data} fontSize={fontSize}/>
    case 'class':
      return <TextCell column={column} data={data} fontSize={fontSize} />
    case 'type':
      return <TextCell column={column} data={data} fontSize={fontSize} />
    case 'title':
      return <TextCell column={column} data={data} fontSize={fontSize} />
    case 'nuser':
      return <TextCell column={column} data={data} fontSize={fontSize} />
    case 'moderators':
      return <ModeratorsCell column={column} data={data} fontSize={fontSize} />
    default:
      return <Cell className={screenStyles['default']}></Cell>
    }
  }

  let renderHeader = (column, fontSize) => {
    let style = {
      'font-size': fontSize + 'px',
    }

    return (<Cell className={screenStyles['header']} style={style}>{column.Header}</Cell>)
  }

  return (
    <Screen width={width} height={height} columns={_COLUMNS} data={boards} renderCell={renderCell} renderHeader={renderHeader} />
  )
}
