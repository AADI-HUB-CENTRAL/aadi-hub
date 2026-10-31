import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './styles/tokens.css'
import './styles/base.css'
import './styles/sections.css'
import './styles/responsive.css'
import './styles/mobile-prompt.css'
import './styles/auth.css'
import './styles/identity.css'
import './styles/dashboard.css'
import './styles/profile.css'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
)
