import { supabase } from './supabase.js'

export const DIWALI_CELEBRATIONS_TABLE = 'diwali_celebrations'
export const DIWALI_CELEBRATION_LIMIT = 30
export const DIWALI_NAME_MAX_LENGTH = 48

const DIWALI_CACHE_KEY = 'aadi-diwali-celebrations-v1'

export function normalizeDisplayName(value) {
  return String(value ?? '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, DIWALI_NAME_MAX_LENGTH)
}

export function createCelebrationId() {
  if (
    typeof crypto !== 'undefined' &&
    typeof crypto.randomUUID === 'function'
  ) {
    return crypto.randomUUID()
  }

  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
    const random = (Math.random() * 16) | 0
    const next = char === 'x' ? random : (random & 0x3) | 0x8
    return next.toString(16)
  })
}

export function isMissingCelebrationsTableError(error) {
  if (!error) return false

  return (
    error.code === 'PGRST205' ||
    error.code === '42P01' ||
    /could not find the table|does not exist/i.test(error.message || '')
  )
}

function normalizeRow(row) {
  if (!row || typeof row !== 'object') return null

  const displayName = normalizeDisplayName(row.display_name)
  if (!displayName) return null

  return {
    id: String(row.id),
    display_name: displayName,
    created_at: row.created_at || new Date().toISOString(),
    pending: Boolean(row.pending),
  }
}

function canUseStorage() {
  return (
    typeof window !== 'undefined' &&
    Boolean(window.localStorage)
  )
}

function readCachedCelebrations() {
  if (!canUseStorage()) return []

  try {
    const raw = window.localStorage.getItem(DIWALI_CACHE_KEY)
    if (!raw) return []

    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []

    return parsed.map(normalizeRow).filter(Boolean)
  } catch {
    return []
  }
}

function writeCachedCelebrations(entries) {
  if (!canUseStorage()) return

  try {
    const sorted = [...entries].sort(
      (first, second) =>
        (Date.parse(second.created_at) || 0) -
        (Date.parse(first.created_at) || 0)
    )
    window.localStorage.setItem(
      DIWALI_CACHE_KEY,
      JSON.stringify(sorted.slice(0, DIWALI_CELEBRATION_LIMIT))
    )
  } catch {
    // Storage can be full or disabled (private mode). The wall still works
    // through Supabase, so ignore cache failures.
  }
}

function mergeEntries(primary, secondary, limit) {
  const byId = new Map()

  primary.concat(secondary).forEach((entry) => {
    if (entry && !byId.has(entry.id)) {
      byId.set(entry.id, entry)
    }
  })

  return Array.from(byId.values())
    .sort(
      (first, second) =>
        (Date.parse(second.created_at) || 0) -
        (Date.parse(first.created_at) || 0)
    )
    .slice(0, limit)
}

export function cacheCelebration(entry, { pending = false } = {}) {
  const normalized = normalizeRow(entry)
  if (!normalized) return

  normalized.pending = pending

  const rest = readCachedCelebrations().filter(
    (item) => item.id !== normalized.id
  )

  writeCachedCelebrations([normalized, ...rest])
}

async function flushPendingCelebrations() {
  if (!supabase) return

  const cached = readCachedCelebrations()
  const pending = cached.filter((entry) => entry.pending)

  if (pending.length === 0) return

  let changed = false
  const next = cached.map((entry) => ({ ...entry }))

  for (const entry of pending) {
    const { error } = await supabase
      .from(DIWALI_CELEBRATIONS_TABLE)
      .insert({ id: entry.id, display_name: entry.display_name })

    if (!error || error.code === '23505') {
      const target = next.find((item) => item.id === entry.id)
      if (target) target.pending = false
      changed = true
    }
  }

  if (changed) {
    writeCachedCelebrations(next)
  }
}

export async function fetchDiwaliCelebrations(
  limit = DIWALI_CELEBRATION_LIMIT
) {
  await flushPendingCelebrations()

  const cached = readCachedCelebrations()

  if (!supabase) {
    return {
      entries: mergeEntries(cached, [], limit),
      error: null,
      unavailable: cached.length === 0,
      unavailableReason: cached.length === 0 ? 'not_configured' : null,
    }
  }

  const { data, error } = await supabase
    .from(DIWALI_CELEBRATIONS_TABLE)
    .select('id, display_name, created_at')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    const unavailable = isMissingCelebrationsTableError(error)

    return {
      entries: mergeEntries(cached, [], limit),
      error,
      unavailable,
      unavailableReason: unavailable ? 'missing_table' : null,
    }
  }

  const entries = (data || []).map(normalizeRow).filter(Boolean)
  return {
    entries: mergeEntries(entries, cached, limit),
    error: null,
    unavailable: false,
    unavailableReason: null,
  }
}

export function subscribeToDiwaliCelebrations({ onInsert, onError }) {
  if (!supabase) {
    return () => {}
  }

  const channelName = `diwali-celebrations-${Date.now()}-${Math.random()
    .toString(16)
    .slice(2)}`

  const channel = supabase.channel(channelName)

  channel.on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: DIWALI_CELEBRATIONS_TABLE,
    },
    (payload) => {
      const entry = normalizeRow(payload?.new)
      if (entry && typeof onInsert === 'function') {
        onInsert(entry)
      }
    }
  )

  channel.subscribe((status) => {
    if (
      status === 'CHANNEL_ERROR' &&
      typeof onError === 'function'
    ) {
      onError(new Error('Real-time subscription failed.'))
    }
  })

  return () => {
    supabase.removeChannel(channel)
  }
}

export async function saveDiwaliCelebration(displayName, id) {
  const name = normalizeDisplayName(displayName)

  if (!name) {
    return { entry: null, error: new Error('A name is required.') }
  }

  if (name.length > DIWALI_NAME_MAX_LENGTH) {
    return {
      entry: null,
      error: new Error(`Name must be at most ${DIWALI_NAME_MAX_LENGTH} characters.`),
    }
  }

  const entryId = id || createCelebrationId()
  const localEntry = {
    id: entryId,
    display_name: name,
    created_at: new Date().toISOString(),
  }

  if (!supabase) {
    cacheCelebration(localEntry, { pending: true })

    return {
      entry: localEntry,
      error: new Error('Supabase is not configured.'),
      unavailable: true,
      unavailableReason: 'not_configured',
      localOnly: true,
    }
  }

  const { error } = await supabase
    .from(DIWALI_CELEBRATIONS_TABLE)
    .insert({ id: entryId, display_name: name })

  if (error) {
    // A retried request may reuse the same client-generated UUID. The primary
    // key conflict means the record already exists, so treat it as success.
    if (error.code === '23505') {
      cacheCelebration(localEntry)

      return {
        entry: localEntry,
        error: null,
        duplicate: true,
      }
    }

    // Keep the name on the visitor's device and retry it on a later visit, so
    // a temporary outage never makes the celebration disappear.
    cacheCelebration(localEntry, { pending: true })

    return {
      entry: localEntry,
      error,
      unavailable: isMissingCelebrationsTableError(error),
      unavailableReason: isMissingCelebrationsTableError(error)
        ? 'missing_table'
        : null,
      localOnly: true,
    }
  }

  cacheCelebration(localEntry)

  return {
    entry: localEntry,
    error: null,
  }
}
