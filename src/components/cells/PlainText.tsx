import { TableData } from '../../types'

type Props = {
    data: TableData<any>
    rowIndex: number
    columnKey: string
}

export default (props: Props) => {
    const { data, rowIndex, columnKey } = props
    let text = data[rowIndex][columnKey]

    return (<div>{text}</div>)
}
