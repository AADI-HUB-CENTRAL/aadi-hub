import Reveal from './ui/Reveal.jsx'
import { BrandSymbol } from './Logo.jsx'
import {
  Spark,
  TrendingUp,
  Music,
  Palette,
  Instagram,
  XIcon,
  LinkedIn,
  WhatsApp,
} from './ui/Icons.jsx'

const CHANNELS = [
  { label: 'Instagram', icon: Instagram },
  { label: 'X', icon: XIcon },
  { label: 'LinkedIn', icon: LinkedIn },
  { label: 'WhatsApp', icon: WhatsApp },
]

const PERKS = [
  {
    title: 'Entertainment-first content',
    body: 'Founding team members create entertainment videos, dance reels and trending formats that make student life worth watching.',
    icon: Music,
  },
  {
    title: 'Content creation engine',
    body: 'From scripting to shooting and editing — campus moments and AADI launches become creator-led content every week.',
    icon: Palette,
  },
  {
    title: '7K+ Instagram community',
    body: 'An engaged audience of 7,000+ Instagram followers gets every drop, challenge and student win right in the feed.',
    icon: Instagram,
  },
]

const STATS = [
  { value: '7K+', label: 'Instagram followers' },
  { value: 'Founding', label: 'creator team' },
  { value: 'Weekly', label: 'reels & content' },
]

const TICKER = [
  'Entertainment videos',
  'Dance reels',
  'Content creation',
  'Campus stories',
  'Creator collabs',
  'Student wins',
]

export default function SocialPartners() {
  return (
    <section className="partners sec sec--deep sec--line" id="partners" aria-label="Our social media partners">
      <div className="partners__glow partners__glow--one" aria-hidden="true" />
      <div className="partners__glow partners__glow--two" aria-hidden="true" />

      <div className="container">
        <div className="partners__head">
          <div>
            <Reveal>
              <p className="sec-kicker">Our social media partners</p>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="sec-title">
                AADI HUB <span className="partners__x">×</span>{' '}
                <em>CJPX MEDIA</em>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={140} variant="right">
            <p className="partners__lead">
              A tie-up with an entertainment and content creation company — CJPX Media&apos;s founding
              team shares entertainment videos, dances and creator content with a 7K+ Instagram
              community.
            </p>
          </Reveal>
        </div>

        <Reveal delay={160} variant="scale">
          <article className="partners__card">
            <div className="partners__grid" aria-hidden="true" />

            <div className="partners__stage">
              <div className="partners__node">
                <div className="partners__logo partners__logo--aadi">
                  <span className="partners__orbit" aria-hidden="true" />
                  <BrandSymbol size={54} />
                </div>
                <p className="partners__node-name">AADI HUB</p>
                <span className="partners__node-sub">Student ecosystem</span>
              </div>

              <div className="partners__beam" aria-hidden="true">
                <span className="partners__beam-line" />
                <span className="partners__beam-dot" />
                <span className="partners__beam-dot partners__beam-dot--2" />
                <span className="partners__beam-label">in partnership</span>
              </div>

              <div className="partners__node">
                <div className="partners__logo partners__logo--cjpx">
                  <span className="partners__orbit" aria-hidden="true" />
                  <img src="/assets/cjpxmedia.png" alt="CJPX Media" />
                </div>
                <p className="partners__node-name">CJPX MEDIA</p>
                <span className="partners__node-sub">Entertainment &amp; content</span>
              </div>
            </div>

            <div className="partners__body">
              <span className="partners__badge">
                <span className="partners__badge-dot" aria-hidden="true" />
                Official entertainment &amp; social media partner
              </span>
              <h3 className="partners__title">One hub. Every feed.</h3>
              <p className="partners__copy">
                CJPX Media is the entertainment and content creation partner behind AADI HUB&apos;s
                social presence. Its founding team members share entertainment videos, dance reels
                and original content — bringing a 7K+ Instagram following closer to student work.
              </p>
              <dl className="partners__stats">
                {STATS.map((stat) => (
                  <div className="partners__stat" key={stat.label}>
                    <dt>{stat.value}</dt>
                    <dd>{stat.label}</dd>
                  </div>
                ))}
              </dl>
              <ul className="partners__channels" aria-label="Channels covered by CJPX Media">
                {CHANNELS.map(({ label, icon: Icon }) => (
                  <li className="partners__channel" key={label}>
                    <Icon size={16} />
                    {label}
                  </li>
                ))}
              </ul>
            </div>

            <div className="partners__ticker" aria-hidden="true">
              <div className="partners__ticker-track">
                {[0, 1].map((pass) => (
                  <div className="partners__ticker-group" key={pass}>
                    {TICKER.map((word) => (
                      <span className="partners__ticker-item" key={`${pass}-${word}`}>
                        {word}
                        <Spark size={13} />
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </article>
        </Reveal>

        <div className="partners__perks">
          {PERKS.map((perk, i) => {
            const Icon = perk.icon
            return (
              <Reveal key={perk.title} delay={180 + i * 110}>
                <article className="partners__perk">
                  <span className="partners__perk-icon">
                    <Icon size={19} />
                  </span>
                  <h3>{perk.title}</h3>
                  <p>{perk.body}</p>
                </article>
              </Reveal>
            )
          })}
        </div>

        <Reveal delay={300}>
          <p className="partners__foot">
            <TrendingUp size={17} />
            Built with CJPX Media — entertainment, content and community on every platform.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
