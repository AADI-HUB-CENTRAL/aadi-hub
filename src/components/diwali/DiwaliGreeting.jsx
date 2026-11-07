import Button from '../ui/Button.jsx'
import { DiwaliMusicButton } from './DiwaliMusicController.jsx'

export default function DiwaliGreeting() {
  return (
    <div className="diwali-greeting">
      <DiwaliMusicButton className="diwali-greeting__music" />

      <span className="diwali-greeting__label">
        <span className="diwali-greeting__diamond" aria-hidden="true" />
        AADI HUB &middot; FESTIVE EDITION 2026
      </span>

      <p className="diwali-greeting__title">
        <span className="diwali-greeting__emoji" aria-hidden="true">
          &#10024;
        </span>
        <span className="diwali-greeting__title-text">Happy Diwali</span>
        <span className="diwali-greeting__emoji" aria-hidden="true">
          &#10024;
        </span>
      </p>

      <p className="diwali-greeting__message">
        May your journey shine brighter. Let&apos;s build a future full of
        possibilities.
      </p>

      <div className="diwali-greeting__cta-wrap">
        <span className="diwali-greeting__cta-sparkle diwali-greeting__cta-sparkle--1" aria-hidden="true" />
        <span className="diwali-greeting__cta-sparkle diwali-greeting__cta-sparkle--2" aria-hidden="true" />
        <Button
          href="/diwali-wishes"
          variant="primary"
          size="md"
          className="diwali-greeting__cta"
        >
          Click for a Surprise
          <span className="diwali-greeting__cta-emoji" aria-hidden="true">
            &#10024;
          </span>
        </Button>
      </div>
    </div>
  )
}
