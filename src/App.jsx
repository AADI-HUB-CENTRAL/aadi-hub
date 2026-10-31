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
import Login from './components/Login.jsx'
import Register from './components/Register.jsx'
import FormPage from './components/FormPage.jsx'

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
    <>
      <a href="#top" id="aadi-skip-link">
        Skip to content
      </a>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/form" element={<FormPage />} />

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

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  )
}
