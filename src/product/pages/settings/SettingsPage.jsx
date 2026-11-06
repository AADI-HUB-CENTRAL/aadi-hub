import { useTheme } from '../../../context/ThemeContext.jsx'
import { Monitor, Moon, Sun } from '../../ui/icons.jsx'
import '../../styles/settings.css'

/* ---------------------------------------------------------------------------
   Settings — workspace preferences.
   Appearance currently controls the dashboard view mode. The choice is stored
   locally and never leaks into the login or public showcase screens.
--------------------------------------------------------------------------- */

const MODES = [
  {
    value: 'default',
    label: 'Default',
    hint: 'Follows your device appearance',
    icon: Monitor,
  },
  {
    value: 'dark',
    label: 'Dark',
    hint: 'Always use the night theme',
    icon: Moon,
  },
  {
    value: 'light',
    label: 'Light',
    hint: 'Always use the light theme',
    icon: Sun,
  },
]

export default function SettingsPage() {
  const { viewMode, setViewMode } = useTheme()

  return (
    <div className="settings-page">
      <div className="page-head">
        <div>
          <h1 className="page-head__title">Settings</h1>
          <p className="page-head__sub">Make the workspace feel right for you.</p>
        </div>
      </div>

      <section className="p-card settings-card" aria-labelledby="appearance-title">
        <div className="settings-card__head">
          <h2 id="appearance-title">Appearance</h2>
          <p>Choose how your dashboard looks. Login and showcase pages keep the AADI HUB look.</p>
        </div>

        <p className="settings-card__label" id="view-mode-label">View mode</p>
        <div className="settings-modes" role="radiogroup" aria-labelledby="view-mode-label">
          {MODES.map(({ value, label, hint, icon: Icon }) => {
            const selected = viewMode === value
            return (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={selected}
                className={`settings-mode${selected ? ' is-selected' : ''}`}
                onClick={() => setViewMode(value)}
              >
                <span className="settings-mode__icon"><Icon size={18} /></span>
                <span className="settings-mode__body">
                  <span className="settings-mode__label">{label}</span>
                  <span className="settings-mode__hint">{hint}</span>
                </span>
                <span className="settings-mode__check" aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </span>
              </button>
            )
          })}
        </div>
      </section>
    </div>
  )
}
