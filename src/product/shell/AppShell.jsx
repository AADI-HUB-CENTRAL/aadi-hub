import { useState, useEffect } from 'react'
import { NavLink, Link, Outlet, useLocation } from 'react-router-dom'
import { ProductLogo, IconButton } from '../ui/kit.jsx'
import AccountMenu from '../ui/AccountMenu.jsx'
import { useTheme } from '../../context/ThemeContext.jsx'
import { Briefcase, Calendar, Grid, IdCard, Rocket, User, Users, Close, Menu } from '../ui/icons.jsx'

/* ---------------------------------------------------------------------------
   AppShell — the authenticated application frame.
   Sidebar (desktop) + drawer (mobile) + topbar + bottom nav (mobile).
   Every visible control has a real destination or is clearly marked "Soon".

   The signed-in identity sits at the foot of the sidebar (and of the mobile
   drawer) as a full profile block: My profile, AADI ID card, Settings and
   Sign out. The topbar keeps a compact avatar that opens the same menu,
   so the identity is always one click away.
   --------------------------------------------------------------------------- */

const NAV_MAIN = [
  {
    label: 'Workspace',
    items: [
      { to: '/dashboard', label: 'Overview', icon: Grid, end: true },
      { to: '/projects', label: 'Projects', icon: Rocket },
      { to: '/opportunities', label: 'Opportunities', icon: Briefcase },
    ],
  },
  {
    label: 'Identity',
    items: [
      { to: '/profile', label: 'My Profile', icon: User },
      { to: '/aadi-id', label: 'AADI ID', icon: IdCard },
    ],
  },
  {
    label: 'Coming soon',
    items: [
      { label: 'Communities', icon: Users, soon: true },
      { label: 'Events', icon: Calendar, soon: true },
    ],
  },
]

const MOBILE_NAV = [
  { to: '/dashboard', label: 'Home', icon: Grid, end: true },
  { to: '/projects', label: 'Projects', icon: Rocket },
  { to: '/opportunities', label: 'Opportunities', icon: Briefcase },
  { to: '/profile', label: 'Profile', icon: User },
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
  [/^\/settings$/, 'Settings'],
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

function SidebarInner({ onNavigate }) {
  return (
    <>
      <div className="shell__brand">
        <Link to="/dashboard" onClick={onNavigate}><ProductLogo symbol={24} size={17} /></Link>
      </div>
      <nav className="shell__nav" aria-label="Main">
        <NavList onNavigate={onNavigate} />
      </nav>
      <div className="shell__side-foot">
        <AccountMenu variant="full" align="left" placement="above" />
      </div>
    </>
  )
}

export default function AppShell() {
  const location = useLocation()
  const { resolvedMode } = useTheme()
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => { setDrawerOpen(false) }, [location.pathname])

  useEffect(() => {
    document.body.dataset.appTheme = resolvedMode
    return () => { delete document.body.dataset.appTheme }
  }, [resolvedMode])

  return (
    <div className="shell" data-theme={resolvedMode}>
      <aside className="shell__sidebar">
        <SidebarInner />
      </aside>

      {drawerOpen && (
        <>
          <div className="shell__drawer-backdrop" onClick={() => setDrawerOpen(false)} aria-hidden="true" />
          <aside className="shell__drawer" role="dialog" aria-label="Navigation menu">
            <div className="shell__drawer-head">
              <ProductLogo symbol={24} size={17} />
              <IconButton label="Close menu" onClick={() => setDrawerOpen(false)}>
                <Close size={20} />
              </IconButton>
            </div>
            <nav className="shell__nav" aria-label="Main">
              <NavList onNavigate={() => setDrawerOpen(false)} />
            </nav>
            <div className="shell__side-foot">
              <AccountMenu variant="full" align="left" placement="above" />
            </div>
          </aside>
        </>
      )}

      <div className="shell__main">
        <header className="shell__topbar">
          <div className="shell__topbar-left">
            <button
              type="button"
              className="p-iconbtn shell__menu-btn"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open navigation"
            >
              <Menu size={22} />
            </button>
            <p className="shell__topbar-title">{titleFor(location.pathname)}</p>
          </div>
          <div className="shell__topbar-actions">
            <AccountMenu />
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
              <item.icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  )
}
