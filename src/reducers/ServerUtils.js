import config from 'config'

const LIST_LIMIT = config.LIST_LIMIT || 50

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

export const GetUserID = () => ({
  endpoint: '/api/userid',
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

export const LoadFavoriteBoards = (userID, level, startIdx, desc) => ({
  endpoint: '/api/user/' + userID + '/favorites',
  method: 'get',
  query: {
    level_idx: level || '',
    start_idx: startIdx || '',
    asc: !desc,
    limit: LIST_LIMIT,
  },
})

export const LoadPopularBoards = () => ({
  endpoint: '/api/boards/popular',
  method: 'get',
})

export const LoadGeneralBoardsByClass = (title, startIdx, desc) => ({
  endpoint: '/api/boards/byclass',
  query: {
    title: title || '',
    start_idx: startIdx || '',
    asc: !desc,
    limit: LIST_LIMIT,
  },
})

export const LoadGeneralBoards = (title, startIdx, desc) => ({
  endpoint: '/api/boards',
  query: {
    title: title || '',
    start_idx: startIdx || '',
    asc: !desc,
    limit: LIST_LIMIT,
  },
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

export const LoadBottomArticles = (bid) => ({
  endpoint: '/api/board/' + bid + '/articles/bottom',
  method: 'get',
})

export const GetArticle = (bid, aid) => {
  return {
    endpoint: '/api/board/' + bid + '/article/' + aid,
    method: 'get',
  }
}

export const GetComments = (bid, aid, startIdx, desc) => {
  let query = {
      start_idx: startIdx || '',
      limit: LIST_LIMIT,
  }
  if(typeof desc !== 'undefined') {
    query.desc = desc
  }
  return {
    endpoint: '/api/board/' + bid + '/article/' + aid + '/comments',
    method: 'get',
    query: query,
  }
}

export const CreateArticle = (bid, theClass, title, content) => {
  return {
    endpoint: '/api/board/' + bid + '/article',
    method: 'post',
    json: {
      class: theClass,
      title,
      content,
    },
  }
}

export const AddRecommend = (bid, aid, recommendType, recommend) => {
  return {
    endpoint: `/api/board/${bid}/article/${aid}/comment`,
    method: 'post',
    json: {
      type: recommendType,
      content: recommend,
    },
  }
}

export const Rank = (bid, aid, rank) => {
  return {
    endpoint: `/api/board/${bid}/article/${aid}/rank`,
    method: 'post',
    json: {
      rank: rank,
    },
  }
}
