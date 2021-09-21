import * as superagent from 'superagent/dist/superagent'
import config from 'config'

const serialize = (data) => {
  if(typeof data === 'object') {
    data = JSON.stringify(data)
  }

  return encodeURIComponent(data)
}

const queryToString = (query) => Object.keys(query).map(k => `${serialize(k)}=${serialize(query[k])}`).join('&')


const callApi = (endpoint, { query, method='get', params, files, json, accessToken }) => {
  const { API_ROOT: CONFIG_API_ROOT } = config

  let default_api_root = window.location.origin

  let API_ROOT = CONFIG_API_ROOT || default_api_root

  if (endpoint.indexOf(API_ROOT) === -1) {
    endpoint = API_ROOT + endpoint
  }

  if (query) {
    endpoint = `${endpoint}?${queryToString(query)}`
  }

  let request = superagent[method](endpoint)

  if (files) {
    for (let name in files) {
      request = request.attach(name, files[name], files[name].name)
    }
    for (let k in params) {
      request = request.field(k, params[k])
    }
  } else if (params) {
    params = queryToString(params)
    request = request.set('Content-Type', 'application/x-www-form-urlencoded')
    request = request.send(params)
  } else if (json) {
    request = request.send(json)
  }

  if (accessToken) {
    request = request.set('Authorization', 'bearer ' + accessToken)
  }
  request = request.withCredentials()

  let csrftokenDOM = document.getElementById('__csrftoken__')
  let csrftoken = csrftokenDOM ? csrftokenDOM.getAttribute('value') : ''
  request = request.set({ 'X-CSRFToken': csrftoken })

  return request
    .then((res) => {
      if (res.status !== 200) {
        return Promise.reject(res)
      }

      const json = JSON.parse(res.text)
      return {'status': res.status, 'data': json}
    })
    .catch((res, ...e) => {
      let msg = (res.body || {}).Msg
      return {'status': res.status, 'errmsg': msg}
    })
}

export default (callAPI) => {
  let { endpoint, method, query, params, files, json, accessToken } = callAPI

  if (typeof endpoint !== 'string') {
    throw new Error('Specify a string endpoint URL.')
  }

  accessToken = accessToken || ''

  if (typeof accessToken !== 'string') {
    throw new Error('accessToken should be string')
  }

  return callApi(endpoint, {method, query, params, files, json, accessToken})
}