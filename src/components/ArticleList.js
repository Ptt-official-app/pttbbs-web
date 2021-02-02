import React from 'react'

import { Cell } from 'fixed-data-table-2'

import screenStyles from './Screen.module.css'

import TextCell from './cells/TextCell'
import StateCell from './cells/StateCell'
import DateCell from './cells/DateCell'
import CommNumCell from './cells/CommNumCell'
import IdxCell from './cells/IdxCell'

import Screen from './Screen'


import { CHAR_WIDTH } from './utils'

const _COLUMNS = [
  {Header: '', accessor: '', width: 0, fixed: true, type: 'rest'},
  {Header: '編號', accessor: 'idx', width: CHAR_WIDTH*6, fixed: true},
  {Header: '', accessor: 'read', width: CHAR_WIDTH*3, fixed: true},
  {Header: '', accessor: 'n_comments', width: CHAR_WIDTH*5, fixed: true},
  {Header: '日期', accessor: 'create_time', width: CHAR_WIDTH*5, fixed: true},
  {Header: '作者', accessor: 'owner', width: CHAR_WIDTH*14, fixed: true},
  {Header: '類別', accessor: 'class', width: CHAR_WIDTH*8, fixed: true},
  {Header: '標題', accessor: 'title', width: CHAR_WIDTH*48, fixed: true},
  {Header: '', accessor: '', width: 0, fixed: true, type: 'rest'},
]

export default (props) => {
  const {articles, width, height} = props

  let renderCell = (column, data, fontSize) => {
    switch(column.accessor) {
    case 'idx':
      return <IdxCell column={column} data={data} fontSize={fontSize}/>
    case 'read':
      return <StateCell column={column} data={data} fontSize={fontSize}/>
    case 'n_comments':
      return <CommNumCell column={column} data={data} fontSize={fontSize}/>
    case 'create_time':
      return <DateCell column={column} data={data} fontSize={fontSize} />
    case 'class':
      return <TextCell column={column} data={data} fontSize={fontSize} isCategory={true}/>
    case 'title':
      return <TextCell column={column} data={data} fontSize={fontSize} />
    case 'owner':
      return <TextCell column={column} data={data} fontSize={fontSize} />
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

  if(articles.length === 0) {
    return (
      <div className="container">這個看板目前沒有文章喔～</div>
    )
  }

  return (
    <Screen width={width} height={height} columns={_COLUMNS} data={articles} renderCell={renderCell} renderHeader={renderHeader} />
  )
}
