import type { I18n } from "./types";

export default {
  header: {
    loginRegister: "登錄/註冊",
  },
  register: {
    title: "註冊新帳號",
    emailAddress: "我的信箱",
    registerAccount: "我要註冊帳號",
    info: "請到您的信箱檢查相關信件",
  },
  login: {
    login: "我要登入",
    register: "我想註冊",
    forgotPassword: "我忘記密碼了～",
    titlePrefix: "\\歡迎登入 ",
    titlePostfix: " ～/",
    info: "請到您的聯絡信箱收取驗證碼，並填入以下空格～",
    submit: "登入",
  },
  init: {
    title: "設定我的個人資訊",
    username: "Username",
    realName: "我的真實姓名",
    birthDate: "我的生日",
    submit: "設定",
    errmsg: {
      noUsername: "請先設定 username",
    },
  },
  error: {
    title: "預期外的情形",
    prompt: "很對不起，遇到了預期外的情形～",
    backHome: "回到",
  },
  profile: {
    withMobileID: "我有通過手機認證",
    withGovernmentID: "我有政府認證的 ID (例: 自然人憑證)",
  },
  errmsg: {
    usernameInvalidChars: "username 包含了不允許的字元",
    usernameStartsWithDot: 'username 不能以 "." 開始',
    usernameEndsWithDot: 'username 不能以 "." 結尾',
  },
} as I18n;
