import React from 'react'

import { Table, Column, Cell } from 'fixed-data-table-2'

import styles from './BoardList.module.css'

import TextCell from './cells/TextCell'

const _COLUMNS = [
  {Header: '', accessor: '', width: 0, fixed: true, type: 'rest'},
  {Header: '編號', accessor: 'idx', width: 100, fixed: true},
  {Header: '', accessor: 'read', width: 50, fixed: true, type: 'read'},
  {Header: '看板', accessor: 'brdname', width: 200, fixed: true},
  {Header: '類別', accessor: 'class', width: 45, fixed: true},
  {Header: '', accessor: 'type', width: 30, fixed: true},
  {Header: '中文敘述', accessor: 'title', width: 300, fixed: true},
  {Header: '人氣', accessor: 'nuser', width: 100, fixed: true},
  {Header: '板主', accessor: 'moderators', width: 100, fixed: true, type: 'moderator'},
  {Header: '', accessor: '', width: 0, fixed: true, type: 'rest'}
]
const _COLUMN_WIDTHS = _COLUMNS.reduce((r, x, i) => r + x.width, 0)

export default (props) => {
  const {boards, width, height} = props

  let scale = width / _COLUMN_WIDTHS
  scale = scale < 1.2 ? scale : 1.2
  let headerHeight = parseInt(30*scale)
  let rowHeight = parseInt(30*scale)
  let scaleWidth = _COLUMNS.reduce((r, x, i) => r + parseInt(x.width*scale), 0)
  let theRestWidth = parseInt((width - scaleWidth) / 2)
  let fontSize=parseInt(rowHeight*0.5)

  console.log('BoardList: width:', width, '_COLUMN_WIDTHS:', _COLUMN_WIDTHS, 'scale:', scale, 'headerHeight:', headerHeight)

  let renderHeader = (column) => {
    return (<Cell className={styles['header']}>{column.Header}</Cell>)
  }

  let renderCell = (column, data) => {
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
      return <TextCell column={column} data={data} fontSize={fontSize} />
    default:
      return <Cell className={styles['default']}></Cell>
    }
  }

  let renderColumn = (column, idx, data) => {
    let columnWidth = column.type === 'rest' ? theRestWidth : parseInt(column.width*scale)
    return (
      <Column
        key={'column'+idx}
        columnKey={column.accessor}
        header={renderHeader(column)}
        cell={renderCell(column, data)}
        fixed={column.fixed || false}
        width={columnWidth} />
    )
  }

  return (
    <Table
      rowHeight={rowHeight}
      rowsCount={boards.length}
      headerHeight={headerHeight}
      width={width}
      height={height}
      showScrollbarX={false}
      showScrollbarY={false}>
      {_COLUMNS.map((column, idx) => renderColumn(column, idx, boards))}
    </Table>
  )
}
