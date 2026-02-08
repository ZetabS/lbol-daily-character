import assert from "node:assert/strict";
import { test } from "node:test";

import { getDayIndex, getMsToNextDay } from "../public/js/time.js";

const KST_OFFSET_MS = 9 * 60 * 60 * 1000;

function kst(iso) {
  return new Date(new Date(iso).getTime() + KST_OFFSET_MS);
}

test("getDayIndex는 KST 자정에서 0으로 시작한다", () => {
  const baseKstMidnight = kst("2003-10-28T00:00:00+09:00");
  assert.equal(getDayIndex(baseKstMidnight), 0);
});

test("getDayIndex는 KST 기준 다음날 자정에서 1이 된다", () => {
  const nextKstMidnight = kst("2003-10-29T00:00:00+09:00");
  assert.equal(getDayIndex(nextKstMidnight), 1);
});

test("getMsToNextDay는 KST 23:59:30에서 30초를 반환한다", () => {
  const nearMidnight = kst("2024-05-06T23:59:30+09:00");
  assert.equal(getMsToNextDay(nearMidnight), 30_000);
});
