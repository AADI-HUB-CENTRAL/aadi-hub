import { Link } from 'react-router-dom'
import { Rangoli } from './DiwaliHeroDecorations.jsx'
import DiwaliFestivalInfo from './DiwaliFestivalInfo.jsx'
import DiwaliFoundingTeamSection from './DiwaliFoundingTeamSection.jsx'

export default function DiwaliGreetingReveal({
  name,
  onReplay,
  onShare,
  shareStatus,
}) {
  return (
    <div className="dw-reveal">
      <div className="dw-reveal__halo" aria-hidden="true" />

      <div className="dw-reveal__rangoli dw-reveal__rangoli--left" aria-hidden="true">
        <Rangoli className="dw-reveal__rangoli-svg" />
      </div>
      <div className="dw-reveal__rangoli dw-reveal__rangoli--right" aria-hidden="true">
        <Rangoli className="dw-reveal__rangoli-svg" />
      </div>

      <section className="dw-reveal__card" aria-labelledby="dw-reveal-title">
        <p className="dw-reveal__eyebrow">AADI HUB &middot; FESTIVE EDITION 2026</p>

        <h1 className="dw-reveal__title" id="dw-reveal-title">
          Happy Diwali, <span>{name}!</span>
        </h1>

        <p className="dw-reveal__blessing">
          May Goddess Lakshmi bless you with prosperity, happiness, wisdom and
          success.
        </p>

        <p className="dw-reveal__message">
          May the light of every diya brighten your life, may every new
          beginning bring opportunity, and may your dreams shine brighter with
          every passing day.
        </p>

        <p className="dw-reveal__message dw-reveal__message--soft">
          Wishing you and your family a Diwali filled with peace, prosperity,
          good health, happiness and countless beautiful memories.
        </p>

        <p className="dw-reveal__attribution">With warm wishes &ndash; AADI HUB</p>

        <div className="dw-reveal__actions">
          <button className="dw-btn dw-btn--gold" type="button" onClick={onReplay}>
            Celebrate Again
          </button>
          <button className="dw-btn dw-btn--outline" type="button" onClick={onShare}>
            Share Your Diwali Wishes
          </button>
          <Link className="dw-btn dw-btn--ghost" to="/">
            Back to AADI HUB
          </Link>
        </div>

        <p className="dw-reveal__status" role="status" aria-live="polite">
          {shareStatus}
        </p>
      </section>

      <DiwaliFoundingTeamSection />

      <DiwaliFestivalInfo />
    </div>
  )
}
