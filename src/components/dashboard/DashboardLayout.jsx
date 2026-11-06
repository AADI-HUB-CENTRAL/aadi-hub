import { useState } from 'react'
import DashboardSidebar from './DashboardSidebar.jsx'
import DashboardHeader from './DashboardHeader.jsx'
import MobileNav from './MobileNav.jsx'

export default function DashboardLayout({ activeSection, onNavigate, children }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className={`dash ${mobileOpen ? 'dash--mobile-open' : ''}`}>
      {mobileOpen && (
        <div className="dash-overlay" onClick={() => setMobileOpen(false)} aria-hidden="true" />
      )}

      <DashboardSidebar
        activeSection={activeSection}
        onNavigate={onNavigate}
        onClose={() => setMobileOpen(false)}
      />

      <div className="dash__main">
        <DashboardHeader onMenuToggle={() => setMobileOpen(!mobileOpen)} />

        <main className="dash__content" id="main-content">
          {children}
        </main>

        <MobileNav activeSection={activeSection} onNavigate={onNavigate} />
      </div>
    </div>
  )
}
