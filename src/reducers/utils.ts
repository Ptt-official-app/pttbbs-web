import { NBRD_LINE, NBRD_FAV, NBRD_BOARD, NBRD_FOLDER } from '../constants'
import moment from 'moment-timezone'

import { BoardSummary, IdxData } from '../types'

export const GoUserHome = (userID: string) => {
    window.location.href = '/user/' + userID
}

export const GoHome = () => {
    window.location.href = '/'
}

export const MergeList = (origList: any[], newList: any[], desc: boolean, isExclude: boolean = false) => {
    if (isExclude) { //desc not include start-item
        newList = newList.slice(1)
    }

    if (newList.length === 0) {
        return origList
    }

    if (desc) {
        newList = newList.reverse()
        return newList.concat(origList)
    } else {
        return origList.concat(newList)
    }
}

export const MergeIdxList = <D extends IdxData>(origList: D[], newList: D[], desc: boolean, startNumIdx: number, isExclude: boolean = false) => {
    if (isExclude) { //desc not include start-item
        newList = newList.slice(1)
    }

    if (newList.length === 0) {
        return origList
    }

    if (desc) {
        if (startNumIdx !== null) {
            let newStartNumIdx = origList.length ? (origList[0].numIdx - 1) : startNumIdx
            newList.map((each, idx) => each.numIdx = newStartNumIdx - idx)
        }

        newList = newList.reverse()

        return newList.concat(origList)
    } else {
        if (startNumIdx !== null) {
            let newStartNumIdx = origList.length ? (origList[origList.length - 1].numIdx + 1) : startNumIdx
            newList.map((each, idx) => each.numIdx = newStartNumIdx + idx)
        }

        return origList.concat(newList)
    }
}

export const SantizeBoard = <B extends BoardSummary>(board?: B | null): B => {
    if (!board) {
        // @ts-ignore because simplified BoardSummary for invalid board
        return { title: "<目前無法看到此板>" }
    }

    board.url = BoardURL(board)

    if (board.type === 'Σ') {
        if (board.gid === 1) {
            board.brdname = ''
            board.class = ''
        }
        board.nuser = ' '
        return board
    }

    switch (board.stat_attr) {
        case NBRD_LINE:
            board.brdname = '------------'
            board.title = '--------------------------------------------------'
            board.nuser = '--'
            board.moderators = ['-----------']
            board.type = '--'
            break
        case NBRD_FOLDER:
            board.type = '□'
            board.brdname = 'MyFavFolder'
            board.nuser = '-'
            break
        default:
            break
    }

    return board
}

export const BoardURL = (board: BoardSummary) => {
    if (board.type === 'Σ') {
        return `/cls/${board.pttbid}`
    }

    switch (board.stat_attr) {
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

export const CdateMdHM = (milliTS: number) => {
    return moment(milliTS).tz('Asia/Taipei').format('MM/DD hh:mm')
}

export const CdateYYYYMdHMS = (milliTS: number) => {
    return moment(milliTS).tz('Asia/Taipei').format('YYYY/MM/DD hh:mm:ss')
}
