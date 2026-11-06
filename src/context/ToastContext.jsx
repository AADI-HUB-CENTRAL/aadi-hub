import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'

/* ---------------------------------------------------------------------------
   Toast — lightweight transient feedback
   ---------------------------------------------------------------------------
   Used for honest, non-blocking confirmations ("Request sent", "Saved").
   Never used to report errors the user must act on — those stay inline.
--------------------------------------------------------------------------- */

const ToastContext = createContext(null)

let nextId = 0

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const timersRef = useRef(new Map())

  const dismiss = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
    const timer = timersRef.current.get(id)
    if (timer) {
      clearTimeout(timer)
      timersRef.current.delete(id)
    }
  }, [])

  const push = useCallback((message, tone = 'success', ttl = 4000) => {
    const id = ++nextId
    setToasts(prev => [...prev.slice(-2), { id, message, tone }])
    const timer = setTimeout(() => dismiss(id), ttl)
    timersRef.current.set(id, timer)
    return id
  }, [dismiss])

  const value = useMemo(() => ({
    push,
    dismiss,
    success: (msg) => push(msg, 'success'),
    info: (msg) => push(msg, 'info'),
    error: (msg) => push(msg, 'error', 6000),
  }), [push, dismiss])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-stack" role="status" aria-live="polite">
        {toasts.map(t => (
          <div key={t.id} className={`toast toast--${t.tone}`}>
            <span className="toast__msg">{t.message}</span>
            <button className="toast__close" onClick={() => dismiss(t.id)} aria-label="Dismiss">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast() must be used inside <ToastProvider>.')
  return ctx
}
