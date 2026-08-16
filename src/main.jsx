import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './styles/tokens.css'
import './styles/base.css'
import './styles/sections.css'
import './styles/responsive.css'
import './styles/mobile-prompt.css'

createRoot(document.getElementById('root')).render(<App />)
