import { Cell } from 'fixed-data-table-2'

export default (props) => {
  const {data, fontSize, rowIndex, columnKey} = props

  let item = data[rowIndex]
  let renderLine = item[columnKey]

  return(
    <Cell>{renderLine(data, fontSize, rowIndex, columnKey)}</Cell>
  )
}
