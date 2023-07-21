import { TableData } from '../../types'
import { Cell } from 'fixed-data-table-2'
import Empty from '../Empty'

type Props = {
    data: TableData<any>
    rowIndex?: number
    columnKey?: string | number
    fontSize: number
    content: any
    setRowNum: any
    highlightRow?: number
    [key: string]: any
}

export default (props: Props) => {
    const { data, fontSize, rowIndex, columnKey, content: Content, setRowNum, highlightRow, highlightStyle, ...params } = props

    let style = {
        display: 'block',
        height: '100%',
        fontSize: fontSize + 'px'
    }
    if (typeof rowIndex === 'undefined') { // for ts
        return (<Empty />)
    }

    if (rowIndex === highlightRow) {
        style = { ...style, ...highlightStyle }
    }

    let link = data[rowIndex].url

    return (
        <a href={link} style={style}>
            <Cell style={style}
                onMouseEnter={() => setRowNum(rowIndex)}
                onMouseLeave={() => setRowNum(-1)}>
                <Content data={data} rowIndex={rowIndex} columnKey={columnKey} {...params} />
            </Cell>
        </a>
    )
}
