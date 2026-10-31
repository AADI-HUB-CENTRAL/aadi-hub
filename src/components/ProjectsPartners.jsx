import Reveal from './ui/Reveal.jsx'

const PARTNERS = [
  {
    name: 'CJPX Media',
    type: 'Entertainment & content partner',
    img: '/assets/cjpxmedia-logo.png',
    alt: 'CJPX Media logo',
    tone: 'cjpx',
  },
  {
    name: 'Annapurnam',
    type: 'NGO platform',
    img: '/assets/annapurnam.webp',
    alt: 'Annapurnam logo',
    tone: 'ngo',
  },
  {
    name: 'Neighbour Stay',
    type: 'Right stay',
    img: '/assets/neighbourstay-logo.jpg',
    alt: 'Neighbour Stay logo',
    tone: 'stay',
  },
]

function PartnerItem({ partner }) {
  return (
    <div className={`pp-item pp-item--${partner.tone}`}>
      <span className="pp-item__logo">
        <img src={partner.img} alt={partner.alt} loading="lazy" />
      </span>
      <span className="pp-item__text">
        <span className="pp-item__name">{partner.name}</span>
        <span className="pp-item__type">{partner.type}</span>
      </span>
    </div>
  )
}

export default function ProjectsPartners() {
  return (
    <section className="pp sec sec--deep sec--line" id="partners" aria-label="Our ongoing projects and partners">
      <div className="container">
        <Reveal>
          <h2 className="pp__title">Our ongoing projects and partners</h2>
        </Reveal>
      </div>

      <Reveal delay={100}>
        <div className="pp-marquee" aria-label="Our ongoing projects and partners">
          <div className="pp-marquee__track">
            {[0, 1, 2].map((pass) => (
              <div className="pp-marquee__group" key={pass} aria-hidden={pass === 0 ? undefined : 'true'}>
                {PARTNERS.map((partner) => (
                  <PartnerItem partner={partner} key={`${pass}-${partner.name}`} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  )
}
