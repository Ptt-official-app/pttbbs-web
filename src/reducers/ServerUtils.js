import config from 'config'

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
