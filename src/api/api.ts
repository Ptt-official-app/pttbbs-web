import config from "config";

export type Query = {
  // biome-ignore lint/suspicious/noExplicitAny: query can be any type.
  [key: string]: any;
};

export type Params = {
  // biome-ignore lint/suspicious/noExplicitAny: params can be any type.
  [key: string]: any;
};

export type Files = {
  [key: string]: File;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type ApiParams = {
  endpoint: string;
  query?: Query;
  method?: string;
  params?: Params;
  files?: Files;
  // biome-ignore lint/suspicious/noExplicitAny: json can be any type.
  json?: any;
  accessToken?: string;
};

export type ApiResult<T> = {
  status: number;
  data?: T;
  errmsg?: string;
};

// biome-ignore lint/suspicious/noExplicitAny: data can be any type.
const serialize = (data: any): string => {
  if (typeof data === "object") {
    data = JSON.stringify(data);
  }

  return encodeURIComponent(data);
};

const queryToString = (query: Query | Params) =>
  Object.keys(query)
    .map((k) => `${serialize(k)}=${serialize(query[k])}`)
    .join("&");

const apiParamsToFetchParams = (
  apiParams: ApiParams,
): [string, RequestInit] => {
  const {
    endpoint: propsEndpoint,
    query,
    method: propsMethod,
    params,
    files,
    json,
    accessToken: propsAccessToken,
  } = apiParams;

  const method = propsMethod || "get";
  const accessToken = propsAccessToken || "";

  const { API_ROOT: CONFIG_API_ROOT } = config;

  const default_api_root = window.location.origin;

  const API_ROOT = CONFIG_API_ROOT || default_api_root;

  let endpoint = propsEndpoint;
  if (endpoint.indexOf(API_ROOT) === -1) {
    endpoint = API_ROOT + endpoint;
  }
  if (query) {
    endpoint = `${endpoint}?${queryToString(query)}`;
  }

  const headers: HeadersInit = {};
  let body: string | FormData | undefined;
  if (files) {
    const formData = new FormData();
    for (const [name, file] of Object.entries(files)) {
      formData.append(name, file, file.name);
    }
    if (params) {
      for (const [key, val] of Object.entries(params)) {
        formData.append(key, val);
      }
    }
    body = formData;
  } else if (params) {
    const paramsStr = queryToString(params);
    headers["Content-Type"] = "application/x-www-form-urlencoded";
    body = paramsStr;
  } else if (json) {
    body = JSON.stringify(json);
    headers["Content-Type"] = "application/json";
  }

  if (accessToken) {
    headers.Authorization = `bearer ${accessToken}`;
  }

  const csrftokenDOM = document.getElementById("__csrftoken__");
  const csrftoken =
    (csrftokenDOM ? csrftokenDOM.getAttribute("value") : "") || "";
  headers["X-CSRFToken"] = csrftoken;

  const options: RequestInit = {
    method,
    headers,
    body,
    credentials: "include",
  };

  return [endpoint, options];
};

export const _testing = {
  apiParamsToFetchParams,
};

export default async <T>(apiParams: ApiParams): Promise<ApiResult<T>> => {
  try {
    const [endpoint, options] = apiParamsToFetchParams(apiParams);

    const res = await fetch(endpoint, options);
    const status = res.status;
    const data = await res.json();
    if (status >= 400) {
      const msg = data.Msg || "";
      return { status, errmsg: msg };
    }

    return { status, data };
  } catch (err) {
    if (err instanceof Error) {
      return { status: 599, errmsg: err.message };
    }

    return { status: 599, errmsg: String(err) };
  }
};
