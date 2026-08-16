import Logo, { BrandSymbol } from './Logo.jsx'
import { Instagram, LinkedIn, XIcon, Github } from './ui/Icons.jsx'

const COLS = [
  {
    title: 'Explore',
    links: [
      { label: 'Vision', href: '#vision' },
      { label: 'Ecosystem', href: '#ecosystem' },
      { label: 'Identity', href: '#identity' },
      { label: 'Passport', href: '#passport' },
      { label: 'Communities', href: '#community' },
      { label: 'Challenges', href: '#challenges' },
      { label: 'Projects', href: '#projects' },
    ],
  },
  {
    title: 'Journey',
    links: [
      { label: 'Opportunities', href: '#opportunities' },
      { label: 'Campus', href: '#campus' },
      { label: 'How it works', href: '#journey' },
      { label: 'Join AADI', href: '#join' },
      { label: 'FAQ', href: '#faq' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '#vision' },
      { label: 'Team', href: '#team' },
      { label: 'Contact', href: '#join' },
      { label: 'Early access', href: '#join' },
      { label: 'Get started', href: '#top' },
    ],
  },
]

const SOCIAL = [
  { label: 'Instagram', icon: Instagram },
  { label: 'LinkedIn', icon: LinkedIn },
  { label: 'X', icon: XIcon },
  { label: 'GitHub', icon: Github },
]

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__brand">
            <Logo size={32} />
            <p>The youth ecosystem for the next generation.</p>
            <div className="footer__social" style={{ marginTop: 22 }}>
              {SOCIAL.map((s) => {
                const Icon = s.icon
                return (
                  <a
                    key={s.label}
                    href="#top"
                    aria-label={`${s.label} — coming soon`}
                    title={`${s.label} — coming soon`}
                  >
                    <Icon size={18} />
                  </a>
                )
              })}
            </div>
          </div>

          {COLS.map((col) => (
            <nav className="footer__col" key={col.title} aria-label={`Footer ${col.title}`}>
              <h4>{col.title}</h4>
              {col.links.map((l) => (
                <a key={l.label} href={l.href}>
                  {l.label}
                </a>
              ))}
            </nav>
          ))}
        </div>

        <div className="footer__bottom">
          <span>© 2026 AADI HUB</span>
          <span>
            <BrandSymbol size={16} style={{ display: 'inline-block', verticalAlign: '-3px', marginRight: 6 }} />
            Built for the <b>next generation.</b>
          </span>
        </div>
      </div>
    </footer>
  )
}
