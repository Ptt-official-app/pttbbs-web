export const GoUserHome = (userID) => {
  window.location.href = '/user/' + userID
}

export const GoHome = () => {
  window.location.href = '/'
}

export const MergeList = (origList, newList, desc, startNumIdx, isExclude) => {
  if(isExclude) { //desc not include start-item
    newList = newList.slice(1)
  }

  if(newList.length === 0) {
    return origList
  }

  if(desc) {
    let newStartNumIdx = origList.length ? (origList[0].numIdx-1) : startNumIdx
    newList.map((each, idx) => each.numIdx = newStartNumIdx-idx)

    newList = newList.reverse()

    return newList.concat(origList)
  } else {
    let newStartNumIdx = origList.length ? (origList[origList.length-1].numIdx+1) : startNumIdx
    newList.map((each, idx) => each.numIdx = newStartNumIdx+idx)

    return origList.concat(newList)
  }
}
