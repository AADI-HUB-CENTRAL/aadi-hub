import { createContext, useContext, useEffect, useMemo, useState } from 'react'

/* ---------------------------------------------------------------------------
   Theme — view mode for the authenticated application.
   The preference is stored locally and only the app shell reads it, so the
   login, onboarding and public showcase keep the original AADI HUB look.
--------------------------------------------------------------------------- */

const STORAGE_KEY = 'aadi-view-mode'
const VIEW_MODES = ['default', 'dark', 'light']

const ThemeContext = createContext(null)

function readStoredMode() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    return VIEW_MODES.includes(stored) ? stored : 'dark'
  } catch {
    return 'dark'
  }
}

function systemPrefersLight() {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  return window.matchMedia('(prefers-color-scheme: light)').matches
}

export function ThemeProvider({ children }) {
  const [viewMode, setViewModeState] = useState(readStoredMode)
  const [systemLight, setSystemLight] = useState(systemPrefersLight)

  useEffect(() => {
    const query = window.matchMedia?.('(prefers-color-scheme: light)')
    if (!query) return undefined
    const onChange = (event) => setSystemLight(event.matches)
    query.addEventListener?.('change', onChange)
    return () => query.removeEventListener?.('change', onChange)
  }, [])

  function setViewMode(mode) {
    if (!VIEW_MODES.includes(mode)) return
    setViewModeState(mode)
    try {
      window.localStorage.setItem(STORAGE_KEY, mode)
    } catch {
      /* storage unavailable — the session still keeps the choice */
    }
  }

  const resolvedMode = viewMode === 'default'
    ? (systemLight ? 'light' : 'dark')
    : viewMode

  const value = useMemo(
    () => ({ viewMode, resolvedMode, setViewMode }),
    [viewMode, resolvedMode],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme() must be used inside <ThemeProvider>.')
  return ctx
}
