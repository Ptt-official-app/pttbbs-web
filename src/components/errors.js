export const ERR_SYS_INIT = "網頁還沒設定完全～ 請再試試～"

export const WARNING_EMAIL_WRONGFORMAT = "Email格式不符～"
export const WARNING_PSD_UNMATCH = "確認密碼不符喔～"

export const ERR_USERNAME_TOO_SHORT = "您的 username 太短囉～最少需要 2 個字～"
export const ERR_USERNAME_TOO_LONG = "您的 username 太長囉～"
export const ERR_PASSWD_TOO_SHORT = "您的 password 太短囉～最少需要 6 個字～"

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