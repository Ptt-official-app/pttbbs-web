import React, { HTMLAttributes, useEffect } from 'react'

import { Table, Column, Cell } from 'fixed-data-table-2'

import styles from './Screen.module.css'
import runeStyles from './cells/ContentRenderer.module.css'

import { CalcScreenScale, CONSTS } from './utils'

import LineCell from './cells/LineCell'
import { PttColumn, TableData, TableProps_m } from '../types'

const _DEFAULT_COLUMNS: PttColumn[] = [
    { Header: '', accessor: '', width: 0, fixed: true, 'type': 'rest' },
    { Header: '', accessor: 'line', width: CONSTS.BASE_COLUMN_WIDTH, fixed: true, 'type': 'line' },
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
    data: TableData<any>
    renderCell: Function
    renderHeader?: Function

    scrollTop?: number
    onVerticalScroll?: (scrollPos: number) => boolean
    scrollToRow?: number | null
    onScrollStart?: ((x: number, y: number, firstRowIndex: number, endRowIndex: number) => void)
    onScrollEnd?: ((x: number, y: number, firstRowIndex: number, endRowIndex: number) => void)
}

export default (props: Props) => {
    const { width, height, columns: propsColumns, data, renderCell: propsRenderCell, renderHeader, scrollTop, onVerticalScroll, scrollToRow, onScrollStart, onScrollEnd } = props

    useEffect(_initBlink, [])

    let columns = propsColumns || _DEFAULT_COLUMNS

    let { scale, lineHeight, fontSize } = CalcScreenScale(width)

    //console.log('Screen: scale:', scale, 'lineHeight:', lineHeight, 'fontSize:', fontSize)
    let headerHeight = (typeof renderHeader !== 'undefined') ? lineHeight : 0
    let rowHeight = lineHeight
    let scaleWidth = columns.reduce((r, x, i) => r + Math.floor(x.width * scale), 0)
    let theRestWidth = Math.floor((width - scaleWidth) / 2)

    //render-cell
    let defaultRenderCell = (column: PttColumn, data: TableData<any>, fontSize: number) => {
        switch (column.type) {
            case 'line':
                return <LineCell column={column} data={data} fontSize={fontSize} />
            default:
                return <Cell className={styles['default']}></Cell>
        }
    }

    let renderCell = propsRenderCell || defaultRenderCell

    let renderColumn = (column: PttColumn, idx: number, data: TableData<any>) => {
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
        scroll.scrollToRow = scrollToRow
    } else if (typeof scrollTop !== 'undefined' && scrollTop !== null) {
        scroll.scrollTop = scrollTop
    }

    if (typeof onVerticalScroll !== 'undefined' && onVerticalScroll !== null) {
        scroll.onVerticalScroll = onVerticalScroll
    }

    if (typeof onScrollStart !== 'undefined' && onScrollStart !== null) {
        // @ts-ignore
        scroll.onScrollStart = onScrollStart
    }

    if (typeof onScrollEnd !== 'undefined' && onScrollEnd !== null) {
        // @ts-ignore
        scroll.onScrollEnd = onScrollEnd
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