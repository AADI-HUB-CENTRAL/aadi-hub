import { supabase } from '../../lib/supabase.js'
import { cleanText, cleanMultiline, sanitizeUrl } from '../../lib/validation.js'

/* ---------------------------------------------------------------------------
   Opportunities Hub data access
   ---------------------------------------------------------------------------
   Honesty rules encoded here (and in RLS):
     * Published listings are world-readable.
     * A student may SUBMIT an opportunity; it lands as status='pending' and
       is_verified=false and is invisible to everyone but the submitter and
       moderators until a moderator publishes it.
     * Only moderators/admins can create a listing directly as published, or
       flip is_verified on. The UI must label unverified submissions as such.
     * Bookmarks are strictly private to the owner.
--------------------------------------------------------------------------- */

const OPPORTUNITY_COLUMNS = `
  id, title, description, type, organization, location, mode,
  eligibility, apply_url, deadline, status, is_verified,
  created_by, created_at, updated_at
`

function mapOpportunity(row) {
  if (!row) return null
  return {
    ...row,
    is_verified: Boolean(row.is_verified),
  }
}

/* ------------------------------- reading -------------------------------- */

/**
 * Browse published opportunities. `search` matches title, organization and
 * description. Filters narrow by type, mode and deadline window.
 */
export async function listOpportunities({
  search = '',
  type = '',
  mode = '',
  status = 'published',
  limit = 60,
} = {}) {
  if (!supabase) return { data: [], error: { message: 'Supabase is not configured.' } }

  let query = supabase
    .from('opportunities')
    .select(OPPORTUNITY_COLUMNS)
    .order('deadline', { ascending: true, nullsFirst: false })
    .order('created_at', { ascending: false })
    .limit(limit)

  if (status) query = query.eq('status', status)
  if (type) query = query.eq('type', type)
  if (mode) query = query.eq('mode', mode)

  const q = cleanText(search, 160)
  if (q) query = query.or(`title.ilike.%${q}%,organization.ilike.%${q}%,description.ilike.%${q}%`)

  const { data, error } = await query
  return { data: (data || []).map(mapOpportunity), error }
}

/** Opportunities the current user submitted (any status). */
export async function listMySubmissions(userId, { limit = 40 } = {}) {
  if (!supabase || !userId) return { data: [], error: { message: 'Supabase is not configured.' } }
  const { data, error } = await supabase
    .from('opportunities')
    .select(OPPORTUNITY_COLUMNS)
    .eq('created_by', userId)
    .order('created_at', { ascending: false })
    .limit(limit)
  return { data: (data || []).map(mapOpportunity), error }
}

export async function fetchOpportunity(id) {
  if (!supabase) return { data: null, error: { message: 'Supabase is not configured.' } }
  const { data, error } = await supabase
    .from('opportunities')
    .select(OPPORTUNITY_COLUMNS)
    .eq('id', id)
    .maybeSingle()
  return { data: mapOpportunity(data), error }
}

/* ------------------------------ bookmarks -------------------------------- */

/** The caller's bookmarked opportunity ids. */
export async function listMyBookmarkIds(userId) {
  if (!supabase || !userId) return { data: [], error: null }
  const { data, error } = await supabase
    .from('opportunity_bookmarks')
    .select('opportunity_id')
    .eq('user_id', userId)
  return { data: (data || []).map(r => r.opportunity_id), error }
}

/** Full bookmarked opportunities (joined), newest first. */
export async function listMyBookmarks(userId, { limit = 60 } = {}) {
  if (!supabase || !userId) return { data: [], error: { message: 'Supabase is not configured.' } }
  const { data, error } = await supabase
    .from('opportunity_bookmarks')
    .select(`opportunity_id, created_at, opportunity:opportunities!opportunity_bookmarks_opportunity_id_fkey (${OPPORTUNITY_COLUMNS})`)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)
  const rows = (data || [])
    .map(r => (r.opportunity ? mapOpportunity(r.opportunity) : null))
    .filter(Boolean)
  return { data: rows, error }
}

export async function addBookmark(userId, opportunityId) {
  if (!supabase) return { error: { message: 'Supabase is not configured.' } }
  const { error } = await supabase
    .from('opportunity_bookmarks')
    .insert({ user_id: userId, opportunity_id: opportunityId })
  // A duplicate PK error means it was already bookmarked — treat as success.
  if (error && error.code === '23505') return { error: null }
  return { error }
}

export async function removeBookmark(userId, opportunityId) {
  if (!supabase) return { error: { message: 'Supabase is not configured.' } }
  const { error } = await supabase
    .from('opportunity_bookmarks')
    .delete()
    .eq('user_id', userId)
    .eq('opportunity_id', opportunityId)
  return { error }
}

/* ------------------------------- writing -------------------------------- */

/** Validate an opportunity payload. Returns field -> message, or {}. */
export function validateOpportunityInput(patch, { moderator = false } = {}) {
  const errors = {}
  const title = cleanText(patch.title, 160)
  if (!title) errors.title = 'A title is required.'
  else if (title.length < 3) errors.title = 'Title must be at least 3 characters.'

  if (patch.type && !OPPORTUNITY_TYPES.some(t => t.value === patch.type)) {
    errors.type = 'Unknown opportunity type.'
  }
  if (patch.mode && patch.mode !== '' && !['remote', 'onsite', 'hybrid'].includes(patch.mode)) {
    errors.mode = 'Unknown mode.'
  }
  if (patch.apply_url && !sanitizeUrl(patch.apply_url)) {
    errors.apply_url = 'Enter a valid http(s) URL.'
  }
  if (patch.deadline && Number.isNaN(Date.parse(patch.deadline))) {
    errors.deadline = 'Enter a valid deadline date.'
  }
  if (!moderator && patch.status && patch.status !== 'pending') {
    errors.status = 'Submissions are reviewed before they go live.'
  }
  return errors
}

function toWritablePatch(patch, { moderator = false } = {}) {
  const out = {}
  if ('title' in patch) out.title = cleanText(patch.title, 160)
  if ('description' in patch) out.description = cleanMultiline(patch.description, 4000) || null
  if ('type' in patch) out.type = patch.type || 'other'
  if ('organization' in patch) out.organization = cleanText(patch.organization, 160) || null
  if ('location' in patch) out.location = cleanText(patch.location, 160) || null
  if ('mode' in patch) out.mode = patch.mode || null
  if ('eligibility' in patch) out.eligibility = cleanText(patch.eligibility, 300) || null
  if ('apply_url' in patch) out.apply_url = sanitizeUrl(patch.apply_url) || null
  if ('deadline' in patch) out.deadline = patch.deadline || null
  if (moderator) {
    if ('status' in patch) out.status = patch.status || 'draft'
    if ('is_verified' in patch) out.is_verified = Boolean(patch.is_verified)
  }
  return out
}

/**
 * Submit an opportunity. For ordinary students the row is always created as
 * status='pending', is_verified=false — RLS enforces this regardless of what
 * the client asks for. Moderators/admins may pass status/is_verified.
 */
export async function submitOpportunity(userId, patch, { moderator = false } = {}) {
  if (!supabase) return { data: null, error: { message: 'Supabase is not configured.' } }
  const errors = validateOpportunityInput(patch, { moderator })
  if (Object.keys(errors).length > 0) {
    return { data: null, error: { message: Object.values(errors)[0], fields: errors } }
  }

  const row = {
    created_by: userId,
    ...toWritablePatch(patch, { moderator }),
    ...(moderator ? {} : { status: 'pending', is_verified: false }),
  }

  const { data, error } = await supabase
    .from('opportunities')
    .insert(row)
    .select(OPPORTUNITY_COLUMNS)
    .maybeSingle()
  return { data: mapOpportunity(data), error }
}

/** Edit an existing submission (creator, while still pending) or listing. */
export async function updateOpportunity(id, patch, { moderator = false } = {}) {
  if (!supabase) return { data: null, error: { message: 'Supabase is not configured.' } }
  const errors = validateOpportunityInput(patch, { moderator })
  if (Object.keys(errors).length > 0) {
    return { data: null, error: { message: Object.values(errors)[0], fields: errors } }
  }
  const { data, error } = await supabase
    .from('opportunities')
    .update(toWritablePatch(patch, { moderator }))
    .eq('id', id)
    .select(OPPORTUNITY_COLUMNS)
    .maybeSingle()
  return { data: mapOpportunity(data), error }
}

/** Moderator action: publish or close a listing. */
export async function setOpportunityStatus(id, status, { verified = null } = {}) {
  if (!supabase) return { data: null, error: { message: 'Supabase is not configured.' } }
  const patch = { status }
  if (verified !== null) patch.is_verified = Boolean(verified)
  const { data, error } = await supabase
    .from('opportunities')
    .update(patch)
    .eq('id', id)
    .select(OPPORTUNITY_COLUMNS)
    .maybeSingle()
  return { data: mapOpportunity(data), error }
}

export async function deleteOpportunity(id) {
  if (!supabase) return { error: { message: 'Supabase is not configured.' } }
  const { error } = await supabase.from('opportunities').delete().eq('id', id)
  return { error }
}

/* --------------------------- shared vocabularies ------------------------- */

export const OPPORTUNITY_TYPES = [
  { value: 'internship', label: 'Internship' },
  { value: 'job', label: 'Job' },
  { value: 'hackathon', label: 'Hackathon' },
  { value: 'scholarship', label: 'Scholarship' },
  { value: 'research', label: 'Research' },
  { value: 'workshop', label: 'Workshop' },
  { value: 'event', label: 'Event' },
  { value: 'other', label: 'Other' },
]

export const OPPORTUNITY_MODES = [
  { value: 'remote', label: 'Remote' },
  { value: 'onsite', label: 'On-site' },
  { value: 'hybrid', label: 'Hybrid' },
]

export const OPPORTUNITY_STATUS_LABELS = {
  draft: 'Draft',
  pending: 'Awaiting review',
  published: 'Published',
  closed: 'Closed',
}

export function opportunityTypeLabel(value) {
  return OPPORTUNITY_TYPES.find(t => t.value === value)?.label || 'Other'
}

export function opportunityStatusLabel(value) {
  return OPPORTUNITY_STATUS_LABELS[value] || value
}
