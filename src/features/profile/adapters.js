import { publicMediaUrl } from './profileApi.js'

/* ---------------------------------------------------------------------------
   Profile <-> legacy "identity" adapter
   ---------------------------------------------------------------------------
   The dashboard/ID components were built against a flat `identity` object.
   Rather than rewrite every component, we translate a Supabase profile row
   into that shape here. One place to change if the shape ever moves.
--------------------------------------------------------------------------- */

export function profileToIdentity(profile) {
  if (!profile) return null

  const coverValue =
    profile.cover_type === 'custom' ? publicMediaUrl(profile.cover_value) : profile.cover_value

  return {
    id: profile.id,
    aadiId: profile.aadi_id,
    aadiIdNum: profile.aadi_id_num,
    role: profile.role,

    fullName: profile.full_name || '',
    headline: profile.headline || '',
    bio: profile.bio || '',
    college: profile.college || '',
    ageRange: profile.age_range || '',
    location: profile.location || '',

    skills: profile.skills || [],
    interests: profile.interests || [],
    goals: profile.goals || [],
    roles: profile.roles || [],

    currently: {
      building: profile.building || '',
      learning: profile.learning || '',
      exploring: profile.exploring || '',
      lookingFor: profile.looking_for || '',
      openTo: profile.open_to || '',
    },

    education: {
      degree: profile.course || '',
      year: profile.study_year || '',
    },

    // A short label used across cards, e.g. "AI & Web Development".
    domain: profile.headline || (profile.skills && profile.skills[0]) || '',

    profilePhoto: publicMediaUrl(profile.avatar_path),
    avatarPath: profile.avatar_path || null,
    profileCover: {
      type: profile.cover_type || 'preset',
      value: coverValue || 'cover-01',
      rawValue: profile.cover_value || null,
    },

    isPublic: profile.is_public !== false,
    createdAt: profile.created_at,
    onboardedAt: profile.onboarding_completed_at,
  }
}
