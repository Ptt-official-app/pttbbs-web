import React, { Dispatch, FocusEvent, LegacyRef, SetStateAction, useState } from 'react'

import { Cell } from 'fixed-data-table-2'

import screenStyles from './Screen.module.css'

import { Edit } from './cells/Edit'

import Screen from './Screen'

import { CHAR_WIDTH } from './utils'
import { Line, PttColumn, TableData } from '../types'
import RowHighlightedCell from './cells/RowHighlightedCell'

const _COLUMNS: PttColumn[] = [
    { Header: '', accessor: '', width: 0, fixed: true, type: 'rest' },
    { Header: 'text', accessor: 'runes', width: CHAR_WIDTH * 90, fixed: true },
    { Header: '', accessor: '', width: 0, fixed: true, type: 'rest' },
]

type Props = {
    lines: Line[]
    width: number
    height: number
    selectedRow?: number
    setSelectedRow: Dispatch<SetStateAction<number>>
    selectedColumn?: number
    setSelectedColumn: Dispatch<SetStateAction<number>>
    focusRef: LegacyRef<HTMLDivElement>
    lengthRef: LegacyRef<HTMLDivElement>
    editWidth?: number
    setEditWidth: Dispatch<SetStateAction<number>>
    updateText: Function
    newLine: Function
    upLine: Function
    nextLine: Function
    isFocus: boolean
    setIsFocus: (isFocus: boolean) => void
}

export default (props: Props) => {
    const { lines, width, height, selectedRow, setSelectedRow, selectedColumn, setSelectedColumn, focusRef, lengthRef, editWidth, setEditWidth, updateText, newLine, upLine, nextLine, isFocus, setIsFocus } = props

    const [isCtrl, setIsCtrl] = useState(false)

    // assume that we will need to use different highlight for different cell
    let defaultHighlight = {
        backgroundColor: '#333',
    }

    let onMouseDown = (e: MouseEvent, row: number, col: number) => {
        if (lines.length === 0) {
            return
        }
        if (row >= lines.length) {
            row = lines.length - 1
        }
        let runes = lines[row].runes
        if (runes.length > 0 && col >= runes.length) {
            col = runes.length - 1
        }
        let text = runes[col].text
        updateText(row, col, text)
        setSelectedRow(row)
        setSelectedColumn(col)
        setIsFocus(true)
    }


    let renderCell = (column: PttColumn, data: TableData, fontSize: number, lineHeight: number) => {
        let renderer = null

        switch (column.accessor) {
            case 'runes':
                renderer = Edit
                break
            default:
                return (<Cell className={screenStyles['default']} />)
        }

        let setRowNum = (rowIndex: number) => {
        }

        return <RowHighlightedCell column={column} data={data} fontSize={fontSize}
            lineHeight={lineHeight} content={renderer} setRowNum={setRowNum}
            highlightRow={selectedRow} highlightStyle={defaultHighlight} selectedRow={selectedRow} setSelectedRow={setSelectedRow} selectedColumn={selectedColumn} setSelectedColumn={setSelectedColumn} focusRef={focusRef} lengthRef={lengthRef} editWidth={editWidth} setEditWidth={setEditWidth} updateText={updateText} newLine={newLine} onMouseDown={onMouseDown} upLine={upLine} nextLine={nextLine} isCtrl={isCtrl} setIsCtrl={setIsCtrl} isFocus={isFocus} />
    }

    let onFocus = (e: FocusEvent) => {
    }

    let onBlur = (e: FocusEvent) => {
    }

    return (
        <div onFocus={onFocus} onBlur={onBlur} >
            <Screen width={width} height={height} columns={_COLUMNS} data={lines} renderCell={renderCell} />
        </div>
    )
}
