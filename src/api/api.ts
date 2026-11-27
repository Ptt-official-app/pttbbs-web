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

// 路徑參數來自網址列，react-router 會把 %2F 解回 "/"；不編碼的話，
// 一條連結就能讓 fetch 帶著 cookie 與 CSRF token 打到任意 API 路徑。
export const apiPath = (
  strings: TemplateStringsArray,
  ...params: (string | number)[]
) => String.raw({ raw: strings }, ...params.map((p) => encodeURIComponent(p)));

export const encodeSubPath = (subPath: string) =>
  subPath.split("/").map(encodeURIComponent).join("/");

// encodeURIComponent 不編碼 "."，而 fetch 會解析 "." 與 ".." 路徑段，
// 所以參數本身是 "." 或 ".." 時仍能跳到別的 API 路徑，在這裡統一擋下。
const hasDotSegment = (endpoint: string) =>
  endpoint
    .split("?")[0]
    .split("/")
    .some((segment) => segment === "." || segment === "..");

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

  if (hasDotSegment(propsEndpoint)) {
    throw new Error(`invalid endpoint: ${propsEndpoint}`);
  }

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
