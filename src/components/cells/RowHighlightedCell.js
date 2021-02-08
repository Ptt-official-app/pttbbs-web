import { Cell } from 'fixed-data-table-2'

export default (props) => {
  const {data, fontSize, rowIndex, columnKey, content: Content, setRowNum, highlightRow, highlightStyle} = props

  let render = () => (<Content data={data} rowIndex={rowIndex} columnKey={columnKey} />)

  let style = {
    display : 'block',
    height : '100%',
    fontSize: fontSize + 'px',
  }

  if (rowIndex === highlightRow) {
    // assume that we will need to use different highlight for different cell
    style = {...style, ...highlightStyle}
  }

  let link = data[rowIndex]['url']

  return (
    <a href={link} style={style}>
      <Cell style={style}
        onMouseEnter={() => setRowNum(rowIndex)}
        onMouseLeave={() => setRowNum(-1)} >
          {render()}
      </Cell>
    </a>
  )
}