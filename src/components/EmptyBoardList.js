import React from 'react'

import Screen from './Screen'

export default (props) => {
  const {width, height, prompt} = props

  let renderData = () => {
    return (
      <span>{prompt} (<a href="/boards">所有看板</a>)</span>
    )
  }

  let data = [
    {line: renderData},
  ]

  return (
    <Screen width={width} height={height} data={data} />
  )
}