import React from 'react'
import PropTypes from 'prop-types'

import styles from './SearchBar.module.css'
import searchIcon from '../assets/img/search_white_24dp.svg'
import clearIcon from '../assets/img/clear_white_24dp.svg'

function SearchBar(props) {
  const {text, setText, searching, onSearch, onClear} = props

  const onSubmit = (e) => {
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
          placeholder="搜尋文章..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{outlineOffset: 0}}
        />
        <button
          className="btn d-flex align-items-center p-0"
          type="submit"
        >
          <img src={searchIcon} alt="search icon"/>
        </button>
        { searching &&
          <button
            className="btn d-flex align-items-center p-0"
            type="submit"
            aria-label="clear"
            onClick={onClear}
          >
            <img src={clearIcon} alt="clear icon"/>
          </button>
        }
      </div>
    </form>
  )
}

SearchBar.propTypes = {
  text: PropTypes.string.isRequired,
  setText: PropTypes.func.isRequired,
  searching: PropTypes.bool.isRequired,
  onSearch: PropTypes.func,
  onClick: PropTypes.func,
}

export default SearchBar

