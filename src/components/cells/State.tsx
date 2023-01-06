import { TableData } from '../../types'

type Props = {
    data: TableData
    rowIndex: number
    columnKey: string
}

export default (props: Props) => {
    const { data, rowIndex, columnKey } = props

    let item = data[rowIndex]
    let text = (item[columnKey] === true) ? '+' : ''

    let style = {
        color: (item[columnKey] === true) ? '#fff' : '#000'
    }
    return (
        <div style={style}>{text}</div>
    )
}