import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { SIDEBAR_NAV, SIDEBAR_BOTTOM } from '../../data/dashboardData.js'
import { getIdentity } from '../../utils/identity.js'
import { getInitials } from '../../utils/identity.js'
import { ArrowUpRight } from '../ui/Icons.jsx'

const iconMap = {
  Layers: (p) => <svg {...p}><path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/></svg>,
  Users: (p) => <svg {...p}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/></svg>,
  Shield: (p) => <svg {...p}><path d="M12 3l8 3v6c0 4.5-3.2 7.9-8 9-4.8-1.1-8-4.5-8-9V6z"/><path d="M9 12l2 2 4-4"/></svg>,
  Globe: (p) => <svg {...p}><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a13.5 13.5 0 0 1 0 18 13.5 13.5 0 0 1 0-18z"/></svg>,
  Trophy: (p) => <svg {...p}><path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0zM7 5H4a2 2 0 0 0 2 4h1M17 5h3a2 2 0 0 1-2 4h-1"/></svg>,
  Rocket: (p) => <svg {...p}><path d="M4.5 16.5c-1.5 1.5-2 5-2 5s3.5-.5 5-2"/><path d="M15 9l-6 6"/><path d="M12 2c3 1 6 4 6 8l-2 2H8l-2-2c0-4 3-7 6-8z"/></svg>,
  Message: (p) => <svg {...p}><path d="M21 11.5a8.4 8.4 0 0 1-8.5 8.4 8.7 8.7 0 0 1-4.3-1.1L3 20l1.2-4.7A8.4 8.4 0 1 1 21 11.5z"/></svg>,
  Briefcase: (p) => <svg {...p}><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18"/></svg>,
  Graduation: (p) => <svg {...p}><path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c0 1.1 2.7 2.5 6 2.5s6-1.4 6-2.5v-5"/></svg>,
  Award: (p) => <svg {...p}><circle cx="12" cy="9" r="6"/><path d="M8.5 14.5L7 22l5-3 5 3-1.5-7.5"/></svg>,
  Target: (p) => <svg {...p}><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none"/></svg>,
  Lightbulb: (p) => <svg {...p}><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1.1 2.1h4.8c.1-.9.5-1.6 1.1-2.1A6 6 0 0 0 12 3z"/></svg>,
}

export default function DashboardSidebar({ activeSection, onNavigate, onClose }) {
  const identity = getIdentity()
  const location = useLocation()
  const name = identity?.fullName || 'User'
  const aadiId = identity?.aadiId || 'AADI-00000'

  return (
    <aside className="dash-sidebar" role="navigation" aria-label="Dashboard navigation">
      <div className="dash-sidebar__top">
        <Link to="/dashboard" className="dash-sidebar__brand">
          <img src="/AADI HUB LOGO.png" alt="AADI HUB" className="dash-sidebar__brand-logo" />
        </Link>

        {onClose && (
          <button className="dash-sidebar__close" onClick={onClose} aria-label="Close menu">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>
          </button>
        )}
      </div>

      <nav className="dash-sidebar__nav">
        <ul className="dash-sidebar__list">
          {SIDEBAR_NAV.map((item) => {
            const Icon = iconMap[item.icon]
            return (
              <li key={item.id}>
                <button
                  className={`dash-sidebar__link ${activeSection === item.id ? 'active' : ''}`}
                  onClick={() => { onNavigate(item.id); onClose?.() }}
                  aria-current={activeSection === item.id ? 'page' : undefined}
                >
                  {Icon && <Icon width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />}
                  <span>{item.label}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="dash-sidebar__bottom">
        <ul className="dash-sidebar__list">
          {SIDEBAR_BOTTOM.map((item) => {
            const Icon = iconMap[item.icon]
            return (
              <li key={item.id}>
                <button
                  className={`dash-sidebar__link ${activeSection === item.id ? 'active' : ''}`}
                  onClick={() => { onNavigate(item.id); onClose?.() }}
                >
                  {Icon && <Icon width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />}
                  <span>{item.label}</span>
                </button>
              </li>
            )
          })}
        </ul>

        <div className="dash-sidebar__user">
          <div className="dash-sidebar__avatar">
            {identity?.profilePhoto ? (
              <img src={identity.profilePhoto} alt="" className="dash-sidebar__avatar-img" />
            ) : (
              <span className="dash-sidebar__avatar-initials">{getInitials(name)}</span>
            )}
          </div>
          <div className="dash-sidebar__user-info">
            <span className="dash-sidebar__user-name">{name}</span>
            <span className="dash-sidebar__user-id">{aadiId}</span>
          </div>
        </div>
      </div>
    </aside>
  )
}
