import { ChangeEvent, ChangeEventHandler, Dispatch, FocusEvent, KeyboardEvent, MouseEvent, MutableRefObject, SetStateAction } from 'react'

import { EditLine, EditRune_t, EditRunes_t, TableData } from '../../types'
import { calcTextCount, getClassNamesFromRune } from './utils'
import { CONSTS } from '../utils'

import styles from './ContentRenderer.module.css'

import Rune from './Rune'
import { cursorTo } from 'readline'


type Props = {
    rune: EditRune_t
    idx: number

    rowIndex?: number
    selectedRow: number
    selectedColumn: number
    newLine: () => void
    upLine: () => number
    nextLine: () => number
    submit: () => void
    isFocus?: boolean

    focusInputRef: MutableRefObject<HTMLInputElement | null>

    updateContent: (row: number, col: number, text: string) => void
    deleteContent: (row: number, col: number) => void

    inputWidth: number
    setInputWidth: Dispatch<SetStateAction<number>>

    onMouseDown?: (e: MouseEvent, rowIndex: number, idx: number) => void

    leftColumn: () => number
    rightColumn: () => number
}

export default (props: Props) => {
    let { rune, idx, rowIndex, selectedRow, selectedColumn, updateContent, newLine, upLine, nextLine, submit, focusInputRef, isFocus, deleteContent, inputWidth, setInputWidth, onMouseDown, leftColumn, rightColumn } = props

    let text = rune.isTail ? '' : rune.text

    console.log('EditCell: rune.isTail:', rune.isTail, 'rune.text:', rune.text || '', 'text:', text)

    let [classNames0] = getClassNamesFromRune(rune)
    if (rune.pullright) {
        classNames0.push(styles['pull-right'])
    }
    classNames0.push(styles['input'])

    let theStyles = {
        width: inputWidth + 'px',
    }

    let onChangeText: ChangeEventHandler = (e) => {
        if (!e.target) {
            return
        }
        // @ts-ignore
        //console.log('EditCell.onChangeText: start: value:', e.target.value)
        // @ts-ignore
        //updateText(selectedRow, selectedColumn, e.target.value)
    }

    let onKeyDownInput = (e: KeyboardEvent) => {
        console.log('EditCell.onKeyDownInput: e:', e, 'isComposing:', e.nativeEvent.isComposing, 'focus:', document.activeElement, 'key:', e.key, 'key.length:', e.key.length, 'altKey:', e.altKey, 'ctrlKey:', e.ctrlKey, 'shiftKey:', e.shiftKey, 'metaKey:', e.metaKey, 'isComposing:', e.nativeEvent.isComposing, 'value:', focusInputRef.current?.value)

        if (focusInputRef.current === null) {
            return
        }

        let valueCount = calcTextCount(focusInputRef.current.value)
        let keyCount = e.key.length === 1 ? calcTextCount(e.key) : 0
        let newInputWidth = (valueCount + keyCount) * CONSTS.CHAR_WIDTH
        if (newInputWidth < 1) {
            newInputWidth = 1
        }
        //console.log('EditCell.onKeyDownInput: to setInputWidth:', 'input:', focusInputRef.current.value, 'textCount:', valueCount, 'newInputWidth:', newInputWidth)

        if (e.nativeEvent.isComposing) {
            switch (e.key) {
                case 'Enter':
                    console.log('EditCell.onKeyDownInput: to set Enter: value:', focusInputRef.current.value)
                    /*
                    updateContent(selectedRow, selectedColumn, focusInputRef.current.value)
                    focusInputRef.current.value = ''
                    focusInputRef.current.defaultValue = ''
                    setInputWidth(1)
                    */
                    setInputWidth(newInputWidth)
                    break
                default:
                    setInputWidth(newInputWidth)
                    break
            }
            return
        }

        setInputWidth(newInputWidth)

        let isCtrl = e.ctrlKey || e.metaKey

        switch (e.key) {
            case 'Meta':
                break
            case 'Control':
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
            case 'ArrowLeft':
                leftColumn()
                break
            case 'ArrowRight':
                rightColumn()
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

    let onKeyUpInput = (e: KeyboardEvent) => {
        // @ts-ignore
        //console.log('EditCell.onKeyUpInput: start: e.key', e.key, 'isComposing:', e.nativeEvent.isComposing, 'value:', e.target.value, 'focusInput.value:', focusInputRef.current.value, 'selectionStart:', focusInputRef.current?.selectionStart, 'selectionEnd:', focusInputRef.current?.selectionEnd, 'altKey:', e.altKey, 'ctrlKey:', e.ctrlKey, 'shiftKey:', e.shiftKey, 'metaKey:', e.metaKey)
        if (focusInputRef.current === null) {
            return
        }

        let textCount = calcTextCount(focusInputRef.current.value)
        let newInputWidth = (textCount) * CONSTS.CHAR_WIDTH
        if (newInputWidth < 1) {
            newInputWidth = 1
        }
        //console.log('EditCell.onKeyUpInput: to setInputWidth:', 'input:', focusInputRef.current.value, 'textCount:', textCount, 'newInputWidth:', newInputWidth)
        setInputWidth(newInputWidth)

        if (e.nativeEvent.isComposing) {
            return
        }

        switch (e.key) {
            case 'Alt':
                return
            case 'CapsLock':
                return
            case 'Shift':
                return
            case 'Super':
                return
            case 'Meta':
                //setIsCtrl(false)
                break
            case 'Control':
                //setIsCtrl(false)
                break
            case 'Enter':
                return
            case 'Tab':
                return
            case 'ArrowDown':
                return
            case 'ArrowLeft':
                return
            case 'ArrowRight':
                return
            case 'ArrowUp':
                return
            case 'End':
                return
            case 'Home':
                return
            case 'PageDown':
                return
            case 'PageUp':
                return
            case 'Backspace':
                deleteContent(selectedRow, selectedColumn)
                return
            case 'Clear':
                return
            case 'Delete':
                deleteContent(selectedRow, selectedColumn)
                return
            default:
                break
        }

        if (focusInputRef.current.value === '') {
            return
        }

        updateContent(selectedRow, selectedColumn, focusInputRef.current.value)
        let runeCount = calcTextCount(text)
        newInputWidth = runeCount * CONSTS.CHAR_WIDTH
        if (newInputWidth < 1) {
            newInputWidth = 1
        }
        //console.log('EditCell.onKeyUpInput: after updateContent: to setInputWidth: text:', text, 'runeCount:', runeCount, 'newInputWidth:', newInputWidth)
        setInputWidth(newInputWidth)
    }

    let onFocusInput = (e: FocusEvent) => {
        //console.log('EditCell.onFocusInput: start: e:', e.target)
    }

    let onBlurInput = (e: FocusEvent) => {
        //console.log('EditCell.onBlurInput: start')
        if (isFocus && focusInputRef.current) {
            focusInputRef.current.focus()
        }
    }

    let _onMouseDown = (e: MouseEvent) => {
        if (!onMouseDown) {
            return
        }

        rowIndex = rowIndex || 0
        onMouseDown(e, rowIndex, idx)
    }

    console.log('EditCell: to render: rowIndex:', rowIndex, 'idx:', idx, 'classNames0:', classNames0, 'text:', text, 'inputWidth:', inputWidth, 'selectStart:', focusInputRef.current?.selectionStart, 'selectEnd:', focusInputRef.current?.selectionEnd)

    let className0 = classNames0.join(' ')
    let cellKey = 'edit-cell-' + selectedRow + '-' + idx
    let inputKey = 'edit-cell-input-' + selectedRow + '-' + idx
    return (
        <>
            <input key={inputKey} type='text' ref={focusInputRef} className={className0} style={theStyles} onChange={onChangeText} onBlur={onBlurInput} onFocus={onFocusInput} onKeyDown={onKeyDownInput} onKeyUp={onKeyUpInput} onMouseDown={_onMouseDown} />
            <span>{text}</span>
        </>
    )
}
