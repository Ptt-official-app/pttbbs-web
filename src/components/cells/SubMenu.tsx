import { Dropdown, DropdownButton, Overlay, OverlayTrigger } from "react-bootstrap"
import { Menu_t, TableData } from "../../types"
import { Listbox } from "react-widgets/cjs"
import { CSSProperties, MutableRefObject } from "react"
import styles from './Cell.module.css'

type Props = {
    menu: Menu_t[]
    data: TableData
    containerRef: MutableRefObject<HTMLDivElement | null>
    rowIndex?: number
    columnKey?: string
    style?: CSSProperties
    render?: Function
}

export default (props: Props) => {
    let { menu, data, rowIndex, columnKey, style, render, containerRef } = props
    rowIndex = rowIndex || 0
    columnKey = columnKey || ''
    style = style || {}

    let item = data[rowIndex]

    return (
        <DropdownButton key={'submenu-' + rowIndex} title="…">
            {menu.map((each, idx) => <Dropdown.Item key={'submenu-' + rowIndex + '-' + idx} eventKey={'submenu-' + rowIndex + '-' + idx} onClick={(e) => each.handle(item, data, rowIndex, columnKey)}>{each.prompt}</Dropdown.Item>)}
        </DropdownButton>
    )
}
