import { Cell } from 'fixed-data-table-2'
import styles from './Cell.module.css'

export default (props) => {
  const {data, fontSize, rowIndex, columnKey} = props

  let style = {
    'font-size': fontSize + 'px',
  }

  return(
    <Cell className={styles['text']} style={style}>{rowIndex + 1}</Cell>
  )
}