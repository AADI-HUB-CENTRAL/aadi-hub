const DIWALI_START_ISO = '2026-11-06T00:00:00+05:30'
const DIWALI_END_ISO = '2026-11-09T20:00:00+05:30'

export const DIWALI_START_MS = Date.parse(DIWALI_START_ISO)
export const DIWALI_END_MS = Date.parse(DIWALI_END_ISO)

export function isDiwaliActive(nowMs = Date.now()) {
  return nowMs >= DIWALI_START_MS && nowMs < DIWALI_END_MS
}

export function msUntilDiwaliTransition(nowMs = Date.now()) {
  if (nowMs < DIWALI_START_MS) return DIWALI_START_MS - nowMs
  if (nowMs < DIWALI_END_MS) return DIWALI_END_MS - nowMs
  return 0
}
