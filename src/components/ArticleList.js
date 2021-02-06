import React, { useState } from 'react'

import { Cell } from 'fixed-data-table-2'

import screenStyles from './Screen.module.css'

import RowHighlightedCell from './cells/RowHighlightedCell'
import { PlainText, PostDate, Idx, State, CommNum, Category } from './cells/ContentRenderer'

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

  const [selectedRow, setSeletedRow] = useState(-1)

  // assume that we will need to use different highlight for different cell
  let defaultHighlight = {
    'background-color' : '#333',
  }

  let renderCell = (column, data, fontSize) => {

    let renderer = PlainText

    switch(column.accessor) {
    case 'idx':
      renderer = Idx
      break
    case 'read':
      renderer = State
      break
    case 'n_comments':
      renderer = CommNum
      break
    case 'create_time':
      renderer = PostDate
      break
    case 'class':
      renderer = Category
      break
    case 'title':
    case 'owner':
      break
    default:
      return <Cell className={screenStyles['default']}></Cell>
    }
    return <RowHighlightedCell column={column} data={data} fontSize={fontSize}
      contentGen={renderer} setRowNum={setSeletedRow}
      highlightRow={selectedRow} highlightStyle={defaultHighlight}/>
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
