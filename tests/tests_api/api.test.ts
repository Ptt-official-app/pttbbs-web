import { beforeEach, describe, expect, it, vi } from "vitest";
import api, { _testing, type ApiParams } from "../../src/api/api";

const { apiParamsToFetchParams } = _testing;

describe("api.apiParamsToFetchParams", () => {
  it("should deal with query", () => {
    const params: ApiParams = {
      endpoint: "/api/test",
      method: "get",
      query: { a: 1, b: "2" },
    };

    const [endpoint, options] = apiParamsToFetchParams(params);
    expect(endpoint).toBe("http://localhost:3457/api/test?a=1&b=2");
    expect(options.method).toBe("get");
  });

  it("should deal with params", () => {
    const params: ApiParams = {
      endpoint: "/api/test",
      method: "post",
      params: { a: 1, b: "2" },
    };

    const [endpoint, options] = apiParamsToFetchParams(params);
    expect(endpoint).toBe("http://localhost:3457/api/test");
    expect(options.method).toBe("post");
    expect(options.body).toBe("a=1&b=2");
  });

  it("should deal with params-obj", () => {
    const params: ApiParams = {
      endpoint: "/api/test",
      method: "post",
      params: { a: 1, b: { c: "2" } },
    };

    const [endpoint, options] = apiParamsToFetchParams(params);
    expect(endpoint).toBe("http://localhost:3457/api/test");
    expect(options.method).toBe("post");
    expect(options.body).toBe("a=1&b=%7B%22c%22%3A%222%22%7D");
  });

  it("should deal with json", () => {
    const params: ApiParams = {
      endpoint: "/api/test",
      method: "post",
      json: { a: 1, b: "2" },
    };

    const [endpoint, options] = apiParamsToFetchParams(params);
    expect(endpoint).toBe("http://localhost:3457/api/test");
    expect(options.method).toBe("post");
    expect(options.body).toBe('{"a":1,"b":"2"}');
  });

  it("should deal with files", () => {
    const params: ApiParams = {
      endpoint: "/api/test",
      method: "post",
      files: { a: new File(["test_content"], "test_filename") },
      params: { c: "test_c" },
      accessToken: "test_access_token",
    };

    const [endpoint, options] = apiParamsToFetchParams(params);
    expect(endpoint).toBe("http://localhost:3457/api/test");
    expect(options.method).toBe("post");
    expect(options.body).toBeInstanceOf(FormData);

    expect(options.headers).toHaveProperty("X-CSRFToken");
    // @ts-expect-error vitest
    expect(options.headers["X-CSRFToken"]).toBe("");

    expect(options.headers).toHaveProperty("Authorization");
    // @ts-expect-error vitest
    expect(options.headers.Authorization).toBe("bearer test_access_token");
  });
});

describe("api", () => {
  type Temp = {
    a: number;
    b: string;
  };

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should successfully return", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        statusText: "OK",
        json: () => ({ a: 1, b: "2" }),
      }),
    );

    const { status, data, errmsg } = await api<Temp>({
      endpoint: "/api/test",
      method: "get",
    });

    expect(status).toBe(200);
    expect(errmsg).toBeUndefined();
    expect(data).not.toBeUndefined();
    if (!data) return;
    expect(data.a).toBe(1);
    expect(data.b).toBe("2");
  });

  it("should return 400", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        statusText: "OK",
        json: () => ({ Msg: "test-400" }),
      }),
    );

    const { status, data, errmsg } = await api<Temp>({
      endpoint: "/api/test",
      method: "get",
    });

    expect(status).toBe(400);
    expect(errmsg).toBe("test-400");
    expect(data).toBeUndefined();
  });

  it("should throw err", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        statusText: "OK",
        json: () => {
          throw Error("error-json");
        },
      }),
    );

    const { status, data, errmsg } = await api<Temp>({
      endpoint: "/api/test",
      method: "get",
    });

    expect(status).toBe(599);
    expect(errmsg).toBe("error-json");
    expect(data).toBeUndefined();
  });

  it("should throw unknown err", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        statusText: "OK",
        json: () => {
          throw "error-json-str";
        },
      }),
    );

    const { status, data, errmsg } = await api<Temp>({
      endpoint: "/api/test",
      method: "get",
    });

    expect(status).toBe(599);
    expect(errmsg).toBe("error-json-str");
    expect(data).toBeUndefined();
  });
});
