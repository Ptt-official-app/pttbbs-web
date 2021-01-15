import React, { useEffect } from 'react'
import pageStyles from './Page.module.css'

import { useWindowSize } from 'react-use'

import { useParams } from 'react-router-dom'

import { useActionDispatchReducer, getRoot, genUUID, Empty } from 'react-reducer-utils'

import * as DoChangeEmailPage from '../reducers/changeEmailPage'

import Header from './Header'

import QueryString from 'query-string'

export default (props) => {
  const [stateChangeEmailPage, doChangeEmailPage] = useActionDispatchReducer(DoChangeEmailPage)

  //init
  let { userid } = useParams()

  useEffect(() => {
    const { token } = QueryString.parse(window.location.search)

    let changeEmailPageID = genUUID()
    doChangeEmailPage.init(changeEmailPageID, doChangeEmailPage, null, null, userid, token)
  }, [])

  //get data
  let changeEmailPage = getRoot(stateChangeEmailPage) || {}
  let myID = changeEmailPage.id || ''
  let errmsg = changeEmailPage.errmsg || ''
  let isDone = changeEmailPage.isDone || false
  let data = changeEmailPage.data || {}

  useEffect(() => {
    if (!isDone) {
      return
    }

    doChangeEmailPage.SleepAndRedirect(myID, userid)

  }, [isDone])


  //render
  const {height: innerHeight} = useWindowSize()
  let style = {
    height: innerHeight + 'px',
  }

  let renderData = () => {
    if(!data.email) {
      return (<Empty />)
    }

    return (
      <label className=''>您的聯絡信箱已更改為 {data.email} 囉～(將會回到您的個人資訊)</label>
    )
  }

  if(errmsg) {
    errmsg += ' (將會回到您的個人資訊)'
  }

  return (
    <div className={pageStyles['root']} style={style}>
      <div className={'container'} style={style}>
        <Header title='更改聯絡信箱' userID={userid} />
        <div className='row'>
          <div className='col'>
            {renderData()}
          </div>
          <div className='col'>
            <label className={pageStyles['errMsg']}>{errmsg}</label>
          </div>
        </div>
      </div>
    </div>
  )
}
