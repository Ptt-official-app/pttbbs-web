import React from 'react'
import styles from './Header.module.css'
import config, { PTT_GUEST } from 'config'

import { GITHUB_LINK } from '../constants'

import { getRoot, ClassState } from 'react-reducer-utils'

import Empty from './Empty'

import { State as HeaderS } from '../reducers/header'

type Props = {
    title: string
    renderHeader?: any
    stateHeader: ClassState<HeaderS>
}

export default (props: Props) => {
    const { title: paramsTitle, renderHeader: paramsRenderHeader, stateHeader } = props

    let me = getRoot(stateHeader)
    let meUserID = me ? me.user_id : ''
    let userID = meUserID || ''

    // Links
    let renderUserHome = () => {
        let text = 'hi~ ' + userID
        let url = '/user/' + userID
        if (!userID || userID === PTT_GUEST) {
            text = "登入/註冊"
            url = '/login'
        }
        return (
            <a className={'pull-right ' + styles['navbar-link']} href={url}>{text}</a>
        )
    }

    let renderHeader = () => {
        if (paramsRenderHeader) {
            return paramsRenderHeader()
        }

        let title = paramsTitle || ''
        if (typeof title === 'function') {
            // @ts-ignore because title is function
            return <div className={'col ' + styles['title']}>{title()}</div>
        } else {
            return <div className={'col ' + styles['title']}>{title}</div>
        }
    }

    let renderTerm = () => {
        if (!config.TERM_URL) {
            return (<Empty />)
        }

        return (<a className={styles['navbar-link']} href={config.TERM_URL}>Term</a>)

    }

    return (
        <nav className={'navbar ' + styles['root']}>
            <a className={'navbar-brand ' + styles['navbar-link']} href={'/'}>{config.BRAND}</a>
            {renderTerm()}
            {renderHeader()}
            {renderUserHome()}
            <a className={styles['navbar-link']} href={GITHUB_LINK}>
                <div className={'ml-3 logo-github ' + styles['logo']}></div>
            </a>
        </nav>
    )
}
