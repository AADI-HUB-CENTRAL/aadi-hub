import { useState, useId } from 'react'
import { cleanText, cleanMultiline } from '../../lib/validation.js'
import { getInitials } from '../../utils/identity.js'

/* ---------------------------------------------------------------------------
   Product UI kit — the only components new screens import.
   Styled exclusively by src/product/styles/product.css.
--------------------------------------------------------------------------- */

/* ------------------------------- Logo ------------------------------------ */

export function ProductLogo({ size = 22, symbol = 26, className = '' }) {
  return (
    <span className={`p-logo ${className}`.trim()}>
      <svg width={symbol} height={symbol} viewBox="0 0 40 40" fill="none" aria-hidden="true">
        <path
          d="M20 6.5 L34.5 34.5 H27.5 L20 18.9 L12.5 34.5 H5.5 Z"
          fill="currentColor" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"
        />
        <circle cx="20" cy="26.6" r="6.4" fill="var(--night-900)" stroke="currentColor" strokeWidth="2.6" />
        <circle cx="20" cy="26.6" r="2.2" fill="currentColor" />
      </svg>
      <span className="p-logo__text" style={{ fontSize: size }}>
        AADI <b>HUB</b>
      </span>
    </span>
  )
}

/* ------------------------------- Button ---------------------------------- */

export function Button({
  children, onClick, type = 'button', variant = 'primary', size = 'md',
  disabled = false, loading = false, full = false, className = '', ...rest
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`p-btn p-btn--${variant} p-btn--${size}${full ? ' p-btn--full' : ''}${className ? ` ${className}` : ''}`}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading && <span className="p-btn__spinner" aria-hidden="true" />}
      {children}
    </button>
  )
}

export function IconButton({ label, onClick, children, className = '' }) {
  return (
    <button type="button" onClick={onClick} className={`p-iconbtn ${className}`.trim()} aria-label={label}>
      {children}
    </button>
  )
}

/* ------------------------------- Fields ---------------------------------- */

function useFieldId(explicit) {
  const rid = useId()
  return explicit || rid
}

export function Field({ label, error, hint, children, required = false }) {
  const id = useId()
  return (
    <div className={`p-field${error ? ' p-field--error' : ''}`}>
      {label && (
        <label className="p-field__label" htmlFor={id}>
          {label}
          {required && <span className="p-field__req" aria-hidden="true"> *</span>}
        </label>
      )}
      {typeof children === 'function' ? children({ id, describedBy: error ? `${id}-err` : undefined }) : children}
      {hint && !error && <p className="p-field__hint">{hint}</p>}
      {error && <p className="p-field__error" id={`${id}-err`} role="alert">{error}</p>}
    </div>
  )
}

export function TextInput({ id, error, className = '', ...rest }) {
  return (
    <input
      id={id}
      className={`p-input ${className}`.trim()}
      aria-invalid={error ? 'true' : undefined}
      {...rest}
    />
  )
}

export function PasswordInput({ id, value, onChange, error, placeholder, autoComplete, name }) {
  const [show, setShow] = useState(false)
  return (
    <div className={`p-input-wrap${error ? ' p-input-wrap--error' : ''}`}>
      <input
        id={id} name={name || 'password'}
        type={show ? 'text' : 'password'}
        className="p-input"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={error ? 'true' : undefined}
      />
      <button
        type="button" className="p-input__toggle"
        onClick={() => setShow(s => !s)}
        aria-label={show ? 'Hide password' : 'Show password'}
        tabIndex={0}
      >
        {show ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><path d="M1 1l22 22"/></svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
        )}
      </button>
    </div>
  )
}

export function TextArea({ id, error, rows = 4, className = '', ...rest }) {
  return (
    <textarea
      id={id}
      rows={rows}
      className={`p-input p-textarea ${className}`.trim()}
      aria-invalid={error ? 'true' : undefined}
      {...rest}
    />
  )
}

export function Select({ id, error, options, placeholder, className = '', ...rest }) {
  return (
    <div className={`p-select-wrap${error ? ' p-input-wrap--error' : ''}`}>
      <select id={id} className={`p-input p-select ${className}`.trim()} aria-invalid={error ? 'true' : undefined} {...rest}>
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(o => (
          <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>
        ))}
      </select>
      <svg className="p-select-wrap__chev" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>
    </div>
  )
}

/* ------------------------------- Chips ----------------------------------- */

export function Chip({ label, selected = false, onToggle, removable = false, onRemove }) {
  if (removable) {
    return (
      <span className="p-chip p-chip--removable">
        {label}
        <button type="button" onClick={onRemove} aria-label={`Remove ${label}`} className="p-chip__x">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>
        </button>
      </span>
    )
  }
  return (
    <button
      type="button"
      className={`p-chip${selected ? ' p-chip--on' : ''}`}
      onClick={onToggle}
      aria-pressed={selected}
    >
      {selected && (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg>
      )}
      {label}
    </button>
  )
}

export function SearchInput({ value, onChange, placeholder = 'Search…' }) {
  const id = useId()
  return (
    <div className="p-search">
      <svg className="p-search__icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
      <input
        id={id} type="search" className="p-input p-search__input"
        value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  )
}

/* ------------------------------ Avatar ----------------------------------- */

export function Avatar({ src, name = '', size = 40 }) {
  const initials = getInitials(name)
  return (
    <span className="p-avatar" style={{ width: size, height: size, fontSize: size * 0.38 }}>
      {src ? <img src={src} alt="" className="p-avatar__img" /> : initials}
    </span>
  )
}

/* ------------------------------ Badge / Tag ------------------------------- */

export function Badge({ children, tone = 'neutral' }) {
  return <span className={`p-badge p-badge--${tone}`}>{children}</span>
}

/* ------------------------------ Spinner ---------------------------------- */

export function Spinner({ label }) {
  return (
    <span className="p-spinner" role="status" aria-live="polite">
      <span className="p-spinner__dot" aria-hidden="true" />
      {label && <span className="p-spinner__label">{label}</span>}
    </span>
  )
}

export function PageState({ icon, title, body, action }) {
  return (
    <div className="p-pagestate">
      {icon && <div className="p-pagestate__icon" aria-hidden="true">{icon}</div>}
      <h3 className="p-pagestate__title">{title}</h3>
      {body && <p className="p-pagestate__body">{body}</p>}
      {action}
    </div>
  )
}

export function InlineError({ children }) {
  if (!children) return null
  return <p className="p-inline-error" role="alert">{children}</p>
}

export function InlineSuccess({ children }) {
  if (!children) return null
  return <p className="p-inline-success" role="status">{children}</p>
}

/* ------------------------------ Progress --------------------------------- */

export function StepBar({ steps, current }) {
  return (
    <ol className="p-steps" aria-label="Onboarding progress">
      {steps.map((label, i) => {
        const state = i < current ? 'done' : i === current ? 'now' : 'todo'
        return (
          <li key={label} className={`p-steps__item p-steps__item--${state}`} aria-current={state === 'now' ? 'step' : undefined}>
            <span className="p-steps__dot">{i + 1}</span>
            <span className="p-steps__label">{label}</span>
          </li>
        )
      })}
    </ol>
  )
}

export function ProgressBar({ pct }) {
  return (
    <div className="p-progress" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
      <div className="p-progress__fill" style={{ width: `${Math.min(100, Math.max(0, pct))}%` }} />
    </div>
  )
}

/* ------------------------------ helpers ---------------------------------- */

/** Shared validation used by auth + profile forms. */
export function validateEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(v || '').trim())
}

export function validateRequired(v, max = 200) {
  return Boolean(cleanText(v, max))
}

export { cleanText, cleanMultiline }
