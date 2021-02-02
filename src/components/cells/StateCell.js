import { Cell } from 'fixed-data-table-2'
import styles from './Cell.module.css'

export default (props) => {
  const {data, fontSize, rowIndex, columnKey} = props

  let item = data[rowIndex]

  let style = {
    'font-size': fontSize + 'px',
  }

  let marker = (item[columnKey] === true) ? '+' : ''

  return(
    <Cell className={styles['text']} style={style}>{marker}</Cell>
  )
}