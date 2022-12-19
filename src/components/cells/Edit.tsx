import { ChangeEvent, Dispatch, FocusEvent, KeyboardEvent, MouseEvent, MutableRefObject, SetStateAction } from 'react'

import styles from './ContentRenderer.module.css'

import { COLOR_FOREGROUND_WHITE, COLOR_BACKGROUND_BLACK } from '../../constants'
import { EDIT_SCREEN_WIDTH } from '../utils'

import Rune from './Rune'
import { Rune_t, Runes_t, TableData } from '../../types'
import { getClassNamesFromRune } from './utils'

type Props = {
    data: TableData
    rowIndex?: number
    columnKey?: string
    selectedRow?: number
    isFocus?: boolean
    onMouseDown?: (e: MouseEvent, rowIndex: number, idx: number) => void
    selectedColumn: number
    focusRef: MutableRefObject<HTMLSpanElement | null>
    lengthRef: MutableRefObject<HTMLSpanElement | null>
    editWidth: number
    updateText: (selectedRow: number | undefined, selectedColumn: number, text: string) => void
    newLine: () => void
    upLine: () => void
    nextLine: () => void
    isCtrl: boolean
    setIsCtrl: Dispatch<SetStateAction<boolean>>
    submit: () => void
}

export const Edit = (props: Props) => {
    let { data, rowIndex, columnKey, selectedRow, isFocus } = props
    rowIndex = rowIndex || 0
    columnKey = columnKey || ''
    isFocus = isFocus || false
    let runes: Runes_t = data[rowIndex][columnKey]
    let tail = _calcTail(runes)
    if (tail !== null) {
        runes = runes.concat([tail])
    }

    let Render = (!isFocus || rowIndex !== selectedRow) ? Rune : EditCore

    let background = data[rowIndex].background || COLOR_BACKGROUND_BLACK
    return (
        <div key={'edit-' + rowIndex} className={styles['c' + background]}>
            {runes.map((each, idx) => (<Render key={'edit-' + idx} rune={each} idx={idx} {...props} />))}
        </div>
    )
}

const _calcTail = (runes: Runes_t) => {
    let count = runes.reduce((r, x, i) => {
        r += _calcEachRune(x.text)
        return r
    }, 0)

    let n = EDIT_SCREEN_WIDTH - count
    if (n <= 0) {
        return null
    }
    let text = [...Array(n)].map(() => ' ').join('')
    return { text, color0: { foreground: COLOR_FOREGROUND_WHITE, background: COLOR_BACKGROUND_BLACK } }
}

const _calcEachRune = (text: string) => {
    let count = text.split('').reduce((r, x, i) => {
        if (x >= ' ' && x <= '~') {
            return r + 1
        }
        return r + 2
    }, 0)
    return count
}

type EditCoreProps = {
    rune: Rune_t
    idx: number
    selectedRow?: number
    selectedColumn: number
    focusRef: MutableRefObject<HTMLSpanElement | null>
    lengthRef: MutableRefObject<HTMLSpanElement | null>
    editWidth: number
    onMouseDown?: (e: MouseEvent, rowIndex: number, idx: number) => void
    updateText: (selectedRow: number | undefined, selectedColumn: number, text: string) => void
    newLine: () => void
    upLine: () => void
    nextLine: () => void
    isCtrl: boolean
    setIsCtrl: Dispatch<SetStateAction<boolean>>
    submit: () => void
}

const EditCore = (props: EditCoreProps) => {
    let { rune, idx, selectedRow, selectedColumn, focusRef, lengthRef, editWidth, updateText, newLine, onMouseDown, upLine, nextLine, setIsCtrl, isCtrl, submit } = props

    if (idx !== selectedColumn) {
        return (<Rune rune={rune} rowIndex={selectedRow} idx={idx} onMouseDown={onMouseDown} />)
    }

    let [classNames0] = getClassNamesFromRune(rune)
    if (rune.pullright) {
        classNames0.push(styles['pull-right'])
    }
    classNames0.push(styles['input'])

    let theStyles = {
        width: editWidth,
    }

    let onChangeText = (e: ChangeEvent) => {
        if (!e.target) {
            return
        }
        // @ts-ignore
        updateText(selectedRow, selectedColumn, e.target.value)
    }

    let onKeyDown = (e: KeyboardEvent) => {
        if (e.nativeEvent.isComposing) {
            return
        }

        switch (e.key) {
            case 'Control':
                setIsCtrl(true)
                break
            case 'Enter':
                newLine()
                break
            case 'ArrowUp':
                upLine()
                break
            case 'ArrowDown':
                nextLine()
                break
            case 'x': //Ctrl-x
                if (isCtrl) {
                    submit()
                }
                break
            case 'X': //Ctrl-x
                if (isCtrl) {
                    submit()
                }
                break
            default:
                break
        }
    }

    let onKeyUp = (e: KeyboardEvent) => {
        switch (e.key) {
            case 'Control':
                setIsCtrl(false)
                break
            default:
                break
        }
    }

    let onFocus = (e: FocusEvent) => {
    }

    let onFocusSpan = (e: FocusEvent) => {
    }

    let onBlur = (e: FocusEvent) => {
    }

    let onBlurSpan = (e: FocusEvent) => {
        if (!focusRef.current) {
            return
        }
        focusRef.current.focus()
    }

    let className0 = classNames0.join(' ')
    let coreKey = 'edit-core-' + selectedRow + '-' + idx
    let focusKey = 'edit-core-input-' + selectedRow + '-' + idx
    let lengthKey = 'edit-core-length-' + selectedRow + '-' + idx
    return (
        <span key={coreKey} ref={focusRef} className={className0} onBlur={onBlurSpan} onFocus={onFocusSpan}>
            <input key={focusKey} className={className0} value={rune.text} style={theStyles} onChange={onChangeText} onKeyDown={onKeyDown} onKeyUp={onKeyUp} onBlur={onBlur} onFocus={onFocus} />
            <span key={lengthKey} ref={lengthRef} className={styles['calc']}>{rune.text}</span>
        </span>
    )
}
