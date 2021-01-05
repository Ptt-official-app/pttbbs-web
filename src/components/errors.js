export const ERR_SYS_INIT = "網頁還沒設定完全～ 請再試試～"

export const mergeErr = (errMsg, errmsg) => {
  let allErrMsg = errMsg
  if(errmsg) {
    if(allErrMsg) {
      allErrMsg += ',' + errmsg
    } else {
      allErrMsg = errmsg
    }
  }

  return allErrMsg
}