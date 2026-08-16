import Reveal from './ui/Reveal.jsx'
import Button from './ui/Button.jsx'
import { BrandSymbol } from './Logo.jsx'

export default function FinalCta() {
  return (
    <section className="final" id="start">
      <div className="grid-bg grid-bg--masked" aria-hidden="true" />
      <div className="container">
        <Reveal variant="scale">
          <div className="final__symbol">
            <BrandSymbol size={62} />
          </div>
        </Reveal>

        <Reveal delay={120}>
          <h2 className="final__title">
            Your next chapter
            <br />
            <span className="kiwi">starts here.</span>
          </h2>
        </Reveal>

        <Reveal delay={240}>
          <p className="final__sub">
            Connect. <b>Build.</b> Grow. <b>Become.</b>
          </p>
        </Reveal>

        <Reveal delay={340}>
          <div className="btn-row">
            <Button href="#join" variant="primary" size="lg">
              Join AADI
            </Button>
            <Button href="#vision" variant="secondary" size="lg" arrow>
              Explore the Vision
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
