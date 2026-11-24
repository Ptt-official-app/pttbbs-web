import { describe, expect, it } from "vitest";
import { tsToDateTimeStr } from "../../src/components/utils";
import { dateMdHM, dateYYYYMdHMS } from "../../src/thunks/utils";

// 2024-01-02 13:04:05 in Asia/Taipei (UTC+8) is 05:04:05 UTC.
const MILLI_TS = Date.UTC(2024, 0, 2, 5, 4, 5);

describe("time format", () => {
  it("dateMdHM should use 24-hour clock", () => {
    expect(dateMdHM(MILLI_TS)).toBe("01/02 13:04");
  });

  it("dateYYYYMdHMS should use 24-hour clock", () => {
    expect(dateYYYYMdHMS(MILLI_TS)).toBe("2024/01/02 13:04:05");
  });

  it("tsToDateTimeStr should use 24-hour clock", () => {
    const d = new Date(2024, 0, 2, 13, 4, 5); // local time
    expect(tsToDateTimeStr(d.getTime() / 1000)).toBe("2024-01-02 13:04:05");
  });
});
