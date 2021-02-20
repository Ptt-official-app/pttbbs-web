import { NBRD_LINE, NBRD_FAV, NBRD_BOARD, NBRD_FOLDER } from '../constants'

export const GoUserHome = (userID) => {
  window.location.href = '/user/' + userID
}

export const GoHome = () => {
  window.location.href = '/'
}

export const MergeList = (origList, newList, desc, startNumIdx, isExclude) => {
  if(isExclude) { //desc not include start-item
    newList = newList.slice(1)
  }

  if(newList.length === 0) {
    return origList
  }

  if(desc) {
    if(startNumIdx !== null) {
      let newStartNumIdx = origList.length ? (origList[0].numIdx-1) : startNumIdx
      newList.map((each, idx) => each.numIdx = newStartNumIdx-idx)
    }

    newList = newList.reverse()

    return newList.concat(origList)
  } else {
    if(startNumIdx !== null) {
      let newStartNumIdx = origList.length ? (origList[origList.length-1].numIdx+1) : startNumIdx
      newList.map((each, idx) => each.numIdx = newStartNumIdx+idx)
    }

    return origList.concat(newList)
  }
}

export const SantizeBoard = (board) => {
  if(!board) {
    return {title: "<目前無法看到此板>"}
  }

  board.url = BoardURL(board)
  switch(board.stat_attr) {
  case NBRD_LINE:
    board.brdname = '------------'
    board.title = '--------------------------------------------------'
    board.nuser = '-----'
    board.moderators = ['-----------']
    board.type = '--'
    break
  case NBRD_FOLDER:
    board.type = '□'
    board.brdname = 'MyFavFolder'
    board.nuser = ' '
    break
  default:
    break
  }

  return board
}

export const BoardURL = (board) => {
  switch(board.stat_attr) {
  case NBRD_LINE:
    return ''
  case NBRD_FAV:
    return `/board/${board.bid}/articles`
  case NBRD_BOARD:
    return `/board/${board.bid}/articles`
  case NBRD_FOLDER:
    return window.location.pathname + `?level=${board.level_idx}`
  default:
    return ''
  }
}