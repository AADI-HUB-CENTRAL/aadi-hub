import { useState, useEffect } from 'react'
import { NavLink, Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { ProductLogo, Avatar, IconButton } from '../ui/kit.jsx'
import { getInitials, getPublicProfileUrl } from '../../utils/identity.js'

/* ---------------------------------------------------------------------------
   AppShell — the authenticated application frame.
   Sidebar (desktop) + drawer (mobile) + topbar + bottom nav (mobile).
   Every visible control has a real destination or is clearly marked "Soon".
--------------------------------------------------------------------------- */

const NAV_MAIN = [
  {
    label: 'Workspace',
    items: [
      { to: '/dashboard', label: 'Overview', icon: IconGrid, end: true },
      { to: '/projects', label: 'Projects', icon: IconRocket },
      { to: '/opportunities', label: 'Opportunities', icon: IconBriefcase },
    ],
  },
  {
    label: 'Identity',
    items: [
      { to: '/profile', label: 'My Profile', icon: IconUser },
      { to: '/aadi-id', label: 'AADI ID', icon: IconId },
    ],
  },
  {
    label: 'Coming soon',
    items: [
      { label: 'Communities', icon: IconUsers, soon: true },
      { label: 'Events', icon: IconCalendar, soon: true },
    ],
  },
]

const MOBILE_NAV = [
  { to: '/dashboard', label: 'Home', icon: IconGrid, end: true },
  { to: '/projects', label: 'Projects', icon: IconRocket },
  { to: '/opportunities', label: 'Opportunities', icon: IconBriefcase },
  { to: '/profile', label: 'Profile', icon: IconUser },
]

const PAGE_TITLES = [
  [/^\/dashboard$/, 'Overview'],
  [/^\/projects$/, 'Projects'],
  [/^\/projects\/new$/, 'New project'],
  [/^\/projects\/[^/]+\/edit$/, 'Edit project'],
  [/^\/projects\/[^/]+$/, 'Project'],
  [/^\/opportunities$/, 'Opportunities'],
  [/^\/opportunities\/new$/, 'Submit opportunity'],
  [/^\/opportunities\/[^/]+$/, 'Opportunity'],
  [/^\/profile$/, 'My profile'],
  [/^\/aadi-id$/, 'AADI ID'],
]

function titleFor(pathname) {
  for (const [re, title] of PAGE_TITLES) if (re.test(pathname)) return title
  return 'AADI HUB'
}

function NavItems({ onNavigate }) {
  return (
    <>
      {NAV_MAIN.map(group => (
        <div key={group.label}>
          <p className="shell__nav-label">{group.label}</p>
          {group.items.map(item => (
            <li key={item.label}>
              {item.soon ? (
                <span className="shell__link shell__link--disabled">
                  <item.icon />
                  <span>{item.label}</span>
                  <span className="shell__link-badge">Soon</span>
                </span>
              ) : (
                <NavLink
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) => `shell__link${isActive ? ' active' : ''}`}
                  onClick={onNavigate}
                >
                  <item.icon />
                  <span>{item.label}</span>
                </NavLink>
              )}
            </li>
          ))}
        </div>
      ))}
    </>
  )
}

function NavList({ onNavigate }) {
  return <ul><NavItems onNavigate={onNavigate} /></ul>
}

function SidebarInner({ onNavigate, children }) {
  return (
    <>
      <div className="shell__brand">
        <Link to="/dashboard" onClick={onNavigate}><ProductLogo symbol={24} size={17} /></Link>
      </div>
      <nav className="shell__nav" aria-label="Main">
        <NavList onNavigate={onNavigate} />
      </nav>
      {children}
    </>
  )
}

export default function AppShell() {
  const { profile, signOut } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => { setDrawerOpen(false) }, [location.pathname])

  const name = profile?.full_name || 'Student'
  const aadiId = profile?.aadi_id || ''
  const avatarUrl = null

  async function handleSignOut() {
    await signOut()
    navigate('/login', { replace: true })
  }

  return (
    <div className="shell">
      <aside className="shell__sidebar">
        <SidebarInner>
          <div className="shell__side-foot">
            <Link to={`/u/${aadiId}`} className="shell__user" title="View public profile">
              <Avatar src={avatarUrl} name={name} size={36} />
              <span>
                <span className="shell__user-name">{name}</span>
                <span className="shell__user-id">{aadiId}</span>
              </span>
            </Link>
          </div>
        </SidebarInner>
      </aside>

      {drawerOpen && (
        <>
          <div className="shell__drawer-backdrop" onClick={() => setDrawerOpen(false)} aria-hidden="true" />
          <aside className="shell__drawer" role="dialog" aria-label="Navigation menu">
            <div className="shell__drawer-head">
              <ProductLogo symbol={24} size={17} />
              <IconButton label="Close menu" onClick={() => setDrawerOpen(false)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
              </IconButton>
            </div>
            <nav className="shell__nav" aria-label="Main">
              <NavList onNavigate={() => setDrawerOpen(false)} />
            </nav>
            <div className="shell__side-foot">
              <Link to={`/u/${aadiId}`} className="shell__user" onClick={() => setDrawerOpen(false)}>
                <Avatar src={avatarUrl} name={name} size={36} />
                <span>
                  <span className="shell__user-name">{name}</span>
                  <span className="shell__user-id">{aadiId}</span>
                </span>
              </Link>
            </div>
          </aside>
        </>
      )}

      <div className="shell__main">
        <header className="shell__topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              className="p-iconbtn shell__menu-btn"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open navigation"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
            </button>
            <h1 className="shell__topbar-title">{titleFor(location.pathname)}</h1>
          </div>
          <div className="shell__topbar-actions">
            <Link
              to={getPublicProfileUrl(aadiId)}
              className="p-btn p-btn--ghost p-btn--sm"
              target="_blank"
              rel="noreferrer"
            >
              Public profile
            </Link>
            <button className="p-btn p-btn--ghost p-btn--sm" onClick={handleSignOut}>
              Sign out
            </button>
          </div>
        </header>

        <main className="shell__content" id="main-content">
          <Outlet />
        </main>

        <nav className="shell__mobilenav" aria-label="Mobile">
          {MOBILE_NAV.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => (isActive ? 'active' : undefined)}
            >
              <item.icon />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  )
}

/* --------------------------------- icons ---------------------------------- */

const ico = {
  width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none',
  stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round',
  'aria-hidden': true,
}

function IconGrid() {
  return <svg {...ico}><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></svg>
}

function IconRocket() {
  return <svg {...ico}><path d="M4.5 16.5c-1.5 1.5-2 5-2 5s3.5-.5 5-2" /><path d="M15 9l-6 6" /><path d="M12 2c3 1 6 4 6 8l-2 2H8l-2-2c0-4 3-7 6-8z" /></svg>
}

function IconBriefcase() {
  return <svg {...ico}><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18" /></svg>
}

function IconUser() {
  return <svg {...ico}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
}

function IconId() {
  return <svg {...ico}><rect x="2" y="5" width="20" height="14" rx="2" /><circle cx="8" cy="11" r="2" /><path d="M14 10h4M14 14h4M6 16c.5-1.5 1.5-2 2-2s1.5.5 2 2" /></svg>
}

function IconUsers() {
  return <svg {...ico}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8" /></svg>
}

function IconCalendar() {
  return <svg {...ico}><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 11h18" /></svg>
}
