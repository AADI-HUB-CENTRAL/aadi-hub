import {
  DiyaDefs,
  Rangoli,
  Lantern,
  Diya,
  Garland,
  CornerGarland,
  SideGarland,
} from './DiwaliHeroDecorations.jsx'

const MOBILE_SPARKLES = [
  { left: '8%', top: '18%', size: 6, duration: 5.6, delay: 0.4 },
  { left: '88%', top: '24%', size: 5, duration: 4.8, delay: 2.2 },
  { left: '16%', top: '58%', size: 4, duration: 6.4, delay: 1.3 },
  { left: '78%', top: '64%', size: 6, duration: 5.2, delay: 3.1 },
  { left: '46%', top: '82%', size: 4, duration: 4.5, delay: 0.9 },
]

const FLOATING = [
  { left: '6%', bottom: '18%', size: 4, duration: 16, delay: 1, drift: 22 },
  { left: '14%', bottom: '42%', size: 3, duration: 13, delay: 6, drift: -18 },
  { left: '23%', bottom: '12%', size: 5, duration: 18, delay: 3, drift: 20 },
  { left: '32%', bottom: '50%', size: 3, duration: 15, delay: 9, drift: -16 },
  { left: '42%', bottom: '24%', size: 4, duration: 17, delay: 2, drift: 24 },
  { left: '51%', bottom: '56%', size: 3, duration: 14, delay: 7, drift: -20 },
  { left: '60%', bottom: '16%', size: 5, duration: 19, delay: 4, drift: 18 },
  { left: '69%', bottom: '46%', size: 3, duration: 13, delay: 10, drift: -14 },
  { left: '78%', bottom: '22%', size: 4, duration: 16, delay: 5, drift: 22 },
  { left: '87%', bottom: '52%', size: 3, duration: 15, delay: 8, drift: -18 },
  { left: '93%', bottom: '14%', size: 4, duration: 18, delay: 11, drift: 16 },
  { left: '37%', bottom: '68%', size: 3, duration: 12, delay: 12, drift: -22 },
]

export default function DiwaliWishesBackdrop() {
  return (
    <div className="dw-bg" aria-hidden="true">
      <DiyaDefs />

      <div className="dw-bg__aurora dw-bg__aurora--gold" />
      <div className="dw-bg__aurora dw-bg__aurora--violet" />
      <div className="dw-bg__aurora dw-bg__aurora--orange" />
      <div className="dw-bg__stars" />
      <div className="dw-bg__pattern" />

      <Garland className="dw-bg__garland" />

      <div className="dw-bg__warmth" />

      <CornerGarland className="dw-bg__corner-garland dw-bg__corner-garland--left" />
      <CornerGarland className="dw-bg__corner-garland dw-bg__corner-garland--right" />
      <SideGarland className="dw-bg__side-garland dw-bg__side-garland--left" />
      <SideGarland className="dw-bg__side-garland dw-bg__side-garland--right" />

      <div className="dw-bg__sparkles">
        {MOBILE_SPARKLES.map((sparkle, index) => (
          <span
            key={index}
            className="dw-bg__sparkle"
            style={{
              left: sparkle.left,
              top: sparkle.top,
              '--s': `${sparkle.size}px`,
              '--dur': `${sparkle.duration}s`,
              '--delay': `${sparkle.delay}s`,
            }}
          />
        ))}
      </div>

      <div className="dw-bg__rangoli dw-bg__rangoli--right">
        <Rangoli className="dw-bg__rangoli-svg" />
      </div>
      <div className="dw-bg__rangoli dw-bg__rangoli--left">
        <Rangoli className="dw-bg__rangoli-svg" />
      </div>

      <div className="dw-bg__lantern dw-bg__lantern--left">
        <Lantern className="dw-bg__lantern-svg" />
      </div>
      <div className="dw-bg__lantern dw-bg__lantern--right">
        <Lantern className="dw-bg__lantern-svg" />
      </div>

      <Diya className="dw-bg__diya dw-bg__diya--left" />
      <Diya className="dw-bg__diya dw-bg__diya--right" />

      <div className="dw-bg__particles">
        {FLOATING.map((p, i) => (
          <span
            key={i}
            className="dw-bg__particle"
            style={{
              left: p.left,
              bottom: p.bottom,
              '--s': `${p.size}px`,
              '--dur': `${p.duration}s`,
              '--delay': `-${p.delay}s`,
              '--drift': `${p.drift}px`,
            }}
          />
        ))}
      </div>
    </div>
  )
}
