import { Cell } from 'fixed-data-table-2'
import styles from './Cell.module.css'

export default (props) => {
  const {data, fontSize, rowIndex, columnKey} = props

  let item = data[rowIndex]
  let color = 'green'

  let text = item[columnKey]
  let num = parseInt(text)
  if (Number.isInteger(num)) {
    if (num > 9) {
      color = 'yellow'
    }
    if (num > 99) {
      color = 'red'
      text = '爆'
    }
  }

  let style = {
    'font-size': fontSize + 'px',
    'color': color,
  }

  return(
    <Cell className={styles['text']} style={style}>{text}</Cell>
  )
}