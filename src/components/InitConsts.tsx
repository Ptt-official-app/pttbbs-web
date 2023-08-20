import { useEffect, useRef, useState } from 'react'
import styles from './InitConsts.module.css'
import { CONSTS, CalcFontSizeScaleScreenWidth, InitCONSTS } from './utils'

import CSS from 'csstype'

type Props = {
    windowWidth: number
    isMobile: boolean
    isInitConsts: boolean
    setIsInitConsts: any
}

export default (props: Props) => {
    const { windowWidth, isMobile, isInitConsts, setIsInitConsts } = props
    const ref: React.MutableRefObject<HTMLSpanElement | null> = useRef(null)
    let { fontSize, scale, screenWidth } = CalcFontSizeScaleScreenWidth(windowWidth, isMobile)

    const [style, setStyle] = useState<CSS.Properties>({ fontSize: `${fontSize}px` })

    useEffect(() => {
        console.log('InitConsts.useEffect: current:', ref.current, 'isInitConsts:', isInitConsts, 'CONSTS.IS_INIT', CONSTS.IS_INIT)
        if (!ref.current) {
            return
        }

        if (isInitConsts) {
            setStyle({ display: 'none', fontSize: `${fontSize}px` })
            return
        }
        if (CONSTS.IS_INIT) {
            return
        }

        let rect = ref.current.getBoundingClientRect()
        let theStyle = getComputedStyle(ref.current)
        console.log('InitConsts: width:', rect.width, 'height:', rect.height, 'fontSize:', theStyle.fontSize, 'fontFamily:', theStyle.fontFamily)
        InitCONSTS(windowWidth, rect.height, isMobile, fontSize, scale, screenWidth)
        setIsInitConsts(true)
    }, [ref.current, isInitConsts])


    return (<span ref={ref} className={styles['root']} style={style}>█</span>)
}