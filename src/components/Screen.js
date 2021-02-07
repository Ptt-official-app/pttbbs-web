import React from 'react'

import { Table, Column, Cell } from 'fixed-data-table-2'

import styles from './Screen.module.css'

import { CalcScreenScale, BASE_COLUMN_WIDTH } from './utils'

import LineCell from './cells/LineCell'

const _DEFAULT_COLUMNS = [
  {Header: '', accessor: '', width: 0, fixed: true, 'type': 'rest'},
  {Header: '', accessor: 'line', width: BASE_COLUMN_WIDTH, fixed: true, 'type': 'line'},
  {Header: '', accessor: '', width: 0, fixed: true, 'type': 'rest'},
]

export default (props) => {
  const {width, height, columns: propsColumns, data, renderCell: propsRenderCell, renderHeader, scrollTop, onVerticalScroll, scrollToRow} = props

  let columns = propsColumns || _DEFAULT_COLUMNS

  let isHeader = !!renderHeader

  let [scale, lineHeight, fontSize] = CalcScreenScale(width)
  let headerHeight = isHeader ? lineHeight : 0
  let rowHeight = lineHeight
  let scaleWidth = columns.reduce((r, x, i) => r + parseInt(x.width*scale), 0)
  let theRestWidth = parseInt((width - scaleWidth) / 2)

  //render-cell
  let defaultRenderCell = (column, data, fontSize) => {
    switch(column.type) {
    case 'line':
      return <LineCell column={column} data={data} fontSize={fontSize}/>
    default:
      return <Cell className={styles['default']}></Cell>
    }
  }

  let renderCell = propsRenderCell || defaultRenderCell

  let renderColumn = (column, idx, data) => {
    let columnWidth = column.type === 'rest' ? theRestWidth : parseInt(column.width*scale)
    return (
      <Column
        key={'column'+idx}
        columnKey={column.accessor}
        header={isHeader ? renderHeader(column, fontSize) : null}
        cell={renderCell(column, data, fontSize)}
        fixed={column.fixed || false}
        width={columnWidth} />
    )
  }

  let scroll = {}

  if(typeof scrollToRow !== 'undefined' && scrollToRow !== null) {
    scroll.scrollTop = scrollToRow * rowHeight
  } else if(typeof scrollTop !== 'undefined' && scrollTop !== null) {
    scroll.scrollTop = scrollTop
  }

  if(typeof onVerticalScroll !== 'undefined' && onVerticalScroll !== null) {
    scroll.onVerticalScroll = onVerticalScroll
  }

  return (
    <Table
      rowHeight={rowHeight}
      rowsCount={data.length}
      headerHeight={headerHeight}
      width={width}
      height={height}
      showScrollbarX={false}
      showScrollbarY={false} {...scroll}>
      {columns.map((column, idx) => renderColumn(column, idx, data))}
    </Table>
  )
}