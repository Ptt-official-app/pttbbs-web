import config from 'config'

const LIST_LIMIT = config.LIST_LIMIT || 10

export const Login = (username, password) => ({
  endpoint: '/api/account/login',
  method: 'post',
  json: {
    client_id: config['CLIENT_ID'],
    client_secret: config['CLIENT_SECRET'],

    username,
    password,
  },
})

export const AttemptRegister = (username, email) => ({
  endpoint: '/api/account/attemptregister',
  method: 'post',
  json: {
    client_id: config['CLIENT_ID'],
    client_secret: config['CLIENT_SECRET'],
    username,
    email,
  },
})

export const Register = (username, password, password_confirm, email, over18, veriCode) => ({
  endpoint: '/api/account/register',
  method: 'post',
  json: {
    client_id: config['CLIENT_ID'],
    client_secret: config['CLIENT_SECRET'],

    username,
    password,
    password_confirm,
    email,
    over18,
    token: veriCode,
  },
})

export const GetUserInfo = (userID) => ({
  endpoint: '/api/user/'+userID,
  method: 'get',
})

export const ChangePasswd = (userID, origPassword, password, passwordConfirm) => ({
  endpoint: '/api/user/'+userID+'/updatepasswd',
  method: 'post',
  json: {
    client_id: config['CLIENT_ID'],
    client_secret: config['CLIENT_SECRET'],

    orig_password: origPassword,
    password,
    password_confirm: passwordConfirm,
  },
})

export const AttemptChangeEmail = (userID, password, email) => ({
  endpoint: '/api/user/'+userID+'/attemptchangeemail',
  method: 'post',
  json: {
    client_id: config['CLIENT_ID'],
    client_secret: config['CLIENT_SECRET'],

    password,
    email,
  },
})

export const ChangeEmail = (userID, token) => ({
  endpoint: '/api/user/'+userID+'/changeemail',
  method: 'post',
  json: {
    client_id: config['CLIENT_ID'],
    client_secret: config['CLIENT_SECRET'],
    token,
  },
})

export const AttemptSetIDEmail = (userID, password, email) => ({
  endpoint: '/api/user/'+userID+'/attemptsetidemail',
  method: 'post',
  json: {
    client_id: config['CLIENT_ID'],
    client_secret: config['CLIENT_SECRET'],

    password,
    email,
  },
})

export const SetIDEmail = (userID, token) => ({
  endpoint: '/api/user/'+userID+'/setidemail',
  method: 'post',
  json: {
    client_id: config['CLIENT_ID'],
    client_secret: config['CLIENT_SECRET'],
    token,
  },
})

export const GetBoardSummary = (bid) => ({
  endpoint: '/api/board/' + bid + '/summary',
  method: 'get',
})

export const LoadPopularBoards = () => ({
  endpoint: '/api/boards/popular',
  method: 'get',
})

export const LoadArticles = (bid, title, startIdx, desc) => {
  let query = {
    title: title || '',
    start_idx: startIdx || '',
    limit: LIST_LIMIT,
    desc: desc || false,
  }

  return {
    endpoint: '/api/board/'+ bid + '/articles',
    method: 'get',
    query: query,
  }
}
