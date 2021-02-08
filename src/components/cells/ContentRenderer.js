import styles from './ContentRenderer.module.css'
import moment from 'moment'

export const PlainText = (props) => {
  const {data, rowIndex, columnKey} = props
  let text = data[rowIndex][columnKey]

  return (<div>{text}</div>)
}

export const PostDate = (props) => {
  const {data, rowIndex, columnKey} = props
  let item = data[rowIndex]
  let text = moment(item[columnKey] * 1000).format('MM/DD') //js is milli-ts based.

  return (<div>{text}</div>)
}

export const Idx = (props) => {
  const {data, rowIndex, columnKey, loadPre, loadNext} = props
  let item = data[rowIndex]
  let text = item[columnKey]

  if(rowIndex === 0 && loadPre) {
    loadPre(item)
  }
  if(rowIndex === data.length - 1 && loadNext) {
    loadNext(item)
  }

  return (<div className={styles['idx']}>{text}</div>)
}

export const State = (props) => {
  const {data, rowIndex, columnKey} = props

  let item = data[rowIndex]
  let text = (item[columnKey] === true) ? '+' : ''

  let style = {
    color : (item[columnKey] === true) ? '#fff' : '#000'
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
    color: color,
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

  return (<div>{'[' + text + ']'}</div>)
}

export const Moderators = (props) => {
  const {data, rowIndex, columnKey} = props

  let item = data[rowIndex]

  return(<div>{item[columnKey].join('/')}</div>)
}