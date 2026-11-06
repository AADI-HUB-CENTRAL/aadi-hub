import { Rangoli } from './DiwaliHeroDecorations.jsx'

const FACTS = [
  {
    title: 'The Festival of Lights',
    body: 'Diwali is celebrated across India and around the world as the Festival of Lights, bringing families and communities together.',
  },
  {
    title: 'Light Over Darkness',
    body: 'At its heart, Diwali symbolizes the victory of light over darkness and good over evil.',
  },
  {
    title: 'Many Stories, One Celebration',
    body: 'Different Indian traditions celebrate different stories and customs associated with Diwali, each with its own warmth and meaning.',
  },
  {
    title: 'Homes Filled With Light',
    body: 'People decorate their homes with diyas, rangoli and lights, welcoming prosperity and positivity into their spaces.',
  },
  {
    title: 'Sweets, Gifts and Togetherness',
    body: 'Families exchange sweets, gifts, prayers and warm wishes, celebrating the joy of being together.',
  },
  {
    title: 'Blessings of Lakshmi',
    body: 'In many traditions, Goddess Lakshmi is worshipped for prosperity and well-being during this auspicious festival.',
  },
]

export default function DiwaliFestivalInfo() {
  return (
    <section className="dw-info" aria-labelledby="dw-info-title">
      <div className="dw-info__rangoli dw-info__rangoli--left" aria-hidden="true">
        <Rangoli className="dw-info__rangoli-svg" />
      </div>
      <div className="dw-info__rangoli dw-info__rangoli--right" aria-hidden="true">
        <Rangoli className="dw-info__rangoli-svg" />
      </div>

      <div className="dw-info__head">
        <span className="dw-info__eyebrow">The story behind the light</span>
        <h2 id="dw-info-title">Why We Celebrate Diwali</h2>
        <p>
          A festival of gratitude, togetherness and hope, celebrated in many
          beautiful ways across India.
        </p>
      </div>

      <div className="dw-info__grid">
        {FACTS.map((fact, index) => (
          <article className="dw-info__card" key={fact.title}>
            <span className="dw-info__index" aria-hidden="true">
              {String(index + 1).padStart(2, '0')}
            </span>
            <h3>{fact.title}</h3>
            <p>{fact.body}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
