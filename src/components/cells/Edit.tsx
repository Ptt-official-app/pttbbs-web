import { ChangeEvent, Dispatch, FocusEvent, KeyboardEvent, MouseEvent, MutableRefObject, SetStateAction, LegacyRef } from 'react'

import styles from './ContentRenderer.module.css'

import { COLOR_FOREGROUND_WHITE, COLOR_BACKGROUND_BLACK } from '../../constants'
import { EDIT_SCREEN_WIDTH, SCREEN_WIDTH } from '../utils'

import EditCell from './EditCell'

import Rune from './Rune'
import { EditLine, EditRune_t, EditRunes_t, TableData } from '../../types'
import { calcRunesCount, getClassNamesFromRune } from './utils'

import { CSSProperties } from 'react'

type Props = {
    data: TableData<EditLine>
    rowIndex?: number
    columnKey?: string
    selectedRow: number
    isFocus?: boolean
    onMouseDownCell?: (e: MouseEvent, rowIndex: number, idx: number) => void
    onMouseDownTail?: (e: MouseEvent, rowIndex: number, idx: number) => void
    selectedColumn: number
    newLine: () => void
    upLine: () => number
    nextLine: () => number
    isCtrl: boolean
    setIsCtrl: Dispatch<SetStateAction<boolean>>
    submit: () => void

    focusInputRef: MutableRefObject<HTMLInputElement | null>

    updateContent: (row: number, col: number, text: string) => void
    deleteContent: (row: number, col: number) => void

    inputWidth: number
    setInputWidth: Dispatch<SetStateAction<number>>

    leftColumn: () => number
    rightColumn: () => number
}

export default (props: Props) => {
    let { data, rowIndex, columnKey, selectedRow, selectedColumn, isFocus, focusInputRef, onMouseDownCell, onMouseDownTail } = props
    rowIndex = rowIndex || 0
    columnKey = columnKey || ''
    isFocus = isFocus || false
    let item: EditLine = data[rowIndex]
    let runes: EditRunes_t = item.runes
    let background = data[rowIndex].background || COLOR_BACKGROUND_BLACK

    //console.log('Edit: rowIndex:', rowIndex, 'item:', item, 'isTail:', item.isTail)

    if (item.isTail) {
        //console.log('Edit: rowIndex:', rowIndex, 'to render tail')
        return <div key={'edit-' + rowIndex} className={styles['c' + background]}>
            {runes.map((each, idx) => (<Rune key={'edit-' + idx} rune={each} idx={idx} onMouseDown={onMouseDownTail} {...props} />))}
        </div>
    }

    let tail = _calcTail(runes)
    if (tail !== null) {
        runes = runes.concat([tail])
    }

    //console.log('Edit: rowIndex:', rowIndex, 'selectedRow:', selectedRow, 'selectedColumn:', selectedColumn, 'tail:', tail, 'runes:', runes, 'isFocus:', isFocus, 'focusInputRef:', focusInputRef.current, 'activeElement:', document.activeElement, 'focusInputRef.current === activeElement', focusInputRef.current === document.activeElement)

    let render = (rune: EditRune_t, idx: number) => {
        let isRune = rowIndex !== selectedRow || idx !== selectedColumn
        let Render = isRune ? Rune : EditCell

        return (<Render key={'edit-' + idx} rune={rune} idx={idx} onMouseDown={onMouseDownCell} {...props} />)
    }

    let theStyle: CSSProperties = {
        whiteSpace: 'nowrap',
        overflowX: 'visible',
    }

    return (
        <div key={'edit-' + rowIndex} className={styles['c' + background]} style={theStyle}>
            {runes.map((each, idx) => render(each, idx))}
        </div>
    )
}

const _calcTail = (runes: EditRunes_t): EditRune_t | null => {
    let count = calcRunesCount(runes)

    let n = SCREEN_WIDTH - count
    if (n < 0) {
        n = 0
    }

    return { text: ' '.repeat(n), color0: { foreground: COLOR_FOREGROUND_WHITE, background: COLOR_BACKGROUND_BLACK }, isEdit: false, isTail: true }
}
