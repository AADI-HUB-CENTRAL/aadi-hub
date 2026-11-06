import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ProductLogo } from '../../ui/kit.jsx'
import '../../styles/product.css'
import '../../styles/auth-split.css'

/* ---------------------------------------------------------------------------
   Shared split-screen frame for every auth screen.

   Desktop: dark brand panel (story + abstract network visual + highlight
   ticker) on the left, light form surface on the right.
   Mobile (<900px): the brand panel collapses to a compact header above the
   single-column form.

   Props:
     title    — page <h1> rendered on the form panel
     subtitle — short supporting line under the title (optional)
     children — the form content
     footer   — node rendered below the form (cross links, back to home)
--------------------------------------------------------------------------- */

const HIGHLIGHTS = ['Build Together', 'Discover Opportunities', 'Grow Your Skills']

const NODES = [
  { id: 'a', x: 48, y: 64 },
  { id: 'b', x: 134, y: 34, kind: 'kiwi' },
  { id: 'c', x: 228, y: 56 },
  { id: 'd', x: 304, y: 106 },
  { id: 'e', x: 174, y: 110, kind: 'accent', pulse: 'a' },
  { id: 'f', x: 86, y: 122 },
  { id: 'g', x: 52, y: 198, kind: 'kiwi' },
  { id: 'h', x: 156, y: 190 },
  { id: 'i', x: 256, y: 168, kind: 'accent', pulse: 'b' },
  { id: 'j', x: 212, y: 230 },
]

const EDGES = [
  ['a', 'b'], ['b', 'c'], ['c', 'd'],
  ['a', 'f'], ['b', 'e'], ['c', 'e'], ['c', 'i'], ['d', 'i'],
  ['f', 'e'], ['f', 'g'], ['g', 'h'], ['h', 'e'],
  ['h', 'j'], ['i', 'j'], ['i', 'e'],
]

const NODE_BY_ID = Object.fromEntries(NODES.map(n => [n.id, n]))

function prefersReducedMotion() {
  return typeof window !== 'undefined'
    && typeof window.matchMedia === 'function'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function HighlightTicker() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (prefersReducedMotion()) return undefined
    const id = setInterval(() => {
      setIndex(i => (i + 1) % HIGHLIGHTS.length)
    }, 3200)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="asp-ticker" aria-hidden="true">
      <span className="asp-ticker__dot" />
      <span className="asp-ticker__track">
        {HIGHLIGHTS.map((label, i) => (
          <span key={label} className={`asp-ticker__item${i === index ? ' is-on' : ''}`}>
            {label}
          </span>
        ))}
      </span>
    </div>
  )
}

function NetworkVisual() {
  const accents = NODES.filter(n => n.kind === 'accent')

  return (
    <svg
      className="asp-viz__svg" viewBox="0 0 348 256" fill="none"
      aria-hidden="true" focusable="false"
    >
      <g className="asp-viz__edges">
        {EDGES.map(([from, to], i) => (
          <line
            key={`${from}-${to}`}
            x1={NODE_BY_ID[from].x} y1={NODE_BY_ID[from].y}
            x2={NODE_BY_ID[to].x} y2={NODE_BY_ID[to].y}
            style={{ animationDelay: `${(0.14 + i * 0.03).toFixed(2)}s` }}
          />
        ))}
      </g>

      <g className="asp-viz__halos">
        {accents.map(n => (
          <circle key={n.id} className="asp-viz__halo" cx={n.x} cy={n.y} r={16} />
        ))}
      </g>

      <g className="asp-viz__nodes">
        {NODES.map((n, i) => {
          const classes = ['asp-viz__node']
          if (n.kind === 'accent') classes.push('asp-viz__node--accent', `asp-viz__node--accent-${n.pulse}`)
          if (n.kind === 'kiwi') classes.push('asp-viz__node--kiwi')
          const delay = n.kind === 'accent' ? undefined : { animationDelay: `${(0.3 + i * 0.04).toFixed(2)}s` }
          return (
            <circle
              key={n.id}
              className={classes.join(' ')}
              cx={n.x} cy={n.y}
              r={n.kind === 'accent' ? 8 : n.kind === 'kiwi' ? 5 : 5.5}
              style={delay}
            />
          )
        })}
      </g>
    </svg>
  )
}

export function AuthFrame({ title, subtitle, children, footer }) {
  return (
    <div className="asp-root">
      <div className="asp-brand">
        <Link to="/" className="asp-brand__logo" aria-label="AADI HUB home">
          <ProductLogo size={21} symbol={27} />
        </Link>

        <div className="asp-pitch">
          <p className="asp-headline">Your next opportunity starts here.</p>
          <p className="asp-support">
            AADI HUB brings students together to connect with peers, build real
            projects, and discover the opportunities worth your time — one
            ecosystem for every step of your journey.
          </p>
          <HighlightTicker />
        </div>

        <div className="asp-viz">
          <NetworkVisual />
        </div>
      </div>

      <main className="asp-main">
        <div className="asp-main__inner">
          <div className="asp-main__head">
            <h1 className="asp-title">{title}</h1>
            {subtitle && <p className="asp-subtitle">{subtitle}</p>}
          </div>

          <div className="asp-main__body">{children}</div>

          {footer && <div className="asp-main__foot">{footer}</div>}
        </div>
      </main>
    </div>
  )
}

/**
 * Honest configuration state for deployments where the Supabase environment
 * variables are missing. Rendered instead of auth forms — never a fake form.
 */
export function NotConfiguredNotice({ what = 'Sign-in' }) {
  return (
    <div className="asp-stack">
      <div className="p-inline-error">
        {what} is unavailable right now — this deployment is not connected to its
        authentication service, so no account operations can run.
      </div>
      <p className="asp-note" style={{ fontSize: 13 }}>
        For the site operator: set <code>VITE_SUPABASE_URL</code> and{' '}
        <code>VITE_SUPABASE_PUBLISHABLE_KEY</code> in the environment and apply the
        database migration, then restart. See docs/setup-and-deployment.md.
      </p>
      <Link to="/" className="p-btn p-btn--secondary p-btn--md p-btn--full">Back to home</Link>
    </div>
  )
}

export default AuthFrame
