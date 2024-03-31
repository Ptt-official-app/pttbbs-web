import React, { useEffect, useState, useRef } from 'react'
import pageStyles from './Page.module.css'

import * as errors from './errors'

import { useWindowSize, useKey, useStartTyping } from 'react-use'
import { useParams } from 'react-router-dom'

import { useReducer, getRoot, getRootID, genUUID } from 'react-reducer-utils'

import * as DoArticlePage from '../reducers/articlePage'
import * as DoHeader from '../reducers/header'

import Header from './Header'
import FunctionBar from './FunctionBar'

import Article from './Article'
import Recommend from './cells/Recommend'

import QueryString from 'query-string'
import Empty from './Empty'
import { CharMap, Content, Line } from '../types'
import { CHAR_WIDTH, CalcScreenScale } from './utils'
import InitConsts from './InitConsts'
import { prefix } from 'react-bootstrap/lib/utils/bootstrapUtils'

type Props = {

}

export default (props: Props) => {
    const [stateArticlePage, doArticlePage] = useReducer(DoArticlePage)
    const [articlePageID] = useState(genUUID())

    const [stateHeader, doHeader] = useReducer(DoHeader)
    const [headerID] = useState(genUUID())

    const [nInitConsts, increaseNInitConsts] = React.useReducer((x: number) => x + 1, 0)
    const hasInitConsts = nInitConsts > 0;

    //init
    let { bid, aid } = useParams()

    // eslint-disable-next-line
    const [errMsg, setErrMsg] = useState('')

    //render
    const [headerHeight, setHeaderHeight] = useState(0)
    const [funcbarHeight, setFuncbarHeight] = useState(0)
    const headerRef: React.MutableRefObject<HTMLDivElement | null> = useRef(null)
    const funcbarRef: React.MutableRefObject<HTMLDivElement | null> = useRef(null)
    const { width: innerWidth, height: innerHeight } = useWindowSize()
    const [charMap, setCharMap] = useState<CharMap>({ width: innerWidth, height: innerHeight, charMap: {} })

    const [scrollTop, setScrollTop] = useState(0)
    const [isRecommend, setIsRecommend] = useState(false)
    const [recommendType, setRecommendStyle] = useState(1)
    const recommendTypeRef: React.MutableRefObject<HTMLDivElement | null> = useRef(null)
    const [recommend, setRecommend] = useState('')
    const [isRecommending, setIsRecommending] = useState(false)

    // the states that needs to be updated with some lazy-eval functions.
    const [stateDict, setStateDict] = useState({ isEditing: false })

    let charWidth = CHAR_WIDTH * 2
    let { lineHeight, fontSize } = CalcScreenScale(innerWidth)

    stateDict.isEditing = isRecommending

    //keys
    useKey('X', (e) => {
        if (stateDict.isEditing) {
            return
        }
        setIsRecommend(true)
    })

    useKey('Escape', (e) => {
        if (stateDict.isEditing) {
            return
        }
        setIsRecommend(false)
    })

    useKey('ArrowLeft', (e) => {
        if (stateDict.isEditing) {
            return
        }
        window.location.href = `/board/${bid}/articles`
    })

    useEffect(() => {
        if (isRecommend) {
            setRecommendStyle(1)
            setRecommend('')

            if (recommendTypeRef.current) {
                recommendTypeRef.current.focus()
            }
        } else {
            setRecommendStyle(1)
            setRecommend('')
        }
    }, [isRecommend])

    useEffect(() => {
        if (!hasInitConsts) {
            return
        }
        doHeader.init(headerID)

        let query = QueryString.parse(window.location.search)
        let startIdx = query.start_idx || ''

        doArticlePage.init(articlePageID, bid, aid, startIdx)
    }, [hasInitConsts])

    useEffect(() => {
        if (headerRef.current === null) {
            return
        }
        setHeaderHeight(headerRef.current.clientHeight)
    }, [headerRef.current])

    useEffect(() => {
        if (funcbarRef.current === null) {
            return
        }
        setFuncbarHeight(funcbarRef.current.clientHeight)
    }, [funcbarRef.current])

    //get data
    let articlePage = getRoot(stateArticlePage)
    if (!articlePage) {
        return (
            <div className={pageStyles['root']}>
                <InitConsts windowWidth={innerWidth} isMobile={false} nInitConsts={nInitConsts} increaseNInitConsts={increaseNInitConsts} />
            </div>
        )
    }
    let myID = getRootID(stateArticlePage)
    let errmsg = articlePage.errmsg || ''
    let brdname = articlePage.brdname
    let title = articlePage.title
    let theClass = articlePage.class
    let contentComments = articlePage.contentComments
    let isNextEnd = articlePage.isNextEnd
    let isPreEnd = articlePage.isPreEnd
    let scrollToRow = articlePage.scrollToRow

    let rank = articlePage.rank
    let nRecommend = articlePage.recommend
    let nComments = articlePage.n_comments
    let comments = articlePage.comments

    let width = innerWidth
    let listHeight = innerHeight - headerHeight - funcbarHeight

    let fullTitle = theClass ? `[${theClass}] ` : ''
    fullTitle += title
    let headerTitle = brdname ? `${brdname} - ${fullTitle}` : ''

    let loadPre = (item: Line) => {
        if (!comments.length) {
            return
        }
        if (isPreEnd) {
            return
        }
        let startIdx = comments[0].idx
        doArticlePage.GetComments(myID, bid, aid, startIdx, true, true)
    }

    let loadNext = (item: Line) => {
        if (!comments.length) {
            return
        }
        if (isNextEnd) {
            return
        }
        let startIdx = comments[comments.length - 1].idx
        doArticlePage.GetComments(myID, bid, aid, startIdx, false, true)
    }

    let onVerticalScroll = (scrollTop: number): boolean => {
        setScrollTop(scrollTop)
        if (typeof scrollToRow === 'undefined') {
            return false
        }

        doArticlePage.SetData(myID, { scrollToRow: undefined })

        return true
    }

    // eslint-disable-next-line
    let allErrMsg = errors.mergeErr(errMsg, errmsg)
    let renderArticle = () => {
        return (
            <Article lines={contentComments} width={width} height={listHeight} loadPre={loadPre} loadNext={loadNext} scrollToRow={scrollToRow} onVerticalScroll={undefined} scrollTop={scrollTop} />
        )
    }

    let startRecommend = () => {
        setIsRecommend(true)
    }

    let header = getRoot(stateHeader)
    let userID = header ? header.user_id : ''
    let prefixLength = userID.length

    let renderRecommend = () => {
        let submit = (recommendType: string, recommend: Content) => {
            if (recommend) {
                doArticlePage.AddRecommend(myID, bid, aid, recommendType, recommend)
            }
            setIsRecommend(false)
        }
        let cancel = () => {
            setIsRecommend(false)
        }

        return (
            <Recommend recommendTypeRef={recommendTypeRef} isRecommend={isRecommend} recommendType={recommendType} setRecommendStyle={setRecommendStyle} recommend={recommend} setRecommend={setRecommend} submit={submit} cancel={cancel} prefixLength={prefixLength} setIsRecommending={setIsRecommending} />
        )
    }

    let loptions = [
        { text: "推/噓", action: startRecommend, hotkey: 'X' },
        { render: renderRecommend }
    ]
    let roptions = [
        { text: "離開", url: `/board/${bid}/articles`, hotkey: "←" },
    ]

    return (
        <div className={pageStyles['root']}>
            <div ref={headerRef}>
                <Header title={headerTitle} stateHeader={stateHeader} />
            </div>
            {renderArticle()}
            <div ref={funcbarRef}>
                <FunctionBar optionsLeft={loptions} optionsRight={roptions} />
            </div>
            <InitConsts windowWidth={innerWidth} isMobile={false} nInitConsts={nInitConsts} increaseNInitConsts={increaseNInitConsts} />
        </div>
    )
}