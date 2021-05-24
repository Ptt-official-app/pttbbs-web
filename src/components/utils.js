import moment from 'moment'

export const TSToDateTimeStr = (ts) => {
  return moment.unix(ts).format('YYYY-MM-DD hh:mm:ss')
}

//board-list: 特殊記號+已讀+看板+類別+種類+中文敘述+人氣+板主
export const CHAR_WIDTH = 11

export const SCREEN_WIDTH = 90
export const EDIT_SCREEN_WIDTH = 80

export const BASE_COLUMN_WIDTH = CHAR_WIDTH*SCREEN_WIDTH

export const BASE_LINE_HEIGHT = 30

const MAX_SCALE = 1.2

const FONT_SIZE_SCALE = 0.70

export const CalcScreenScale = (width) => {
  let scale = width / BASE_COLUMN_WIDTH
  scale = scale < MAX_SCALE ? scale : MAX_SCALE

  let lineHeight = parseInt(BASE_LINE_HEIGHT * scale)

  let fontSize = parseInt(lineHeight * FONT_SIZE_SCALE)

  return [scale, lineHeight, fontSize]
}

export const GetBoardParent = () => {
  //TODO: imagine that there should be a session data remembering the last board list visited
  // If the board is visited directly by url there will be no record => return ""
  console.log("GetBoardParent:")
  return ""
}