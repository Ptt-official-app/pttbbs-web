import { Cell } from 'fixed-data-table-2'
import styles from './Cell.module.css'

export default (props) => {
  const {data, fontSize, rowIndex, columnKey} = props

  let item = data[rowIndex]
  let date = new Date(item[columnKey])

  let style = {
    'font-size': fontSize + 'px',
  }

  return(
    <Cell className={styles['text']} style={style}>
      {date.getMonth()+1}/{date.getDate()}
    </Cell>
  )
}