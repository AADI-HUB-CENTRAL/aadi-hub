import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { getIdentity } from '../utils/identity.js'
import DashboardLayout from './dashboard/DashboardLayout.jsx'
import ProfileCompletionCard from './dashboard/ProfileCompletionCard.jsx'
import AadiIdWidget from './dashboard/AadiIdWidget.jsx'
import QuickActions from './dashboard/QuickActions.jsx'
import CommunityPreview from './dashboard/CommunityPreview.jsx'
import ChallengePreview from './dashboard/ChallengePreview.jsx'
import ProjectPreview from './dashboard/ProjectPreview.jsx'
import FeedPreview from './dashboard/FeedPreview.jsx'
import GoalsWidget from './dashboard/GoalsWidget.jsx'
import ReputationWidget from './dashboard/ReputationWidget.jsx'
import ProfilePage from './dashboard/ProfilePage.jsx'
import AadiIdSection from './dashboard/AadiIdSection.jsx'

export default function Dashboard({ activeSection: forcedSection }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [activeSection, setActiveSection] = useState(forcedSection || 'overview')
  const identity = getIdentity()

  useEffect(() => {
    if (!identity) {
      navigate('/register', { replace: true })
    }
  }, [identity, navigate])

  useEffect(() => {
    if (forcedSection) setActiveSection(forcedSection)
  }, [forcedSection])

  useEffect(() => {
    if (location.pathname === '/dashboard/profile') {
      setActiveSection('profile')
    }
    if (location.pathname === '/dashboard/aadi-id' || location.pathname === '/aadi-id') {
      setActiveSection('aadi-id')
    }
  }, [location.pathname])

  if (!identity) return null

  const handleNavigate = (section) => {
    setActiveSection(section)
    if (section === 'profile') {
      navigate('/dashboard/profile')
      return
    }
    if (section === 'aadi-id') {
      navigate('/dashboard/aadi-id')
      return
    }
    if (section === 'overview') {
      navigate('/dashboard')
      return
    }
  }

  const showOverview = activeSection === 'overview'

  return (
    <DashboardLayout activeSection={activeSection} onNavigate={handleNavigate}>
      {activeSection === 'profile' ? (
        <ProfilePage />
      ) : activeSection === 'aadi-id' ? (
        <AadiIdSection />
      ) : showOverview ? (
        <div className="dash-overview">
          <div className="dash-overview__main">
            <ProfileCompletionCard />
            <QuickActions />
            <CommunityPreview />
            <ChallengePreview />
            <ProjectPreview />
            <FeedPreview />
          </div>
          <aside className="dash-overview__sidebar">
            <AadiIdWidget />
            <GoalsWidget />
            <ReputationWidget />
          </aside>
        </div>
      ) : (
        <div className="dash-placeholder">
          <h2 className="dash-placeholder__title" style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 600, color: 'var(--ink)' }}>
            {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
          </h2>
          <p style={{ color: 'var(--muted-on-light)', marginTop: 8 }}>Coming soon.</p>
        </div>
      )}
    </DashboardLayout>
  )
}
