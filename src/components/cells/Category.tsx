import { TableData } from "../../types"

type Props = {
    data: TableData
    rowIndex: number
    columnKey: string
}

export default (props: Props) => {
    const { data, rowIndex, columnKey } = props
    let item = data[rowIndex]

    let text = item[columnKey] || ''
    if (text === '') {
        text = '其他'
    }

    return (<div>{'[' + text + ']'}</div>)
}
