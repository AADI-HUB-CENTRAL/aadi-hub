import { supabase } from '../../lib/supabase.js'
import { cleanText, cleanMultiline, sanitizeUrl } from '../../lib/validation.js'

/* ---------------------------------------------------------------------------
   Projects & collaboration data access
   ---------------------------------------------------------------------------
   RLS is the security boundary. This module only shapes requests and maps
   results. Nothing here can bypass a policy the database enforces.

   Collaboration model:
     * Anyone signed in may send ONE join request per project
       (insert into project_members with status='pending').
     * The project owner approves (status='active') or rejects
       (status='rejected'). The requester may withdraw (delete their row).
     * Only 'active' members and the owner see private projects.
--------------------------------------------------------------------------- */

const PROJECT_COLUMNS = `
  id, owner_id, title, description, category, technologies,
  roles_needed, skills_needed, status, repo_url, demo_url,
  visibility, created_at, updated_at
`

const MEMBER_COLUMNS = `
  project_id, user_id, role, status, message, created_at
`

const OWNER_PUBLIC_COLUMNS = 'id, aadi_id, full_name, headline, avatar_path, cover_type, cover_value'

const MEMBER_PROFILE_COLUMNS = `
  user_id, role, status, message, created_at,
  profile:profiles!project_members_user_id_fkey ( id, aadi_id, full_name, headline, avatar_path )
`

/** Map a raw row into the shape the UI expects. */
function mapProject(row) {
  if (!row) return null
  const { owner, members, ...rest } = row
  return {
    ...rest,
    technologies: row.technologies || [],
    roles_needed: row.roles_needed || [],
    skills_needed: row.skills_needed || [],
    owner: owner || null,
    members: members || [],
  }
}

/* ------------------------------- reading -------------------------------- */

/**
 * Public project directory. RLS already restricts private projects; this
 * query only asks for what everyone may see. `search` matches title,
 * description and technology tags. `category` / `status` narrow further.
 */
export async function listProjects({ search = '', category = '', status = '', limit = 60 } = {}) {
  if (!supabase) return { data: [], error: { message: 'Supabase is not configured.' } }

  let query = supabase
    .from('projects')
    .select(`${PROJECT_COLUMNS}, owner:profiles!projects_owner_id_fkey (${OWNER_PUBLIC_COLUMNS})`)
    .eq('visibility', 'public')
    .neq('status', 'archived')
    .order('created_at', { ascending: false })
    .limit(limit)

  const q = cleanText(search, 120)
  if (q) query = query.or(`title.ilike.%${q}%,description.ilike.%${q}%`)
  if (category) query = query.eq('category', category)
  if (status) query = query.eq('status', status)

  const { data, error } = await query
  return { data: (data || []).map(mapProject), error }
}

/** Projects the user owns or is an active member of. */
export async function listMyProjects(userId, { limit = 60 } = {}) {
  if (!supabase || !userId) return { data: [], error: { message: 'Supabase is not configured.' } }

  const [{ data: owned, error: ownedErr }, { data: joined, error: joinedErr }] = await Promise.all([
    supabase
      .from('projects')
      .select(PROJECT_COLUMNS)
      .eq('owner_id', userId)
      .neq('status', 'archived')
      .order('created_at', { ascending: false })
      .limit(limit),
    supabase
      .from('project_members')
      .select(`project_id, role, status, project:projects!project_members_project_id_fkey (${PROJECT_COLUMNS})`)
      .eq('user_id', userId)
      .eq('status', 'active'),
  ])

  const error = ownedErr || joinedErr
  if (error) return { data: [], error }

  const ownedMapped = (owned || []).map(p => ({ ...p, technologies: p.technologies || [], roles_needed: p.roles_needed || [], skills_needed: p.skills_needed || [], owner: null, members: [], membership: { role: 'owner', status: 'active' } }))

  const joinedMapped = (joined || [])
    .filter(r => r.project && r.project.status !== 'archived' && r.project.visibility !== 'private')
    .map(r => ({
      ...r.project,
      technologies: r.project.technologies || [],
      roles_needed: r.project.roles_needed || [],
      skills_needed: r.project.skills_needed || [],
      owner: null,
      members: [],
      membership: { role: r.role, status: r.status },
    }))

  const seen = new Set(ownedMapped.map(p => p.id))
  const merged = [...ownedMapped, ...joinedMapped.filter(p => !seen.has(p.id))]
  return { data: merged, error: null }
}

/** Join requests the user has sent, newest first. */
export async function listMyJoinRequests(userId, { limit = 30 } = {}) {
  if (!supabase || !userId) return { data: [], error: { message: 'Supabase is not configured.' } }
  const { data, error } = await supabase
    .from('project_members')
    .select(`project_id, status, message, created_at, project:projects!project_members_project_id_fkey ( id, title, owner_id )`)
    .eq('user_id', userId)
    .eq('status', 'pending')
    .order('created_at', { ascending: false })
    .limit(limit)
  return { data: data || [], error }
}

/** Full detail for one project, including members the caller may see. */
export async function fetchProject(projectId) {
  if (!supabase) return { data: null, error: { message: 'Supabase is not configured.' } }
  const { data, error } = await supabase
    .from('projects')
    .select(`${PROJECT_COLUMNS}, owner:profiles!projects_owner_id_fkey (${OWNER_PUBLIC_COLUMNS})`)
    .eq('id', projectId)
    .maybeSingle()
  if (error || !data) return { data: null, error }

  const { data: members, error: membersError } = await supabase
    .from('project_members')
    .select(MEMBER_PROFILE_COLUMNS)
    .eq('project_id', projectId)
    .order('created_at', { ascending: true })

  if (membersError) return { data: mapProject(data), error: membersError }
  return { data: mapProject({ ...data, members: members || [] }), error: null }
}

/** Pending join requests on a project the caller owns. */
export async function listJoinRequests(projectId) {
  if (!supabase) return { data: [], error: { message: 'Supabase is not configured.' } }
  const { data, error } = await supabase
    .from('project_members')
    .select(MEMBER_PROFILE_COLUMNS)
    .eq('project_id', projectId)
    .eq('status', 'pending')
    .order('created_at', { ascending: true })
  return { data: data || [], error }
}

/** The caller's own membership row on a project, if any. */
export async function fetchMyMembership(projectId, userId) {
  if (!supabase || !userId) return { data: null, error: null }
  const { data, error } = await supabase
    .from('project_members')
    .select('project_id, user_id, role, status, message, created_at')
    .eq('project_id', projectId)
    .eq('user_id', userId)
    .maybeSingle()
  return { data: data ?? null, error }
}

/* ------------------------------- writing -------------------------------- */

function toWritableProjectPatch(patch, { partial = false } = {}) {
  const out = {}
  if (!partial || 'title' in patch) out.title = cleanText(patch.title, 120)
  if (!partial || 'description' in patch) out.description = cleanMultiline(patch.description, 2000) || null
  if (!partial || 'category' in patch) out.category = cleanText(patch.category, 80) || null
  if (!partial || 'technologies' in patch) out.technologies = (patch.technologies || []).slice(0, 30)
  if (!partial || 'roles_needed' in patch) out.roles_needed = (patch.roles_needed || []).slice(0, 20)
  if (!partial || 'skills_needed' in patch) out.skills_needed = (patch.skills_needed || []).slice(0, 30)
  if (!partial || 'status' in patch) out.status = patch.status || 'planning'
  if (!partial || 'repo_url' in patch) out.repo_url = sanitizeUrl(patch.repo_url) || null
  if (!partial || 'demo_url' in patch) out.demo_url = sanitizeUrl(patch.demo_url) || null
  if (!partial || 'visibility' in patch) out.visibility = patch.visibility === 'private' ? 'private' : 'public'
  return out
}

/** Validate a project payload. Returns an object of field -> message, or {}. */
export function validateProjectInput(patch, { partial = false } = {}) {
  const errors = {}
  if (!partial || 'title' in patch) {
    const t = cleanText(patch.title, 120)
    if (!t) errors.title = 'A project needs a title.'
    else if (t.length < 3) errors.title = 'Title must be at least 3 characters.'
  }
  if (!partial || 'status' in patch) {
    const allowed = ['planning', 'in_progress', 'completed', 'archived']
    if (patch.status && !allowed.includes(patch.status)) errors.status = 'Unknown status.'
  }
  if (!partial || 'visibility' in patch) {
    if (patch.visibility && !['public', 'private'].includes(patch.visibility)) errors.visibility = 'Unknown visibility.'
  }
  if (!partial || 'repo_url' in patch) {
    if (patch.repo_url && !sanitizeUrl(patch.repo_url)) errors.repo_url = 'Enter a valid http(s) URL.'
  }
  if (!partial || 'demo_url' in patch) {
    if (patch.demo_url && !sanitizeUrl(patch.demo_url)) errors.demo_url = 'Enter a valid http(s) URL.'
  }
  return errors
}

export async function createProject(ownerId, patch) {
  if (!supabase) return { data: null, error: { message: 'Supabase is not configured.' } }
  const errors = validateProjectInput(patch)
  if (Object.keys(errors).length > 0) return { data: null, error: { message: Object.values(errors)[0], fields: errors } }

  const { data, error } = await supabase
    .from('projects')
    .insert({ owner_id: ownerId, ...toWritableProjectPatch(patch) })
    .select(PROJECT_COLUMNS)
    .single()
  return { data, error }
}

export async function updateProject(projectId, patch) {
  if (!supabase) return { data: null, error: { message: 'Supabase is not configured.' } }
  const errors = validateProjectInput(patch, { partial: true })
  if (Object.keys(errors).length > 0) return { data: null, error: { message: Object.values(errors)[0], fields: errors } }

  const { data, error } = await supabase
    .from('projects')
    .update(toWritableProjectPatch(patch, { partial: true }))
    .eq('id', projectId)
    .select(PROJECT_COLUMNS)
    .maybeSingle()
  return { data, error }
}

export async function archiveProject(projectId) {
  if (!supabase) return { data: null, error: { message: 'Supabase is not configured.' } }
  const { data, error } = await supabase
    .from('projects')
    .update({ status: 'archived' })
    .eq('id', projectId)
    .select('id, status')
    .maybeSingle()
  return { data, error }
}

export async function deleteProject(projectId) {
  if (!supabase) return { error: { message: 'Supabase is not configured.' } }
  const { error } = await supabase.from('projects').delete().eq('id', projectId)
  return { error }
}

/* ---------------------------- collaboration ----------------------------- */

/** Send a join request. `message` is optional context for the owner. */
export async function requestToJoin(projectId, userId, message = '') {
  if (!supabase) return { data: null, error: { message: 'Supabase is not configured.' } }
  const text = cleanMultiline(message, 500) || null
  const { data, error } = await supabase
    .from('project_members')
    .insert({ project_id: projectId, user_id: userId, role: 'member', status: 'pending', message: text })
    .select('project_id, user_id, role, status, message, created_at')
    .maybeSingle()
  return { data, error }
}

/** Withdraw your own pending request (or leave an active membership). */
export async function leaveProject(projectId, userId) {
  if (!supabase) return { error: { message: 'Supabase is not configured.' } }
  const { error } = await supabase
    .from('project_members')
    .delete()
    .eq('project_id', projectId)
    .eq('user_id', userId)
  return { error }
}

/** Owner approves or rejects a pending request. */
export async function respondToJoinRequest(projectId, requesterId, accept) {
  if (!supabase) return { data: null, error: { message: 'Supabase is not configured.' } }
  const { data, error } = await supabase
    .from('project_members')
    .update({ status: accept ? 'active' : 'rejected' })
    .eq('project_id', projectId)
    .eq('user_id', requesterId)
    .eq('status', 'pending')
    .select('project_id, user_id, role, status')
    .maybeSingle()
  return { data, error }
}

/** Remove an active member (owner action) — same as revoke. */
export async function removeMember(projectId, memberId) {
  if (!supabase) return { error: { message: 'Supabase is not configured.' } }
  const { error } = await supabase
    .from('project_members')
    .delete()
    .eq('project_id', projectId)
    .eq('user_id', memberId)
  return { error }
}

/* --------------------------- shared vocabularies ------------------------- */

export const PROJECT_CATEGORIES = [
  'AI', 'Web', 'Mobile', 'Design', 'Data', 'Hardware', 'Business', 'Research', 'Other',
]

export const PROJECT_STATUSES = [
  { value: 'planning', label: 'Planning' },
  { value: 'in_progress', label: 'In progress' },
  { value: 'completed', label: 'Completed' },
]

export const COLLAB_ROLES = [
  'Developer', 'Designer', 'Product', 'Research', 'Content', 'Marketing', 'Mentor',
]
