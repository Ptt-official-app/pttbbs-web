import React, { FormEvent, MouseEventHandler } from 'react'

import styles from './SearchBar.module.css'
import searchIcon from '../assets/img/search_white_24dp.svg'
import clearIcon from '../assets/img/clear_white_24dp.svg'

type Props = {
    text: string
    setText: Function
    searching: boolean
    onSearch: Function
    onClear: MouseEventHandler<HTMLButtonElement>
    prompt: string
    className?: string
}

export default (props: Props) => {
    const { text, setText, searching, onSearch, onClear, prompt } = props

    const onSubmit = (e: FormEvent) => {
        e.preventDefault()
        onSearch()
    }

    return (
        <form
            className={props.className}
            onSubmit={onSubmit}
        >
            <div className={`rounded-pill ${styles.wrapper}`}>
                <input
                    type="search"
                    className={styles.searchText}
                    placeholder={prompt}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    style={{ outlineOffset: 0 }}
                />
                <button
                    className="btn d-flex align-items-center p-0"
                    type="submit"
                >
                    <img src={searchIcon} alt="search icon" />
                </button>
                {
                    searching && <button
                        className="btn d-flex align-items-center p-0"
                        type="submit"
                        aria-label="clear"
                        onClick={onClear}
                    >
                        <img src={clearIcon} alt="clear icon" />
                    </button>
                }
            </div>
        </form>
    )
}
