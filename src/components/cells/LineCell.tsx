import { Cell } from 'fixed-data-table-2'
import { PttColumn, TableData } from '../../types'
import Empty from '../Empty'

type Props = {
    data: TableData<any>
    fontSize: number
    rowIndex?: number
    columnKey?: string
    column: PttColumn
}

export default (props: Props) => {
    const { data, fontSize, rowIndex, columnKey } = props

    // @ts-ignore
    let item = data[rowIndex]
    let renderLine = item[columnKey]

    return (
        <Cell>{renderLine(data, fontSize, rowIndex, columnKey)}</Cell>
    )
}
