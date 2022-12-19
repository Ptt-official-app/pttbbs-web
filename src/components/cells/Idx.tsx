import { Component } from 'react'
import styles from './ContentRenderer.module.css'

type Props = {
    data: any
    rowIndex?: number
    columnKey?: string
    loadPre?: (item: any) => void
    loadNext?: (item: any) => void
}

export default class Idx extends Component<Props> {
    state = {}

    static getDerivedStateFromProps = (props: Props, state: {}) => {
        let { data, rowIndex, loadPre, loadNext } = props
        rowIndex = rowIndex || 0
        let item = data[rowIndex]

        if (rowIndex === 0 && loadPre) {
            loadPre(item)
        }
        if (rowIndex === data.length - 1 && loadNext) {
            loadNext(item)
        }

        return true
    }

    render() {
        let { data, rowIndex, columnKey } = this.props
        rowIndex = rowIndex || 0
        columnKey = columnKey || ''
        let item = data[rowIndex]
        let text = item[columnKey]

        let styleClasses = styles['idx']
        if (text === '★') {
            styleClasses += (' ' + styles['bottomArticle'])
        }

        return (<div className={styleClasses}>{text}</div>)
    }
}
