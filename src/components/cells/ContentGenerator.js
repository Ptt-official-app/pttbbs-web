export const GenPlainText = (data, rowIndex, columnKey) => {
    let text = data[rowIndex][columnKey]

    let style = {}
    return {style, text}
}

export const GenDate = (data, rowIndex, columnKey) => {

    let item = data[rowIndex]
    let date = new Date(item[columnKey])

    let month = date.getMonth() + 1
    let day = date.getDay()
    let text =  month.toString() + "/" + day.toString()

    let style = {}
    return {style, text}
}

export const GenIdx = (data, rowIndex, columnKey) => {
    let idx = rowIndex + 1
    let text = idx.toString()
    let style = {}
    return {style, text}
}

export const GenState = (data, rowIndex, columnKey) => {
    let item = data[rowIndex]
    let text = (item[columnKey] === true) ? '+' : '-'

    let style = {
        'color' : (item[columnKey] === true) ? '#fff' : '#000'
    }
    return {style, text}
}

export const GenCommNum = (data, rowIndex, columnKey) => {
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

  return {style, text}
}

export const GenCategory = (data, rowIndex, columnKey) => {
  let item = data[rowIndex]
  let text = '[' + item[columnKey] + ']'

  let style = {}
  return {style, text}
}



