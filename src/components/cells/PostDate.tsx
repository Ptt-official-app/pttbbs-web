import moment from 'moment'
import { TableData } from '../../types'

type Props = {
    data: TableData
    rowIndex: number
    columnKey: string
}

export default (props: Props) => {
    const { data, rowIndex, columnKey } = props
    let item = data[rowIndex]
    let text = moment(item[columnKey] * 1000).format('MM/DD') //moment is milli-ts based.

    return (<div>{text}</div>)
}
