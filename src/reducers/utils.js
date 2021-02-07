export const GoUserHome = (userID) => {
  window.location.href = '/user/' + userID
}

export const GoHome = () => {
  window.location.href = '/'
}

export const MergeList = (origList, newList, isReverse, isAppend, isIncludeStartIdx, startNumIdx) => {
  if(!isIncludeStartIdx && newList.length > 0) {
    newList = newList.slice(1)
  }

  if(newList.length === 0) {
    return origList
  }

  if(isReverse) {
    newList = newList.reverse()
  }

  if(isAppend) {
    let newStartNumIdx = origList.length ? (origList[origList.length-1].numIdx+1) : startNumIdx
    newList.map((each, idx) => each.numIdx = newStartNumIdx+idx)
    return origList.concat(newList)
  } else {
    let newStartNumIdx = origList.length ? (origList[0].numIdx-1) : startNumIdx
    newList.map((each, idx) => each.numIdx = newStartNumIdx+idx)
    return newList.concat(origList)
  }
}
