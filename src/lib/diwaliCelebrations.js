import { supabase } from './supabase.js'

export const DIWALI_CELEBRATIONS_TABLE = 'diwali_celebrations'
export const DIWALI_CELEBRATION_LIMIT = 30
export const DIWALI_NAME_MAX_LENGTH = 48

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
  }
}

export async function fetchDiwaliCelebrations(
  limit = DIWALI_CELEBRATION_LIMIT
) {
  if (!supabase) {
    return { entries: [], error: null, unavailable: true }
  }

  const { data, error } = await supabase
    .from(DIWALI_CELEBRATIONS_TABLE)
    .select('id, display_name, created_at')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    return {
      entries: [],
      error,
      unavailable: isMissingCelebrationsTableError(error),
    }
  }

  const entries = (data || []).map(normalizeRow).filter(Boolean)
  return { entries, error: null, unavailable: false }
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

  if (!supabase) {
    return {
      entry: null,
      error: new Error('Supabase is not configured.'),
      unavailable: true,
    }
  }

  const { error } = await supabase
    .from(DIWALI_CELEBRATIONS_TABLE)
    .insert({ id: entryId, display_name: name })

  if (error) {
    // A retried request may reuse the same client-generated UUID. The primary
    // key conflict means the record already exists, so treat it as success.
    if (error.code === '23505') {
      return {
        entry: {
          id: entryId,
          display_name: name,
          created_at: new Date().toISOString(),
        },
        error: null,
        duplicate: true,
      }
    }

    return {
      entry: null,
      error,
      unavailable: isMissingCelebrationsTableError(error),
    }
  }

  return {
    entry: {
      id: entryId,
      display_name: name,
      created_at: new Date().toISOString(),
    },
    error: null,
  }
}
