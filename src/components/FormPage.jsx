import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import EarlyAccessForm from './EarlyAccessForm.jsx'
import { BrandSymbol } from './Logo.jsx'

export default function FormPage() {
  useEffect(() => {
    document.title = 'AADI HUB — Join the Founding Community'
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="form-page">
      <div className="form-page__bg" aria-hidden="true" />

      <div className="form-page__inner">
        <Link to="/" className="form-page__back" aria-label="Back to AADI HUB">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to AADI HUB
        </Link>

        <div className="form-page__header">
          <div className="form-page__brand">
            <BrandSymbol size={38} />
            <span className="form-page__brand-text">AADI <b>HUB</b></span>
          </div>

          <h1 className="form-page__title">
            Founding Community
          </h1>

          <p className="form-page__subtitle">
            Join the people building what comes next.
          </p>

          <div className="form-page__kicker">
            <span className="tag tag--kiwi">Early access · Founding community</span>
            <p className="form-page__kicker-text">
              Tell us a little about yourself and become part of the early AADI HUB community.
            </p>
          </div>
        </div>

        <div className="form-page__card">
          <EarlyAccessForm />
        </div>

        <footer className="form-page__footer">
          <p>Your information is used only for AADI early access and product updates.</p>
        </footer>
      </div>
    </div>
  )
}
