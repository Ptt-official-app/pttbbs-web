import styles from './ContentRenderer.module.css'
import { COLOR_BACKGROUND_BLACK } from "../../constants"
import { Runes_t } from '../../types'
import { MouseEvent } from 'react'

import Rune from './Rune'

type Props = {
    data: any
    fontSize: number
    rowIndex: number
    columnKey: string
    loadPre?: (arg0: any) => void
    loadNext?: (arg0: any) => void
    onMouseDown?: (e: MouseEvent) => void
}

export default (props: Props) => {
    const { data, rowIndex, columnKey, loadPre, loadNext, onMouseDown } = props
    let item = data[rowIndex]
    let runes: Runes_t[] = item[columnKey] || []
    let background = item.background || COLOR_BACKGROUND_BLACK

    if (rowIndex === 0 && loadPre) {
        loadPre(item)
    }
    if (rowIndex === data.length - 1 && loadNext) {
        loadNext(item)
    }

    return (
        <div className={styles['c' + background]}>
            {runes.map((each, idx) => (<Rune key={'runes-' + idx} rune={each} rowIndex={rowIndex} idx={idx} onMouseDown={onMouseDown} />))}
        </div>
    )
}
