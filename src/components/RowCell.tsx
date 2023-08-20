import { Cell } from 'fixed-data-table-2'
import { TableData } from '../types'
import CSS from 'csstype'
import Empty from './Empty'

type Props = {
    data: TableData<any>
    fontSize: number
    rowIndex?: number
    columnKey?: string | number
    content: JSX.Element
    setRowNum: Function
    highlightRow: number
    highlightStyle: CSS.Properties
    [key: string]: any
}

export default (props: Props) => {
    const { data, fontSize, rowIndex, columnKey, content: Content, setRowNum, highlightRow, highlightStyle, ...params } = props

    // @ts-ignore
    let render = () => (<Content data={data} rowIndex={rowIndex} columnKey={columnKey} {...params} />)

    let style: CSS.Properties = {
        display: 'block',
        height: '100%',
        fontSize: fontSize + 'px',
    }
    if (!rowIndex) {
        return (<Empty />)
    }

    if (rowIndex === highlightRow) {
        // assume that we will need to use different highlight for different cell
        style = { ...style, ...highlightStyle }
    }

    let link = data[rowIndex]['url']

    return (
        <a href={link} style={style}>
            <Cell style={style}>
                {render()}
            </Cell>
        </a>
    )
}