import React, { useEffect } from 'react'

import { Table, Column, Cell } from 'fixed-data-table-2'

import styles from './Screen.module.css'
import runeStyles from './cells/ContentRenderer.module.css'

import { CalcScreenScale, BASE_COLUMN_WIDTH } from './utils'

import LineCell from './cells/LineCell'
import { PttColumn, TableData, TableProps_m } from '../types'

const _DEFAULT_COLUMNS: PttColumn[] = [
    { Header: '', accessor: '', width: 0, fixed: true, 'type': 'rest' },
    { Header: '', accessor: 'line', width: BASE_COLUMN_WIDTH, fixed: true, 'type': 'line' },
    { Header: '', accessor: '', width: 0, fixed: true, 'type': 'rest' },
]

const _initBlink = () => {
    // The <body> blinking trick, inspired by PttChrome:
    // https://github.com/robertabcd/PttChrome/blob/dev/src/js/term_buf.js TermBuf.prototype.notify()
    const interval = setInterval(() => document.body.classList.toggle(runeStyles['hide-blink']), 1000)
    return () => {
        clearInterval(interval)
        document.body.classList.remove(runeStyles['hide-blink'])
    }
}

type Props = {
    width: number
    height: number
    columns?: PttColumn[]
    data: TableData
    renderCell: Function
    renderHeader?: Function
    scrollTop?: number
    onVerticalScroll?: (scrollPos: number) => boolean
    scrollToRow?: number
}

export default (props: Props) => {
    const { width, height, columns: propsColumns, data, renderCell: propsRenderCell, renderHeader, scrollTop, onVerticalScroll, scrollToRow } = props

    useEffect(_initBlink, [])

    let columns = propsColumns || _DEFAULT_COLUMNS

    let { scale, lineHeight, fontSize } = CalcScreenScale(width)

    console.log('Screen: scale:', scale, 'lineHeight:', lineHeight, 'fontSize:', fontSize)
    let headerHeight = (typeof renderHeader !== 'undefined') ? lineHeight : 0
    let rowHeight = lineHeight
    let scaleWidth = columns.reduce((r, x, i) => r + Math.floor(x.width * scale), 0)
    let theRestWidth = Math.floor((width - scaleWidth) / 2)

    //render-cell
    let defaultRenderCell = (column: PttColumn, data: TableData, fontSize: number) => {
        switch (column.type) {
            case 'line':
                return <LineCell column={column} data={data} fontSize={fontSize} />
            default:
                return <Cell className={styles['default']}></Cell>
        }
    }

    let renderCell = propsRenderCell || defaultRenderCell

    let renderColumn = (column: PttColumn, idx: number, data: TableData) => {
        let columnWidth = column.type === 'rest' ? theRestWidth : Math.floor(column.width * scale)
        return (
            <Column
                key={'column' + idx}
                columnKey={column.accessor}
                header={(typeof renderHeader !== 'undefined') ? renderHeader(column, fontSize) : null}
                cell={renderCell(column, data, fontSize, lineHeight)}
                fixed={column.fixed || false}
                width={columnWidth} />
        )
    }

    let scroll: TableProps_m = {}

    if (typeof scrollToRow !== 'undefined' && scrollToRow !== null) {
        scroll.scrollTop = scrollToRow * rowHeight
    } else if (typeof scrollTop !== 'undefined' && scrollTop !== null) {
        scroll.scrollTop = scrollTop
    }

    if (typeof onVerticalScroll !== 'undefined' && onVerticalScroll !== null) {
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
            showScrollbarY={false}
            {...scroll}>
            {columns.map((column, idx) => renderColumn(column, idx, data))}
        </Table>
    )
}