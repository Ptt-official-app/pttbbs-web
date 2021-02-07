import styles from './ContentRenderer.module.css'

export const PlainText = (props) => {
  const {data, rowIndex, columnKey} = props
  let text = data[rowIndex][columnKey]

  return text
}

export const PostDate = (props) => {
  const {data, rowIndex, columnKey} = props
  let item = data[rowIndex]
  let date = new Date(item[columnKey])

  let month = date.getMonth() + 1
  let day = date.getDay()
  let text =  month.toString() + "/" + day.toString()

  return text
}

export const Idx = (props) => {
  const {data, rowIndex, columnKey} = props
    let item = data[rowIndex]
    let text = item[columnKey]

    return (<div className={styles['idx']}>{text}</div>)
}

export const State = (props) => {
  const {data, rowIndex, columnKey} = props

  let item = data[rowIndex]
  let text = (item[columnKey] === true) ? '+' : '-'

  let style = {
      'color' : (item[columnKey] === true) ? '#fff' : '#000'
  }
  return (
    <div style={style}>{text}</div>
  )
}

export const CommNum = (props) => {
  const {data, rowIndex, columnKey} = props

  let item = data[rowIndex]
  let color = 'green'

  let text = item[columnKey] || 0
  let num = parseInt(text)
  if(num === 0) {
    return (<div></div>)
  }
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
    'color': color,
  }

  return (
    <div style={style}>{text}</div>
  )
}

export const Category = (props) => {
  const {data, rowIndex, columnKey} = props
  let item = data[rowIndex]

  let text = item[columnKey] || ''
  if(text === '') {
    return ''
  }

  return '[' + text + ']'
}
