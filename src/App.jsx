import { Routes, Route, Navigate } from 'react-router-dom'
import MobileExperiencePrompt from './components/MobileExperiencePrompt.jsx'
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import TrustStrip from './components/TrustStrip.jsx'
import ProjectsPartners from './components/ProjectsPartners.jsx'
import Problem from './components/Problem.jsx'
import Differentiation from './components/Differentiation.jsx'
import Vision from './components/Vision.jsx'
import Team from './components/Team.jsx'
import Identity from './components/Identity.jsx'
import Passport from './components/Passport.jsx'
import Feed from './components/Feed.jsx'
import Communities from './components/Communities.jsx'
import Challenges from './components/Challenges.jsx'
import Projects from './components/Projects.jsx'
import BuildWithPeople from './components/BuildWithPeople.jsx'
import Opportunities from './components/Opportunities.jsx'
import Campus from './components/Campus.jsx'
import Reputation from './components/Reputation.jsx'
import Journey from './components/Journey.jsx'
import WhyAadi from './components/WhyAadi.jsx'
import Meaning from './components/Meaning.jsx'
import Future from './components/Future.jsx'
import Movement from './components/Movement.jsx'
import EarlyAccess from './components/EarlyAccess.jsx'
import Faq from './components/Faq.jsx'
import FinalCta from './components/FinalCta.jsx'
import Footer from './components/Footer.jsx'
import ShowcasePage from './components/ShowcasePage.jsx'
import FormPage from './components/FormPage.jsx'
import TeamPage from './components/TeamPage.jsx'
import TeamMemberPage from './components/TeamMemberPage.jsx'
import DiwaliWishesPage from './components/diwali/DiwaliWishesPage.jsx'
import { DiwaliMusicProvider } from './components/diwali/DiwaliMusicController.jsx'

import LoginPage from './product/pages/auth/LoginPage.jsx'
import SignupPage from './product/pages/auth/SignupPage.jsx'
import ForgotPasswordPage from './product/pages/auth/ForgotPasswordPage.jsx'
import ResetPasswordPage from './product/pages/auth/ResetPasswordPage.jsx'
import VerifyEmailPage from './product/pages/auth/VerifyEmailPage.jsx'
import AuthCallbackPage from './product/pages/auth/AuthCallbackPage.jsx'
import OnboardingPage from './product/pages/onboarding/OnboardingPage.jsx'
import WelcomePage from './product/pages/onboarding/WelcomePage.jsx'
import AppShell from './product/shell/AppShell.jsx'
import OverviewPage from './product/pages/dashboard/OverviewPage.jsx'
import ProjectsPage from './product/pages/projects/ProjectsPage.jsx'
import ProjectDetailPage from './product/pages/projects/ProjectDetailPage.jsx'
import ProjectFormPage from './product/pages/projects/ProjectFormPage.jsx'
import OpportunitiesPage from './product/pages/opportunities/OpportunitiesPage.jsx'
import OpportunityDetailPage from './product/pages/opportunities/OpportunityDetailPage.jsx'
import SubmitOpportunityPage from './product/pages/opportunities/SubmitOpportunityPage.jsx'
import MyProfilePage from './product/pages/profile/MyProfilePage.jsx'
import AadiIdPage from './product/pages/profile/AadiIdPage.jsx'
import SettingsPage from './product/pages/settings/SettingsPage.jsx'
import PublicProfilePage from './product/pages/profile/PublicProfilePage.jsx'
import { RequireAuth, RedirectIfAuthed, NotFound } from './routes/guards.jsx'

function LandingPage() {
  return (
    <>
      <MobileExperiencePrompt />
      <Navbar />
      <main>
        <Hero />
        <TrustStrip />
        <ProjectsPartners />
        <Problem />
        <Vision />
        <Team />
        <Identity />
        <Passport />
        <Journey />
        <WhyAadi />
        <Meaning />
        <Future />
        <Movement />
        <EarlyAccess />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <DiwaliMusicProvider>
      <a href="#top" id="aadi-skip-link">
        Skip to content
      </a>
      <Routes>
        {/* --------------------------- public showcase --------------------------- */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/team" element={<ShowcasePage><TeamPage /></ShowcasePage>} />
        <Route path="/team/:slug" element={<ShowcasePage><TeamMemberPage /></ShowcasePage>} />
        <Route path="/form" element={<FormPage />} />
        <Route path="/diwali-wishes" element={<DiwaliWishesPage />} />

        <Route path="/explore" element={<Navigate to="/" replace />} />
        <Route path="/explore/social" element={<ShowcasePage><Differentiation /></ShowcasePage>} />
        <Route path="/explore/feed" element={<ShowcasePage><Feed /></ShowcasePage>} />
        <Route path="/explore/communities" element={<ShowcasePage><Communities /></ShowcasePage>} />
        <Route path="/explore/challenges" element={<ShowcasePage><Challenges /></ShowcasePage>} />
        <Route path="/explore/projects" element={<ShowcasePage><Projects /></ShowcasePage>} />
        <Route path="/explore/build-with-people" element={<ShowcasePage><BuildWithPeople /></ShowcasePage>} />
        <Route path="/explore/opportunities" element={<ShowcasePage><Opportunities /></ShowcasePage>} />
        <Route path="/explore/campus" element={<ShowcasePage><Campus /></ShowcasePage>} />
        <Route path="/explore/reputation" element={<ShowcasePage><Reputation /></ShowcasePage>} />

        {/* ------------------------- authentication (upgraded) -------------------- */}
        <Route path="/login" element={<RedirectIfAuthed><LoginPage /></RedirectIfAuthed>} />
        <Route path="/register" element={<RedirectIfAuthed><SignupPage /></RedirectIfAuthed>} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/auth/callback" element={<AuthCallbackPage />} />

        {/* ------------------ onboarding + first-time welcome moment -------------- */}
        <Route path="/onboarding" element={<RequireAuth allowIncompleteOnboarding><OnboardingPage /></RequireAuth>} />
        <Route path="/welcome" element={<RequireAuth allowIncompleteOnboarding><WelcomePage /></RequireAuth>} />

        {/* ---------------------- authenticated application ----------------------- */}
        <Route element={<RequireAuth><AppShell /></RequireAuth>}>
          <Route path="/dashboard" element={<OverviewPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/new" element={<ProjectFormPage />} />
          <Route path="/projects/:id" element={<ProjectDetailPage />} />
          <Route path="/projects/:id/edit" element={<ProjectFormPage />} />
          <Route path="/opportunities" element={<OpportunitiesPage />} />
          <Route path="/opportunities/new" element={<SubmitOpportunityPage />} />
          <Route path="/opportunities/:id" element={<OpportunityDetailPage />} />
          <Route path="/profile" element={<MyProfilePage />} />
          <Route path="/aadi-id" element={<AadiIdPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>

        {/* ------------------------- old deep-link redirects ---------------------- */}
        <Route path="/dashboard/profile" element={<Navigate to="/profile" replace />} />
        <Route path="/dashboard/aadi-id" element={<Navigate to="/aadi-id" replace />} />

        {/* --------------------------- public profiles ---------------------------- */}
        <Route path="/u/:aadiId" element={<PublicProfilePage />} />
        <Route path="/p/:aadiId" element={<PublicProfilePage />} />
        <Route path="/profile/:aadiId" element={<PublicProfilePage />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </DiwaliMusicProvider>
  )
}
