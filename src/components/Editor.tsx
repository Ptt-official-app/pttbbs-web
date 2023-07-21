import React, { Dispatch, FocusEvent, KeyboardEvent, SetStateAction, useEffect, useState, MutableRefObject, MouseEventHandler, useRef } from 'react'

import { Cell } from 'fixed-data-table-2'

import screenStyles from './Screen.module.css'

import Edit from './cells/Edit'

import Screen from './Screen'

import { CHAR_WIDTH, CONSTS, SCREEN_WIDTH } from './utils'
import { EditLine, EditRunes_t, PttColumn, TableData } from '../types'
import RowHighlightedCell from './cells/RowHighlightedCell'
import { COLOR_BACKGROUND_BLACK, COLOR_FOREGROUND_WHITE } from '../constants'
import { calcTextCount } from './cells/utils'
import { Container } from 'react-bootstrap/lib/Tab'

const _COLUMNS: PttColumn[] = [
    { Header: '', accessor: '', width: 0, fixed: true, type: 'rest' },
    { Header: 'text', accessor: 'runes', width: CHAR_WIDTH * 90, fixed: true },
    { Header: '', accessor: '', width: 0, fixed: true, type: 'rest' },
]

type Props = {
    contentLines: EditLine[]
    setContentLines: Dispatch<SetStateAction<EditLine[]>>

    width: number
    height: number
    selectedRow: number
    setSelectedRow: Dispatch<SetStateAction<number>>
    selectedColumn: number
    setSelectedColumn: Dispatch<SetStateAction<number>>
}

export default (props: Props) => {
    const { width, height, selectedRow, setSelectedRow, selectedColumn, setSelectedColumn, contentLines, setContentLines } = props

    const [highlightRow, setHighlightRow] = useState(-1)

    const [tailLines, setTailLines] = useState<EditLine[]>([])
    const [allLines, setAllLines] = useState<EditLine[]>([])

    const focusInputRef: MutableRefObject<HTMLInputElement | null> = useRef(null)
    const [inputWidth, setInputWidth] = useState(1)

    const [firstRowIdx, setFirstRowIdx] = useState(0)
    const [endRowIdx, setEndRowIdx] = useState(0)
    const [scrollRowIdx, setScrollRowIdx] = useState<number | null>(null)

    let safeSetSelectedRow = (row: number): number => {
        if (row >= contentLines.length) {
            row = contentLines.length - 1
        }
        setSelectedRow(row)
        setHighlightRow(row)

        console.log('Editor.safeSetSelectedRow: row:', row, 'contentLines:', contentLines.length, 'selectedRow:', selectedRow, 'highlightRow:', highlightRow, 'selectedColumn:', selectedColumn, 'length:', contentLines[row].runes.length)

        if (selectedColumn > contentLines[row].runes.length) {
            setSelectedColumn(contentLines[row].runes.length)
        }

        return row
    }


    let upLine = (): number => {
        if (selectedRow === 0) {
            return selectedRow
        }

        let newRow = safeSetSelectedRow(selectedRow - 1)

        return newRow
    }


    let nextLine = (): number => {
        if (selectedRow === contentLines.length - 1) {
            if (selectedColumn < contentLines[selectedRow].runes.length) {
                rightColumn()
            }
            return selectedRow
        }

        let newRow = safeSetSelectedRow(selectedRow + 1)

        return newRow
    }

    let leftColumn = (): number => {
        if (selectedColumn === 0) {
            if (selectedRow === 0) {
                return selectedColumn
            }

            let newRow = upLine()
            let newColumn = contentLines[newRow].runes.length
            setSelectedColumn(newColumn)

            return newColumn
        }
        setSelectedColumn(selectedColumn - 1)

        return selectedColumn - 1
    }

    let rightColumn = (): number => {
        if (selectedColumn >= contentLines[selectedRow].runes.length) {
            if (selectedRow >= contentLines.length - 1) {
                return selectedColumn
            }
            nextLine()
            setSelectedColumn(0)

            return 0
        }
        setSelectedColumn(selectedColumn + 1)

        return selectedColumn + 1
    }

    let safeSetSelectedRowCheckColumnOnly = (row: number) => {
        setSelectedRow(row)
        setHighlightRow(row)

        if (row >= contentLines.length) {
            return
        }

        if (selectedColumn > contentLines[row].runes.length) {
            setSelectedColumn(contentLines[row].runes.length)
        }
    }

    let safeSetHightlightRow = (row: number) => {
        if (row >= contentLines.length) {
            row = contentLines.length - 1
        }
        setHighlightRow(row)
    }

    let newLine = () => {
        if (focusInputRef.current === null) {
            //console.log('Editor.newLine: start: no focusInputRef: row:', selectedRow, 'col:', selectedColumn)
            return
        }
        //console.log('Editor.newLine: start: value:', focusInputRef.current.value, 'row:', selectedRow, 'col:', selectedColumn)

        let [newContentLines, newSelectedRow, newSelectedColumn] = updateContent(selectedRow, selectedColumn, focusInputRef.current.value)
        focusInputRef.current.value = ''
        focusInputRef.current.defaultValue = ''

        let lines = newContentLines.map((each) => each)
        if (lines.length <= newSelectedRow) {
            lines = insertNewLines(lines, lines.length, newSelectedRow + 1 - lines.length)
        }
        let line = lines[newSelectedRow]
        let theColumn = newSelectedColumn
        if (theColumn > line.runes.length) {
            theColumn = line.runes.length
        }
        let preRunes = line.runes.slice(0, theColumn)
        let postRunes = line.runes.slice(theColumn)

        line.runes = preRunes
        let theNewLine: EditLine = { runes: postRunes, isTail: false }
        let newLines = updateLines(lines, selectedRow, [line, theNewLine])
        setContentLines(newLines)
        let theAllLines = newLines.concat(tailLines)
        setAllLines(theAllLines)
        safeSetSelectedRowCheckColumnOnly(selectedRow + 1)
        setSelectedColumn(0)
    }

    let onMouseDownTail = () => {
        //console.log('Editor.onMouseDownTail: start: contentLines:', contentLines)
        safeSetSelectedRowCheckColumnOnly(contentLines.length - 1)
        setSelectedColumn(contentLines[contentLines.length - 1].runes.length)
        setInputWidth(1)
    }

    // init
    useEffect(() => {
        let initLines: EditLine[] = [
            { runes: [], isTail: false },
        ]

        setContentLines(initLines)

        let theAllLines = contentLines.concat(tailLines)
        setAllLines(theAllLines)
    }, [])

    // update height or CONSTS.LINE_HEIGHT
    useEffect(() => {
        let nTailLines = Math.ceil(height / CONSTS.LINE_HEIGHT - 1)
        const theTailLines: EditLine[] = Array.from(Array(nTailLines)).map((each, idx) => ({
            runes: [
                {
                    text: '~' + ' '.repeat(SCREEN_WIDTH - 1),
                    color0: {},
                    isEdit: false,
                    isTail: false,
                },
            ],
            isTail: true,
        }))

        setTailLines(theTailLines)

        let theAllLines = contentLines.concat(theTailLines)
        setAllLines(theAllLines)
        let newEndRowIdx = firstRowIdx + nTailLines

        //console.log('Editor.height update: firstRowIdx:', firstRowIdx, 'newEndRowIdx:', newEndRowIdx)
        setEndRowIdx(newEndRowIdx)
    }, [height, CONSTS.LINE_HEIGHT])

    useEffect(() => {
        //console.log('Editor: useEffect (focusRef, selectedRow): start: focusRef:', focusInputRef.current, 'highlightRow:', highlightRow)
        if (focusInputRef.current === null || highlightRow === -1) {
            return
        }

        if (focusInputRef.current === document.activeElement) {
            return
        }

        //console.log('Editor: useEffect (focusRef, selectedRow): to set focus: selectedStart:', focusInputRef.current.selectionStart, 'selectedEnd:', focusInputRef.current.selectionEnd)

        focusInputRef.current.focus()
    }, [focusInputRef.current, highlightRow, selectedRow, selectedColumn])

    useEffect(() => {
        //console.log('Editor: useEffect (selectedRow, firstRowIdx, endRowIdx): start: selectedRow:', selectedRow, 'firstRowIdx:', firstRowIdx, 'endRowIdx:', endRowIdx)
        if (selectedRow >= firstRowIdx + 1 && selectedRow < endRowIdx - 1) {
            return
        }

        let nRows = endRowIdx - firstRowIdx

        if (selectedRow < firstRowIdx + 2) {
            let toSetScrollRowIdx = firstRowIdx - nRows + 2
            if (toSetScrollRowIdx < 0) {
                toSetScrollRowIdx = 0
            } else if (toSetScrollRowIdx >= contentLines.length + tailLines.length) {
                toSetScrollRowIdx = contentLines.length + tailLines.length - 1
            }
            //console.log('Editor: useEffect (selectedRow, firstRowIdx, endRowIdx): to setScrollRowIdx: toSetScrollRowIdx:', toSetScrollRowIdx)
            setScrollRowIdx(toSetScrollRowIdx)
        } else if (selectedRow >= endRowIdx - 2) {
            let toSetScrollRowIdx = endRowIdx + nRows - 3
            if (toSetScrollRowIdx < 0) {
                toSetScrollRowIdx = 0
            } else if (toSetScrollRowIdx >= contentLines.length + tailLines.length) {
                toSetScrollRowIdx = contentLines.length + tailLines.length - 1
            }
            //console.log('Editor: useEffect (selectedRow, firstRowIdx, endRowIdx): to setScrollRowIdx: toSetScrollRowIdx:', toSetScrollRowIdx)
            setScrollRowIdx(toSetScrollRowIdx)
        }

    }, [selectedRow, firstRowIdx, endRowIdx])

    /*****
     * Context
     */
    let deleteContent = (row: number, col: number) => {
        if (col === 0) {
            if (row === 0) {
                return
            }

            let currentLine = contentLines[row]
            let preContentLines = contentLines.slice(0, row)
            let postContentLines = contentLines.slice(row + 1)
            let newContentLines = preContentLines.concat(postContentLines)
            row--
            col = newContentLines[row].runes.length
            let newLines = attachLine(newContentLines, row, currentLine)
            setContentLines(newLines)
            let theAllLines = newLines.concat(tailLines)
            setAllLines(theAllLines)
            safeSetSelectedRow(row)
            setSelectedColumn(col)
            return
        }

        col--

        deleteContentCore(row, col)
    }

    let deleteContentCore = (row: number, col: number): [EditLine[], number, number] => {
        let lines = contentLines
        if (lines.length <= row) {
            return [lines, row, col]
        }

        // touch line
        let line = lines[row]
        let preRunes = line.runes.slice(0, col)
        let postRunes = line.runes.slice(col + 1)
        let newRunes = preRunes.concat(postRunes)

        console.log('deleteContentCore: row:', row, 'col:', col, 'orig:', line.runes, 'new:', newRunes)

        let [wrapLines, wrapRow, wrapColumn] = runesToWrapLines(newRunes, row, col)

        let newLines = updateLines(lines, row, wrapLines)

        setContentLines(newLines)
        let theAllLines = newLines.concat(tailLines)
        setAllLines(theAllLines)
        setSelectedRow(wrapRow)
        setSelectedColumn(wrapColumn)

        return [newLines, wrapRow, wrapColumn]
    }

    let attachLine = (lines: EditLine[], row: number, currentLine: EditLine): EditLine[] => {
        let theRunes = lines[row].runes
        let theColumn = theRunes.length
        let newRunes = theRunes.concat(currentLine.runes)
        let [wrapLines, wrapRow, wrapColumn] = runesToWrapLines(newRunes, row, theColumn)
        let newLines = updateLines(lines, row, wrapLines)

        return newLines
    }

    let updateContent = (row: number, col: number, text: string): [EditLine[], number, number] => {
        //console.log('Editor.updateContent: start: row:', row, 'col:', col, 'text:', text, 'EDIT_SCREEN_WIDTH:', CONSTS.EDIT_SCREEN_WIDTH)

        // touch lines
        let lines = contentLines
        if (lines.length <= row) {
            lines = insertNewLines(lines, lines.length, row + 1 - lines.length)
        }

        // touch line
        let line = lines[row]
        let runes = textToEditRunes(text)
        let newRunes = updateRunes(line.runes, col, runes)
        let newColumn = col + runes.length

        let [wrapLines, wrapRow, wrapColumn] = runesToWrapLines(newRunes, row, newColumn)
        let newLines = updateLines(lines, row, wrapLines)
        //console.log('Editor.updateContent: after runesToWrapLines: runes:', runes, 'col:', col, 'newRunes:', newRunes, 'row:', row, 'newColumn:', newColumn, 'wrapLines:', wrapLines, 'wrapRow:', wrapRow, 'wrapColumn:', wrapColumn, 'newLines:', newLines)

        setContentLines(newLines)
        let theAllLines = newLines.concat(tailLines)
        setAllLines(theAllLines)
        setSelectedRow(wrapRow)
        setSelectedColumn(wrapColumn)

        return [newLines, wrapRow, wrapColumn]
    }

    let textToEditRunes = (text: string): EditRunes_t => {
        return text.split('').map((each) => ({ text: each, color0: { foreground: COLOR_FOREGROUND_WHITE, backgroud: COLOR_BACKGROUND_BLACK }, isEdit: true, isTail: false }))
    }

    let updateRunes = (runes: EditRunes_t, column: number, newRunes: EditRunes_t): EditRunes_t => {
        let preRunes: EditRunes_t = runes.slice(0, column)
        let postRunes: EditRunes_t = runes.slice(column)
        return preRunes.concat(newRunes).concat(postRunes)
    }

    let insertLines = (lines: EditLine[], row: number, newLines: EditLine[]): EditLine[] => {
        let preLines = lines.slice(0, row)
        let postLines = lines.slice(row)
        return preLines.concat(newLines).concat(postLines)
    }

    let insertNewLines = (lines: EditLine[], startRow: number, nRow: number): EditLine[] => {
        let addLines: EditLine[] = Array.from(Array(nRow)).map(() => ({ runes: [], isTail: false }))
        return insertLines(lines, startRow, addLines)
    }

    let runesToWrapLines = (runes: EditRunes_t, row: number, col: number): [EditLine[], number, number] => {
        let lines: EditLine[] = []
        let wrapRow = 0
        let wrapCol = 0
        let textCount = 0
        let line: EditLine = { runes: [], isTail: false }

        //console.log('Editor.runesToWrapLines: runes:', runes, 'row:', row, 'col:', col)
        let eachRow = row
        runes.map((each, eachColumn) => {
            let eachCount = calcTextCount(each.text)
            if (eachCount === 0) {
                console.log('[ERROR] Editor.runesToWrapLines: text should not be empty: rune:', each.text, 'row:', row, 'col:', col, 'eachColumn:', eachColumn)
                return
            }

            if (textCount + eachCount > CONSTS.EDIT_SCREEN_WIDTH) {
                lines.push(line)
                line = { runes: [], isTail: false }
                textCount = 0
                eachRow++
            }

            line.runes.push(each)
            textCount += eachCount

            // if col < runes.length
            if (eachColumn === col) {
                wrapRow = eachRow
                wrapCol = line.runes.length - 1
            }
        })

        if (line.runes.length > 0 || lines.length === 0) {
            lines.push(line)
        }

        // if col === runes.length
        if (col === runes.length) {
            wrapRow = row + lines.length - 1
            wrapCol = lines[lines.length - 1].runes.length
        }

        return [lines, wrapRow, wrapCol]
    }

    let updateLines = (lines: EditLine[], row: number, newLines: EditLine[]): EditLine[] => {
        let preLines = lines.slice(0, row)
        let postLines = lines.slice(row + 1)
        return preLines.concat(newLines).concat(postLines)
    }

    /*****
     * Cell
     */
    // onMouseDownCell
    let onMouseDownCell = (e: MouseEvent, row: number, col: number) => {
        //console.log('Editor.onMouseDownCell: start: lines:', contentLines.length, 'tailLines:', tailLines.length, 'row:', row, 'col:', col, 'focusInputRef:', focusInputRef.current, 'target:', e.target)
        if (contentLines.length === 0) {
            return
        }
        if (row >= contentLines.length) {
            row = contentLines.length - 1
        }

        let runes = contentLines[row].runes

        // @ts-ignore
        if (e.nativeEvent.offsetX >= e.target.clientWidth / 2 && col < runes.length && !(selectedRow === row && selectedColumn === col + 1)) {

            col++
        }

        // @ts-ignore
        //console.log('Editor.onMouseDownCell: to check runes: lines:', contentLines.length, 'tailLines:', tailLines.length, 'row:', row, 'col:', col, 'e:', e, 'offsetX:', e.nativeEvent.offsetX, 'target.width:', e.nativeEvent.target.clientWidth, 'value:', e.target.innerHTML)

        if (col > runes.length) {
            console.log('[ERROR] Editor.onMouseDownCell: col > runes.length: row:', row, 'col:', col, 'runes.length:', runes.length)
            col = runes.length
        }

        //console.log('Editor.onMouseDownCell: to set: lines:', contentLines.length, 'tailLines:', tailLines.length, 'row:', row, 'col:', col)

        safeSetSelectedRow(row)
        setSelectedColumn(col)

        if (focusInputRef.current === null) {
            return
        }

        setInputWidth(1)
        focusInputRef.current.value = ''
    }

    // renderCell
    let renderCell = (column: PttColumn, data: TableData<any>, fontSize: number, lineHeight: number) => {
        let renderer = null

        // assume that we will need to use different highlight for different cell
        let defaultHighlight = {
            backgroundColor: '#333',
        }

        switch (column.accessor) {
            case 'runes':
                renderer = Edit
                break
            default:
                renderer = () => (<Cell className={screenStyles['default']} />)
        }

        let isFocus = highlightRow !== -1

        return <RowHighlightedCell
            column={column}
            data={data}
            fontSize={fontSize}
            lineHeight={lineHeight}
            content={renderer}
            setRowNum={safeSetHightlightRow}
            highlightRow={highlightRow}
            highlightStyle={defaultHighlight}

            selectedRow={selectedRow}
            setSelectedRow={safeSetSelectedRow}
            selectedColumn={selectedColumn}
            setSelectedColumn={setSelectedColumn}
            newLine={newLine}
            onMouseDownCell={onMouseDownCell}
            onMouseDownTail={onMouseDownTail}
            upLine={upLine}
            nextLine={nextLine}
            isFocus={isFocus}
            focusInputRef={focusInputRef}

            updateContent={updateContent}
            deleteContent={deleteContent}

            inputWidth={inputWidth}
            setInputWidth={setInputWidth}

            leftColumn={leftColumn}
            rightColumn={rightColumn}
        />
    }

    /*****
     * Screen
     */
    let onScrollEnd = (x: number, y: number, newFirstRowIdx: number, newEndRowIdx: number) => {
        //console.log('Editor.onScrollEnd: x:', x, 'y:', y, 'firstRowIndex:', firstRowIdx, 'endRowIndex:', endRowIdx, 'newFirstRowIndex:', newFirstRowIdx, 'newEndRowIndex:', newEndRowIdx, 'selectedRow:', selectedRow, 'scrollRowIdx:', scrollRowIdx)

        setFirstRowIdx(newFirstRowIdx)
        setEndRowIdx(newEndRowIdx)

        let theNewFirstRowIdx = newFirstRowIdx < contentLines.length - 1 ? (newFirstRowIdx + 1) : newFirstRowIdx

        // not from auto newline / auto-up / auto-down
        if (scrollRowIdx === null) {
            if (newFirstRowIdx < firstRowIdx || selectedRow < newFirstRowIdx) {
                //console.log('Editor.onScrollEnd: to safeSetSelectedRow: selctedRow:', selectedRow, 'newRow:', theNewFirstRowIdx, 'contentLines:', contentLines.length)
                safeSetSelectedRow(theNewFirstRowIdx)
            } else if (selectedRow >= newEndRowIdx) {
                //console.log('Editor.onScrollEnd: to safeSetSelectedRow: selctedRow:', selectedRow, 'newRow:', theNewFirstRowIdx, 'contentLines:', contentLines.length)
                safeSetSelectedRow(theNewFirstRowIdx)
            }
        }

        setScrollRowIdx(null)

        //console.log('Editor.onScrollEnd: done')
    }

    return (
        <div>
            <Screen width={width} height={height} columns={_COLUMNS} data={allLines} renderCell={renderCell} onScrollEnd={onScrollEnd} scrollToRow={scrollRowIdx} />
        </div>
    )
}
