import { useEffect, useRef, useState, useReducer } from 'react'
import styles from './InitConsts.module.css'
import { CONSTS, CalcFontSizeScaleScreenWidth, InitCONSTS } from './utils'

import CSS from 'csstype'

type Props = {
    windowWidth: number
    isMobile: boolean
    nInitConsts: number
    increaseNInitConsts: any
}

export default (props: Props) => {
    const { windowWidth, isMobile, nInitConsts, increaseNInitConsts } = props
    const ref: React.MutableRefObject<HTMLSpanElement | null> = useRef(null)
    const [nResetConsts, increaseNResetConsts] = useReducer((x: number) => x + 1, 0)
    const [style, setStyle] = useState<CSS.Properties>({})

    useEffect(() => {
        console.log('InitConsts.useEffect: current:', ref.current, 'nInitConsts:', nInitConsts, 'CONSTS.IS_INIT', CONSTS.IS_INIT)
        if (!ref.current) {
            return
        }
        let { fontSize } = CalcFontSizeScaleScreenWidth(windowWidth, isMobile, false)
        setStyle({ fontSize: `${fontSize}px` })
        increaseNResetConsts()
    }, [ref.current, windowWidth])

    useEffect(() => {
        if (!ref.current) {
            return
        }
        let { fontSize, scale, screenWidth } = CalcFontSizeScaleScreenWidth(windowWidth, isMobile, false)
        let rect = ref.current.getBoundingClientRect()
        let theStyle = getComputedStyle(ref.current)
        let lineHeight = rect.height - 0.5
        console.log('InitConsts: width:', rect.width, 'height:', rect.height, 'windowWidth:', windowWidth, 'lineHeight:', lineHeight, 'fontSize:', theStyle.fontSize, 'fontFamily:', theStyle.fontFamily)
        InitCONSTS(windowWidth, lineHeight, isMobile, fontSize, scale, screenWidth)
        increaseNInitConsts()
    }, [nResetConsts])

    return (<span ref={ref} className={styles['root']} style={style}>█</span>)
}