import { useEffect, useRef, useState } from 'react'
import Logo, { BrandSymbol } from './Logo.jsx'
import Button from './ui/Button.jsx'
import { Menu, X } from './ui/Icons.jsx'

const LINKS = [
  { label: 'Vision', href: '#vision' },
  { label: 'Ecosystem', href: '#ecosystem' },
  { label: 'Communities', href: '#community' },
  { label: 'Challenges', href: '#challenges' },
  { label: 'Projects', href: '#projects' },
  { label: 'Opportunities', href: '#opportunities' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('')
  const drawerRef = useRef(null)
  const burgerRef = useRef(null)
  const activeRef = useRef('')

  useEffect(() => {
    const sections = LINKS.map((l) => document.getElementById(l.href.slice(1)))
      .filter(Boolean)
      .sort((a, b) =>
        a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
      )
    const onScroll = () => {
      setScrolled(window.scrollY > 12)
      let next = ''
      for (const s of sections) {
        if (s.getBoundingClientRect().top <= 132) next = s.id
      }
      if (next !== activeRef.current) {
        activeRef.current = next
        setActive(next)
      }
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') close()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const panel = drawerRef.current
    if (!panel) return
    const focusables = Array.from(panel.querySelectorAll('a[href], button'))
    if (!focusables.length) return
    const first = focusables[0]
    const last = focusables[focusables.length - 1]
    const onTab = (e) => {
      if (e.key !== 'Tab') return
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    const closeBtn = panel.querySelector('.drawer__close')
    const target = closeBtn || first
    let attempts = 0
    let timer
    const moveFocus = () => {
      attempts++
      const active = document.activeElement
      if (active && panel.contains(active)) return
      if (attempts > 6) return
      target.focus()
      timer = setTimeout(moveFocus, 30)
    }
    timer = setTimeout(moveFocus, 0)
    panel.addEventListener('keydown', onTab)
    return () => {
      clearTimeout(timer)
      panel.removeEventListener('keydown', onTab)
    }
  }, [open])

  const scrollToId = (id) => {
    const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ? 'auto'
      : 'smooth'
    if (id === 'top') {
      window.scrollTo({ top: 0, behavior })
      return
    }
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior, block: 'start' })
  }

  const close = () => {
    setOpen(false)
    document.body.style.overflow = ''
    if (burgerRef.current) burgerRef.current.focus()
  }

  const go = (e, id) => {
    e.preventDefault()
    close()
    scrollToId(id)
  }

  return (
    <header className={`nav${scrolled ? ' is-scrolled' : ''}`}>
      <div className="container nav__inner">
        <a
          href="#top"
          className="nav__logo"
          aria-label="AADI HUB — back to top"
          onClick={(e) => go(e, 'top')}
        >
          <BrandSymbol size={28} />
          <img
            className="nav__logo-img"
            src="/AADI HUB LOGO.png"
            alt="AADI HUB"
            width={2170}
            height={1080}
          />
        </a>

        <nav className="nav__links" aria-label="Primary">
          {LINKS.map((l) => {
            const id = l.href.slice(1)
            return (
              <a
                key={l.href}
                className="nav__link"
                href={l.href}
                aria-current={active === id ? 'true' : undefined}
                onClick={(e) => go(e, id)}
              >
                {l.label}
              </a>
            )
          })}
        </nav>

        <div className="nav__right">
          <span className="nav__status">
            <span className="nav__status-dot" aria-hidden="true" />
            Early Access
          </span>
          <a className="nav__login" href="/login">
            Login
          </a>
          <Button href="/register" variant="primary" size="sm" className="nav__register" arrow>
            Register
          </Button>
          <button
            className="nav__burger"
            ref={burgerRef}
            onClick={() => setOpen(true)}
            aria-label={open ? 'Close navigation' : 'Open navigation'}
            aria-expanded={open}
            aria-controls="mobile-drawer"
          >
            <Menu />
          </button>
        </div>
      </div>

      <div className={`drawer${open ? ' is-open' : ''}`} id="mobile-drawer" aria-hidden={!open}>
        <div className="drawer__backdrop" onClick={close} />
        <div
          className="drawer__panel"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
          ref={drawerRef}
        >
          <div className="drawer__top">
            <a
              className="drawer__logo"
              href="#top"
              aria-label="AADI HUB — back to top"
              onClick={(e) => go(e, 'top')}
            >
              <Logo symbol={24} />
            </a>
            <button className="drawer__close" onClick={close} aria-label="Close navigation">
              <X />
            </button>
          </div>
          <nav className="drawer__links" aria-label="Mobile">
            {LINKS.map((l) => {
              const id = l.href.slice(1)
              return (
                <a
                  key={l.href}
                  className="drawer__link"
                  href={l.href}
                  aria-current={active === id ? 'true' : undefined}
                  onClick={(e) => go(e, id)}
                >
                  {l.label}
                </a>
              )
            })}
          </nav>
          <div className="drawer__divider" />
          <div className="drawer__actions">
            <a className="drawer__login" href="/login" onClick={close}>
              Login
            </a>
            <Button
              href="/register"
              variant="primary"
              size="lg"
              className="w-full drawer__register"
              arrow
              onClick={close}
            >
              Register
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
