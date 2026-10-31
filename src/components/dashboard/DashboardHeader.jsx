import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getIdentity, getInitials } from '../../utils/identity.js'
import { getGreeting } from '../../data/dashboardData.js'
import { logout } from '../../utils/logout.js'

export default function DashboardHeader({ onMenuToggle }) {
  const identity = getIdentity()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const menuRef = useRef(null)
  const notifRef = useRef(null)

  const name = identity?.fullName || 'User'
  const aadiId = identity?.aadiId || 'AADI-00000'
  const firstName = name.split(' ')[0]

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <header className="dash-header">
      <div className="dash-header__left">
        <button className="dash-header__menu-btn" onClick={onMenuToggle} aria-label="Toggle navigation menu">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
        </button>
        <div className="dash-header__greeting">
          <h1 className="dash-header__name">{getGreeting()}, {firstName}</h1>
          <p className="dash-header__sub">Here is what is happening in your AADI journey.</p>
        </div>
      </div>

      <div className="dash-header__right">
        <div className="dash-header__notif-wrap" ref={notifRef}>
          <button
            className="dash-header__icon-btn"
            onClick={() => { setNotifOpen(!notifOpen); setMenuOpen(false) }}
            aria-label="Notifications"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            <span className="dash-header__notif-dot" />
          </button>
          {notifOpen && (
            <div className="dash-header__dropdown dash-header__notif-dropdown">
              <div className="dash-header__dropdown-header">Notifications</div>
              <div className="dash-header__notif-item">
                <span className="dash-header__notif-icon dash-header__notif-icon--success">&#10003;</span>
                <div>
                  <p className="dash-header__notif-text">Your AADI ID was created successfully.</p>
                  <span className="dash-header__notif-time">Just now</span>
                </div>
              </div>
              <div className="dash-header__notif-item">
                <span className="dash-header__notif-icon dash-header__notif-icon--reminder">&#9679;</span>
                <div>
                  <p className="dash-header__notif-text">Complete your profile to unlock more features.</p>
                  <span className="dash-header__notif-time">1h ago</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="dash-header__user-wrap" ref={menuRef}>
          <button
            className="dash-header__avatar-btn"
            onClick={() => { setMenuOpen(!menuOpen); setNotifOpen(false) }}
            aria-label="User menu"
          >
            {identity?.profilePhoto ? (
              <img src={identity.profilePhoto} alt="" className="dash-header__avatar-img" />
            ) : (
              <span className="dash-header__avatar-initials">{getInitials(name)}</span>
            )}
            <span className="dash-header__avatar-name">{name}</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 9l6 6 6-6"/></svg>
          </button>
          {menuOpen && (
            <div className="dash-header__dropdown dash-header__user-dropdown">
              <div className="dash-header__dropdown-user">
                <span className="dash-header__dropdown-name">{name}</span>
                <span className="dash-header__dropdown-id">{aadiId}</span>
              </div>
              <div className="dash-header__dropdown-divider" />
              <button className="dash-header__dropdown-item" onClick={() => { navigate('/profile/' + aadiId); setMenuOpen(false) }}>
                View profile
              </button>
              <button className="dash-header__dropdown-item" onClick={() => { navigate('/aadi-id'); setMenuOpen(false) }}>
                AADI ID
              </button>
              <button className="dash-header__dropdown-item" onClick={() => setMenuOpen(false)}>
                Settings
              </button>
              <div className="dash-header__dropdown-divider" />
              <button className="dash-header__dropdown-item dash-header__dropdown-item--danger" onClick={logout}>
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
