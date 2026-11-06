/* ============================================================
   AADI Identity — localStorage prototype utilities
   ============================================================
   This is a FRONTEND-ONLY prototype. A future backend will
   replace localStorage with a real database + ID allocation.
   ============================================================ */

const IDENTITY_STORAGE_KEY = 'aadi_identity'
const IDENTITIES_KEY = 'aadi_identities'
const SEQUENCE_KEY = 'aadi_next_id'
const START_ID = 70001

export function generateAadiId() {
  const current = parseInt(localStorage.getItem(SEQUENCE_KEY) || String(START_ID), 10)
  const id = `AADI-${String(current).padStart(5, '0')}`
  localStorage.setItem(SEQUENCE_KEY, String(current + 1))
  return id
}

export function saveIdentity(identity) {
  localStorage.setItem(IDENTITY_STORAGE_KEY, JSON.stringify(identity))

  const all = getAllIdentities()
  const idx = all.findIndex(i => i.aadiId === identity.aadiId)
  if (idx >= 0) {
    all[idx] = identity
  } else {
    all.push(identity)
  }
  localStorage.setItem(IDENTITIES_KEY, JSON.stringify(all))
}

export function updateIdentity(patch) {
  const current = getIdentity()
  if (!current) return null
  const updated = { ...current, ...patch }
  saveIdentity(updated)
  return updated
}

export function getIdentity() {
  try {
    const raw = localStorage.getItem(IDENTITY_STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function getAllIdentities() {
  try {
    return JSON.parse(localStorage.getItem(IDENTITIES_KEY) || '[]')
  } catch {
    return []
  }
}

export function getIdentityById(aadiId) {
  return getAllIdentities().find(i => i.aadiId === aadiId) || null
}

export function getInitials(fullName) {
  return fullName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase()
}

export function getPublicProfileUrl(aadiId) {
  const base = import.meta.env.VITE_PUBLIC_APP_URL || window.location.origin
  return `${base}/u/${aadiId}`
}

export async function shareProfile(aadiId) {
  const url = getPublicProfileUrl(aadiId)
  const title = 'My AADI Profile'
  const text = 'Check out my AADI HUB profile'
  if (navigator.share) {
    try {
      await navigator.share({ title, text, url })
      return 'shared'
    } catch { /* user cancelled or not supported */ }
  }
  try {
    await navigator.clipboard.writeText(url)
    return 'copied'
  } catch {
    return 'failed'
  }
}

export function getProfileCompletion(identity) {
  if (!identity) return { pct: 0, items: [] }
  const items = [
    { label: 'Profile photo', done: Boolean(identity.profilePhoto), weight: 15 },
    { label: 'Full name', done: Boolean(identity.fullName?.trim()), weight: 15 },
    { label: 'College / School', done: Boolean(identity.college?.trim()), weight: 12 },
    { label: 'Headline', done: Boolean(identity.headline?.trim()), weight: 10 },
    { label: 'About me', done: Boolean(identity.bio?.trim()), weight: 13 },
    { label: 'Skills', done: identity.skills?.length > 0, weight: 10 },
    { label: 'Interests', done: identity.interests?.length > 0, weight: 10 },
    { label: 'AADI goals', done: identity.goals?.length > 0, weight: 10 },
    { label: 'Education', done: Boolean(identity.education?.degree?.trim()), weight: 5 },
  ]
  const total = items.reduce((s, i) => s + i.weight, 0)
  const done = items.reduce((s, i) => s + (i.done ? i.weight : 0), 0)
  return { pct: Math.round((done / total) * 100), items }
}
