import Reveal from './ui/Reveal.jsx'
import Button from './ui/Button.jsx'

const LIST = ['Your people.', 'Your ideas.', 'Your projects.', 'Your opportunities.', 'Your next.']

export default function Movement() {
  return (
    <section className="sec movement" id="movement">
      <div className="container">
        <Reveal>
          <span className="movement__strike">We’re not building another platform.</span>
        </Reveal>

        <Reveal delay={140}>
          <h2 className="movement__title">
            We’re building
            <br />
            <span className="kiwi">a place to belong.</span>
          </h2>
        </Reveal>

        <Reveal delay={260}>
          <ul className="movement__list">
            {LIST.map((l, i) => (
              <li key={l}>
                {i === LIST.length - 1 ? (
                  <>
                    Your <i>next.</i>
                  </>
                ) : (
                  l
                )}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={360}>
          <div className="btn-row">
            <Button href="#join" variant="primary" size="lg">
              Join AADI
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
