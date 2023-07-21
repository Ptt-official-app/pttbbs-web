import moment from 'moment'

export const TSToDateTimeStr = (ts: number) => {
    return moment.unix(ts).format('YYYY-MM-DD hh:mm:ss')
}

//board-list: 特殊記號+已讀+看板+類別+種類+中文敘述+人氣+板主
export const CHAR_WIDTH = 10

export const SCREEN_WIDTH = 90
export const EDIT_SCREEN_WIDTH = 80

const MAX_SCALE = 1.2

const DEFAULT_CHAR_WIDTH = 10
const DEFAULT_SCREEN_WIDTH = 90

export const CONSTS = {
    FONT_SIZE: 20,
    HALF_FONT_SIZE: 10,
    SCALE: 1,
    WINDOW_WIDTH: 3840,
    SCREEN_WIDTH: 90,
    CHAR_WIDTH: 10,
    EDIT_SCREEN_WIDTH: 80,
    LINE_HEIGHT: 25,
    IS_MOBILE: false,
    IS_INIT: false,
    BASE_COLUMN_WIDTH: 10 * 90, // CHAR_WIDTH * SCREEN_WIDTH
}

const calcScreenWidth = (windowWidth: number, isMobile: boolean) => {
    if (!isMobile) {
        if (windowWidth > DEFAULT_SCREEN_WIDTH * DEFAULT_CHAR_WIDTH) {
            return DEFAULT_SCREEN_WIDTH
        } else {
            return Math.floor(windowWidth / DEFAULT_CHAR_WIDTH)
        }
    } else {
        return 15
    }
}

const calcScale = (windowWidth: number, isMobile: boolean, screenWidth: number) => {
    if (CONSTS.IS_INIT) {
        return CONSTS.SCALE
    }
    if (!isMobile) {
        let scale = windowWidth / (DEFAULT_CHAR_WIDTH * screenWidth)
        return scale < MAX_SCALE ? scale : MAX_SCALE
    } else {
        return 1
    }
}

export const CalcFontSizeScaleScreenWidth = (windowWidth: number, isMobile: boolean) => {
    if (CONSTS.IS_INIT) {
        return { fontSize: CONSTS.FONT_SIZE, scale: CONSTS.SCALE, screenWidth: CONSTS.SCREEN_WIDTH }
    }
    if (!isMobile) {
        let screenWidth = calcScreenWidth(windowWidth, isMobile)
        let scale = calcScale(windowWidth, isMobile, screenWidth)
        let fontSize = Math.floor(scale * DEFAULT_CHAR_WIDTH * 2)
        return { fontSize, scale, screenWidth }
    } else {
        return { fontSize: 15, scale: 1, screenWidth: 20 }
    }
}

export const InitCONSTS = (windowWidth: number, lineHeight: number, isMobile: boolean, fontSize: number, scale: number, screenWidth: number) => {
    let halfFontSize = Math.floor(fontSize / 2)
    let toUpdate = {
        WINDOW_WIDTH: windowWidth,
        IS_MOBILE: isMobile,

        FONT_SIZE: fontSize,
        HALF_FONT_SIZE: halfFontSize,
        SCALE: scale,
        SCREEN_WIDTH: screenWidth,

        CHAR_WIDTH: halfFontSize,

        LINE_HEIGHT: lineHeight,

        IS_INIT: true,

        BASE_COLUMN_WIDTH: halfFontSize * screenWidth
    }
    Object.assign(CONSTS, toUpdate)

    console.log('utils.InitCONSTS: CONSTS:', CONSTS)
}

export const CalcScreenScale = (width: number) => {
    let scale = width / (DEFAULT_CHAR_WIDTH * CONSTS.SCREEN_WIDTH)
    scale = scale < MAX_SCALE ? scale : MAX_SCALE
    let lineHeight = CONSTS.LINE_HEIGHT
    let fontSize = CONSTS.FONT_SIZE

    return { scale, lineHeight, fontSize }
}

export const GetBoardParent = () => {
    //XXX TODO: imagine that there should be a session data remembering the last board list visited
    // If the board is visited directly by url there will be no record => return ""
    return ""
}