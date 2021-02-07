import { Cell } from 'fixed-data-table-2'
import styles from './Cell.module.css'

export default (props) => {
  const {data, fontSize, rowIndex, columnKey} = props

  let item = data[rowIndex]

  let style = {
    fontSize: fontSize + 'px',
  }

  return(
    <Cell className={styles['text']} style={style}>{item[columnKey].join('/')}</Cell>
  )
}
