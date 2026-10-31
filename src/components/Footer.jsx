import { Link } from 'react-router-dom'
import Logo, { BrandSymbol } from './Logo.jsx'
import { ArrowUpRight, Instagram, LinkedIn, MapPin, XIcon, Github } from './ui/Icons.jsx'

const COLS = [
  {
    title: 'Explore',
    links: [
      { label: 'Vision', href: '#vision' },
      { label: 'Ecosystem', href: '#ecosystem' },
      { label: 'Identity', href: '#identity' },
      { label: 'Passport', href: '#passport' },
      { label: 'FAQ', href: '#faq' },
    ],
  },
  {
    title: 'Experience',
    links: [
      { label: 'Social, but around progress', to: '/explore/social' },
      { label: 'Social feed', to: '/explore/feed' },
      { label: 'Communities', to: '/explore/communities' },
      { label: 'Challenges', to: '/explore/challenges' },
      { label: 'Projects', to: '/explore/projects' },
      { label: 'Build with people', to: '/explore/build-with-people' },
    ],
  },
  {
    title: 'Ecosystem',
    links: [
      { label: 'Opportunities', to: '/explore/opportunities' },
      { label: 'Campus ecosystem', to: '/explore/campus' },
      { label: 'Reputation', to: '/explore/reputation' },
      { label: 'How it works', href: '#journey' },
      { label: 'Join AADI', href: '#join' },
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

const StarMark = ({ size = 13 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2.6l2.9 6.1 6.6.9-4.8 4.6 1.2 6.6L12 17.6l-5.9 3.2 1.2-6.6-4.8-4.6 6.6-.9z" />
  </svg>
)

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

            <div className="footer__trust">
              <div className="footer__trust-rating">
                <span className="footer__trust-stars" role="img" aria-label="Rated 5 out of 5 stars">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <StarMark key={i} />
                  ))}
                </span>
                <span className="footer__trust-score">5.0</span>
              </div>
              <p className="footer__trust-title">Trusted by students &amp; faculty</p>
              <p className="footer__trust-sub">Rated by the AADI community.</p>
              <div className="footer__trust-brand">
                <span className="footer__trustpilot-mark">
                  <StarMark size={13} />
                </span>
                <span>Trustpilot</span>
              </div>
            </div>
          </div>

          {COLS.map((col) => (
            <nav className="footer__col" key={col.title} aria-label={`Footer ${col.title}`}>
              <h4>{col.title}</h4>
              {col.links.map((l) => (
                l.to ? (
                  <Link key={l.label} to={l.to}>
                    {l.label}
                  </Link>
                ) : (
                  <a key={l.label} href={`/${l.href}`}>
                    {l.label}
                  </a>
                )
              ))}
            </nav>
          ))}

          <div className="footer__map" aria-label="AADI HUB location map">
            <div className="footer__map-info">
              <span className="footer__map-kicker">
                <MapPin size={14} />
                AADI HUB location
              </span>
              <h4>Madanapalle Institute of Technology &amp; Science</h4>
              <p>NH-42, near Angallu, Madanapalle, Andhra Pradesh 517325</p>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Madanapalle+Institute+of+Technology+and+Science"
                target="_blank"
                rel="noopener noreferrer"
              >
                Open in Google Maps <ArrowUpRight size={15} />
              </a>
            </div>

            <div className="footer__map-frame">
              <iframe
                title="Map showing AADI HUB at Madanapalle Institute of Technology and Science"
                src="https://www.openstreetmap.org/export/embed.html?bbox=78.4485%2C13.6096%2C78.5085%2C13.6496&layer=mapnik&marker=13.6296%2C78.4785"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
              <span className="footer__map-badge">
                <MapPin size={13} />
                MITS, Madanapalle
              </span>
            </div>
          </div>
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
