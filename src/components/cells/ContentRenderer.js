export const PlainText = (data, rowIndex, columnKey) => {
    let text = data[rowIndex][columnKey]

    return text
}

export const PostDate = (data, rowIndex, columnKey) => {

    let item = data[rowIndex]
    let date = new Date(item[columnKey])

    let month = date.getMonth() + 1
    let day = date.getDay()
    let text =  month.toString() + "/" + day.toString()

    return text
}

export const Idx = (data, rowIndex, columnKey) => {
    let idx = rowIndex + 1
    let text = idx.toString()
    return text
}

export const State = (data, rowIndex, columnKey) => {
    let item = data[rowIndex]
    let text = (item[columnKey] === true) ? '+' : '-'

    let style = {
        'color' : (item[columnKey] === true) ? '#fff' : '#000'
    }
    return (
      <div style={style}>{text}</div>
    )
}

export const CommNum = (data, rowIndex, columnKey) => {
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
    'color': color,
  }

    return (
      <div style={style}>{text}</div>
    )
}

export const Category = (data, rowIndex, columnKey) => {
  let item = data[rowIndex]
  let text = '[' + item[columnKey] + ']'

  return text
}



