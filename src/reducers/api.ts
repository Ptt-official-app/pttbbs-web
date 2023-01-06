import config from 'config'

export type Query = {
    [key: string]: any
}

export type Params = {
    [key: string]: any
}

export type Files = {
    [key: string]: any
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type CallAPI<T> = {
    endpoint: string
    method?: string
    query?: Query
    params?: Params
    files?: Files
    json?: any
    accessToken?: string
}

type ApiParams = {
    query?: Query
    method?: string
    params?: Params
    files?: Files
    json?: any
    accessToken?: string
}

type ApiResult<T> = {
    status: number
    data?: T
    errmsg?: string
}


const serialize = (data: any): string => {
    if (typeof data === 'object') {
        data = JSON.stringify(data)
    }

    return encodeURIComponent(data)
}

const queryToString = (query: Query | Params) => Object.keys(query).map(k => `${serialize(k)}=${serialize(query[k])}`).join('&')


const callApi = <T>(endpoint: string, { query, method = 'get', params, files, json, accessToken }: ApiParams): Promise<ApiResult<T>> => {
    const { API_ROOT: CONFIG_API_ROOT } = config

    let default_api_root = window.location.origin

    let API_ROOT = CONFIG_API_ROOT || default_api_root

    if (endpoint.indexOf(API_ROOT) === -1) {
        endpoint = API_ROOT + endpoint
    }

    if (query) {
        endpoint = `${endpoint}?${queryToString(query)}`
    }

    let headers: HeadersInit = {}
    let body: string | undefined = undefined
    if (files) {
        // eslint-disable-next-line
        for (let name in files) {
        }
        // eslint-disable-next-line
        for (let k in params) {
        }
    } else if (params) {
        let paramsStr = queryToString(params)
        headers['Content-Type'] = 'application/x-www-form-urlencoded'
        body = paramsStr
    } else if (json) {
        body = JSON.stringify(json)
        headers['Content-Type'] = 'application/json'
    }

    if (accessToken) {
        headers['Authorization'] = 'bearer ' + accessToken
    }

    let csrftokenDOM = document.getElementById('__csrftoken__')
    let csrftoken = (csrftokenDOM ? csrftokenDOM.getAttribute('value') : '') || ''
    headers['X-CSRFToken'] = csrftoken

    let options: RequestInit = {
        method,
        headers,
        body,
    }

    return fetch(endpoint, options)
        .then((res) => {
            let status = res.status
            return res.json()
                .then((data) => {
                    if (res.status !== 200) {
                        let msg = data.Msg || ''
                        return { status, 'errmsg': msg }
                    } else {
                        return { 'status': res.status, 'data': data }
                    }
                })
                .catch((err) => {
                    console.log('api.callApi: json: err:', err)
                    return { 'status': 598, 'errmsg': err.message }
                })
        })
        .catch((err) => {
            return { 'status': 599, 'errmsg': err.message }
        })

}

export default <T>(callAPI: CallAPI<T>): Promise<ApiResult<T>> => {
    let { endpoint, method, query, params, files, json, accessToken } = callAPI

    accessToken = accessToken || ''

    return callApi(endpoint, { method, query, params, files, json, accessToken })
}