import { Routes, Route } from 'react-router-dom'
import MobileExperiencePrompt from './components/MobileExperiencePrompt.jsx'
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import TrustStrip from './components/TrustStrip.jsx'
import Problem from './components/Problem.jsx'
import Differentiation from './components/Differentiation.jsx'
import Vision from './components/Vision.jsx'
import Team from './components/Team.jsx'
import Identity from './components/Identity.jsx'
import Passport from './components/Passport.jsx'
import Profile from './components/Profile.jsx'
import Feed from './components/Feed.jsx'
import Communities from './components/Communities.jsx'
import Challenges from './components/Challenges.jsx'
import Projects from './components/Projects.jsx'
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
import Login from './components/Login.jsx'
import Register from './components/Register.jsx'
import CreateIdentity from './components/CreateIdentity.jsx'
import FormPage from './components/FormPage.jsx'
import PublicProfile from './components/PublicProfile.jsx'
import Welcome from './components/Welcome.jsx'
import Dashboard from './components/Dashboard.jsx'

function LandingPage() {
  return (
    <>
      <MobileExperiencePrompt />
      <Navbar />
      <main>
        <Hero />
        <TrustStrip />
        <Problem />
        <Differentiation />
        <Vision />
        <Team />
        <Identity />
        <Passport />
        <Profile />
        <Feed />
        <Communities />
        <Challenges />
        <Projects />
        <Opportunities />
        <Campus />
        <Reputation />
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
    <>
      <a href="#top" id="aadi-skip-link">
        Skip to content
      </a>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/form" element={<FormPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/create-identity" element={<CreateIdentity />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/profile" element={<Dashboard activeSection="profile" />} />
        <Route path="/dashboard/aadi-id" element={<Dashboard activeSection="aadi-id" />} />
        <Route path="/aadi-id" element={<Dashboard activeSection="aadi-id" />} />
        <Route path="/profile/:aadiId" element={<PublicProfile />} />
        <Route path="/u/:aadiId" element={<PublicProfile />} />
      </Routes>
    </>
  )
}
