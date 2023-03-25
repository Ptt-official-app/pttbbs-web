import React from 'react'
import styles from './FunctionBar.module.css'

import { OverlayTrigger, Tooltip, TooltipProps } from 'react-bootstrap'

type Props = {
    optionsLeft: Option[]
    optionsRight: Option[]
}

type Option = {
    [key: string]: any
}

export default (props: Props) => {
    const { optionsLeft, optionsRight } = props

    let mapOption = (val: Option, idx: number) => {
        let { text, action, url, render, hotkey } = val

        let renderTooltip = (props: TooltipProps) => (
            <Tooltip {...props}>快速鍵：{hotkey}</Tooltip>
        )

        let renderInner = () => {
            if (render) {
                return render()

            } else if (url) {
                return (
                    <a className={'nav-link ' + styles['navbar-link']} href={url}>{text}</a>
                )
            } else {
                return (
                    <button className={'nav-link ' + styles['navbar-link']} onClick={action}>{text}</button>
                )
            }
        }

        if (hotkey) {
            return (
                <li key={'func-' + idx} className="nav-item">
                    <OverlayTrigger placement='top' trigger={['hover', 'hover']} overlay={renderTooltip}>
                        {renderInner()}
                    </OverlayTrigger>
                </li>
            )
        } else {
            return (
                <li key={'func-' + idx} className="nav-item">
                    {renderInner()}
                </li>
            )
        }
    }

    let renderOptions = (options: Option[]) => {
        return (
            <ul className='nav'>
                {options.map((each, idx) => mapOption(each, idx))}
            </ul >
        )
    }

    return (
        <nav className={'fixed-buttom navbar justify-content-between ' + styles['root']}>
            {renderOptions(optionsLeft)}
            {renderOptions(optionsRight)}
        </nav>
    )
}