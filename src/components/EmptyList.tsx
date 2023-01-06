import CSS from 'csstype'

type Props = {
    prompt: string
    width?: number
    height?: number
}

export default (props: Props) => {
    let { prompt, width, height } = props
    width = width || 0
    height = height || 0

    let styles: CSS.Properties = {
        // @ts-ignore
        width,
        // @ts-ignore
        height,
    }
    let className = 'container'
    if (width === 0) {
        styles = {}
        className = 'container vh-100'
    }

    return (
        <div className={className} style={styles}>
            <h3 className="mx-4"> {prompt} </h3>
        </div>
    )
}