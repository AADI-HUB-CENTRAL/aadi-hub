import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { isSupabaseConfigured, supabase } from '../lib/supabase.js'
import { ensureMyProfile } from '../features/profile/profileApi.js'

/* ---------------------------------------------------------------------------
   AuthProvider — the single source of truth for "who is signed in"
   ---------------------------------------------------------------------------
   Sessions come exclusively from Supabase Auth; this provider never stores
   tokens or passwords itself. When the Supabase environment variables are
   missing there is no client, so nobody can be signed in — auth pages render
   a configuration notice instead of a form.

   Exposed via useAuth():
      status        'loading' | 'ready' | 'error'
      configured    boolean  (Supabase credentials present)
      session       session or null
      user          session user or null
      profile       profile row, or null
      profileStatus 'idle' | 'loading' | 'ready' | 'missing' | 'error'
      profileError  string | null
      isAuthenticated
      refreshProfile()
      signOut()
--------------------------------------------------------------------------- */

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [status, setStatus] = useState('loading')
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [profileStatus, setProfileStatus] = useState('idle')
  const [profileError, setProfileError] = useState(null)

  const userId = session?.user?.id || null

  // --- Session bootstrap + subscription -----------------------------------
  useEffect(() => {
    if (!supabase) {
      // Not configured: there is no auth service, so there is no session.
      setSession(null)
      setStatus('ready')
      return undefined
    }

    let active = true

    supabase.auth
      .getSession()
      .then(({ data, error }) => {
        if (!active) return
        if (error) {
          setStatus('error')
          return
        }
        setSession(data.session ?? null)
        setStatus('ready')
      })
      .catch(() => {
        if (active) setStatus('error')
      })

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      // Deliberately synchronous: awaiting other Supabase calls inside this
      // callback can deadlock the auth client. The profile effect below reacts.
      setSession(nextSession ?? null)
      setStatus('ready')
    })

    return () => {
      active = false
      subscription?.subscription?.unsubscribe()
    }
  }, [])

  // --- Profile loading ----------------------------------------------------
  // A verified session whose profile row is missing is a recoverable state,
  // not a permanent failure: ensureMyProfile() calls the SECURITY DEFINER
  // create_missing_profile() RPC, which can only ever create the caller's own
  // row. This is what closes the "account exists but profile does not" gap
  // for accounts whose signup trigger fired before the schema was fixed.
  const loadProfile = useCallback(async () => {
    if (!userId || !supabase) {
      setProfile(null)
      setProfileStatus('idle')
      setProfileError(null)
      return
    }

    setProfileStatus('loading')
    const { data, error } = await ensureMyProfile(userId)

    if (error) {
      setProfile(null)
      setProfileStatus('error')
      setProfileError(error.message || 'Could not load your profile.')
      return
    }

    setProfile(data ?? null)
    setProfileError(null)
    setProfileStatus(data ? 'ready' : 'missing')
  }, [userId])

  useEffect(() => {
    loadProfile()
  }, [loadProfile])

  const signOut = useCallback(async () => {
    if (!supabase) return { error: null }
    const { error } = await supabase.auth.signOut()
    if (!error) {
      setSession(null)
      setProfile(null)
      setProfileStatus('idle')
      setProfileError(null)
    }
    return { error }
  }, [])

  const value = useMemo(
    () => ({
      status,
      configured: isSupabaseConfigured,
      session,
      user: session?.user ?? null,
      profile,
      profileStatus,
      profileError,
      isAuthenticated: Boolean(session?.user),
      refreshProfile: loadProfile,
      signOut,
    }),
    [status, session, profile, profileStatus, profileError, loadProfile, signOut]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth() must be used inside <AuthProvider>.')
  }
  return ctx
}
