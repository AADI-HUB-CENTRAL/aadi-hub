import { supabase } from '../../lib/supabase.js'
import { cleanMultiline, cleanText, sanitizeUrl } from '../../lib/validation.js'

/* ---------------------------------------------------------------------------
   Profile data access
   ---------------------------------------------------------------------------
   All reads/writes go through Supabase. RLS decides what is actually allowed;
   this module only shapes the data. Never trust a value coming from here as
   authorised — the database already enforced it.
--------------------------------------------------------------------------- */

const PUBLIC_COLUMNS = `
  id, aadi_id, aadi_id_num, role, full_name, headline, bio, college, course,
  study_year, age_range, location, skills, interests, goals, roles,
  building, learning, exploring, looking_for, open_to, avatar_path,
  cover_type, cover_value, github_url, portfolio_url, linkedin_url,
  department, graduation_year, skill_levels, collab_prefs, collab_mode,
  is_public, onboarding_completed_at, created_at, updated_at
`

export async function fetchMyProfile(userId) {
  if (!supabase) return { data: null, error: { message: 'Supabase is not configured.' } }
  const { data, error } = await supabase
    .from('profiles')
    .select(PUBLIC_COLUMNS)
    .eq('id', userId)
    .maybeSingle()
  return { data, error }
}

export async function fetchProfileByAadiId(aadiId) {
  if (!supabase) return { data: null, error: { message: 'Supabase is not configured.' } }
  const { data, error } = await supabase
    .from('profiles')
    .select(PUBLIC_COLUMNS)
    .eq('aadi_id', aadiId)
    .maybeSingle()
  return { data, error }
}

/** Only these fields are ever writable by the user. */
function toWritablePatch(patch) {
  const out = {}
  if ('full_name' in patch) out.full_name = cleanText(patch.full_name, 120)
  if ('headline' in patch) out.headline = cleanText(patch.headline, 160) || null
  if ('bio' in patch) out.bio = cleanMultiline(patch.bio, 500) || null
  if ('college' in patch) out.college = cleanText(patch.college, 160) || null
  if ('course' in patch) out.course = cleanText(patch.course, 160) || null
  if ('study_year' in patch) out.study_year = cleanText(patch.study_year, 40) || null
  if ('age_range' in patch) out.age_range = patch.age_range || null
  if ('location' in patch) out.location = cleanText(patch.location, 120) || null
  if ('skills' in patch) out.skills = Array.isArray(patch.skills) ? patch.skills.slice(0, 40) : []
  if ('interests' in patch) out.interests = Array.isArray(patch.interests) ? patch.interests.slice(0, 40) : []
  if ('goals' in patch) out.goals = Array.isArray(patch.goals) ? patch.goals.slice(0, 40) : []
  if ('roles' in patch) out.roles = Array.isArray(patch.roles) ? patch.roles.slice(0, 20) : []
  if ('building' in patch) out.building = cleanText(patch.building, 160) || null
  if ('learning' in patch) out.learning = cleanText(patch.learning, 160) || null
  if ('exploring' in patch) out.exploring = cleanText(patch.exploring, 160) || null
  if ('looking_for' in patch) out.looking_for = cleanText(patch.looking_for, 160) || null
  if ('open_to' in patch) out.open_to = cleanText(patch.open_to, 160) || null
  if ('github_url' in patch) out.github_url = sanitizeUrl(patch.github_url) || null
  if ('portfolio_url' in patch) out.portfolio_url = sanitizeUrl(patch.portfolio_url) || null
  if ('linkedin_url' in patch) out.linkedin_url = sanitizeUrl(patch.linkedin_url) || null
  if ('department' in patch) out.department = cleanText(patch.department, 160) || null
  if ('graduation_year' in patch) {
    const y = Number(patch.graduation_year)
    out.graduation_year = Number.isInteger(y) && y >= 2024 && y <= 2100 ? y : null
  }
  if ('skill_levels' in patch) {
    const raw = patch.skill_levels && typeof patch.skill_levels === 'object' ? patch.skill_levels : {}
    const cleaned = {}
    for (const [k, v] of Object.entries(raw).slice(0, 60)) {
      const level = String(v || '')
      if (['Beginner', 'Intermediate', 'Advanced'].includes(level)) cleaned[cleanText(k, 80)] = level
    }
    out.skill_levels = cleaned
  }
  if ('collab_prefs' in patch) out.collab_prefs = Array.isArray(patch.collab_prefs) ? patch.collab_prefs.slice(0, 20) : []
  if ('collab_mode' in patch) out.collab_mode = ['remote', 'onsite', 'hybrid'].includes(patch.collab_mode) ? patch.collab_mode : null
  if ('is_public' in patch) out.is_public = Boolean(patch.is_public)
  if ('avatar_path' in patch) out.avatar_path = patch.avatar_path || null
  if ('cover_type' in patch) out.cover_type = patch.cover_type === 'custom' ? 'custom' : 'preset'
  if ('cover_value' in patch) out.cover_value = patch.cover_value || null
  if ('onboarding_completed_at' in patch) out.onboarding_completed_at = patch.onboarding_completed_at
  return out
}

export async function updateMyProfile(userId, patch) {
  if (!supabase) return { data: null, error: { message: 'Supabase is not configured.' } }
  const { data, error } = await supabase
    .from('profiles')
    .update(toWritablePatch(patch))
    .eq('id', userId)
    .select(PUBLIC_COLUMNS)
    .maybeSingle()
  return { data, error }
}

/* ------------------------------- storage -------------------------------- */

const BUCKET = 'profile-media'
const MAX_BYTES = 5 * 1024 * 1024
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp']

export function validateImageFile(file) {
  if (!file) return 'Please choose an image file.'
  if (!ALLOWED.includes(file.type)) return 'Please use a JPEG, PNG or WebP image.'
  if (file.size > MAX_BYTES) return 'Image must be under 5 MB.'
  return null
}

/**
 * Upload an image into the caller's own folder: <uid>/<name>.
 * The storage policies only permit writes inside that folder.
 */
export async function uploadProfileMedia(userId, file, kind = 'avatar') {
  if (!supabase) return { path: null, error: { message: 'Supabase is not configured.' } }
  const ext = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg'
  const path = `${userId}/${kind}-${Date.now()}.${ext}`

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: true,
    contentType: file.type,
  })

  if (error) return { path: null, error }
  return { path, error: null }
}

export function publicMediaUrl(path) {
  if (!path || !supabase) return null
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return data?.publicUrl || null
}

/** Remove a previously uploaded object. Failures are non-fatal. */
export async function removeProfileMedia(path) {
  if (!path || !supabase) return
  await supabase.storage.from(BUCKET).remove([path])
}

/* --------------------------- shared vocabularies ------------------------- */

export const SKILLS = [
  'AI', 'Machine Learning', 'Data Science', 'Data Analysis', 'Python', 'Java',
  'JavaScript', 'Web Development', 'App Development', 'UI/UX Design', 'Graphic Design',
  'Content Creation', 'Video Editing', 'Business', 'Entrepreneurship', 'Communication',
  'Leadership', 'Research', 'Cloud', 'Cybersecurity',
]

export const INTERESTS = [
  'AI', 'Technology', 'Data', 'Design', 'Content', 'Startups', 'Business',
  'Gaming', 'Creative', 'Photography', 'Finance', 'Education', 'Innovation', 'Open Source',
]

export const GOALS = [
  'BUILD', 'CONNECT', 'LEARN', 'CREATE', 'COMPETE', 'LEAD', 'FIND OPPORTUNITIES', 'MEET PEOPLE',
]

export const AGE_RANGES = ['Under 15', '15-18', '18-24', '25+']

export const ROLES = ['Builder', 'Learner', 'Creator', 'Developer', 'Designer', 'Entrepreneur']

export const STUDY_YEARS = ['1st year', '2nd year', '3rd year', '4th year', 'Graduated', 'Other']
