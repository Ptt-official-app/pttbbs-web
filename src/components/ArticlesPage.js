import React, { useEffect, useState } from 'react'
import pageStyles from './Page.module.css'

import * as errors from './errors'

import { useWindowSize } from 'react-use'
import { useParams } from 'react-router-dom'

import { useActionDispatchReducer, getRoot, genUUID } from 'react-reducer-utils'

import * as DoArticlesPage from '../reducers/articlesPage'

import Header from './Header'
import ArticleList from './ArticleList'

export default (props) => {
  const [stateArticlesPage, doArticlesPage] = useActionDispatchReducer(DoArticlesPage)

  // eslint-disable-next-line
  const [errMsg, setErrMsg] = useState('')

  //init
  let { bid } = useParams()
  useEffect(() => {
    let articlesPageID = genUUID()
    doArticlesPage.init(articlesPageID, doArticlesPage, null, null, bid)
  }, [])

  //get data
  let articlesPage = getRoot(stateArticlesPage) || {}
  let errmsg = articlesPage.errmsg || ''
  let articles = articlesPage.list || []
  let brdname = articlesPage.brdname || ''
  let title = articlesPage.title || ''

  //render
  const {width: innerWidth, height: innerHeight} = useWindowSize()

  let width = innerWidth
  let listHeight = innerHeight * 0.9

  let headerTitle = '文章列表: 看版 ' + brdname + ' - ' + title

  // eslint-disable-next-line
  let allErrMsg = errors.mergeErr(errMsg, errmsg)
  let renderArticles = () => {
    if (articles.length === 0) {
      return(
        <div className="container vh-100">
          <h3 className="mx-4">這個看板目前沒有文章喔～</h3>
        </div>
      )
    } else {
      return (
        <ArticleList articles={articles} width={width} height={listHeight}/>
      )
    }
  }

  return (
    <div className={pageStyles['root']}>
      <Header title={headerTitle} />
      {renderArticles()}
    </div>
  )
}
