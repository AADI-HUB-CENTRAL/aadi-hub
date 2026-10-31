import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { isSupabaseConfigured, supabase } from '../lib/supabase.js'

/* ---------------------------------------------------------------------------
   AuthProvider — the single source of truth for "who is signed in"
   ---------------------------------------------------------------------------
   Wraps Supabase's official session mechanism. It does NOT invent a parallel
   auth system, and it never stores tokens or passwords itself.

   Exposed via useAuth():
     status        'loading' | 'ready' | 'unconfigured' | 'error'
     configured    boolean
     session       Supabase session or null
     user          auth user or null
     profile       row from public.profiles, or null
     profileStatus 'idle' | 'loading' | 'ready' | 'missing' | 'error'
     profileError  string | null
     isAuthenticated
     refreshProfile()
     signOut()
--------------------------------------------------------------------------- */

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [status, setStatus] = useState(isSupabaseConfigured ? 'loading' : 'unconfigured')
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [profileStatus, setProfileStatus] = useState('idle')
  const [profileError, setProfileError] = useState(null)

  const userId = session?.user?.id || null

  // --- Session bootstrap + subscription -----------------------------------
  useEffect(() => {
    if (!supabase) {
      setStatus('unconfigured')
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
  const loadProfile = useCallback(async () => {
    if (!supabase) return
    if (!userId) {
      setProfile(null)
      setProfileStatus('idle')
      setProfileError(null)
      return
    }

    setProfileStatus('loading')
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle()

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
      setProfile(null)
      setProfileStatus('idle')
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
