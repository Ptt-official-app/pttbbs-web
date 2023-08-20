import { TableData } from '../../types'

type Props = {
    data: TableData<any>
    rowIndex: number
    columnKey: string

}

export default (props: Props) => {
    const { data, rowIndex, columnKey } = props

    let item = data[rowIndex]
    let moderators = item[columnKey] || []
    return (<div>{moderators.join('/')}</div>)
}
