import React, { useState } from 'react'

import CSS from 'csstype'

import { Cell } from 'fixed-data-table-2'

import screenStyles from './Screen.module.css'

import Screen from './Screen'

import RowHighlightedCell from './cells/RowHighlightedCell'

import PlainText from './cells/PlainText'
import Idx from './cells/Idx'
import Moderators from './cells/Moderators'

import { CHAR_WIDTH } from './utils'
import { BoardSummary_i, PttColumn, TableData } from '../types'

const _COLUMNS: PttColumn[] = [
    { Header: '', accessor: '', width: 0, fixed: true, type: 'rest' },
    { Header: '編號', accessor: 'numIdx', width: CHAR_WIDTH * 6, fixed: true },
    { Header: '', accessor: 'read', width: CHAR_WIDTH * 4, fixed: true, type: 'read' },
    { Header: '看板', accessor: 'brdname', width: CHAR_WIDTH * 12, fixed: true, headerTextAlign: 'left' },
    { Header: '類別', accessor: 'class', width: CHAR_WIDTH * 5, fixed: true, headerTextAlign: 'left' },
    { Header: '', accessor: 'type', width: CHAR_WIDTH * 2, fixed: true },
    { Header: '中文敘述', accessor: 'title', width: CHAR_WIDTH * 48, fixed: true },
    { Header: '人氣', accessor: 'nuser', width: CHAR_WIDTH * 5, fixed: true },
    { Header: '板主', accessor: 'moderators', width: CHAR_WIDTH * 38, fixed: true, type: 'moderator' },
    { Header: '', accessor: '', width: 0, fixed: true, type: 'rest' },
]

type Props = {
    boards: BoardSummary_i[]
    width: number
    height: number
    loadPre?: (item: BoardSummary_i) => void
    loadNext?: (item: BoardSummary_i) => void
    scrollToRow?: number
    onVerticalScroll?: (scrollPos: number) => boolean
    scrollTop?: number
}

type IdxProps = {
    data: TableData<any>
    rowIndex?: number
    columnKey?: string
}

export default (props: Props) => {
    const { boards, width, height, loadPre, loadNext, scrollToRow, onVerticalScroll, scrollTop } = props

    const [selectedRow, setSeletedRow] = useState(-1)

    let defaultHighlight = {
        backgroundColor: '#333',
    }

    let renderIdx = (props: IdxProps) => {
        const { data, rowIndex, columnKey } = props
        return (<Idx data={data} rowIndex={rowIndex} columnKey={columnKey} loadPre={loadPre} loadNext={loadNext} />)
    }

    let renderCell = (column: PttColumn, data: TableData<any>, fontSize: number) => {
        let renderer = null

        switch (column.accessor) {
            case 'numIdx':
                renderer = (props: IdxProps) => renderIdx(props)
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

    let renderHeader = (column: PttColumn, fontSize: number) => {
        let style: CSS.Properties = {
            fontSize: fontSize + 'px',
        }
        let textAlign = column.headerTextAlign
        if (typeof textAlign !== 'undefined') {
            style.textAlign = textAlign
        }

        return (<Cell className={screenStyles['header']} style={style}>{column.Header}</Cell>)
    }

    return (
        <Screen width={width} height={height} columns={_COLUMNS} data={boards} renderCell={renderCell} renderHeader={renderHeader} scrollToRow={scrollToRow} onVerticalScroll={onVerticalScroll} scrollTop={scrollTop} />
    )
}
