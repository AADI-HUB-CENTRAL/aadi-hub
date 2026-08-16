import { useEffect, useRef, useState } from 'react'
import SectionHeader from './ui/SectionHeader.jsx'
import Reveal from './ui/Reveal.jsx'
import Button from './ui/Button.jsx'
import Qr from './ui/Qr.jsx'
import { BrandSymbol } from './Logo.jsx'
import { Check } from './ui/Icons.jsx'

const POINTS = [
  { title: 'One ID. Everywhere.', text: 'Your AADI ID gives you one identity across the ecosystem — no separate account for every feature.' },
  { title: 'Grows with you.', text: 'Your profile evolves as you participate, build, contribute and grow.' },
  { title: 'Scan to discover.', text: 'Your QR opens your public AADI profile, so anyone can see who you are and what you’re building.' },
]

const SKILLS = ['AI', 'Python', 'SQL', 'Data']

const MAX_TILT = 3.5

function IdCard() {
  const ref = useRef(null)
  const [scan, setScan] = useState(0)

  const handleScan = () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    setScan((n) => n + 1)
  }

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (window.matchMedia('(pointer: coarse)').matches) return

    let raf = 0
    const onMove = (e) => {
      const r = el.getBoundingClientRect()
      const px = (e.clientX - r.left) / r.width
      const py = (e.clientY - r.top) / r.height
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        el.style.setProperty('--rx', `${((0.5 - py) * MAX_TILT * 2).toFixed(2)}deg`)
        el.style.setProperty('--ry', `${((px - 0.5) * MAX_TILT * 2).toFixed(2)}deg`)
        el.style.setProperty('--mx', `${(px * 100).toFixed(1)}%`)
        el.style.setProperty('--my', `${(py * 100).toFixed(1)}%`)
      })
    }
    const onLeave = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        el.style.setProperty('--rx', '0deg')
        el.style.setProperty('--ry', '0deg')
      })
    }
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    return () => {
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div className="idcard" ref={ref} onClick={handleScan}>
      <BrandSymbol className="idcard__watermark" size={240} />

      <div className="idcard__brand">
        <span className="idcard__logo">
          <BrandSymbol size={26} />
          AADI <b>HUB</b>
        </span>
        <span className="idcard__badge">Concept ID</span>
      </div>

      <div className="idcard__identity">
        <h3 className="idcard__name">Naga Neeraj</h3>
        <p className="idcard__role">Data Science · Builder</p>
      </div>

      <ul className="idcard__skills" aria-label="Key skills">
        {SKILLS.map((s) => (
          <li className="idcard__skill" key={s}>
            {s}
          </li>
        ))}
      </ul>

      <div className="idcard__idline">
        <span className="idcard__idlabel">AADI ID</span>
        <span className="idcard__idnum">AADI-000281</span>
      </div>

      <div className="idcard__foot">
        <div className="idcard__reps">
          <div className="idcard__rep">
            <span className="idcard__replabel">Level</span>
            <b className="idcard__repval">14</b>
          </div>
          <div className="idcard__rep">
            <span className="idcard__replabel">Reputation</span>
            <b className="idcard__repval">4,280</b>
          </div>
        </div>

        <div className="idcard__qrbox">
          <div className="idcard__qr">
            <span
              key={scan}
              className={`idcard__scan${scan > 0 ? ' is-active' : ''}`}
              aria-hidden="true"
              onAnimationEnd={() => setScan(0)}
            />
            <Qr />
          </div>
          <span className="idcard__qrtext">Scan to discover</span>
        </div>
      </div>

      <div className="idcard__strip">
        <span>AADI Identity · Concept ID</span>
        <span>Profile type · Builder</span>
      </div>
    </div>
  )
}

export default function Identity() {
  return (
    <section className="sec sec--night sec--line" id="identity">
      <div className="container identity__grid">
        <Reveal variant="left" className="identity__copy">
          <SectionHeader
            kicker="AADI ID"
            tag="Concept preview"
            title={
              <>
                Your identity.
                <span className="line">Beyond a <em>name.</em></span>
              </>
            }
            lead="Every member gets a digital identity that grows with them — one ID that carries skills, projects, communities and reputation across everything AADI builds."
          />
          <Reveal delay={180}>
            <ul className="profile__copy__list">
              {POINTS.map((p) => (
                <li className="profile__copy__item" key={p.title}>
                  <span className="ico"><Check size={20} /></span>
                  <div>
                    <h4>{p.title}</h4>
                    <p>{p.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>
          <div className="btn-row">
            <Button href="#passport" variant="primary" size="lg" arrow>
              Meet the Passport
            </Button>
          </div>
          <p className="identity__note">Your ID is the beginning. Your Passport tells the story.</p>
        </Reveal>

        <Reveal variant="right" delay={150}>
          <div className="idcard__stage">
            <IdCard />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
