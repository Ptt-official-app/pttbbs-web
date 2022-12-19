import styles from './ContentRenderer.module.css'

const _runeAttrs = ['foreground', 'background', 'blink', 'highlight']

export const getClassNamesFromRune = (rune: any): [string[], boolean] => {
    let classNames0 = [styles['rune']]
    let color0 = rune.color0 || {}
    classNames0.push(...getClassNamesFromColor(color0))
    let isTwoColor = rune.color1 && _runeAttrs.some((attr) => color0[attr] !== rune.color1[attr])
    if (isTwoColor) {
        let color1 = rune.color1 || color0
        classNames0.push(styles['halves'])
        classNames0.push(...getClassNamesFromColor(color1, 'r'))
    }

    return [classNames0, isTwoColor]
}

export const getClassNamesFromColor = (color: any, part: string = '') => {
    let classNames = []
    if (color.foreground) {
        if (color.highlight) {
            classNames.push(styles[part + 'h' + color.foreground])
        } else {
            classNames.push(styles[part + 'c' + color.foreground])
        }
    }

    if (color.background) {
        classNames.push(styles[part + 'c' + color.background])
    }

    if (color.blink) {
        classNames.push(styles[part + 'c5'])
    }

    return classNames
}

