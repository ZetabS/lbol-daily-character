const KST_OFFSET_MS = 9 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;
const EPOCH_KST_MIDNIGHT_MS = Date.UTC(2003, 9, 28) - KST_OFFSET_MS;

function getKstDate() {
  return new Date(Date.now() + KST_OFFSET_MS);
}

function getKstMidnightMs(kstDate) {
  const year = kstDate.getUTCFullYear();
  const month = kstDate.getUTCMonth();
  const day = kstDate.getUTCDate();
  return Date.UTC(year, month, day);
}

export function getDayIndex(kstNow = getKstDate()) {
  const todayMidnightMs = getKstMidnightMs(kstNow);
  const diffMs = todayMidnightMs - EPOCH_KST_MIDNIGHT_MS;
  return Math.floor(diffMs / DAY_MS);
}

export function getMsToNextDay(kstNow = getKstDate()) {
  const nextMidnightMs = getKstMidnightMs(kstNow) + DAY_MS;
  return nextMidnightMs - kstNow.getTime();
}
