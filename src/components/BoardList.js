import React, { useState } from 'react'

import { Cell } from 'fixed-data-table-2'

import screenStyles from './Screen.module.css'

import Screen from './Screen'

import RowHighlightedCell from './cells/RowHighlightedCell'

import { PlainText, Idx, Moderators } from './cells/ContentRenderer'


import { CHAR_WIDTH } from './utils'

const _COLUMNS = [
  {Header: '', accessor: '', width: 0, fixed: true, type: 'rest'},
  {Header: '編號', accessor: 'numIdx', width: CHAR_WIDTH*6, fixed: true},
  {Header: '', accessor: 'read', width: CHAR_WIDTH*4, fixed: true, type: 'read'},
  {Header: '看板', accessor: 'brdname', width: CHAR_WIDTH*12, fixed: true, 'header-text-align': 'left'},
  {Header: '類別', accessor: 'class', width: CHAR_WIDTH*5, fixed: true, 'header-text-align': 'left'},
  {Header: '', accessor: 'type', width: CHAR_WIDTH*2, fixed: true},
  {Header: '中文敘述', accessor: 'title', width: CHAR_WIDTH*48, fixed: true},
  {Header: '人氣', accessor: 'nuser', width: CHAR_WIDTH*5, fixed: true},
  {Header: '板主', accessor: 'moderators', width: CHAR_WIDTH*38, fixed: true, type: 'moderator'},
  {Header: '', accessor: '', width: 0, fixed: true, type: 'rest'},
]

export default (props) => {
  const {boards, width, height, loadPre, loadNext, scrollToRow, onVerticalScroll, scrollTop} = props

  const [selectedRow, setSeletedRow] = useState(-1)

  let defaultHighlight = {
    backgroundColor: '#333',
  }

  let renderIdx = (props) => {
    const {data, rowIndex, columnKey} = props
    return (<Idx data={data} rowIndex={rowIndex} columnKey={columnKey} loadPre={loadPre} loadNext={loadNext} />)
  }

  let renderCell = (column, data, fontSize) => {
    let renderer = null

    switch(column.accessor) {
    case 'numIdx':
      renderer = (props) => renderIdx(props)
      break
    case 'read':
      renderer = PlainText
      break
    case 'brdname':
      renderer = PlainText
      break
    case 'class':
      renderer = PlainText
      break
    case 'type':
      renderer = PlainText
      break
    case 'title':
      renderer = PlainText
      break
    case 'nuser':
      renderer = PlainText
      break
    case 'moderators':
      renderer = Moderators
      break
    default:
      return <Cell className={screenStyles['default']}></Cell>
    }

    return <RowHighlightedCell column={column} data={data} fontSize={fontSize}
      content={renderer} setRowNum={setSeletedRow}
      highlightRow={selectedRow} highlightStyle={defaultHighlight} loadPre={loadPre} loadNext={loadNext} />

  }

  let renderHeader = (column, fontSize) => {
    let style = {
      fontSize: fontSize + 'px',
    }
    let textAlign = column['header-text-align'] || ''
    if(textAlign !== '') {
      style['textAlign'] = textAlign
    }

    return (<Cell className={screenStyles['header']} style={style}>{column.Header}</Cell>)
  }

  return (
    <Screen width={width} height={height} columns={_COLUMNS} data={boards} renderCell={renderCell} renderHeader={renderHeader} scrollToRow={scrollToRow} onVerticalScroll={onVerticalScroll} scrollTop={scrollTop} />
  )
}
