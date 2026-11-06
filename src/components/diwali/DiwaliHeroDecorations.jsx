import DiwaliFireworks from './DiwaliFireworks.jsx'

const PARTICLES = [
  { left: '5%', bottom: '16%', size: 5, duration: 15, delay: 2, drift: 28 },
  { left: '11%', bottom: '36%', size: 3, duration: 13, delay: 7, drift: -22 },
  { left: '18%', bottom: '10%', size: 4, duration: 17, delay: 4, drift: 18 },
  { left: '27%', bottom: '44%', size: 3, duration: 12, delay: 10, drift: -16 },
  { left: '36%', bottom: '22%', size: 5, duration: 16, delay: 1, drift: 24 },
  { left: '46%', bottom: '52%', size: 3, duration: 14, delay: 8, drift: -20 },
  { left: '55%', bottom: '14%', size: 4, duration: 18, delay: 5, drift: 20 },
  { left: '64%', bottom: '40%', size: 3, duration: 13, delay: 11, drift: -14 },
  { left: '73%', bottom: '20%', size: 5, duration: 16, delay: 3, drift: 24 },
  { left: '81%', bottom: '48%', size: 3, duration: 15, delay: 9, drift: -18 },
  { left: '88%', bottom: '12%', size: 4, duration: 17, delay: 6, drift: 16 },
  { left: '94%', bottom: '34%', size: 3, duration: 12, delay: 12, drift: -22 },
]

const SPARKLES = [
  { left: '9%', top: '22%', size: 9, duration: 5.5, delay: 0 },
  { left: '22%', top: '12%', size: 6, duration: 4.2, delay: 1.4 },
  { left: '39%', top: '30%', size: 7, duration: 6.2, delay: 2.6 },
  { left: '58%', top: '9%', size: 5, duration: 4.8, delay: 0.8 },
  { left: '71%', top: '28%', size: 8, duration: 6.8, delay: 3.1 },
  { left: '86%', top: '16%', size: 6, duration: 5.1, delay: 1.9 },
  { left: '93%', top: '58%', size: 5, duration: 6.4, delay: 2.2 },
  { left: '14%', top: '64%', size: 6, duration: 5.7, delay: 3.6 },
]

const MARIGOLDS = [
  [34, 42, 1.05],
  [92, 58, 0.9],
  [150, 74, 1.1],
  [216, 88, 0.95],
  [286, 96, 1.2],
  [356, 98, 1],
  [426, 94, 1.15],
  [496, 86, 0.95],
  [566, 76, 1.1],
  [636, 64, 1],
  [706, 54, 1.15],
  [774, 48, 0.95],
  [838, 48, 1.05],
  [890, 58, 0.85],
]

const CORNER_MARIGOLDS = [
  [10, 14, 0.72, 'gold'],
  [32, 28, 0.84, 'orange'],
  [57, 40, 0.96, 'deep'],
  [84, 48, 1.02, 'orange'],
  [109, 52, 0.9, 'gold'],
  [124, 72, 1, 'deep'],
  [130, 102, 1.1, 'orange'],
  [134, 134, 0.94, 'gold'],
  [135, 166, 1.06, 'deep'],
  [132, 198, 0.96, 'orange'],
  [128, 230, 1.04, 'gold'],
  [122, 260, 0.82, 'deep'],
]

const SIDE_MARIGOLDS = Array.from({ length: 13 }, (_, index) => {
  const tones = ['orange', 'gold', 'deep']
  return {
    x: 34 + Math.sin(index * 1.38) * 9,
    y: 26 + index * 53,
    scale: index % 4 === 0 ? 1.08 : 0.88 + (index % 3) * 0.07,
    tone: tones[index % tones.length],
  }
})

export function DiyaDefs() {
  return (
    <svg width="0" height="0" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id="diwali-diya-glow" cx="50%" cy="38%" r="50%">
          <stop offset="0%" stopColor="#FFE7B0" stopOpacity="0.9" />
          <stop offset="55%" stopColor="#FFB347" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#FF8A1F" stopOpacity="0" />
        </radialGradient>
        <linearGradient
          id="diwali-diya-clay"
          x1="20"
          y1="68"
          x2="100"
          y2="104"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#B4531F" />
          <stop offset="0.5" stopColor="#7A3217" />
          <stop offset="1" stopColor="#4A1E10" />
        </linearGradient>
        <linearGradient
          id="diwali-diya-rim"
          x1="24"
          y1="70"
          x2="96"
          y2="92"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FFD98A" />
          <stop offset="0.5" stopColor="#F2A93B" />
          <stop offset="1" stopColor="#B4691D" />
        </linearGradient>
        <linearGradient
          id="diwali-lantern-body"
          x1="22"
          y1="44"
          x2="58"
          y2="108"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F7C46C" stopOpacity="0.28" />
          <stop offset="0.5" stopColor="#FF9E3D" stopOpacity="0.16" />
          <stop offset="1" stopColor="#B4531F" stopOpacity="0.32" />
        </linearGradient>
        <radialGradient id="diwali-lantern-halo" cx="50%" cy="62%" r="50%">
          <stop offset="0%" stopColor="#FFC46A" stopOpacity="0.4" />
          <stop offset="60%" stopColor="#FF9A3C" stopOpacity="0.14" />
          <stop offset="100%" stopColor="#FF8A1F" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  )
}

export function Rangoli({ className }) {
  const petals = Array.from({ length: 12 })
  const dots = Array.from({ length: 24 })

  return (
    <svg
      className={className}
      viewBox="0 0 240 240"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="120" cy="120" r="112" stroke="currentColor" strokeOpacity="0.35" />
      <circle
        cx="120"
        cy="120"
        r="104"
        stroke="currentColor"
        strokeOpacity="0.2"
        strokeDasharray="2 7"
      />

      {petals.map((_, i) => (
        <g key={`petal-${i}`} transform={`rotate(${i * 30} 120 120)`}>
          <path
            d="M120 34c11 18 17 33 17 47 0 15-7 26-17 35-10-9-17-20-17-35 0-14 6-29 17-47Z"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeOpacity="0.8"
          />
          <path
            d="M120 52c5 10 8 19 8 28 0 9-3 16-8 22-5-6-8-13-8-22 0-9 3-18 8-28Z"
            stroke="currentColor"
            strokeWidth="0.9"
            strokeOpacity="0.45"
          />
          <circle cx="120" cy="38" r="3" fill="currentColor" fillOpacity="0.85" />
        </g>
      ))}

      {dots.map((_, i) => (
        <circle
          key={`dot-${i}`}
          cx="120"
          cy="27"
          r="1.6"
          fill="currentColor"
          fillOpacity="0.7"
          transform={`rotate(${i * 15} 120 120)`}
        />
      ))}

      <circle cx="120" cy="120" r="62" stroke="currentColor" strokeOpacity="0.55" />
      <circle
        cx="120"
        cy="120"
        r="46"
        stroke="currentColor"
        strokeOpacity="0.35"
        strokeDasharray="1 6"
      />
      <circle cx="120" cy="120" r="14" stroke="currentColor" strokeOpacity="0.75" />
      <circle cx="120" cy="120" r="5" fill="currentColor" fillOpacity="0.6" />
    </svg>
  )
}

export function Lantern({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 80 190"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="40" cy="72" r="38" fill="url(#diwali-lantern-halo)" />
      <path d="M40 0v30" stroke="currentColor" strokeOpacity="0.45" />
      <path d="M22 30h36l-4 12H26z" fill="#B4691D" />
      <path
        d="M20 44c0-4 9-6 20-6s20 2 20 6v58c0 4-9 6-20 6s-20-2-20-6V44Z"
        fill="url(#diwali-lantern-body)"
        stroke="#F2B75A"
        strokeOpacity="0.7"
        strokeWidth="1.4"
      />
      <path d="M28 44v62M40 42v68M52 44v62" stroke="#F7C46C" strokeOpacity="0.35" />
      <path d="M22 68h36M22 84h36" stroke="#F7C46C" strokeOpacity="0.2" />
      <path d="M30 108h20l-5 9H35z" fill="#B4691D" />
      <path d="M40 117v18" stroke="currentColor" strokeOpacity="0.55" />
      <circle cx="40" cy="139" r="3.5" fill="#FFD27A" />
      <path d="M40 142v10" stroke="currentColor" strokeOpacity="0.35" />
      <circle className="diwali__lantern-bulb" cx="40" cy="72" r="7" fill="#FFE4A8" />
    </svg>
  )
}

export function Diya({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 120"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="60" cy="52" r="34" fill="url(#diwali-diya-glow)" />
      <path
        className="diwali__flame"
        d="M60 40c-7 9-11 15-11 21a11 11 0 0 0 22 0c0-6-4-12-11-21Z"
        fill="#FFD06B"
      />
      <path
        className="diwali__flame diwali__flame--inner"
        d="M60 49c-3 4-5 8-5 11a5 5 0 0 0 10 0c0-3-2-7-5-11Z"
        fill="#FFF6D8"
      />
      <path
        d="M24 76c6 22 18 30 36 30s30-8 36-30c-9 6-22 9-36 9s-27-3-36-9Z"
        fill="url(#diwali-diya-clay)"
        stroke="url(#diwali-diya-rim)"
        strokeWidth="2"
      />
      <path
        d="M28 78c4 9 16 15 32 15s28-6 32-15"
        stroke="#FFCF78"
        strokeOpacity="0.55"
        strokeWidth="1.5"
      />
      <ellipse cx="60" cy="109" rx="26" ry="4" fill="#000000" fillOpacity="0.28" />
    </svg>
  )
}

const MARIGOLD_TONES = {
  orange: ['#F59E0B', '#FFC04D', '#FFE1A0'],
  gold: ['#FBBF24', '#FDE68A', '#FFF4CC'],
  deep: ['#EA7A16', '#FFB347', '#FFE1A0'],
}

export function Marigold({ x, y, scale, tone = 'orange' }) {
  const [outer, inner, center] = MARIGOLD_TONES[tone]

  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      {Array.from({ length: 8 }).map((_, i) => (
        <ellipse
          key={i}
          cx="0"
          cy="-6.5"
          rx="4.4"
          ry="6.8"
          fill={outer}
          fillOpacity="0.9"
          transform={`rotate(${i * 45})`}
        />
      ))}
      {Array.from({ length: 8 }).map((_, i) => (
        <ellipse
          key={`inner-${i}`}
          cx="0"
          cy="-3.4"
          rx="2.4"
          ry="3.8"
          fill={inner}
          transform={`rotate(${i * 45 + 22.5})`}
        />
      ))}
      <circle r="3.4" fill={center} />
    </g>
  )
}

export function Garland({ className = 'diwali__garland' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 920 140"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M0 18C128 76 232 92 330 98c106 7 190-6 278-28 100-25 208-26 312 8"
        stroke="rgba(255, 196, 92, 0.22)"
        strokeWidth="1.6"
      />
      {MARIGOLDS.map(([x, y, scale], i) => (
        <g key={i}>
          {i % 3 === 0 && (
            <ellipse
              cx={x + 12}
              cy={y + 8}
              rx="5"
              ry="2.4"
              fill="#6F8F3A"
              fillOpacity="0.55"
              transform={`rotate(24 ${x + 12} ${y + 8})`}
            />
          )}
          {i % 4 === 0 && (
            <ellipse
              cx={x - 11}
              cy={y + 9}
              rx="4.6"
              ry="2.2"
              fill="#7DA626"
              fillOpacity="0.45"
              transform={`rotate(-20 ${x - 11} ${y + 9})`}
            />
          )}
          <Marigold x={x} y={y} scale={scale} />
        </g>
      ))}
    </svg>
  )
}

export function CornerGarland({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 170 312"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M2 4c22 10 46 22 68 34 17 9 32 16 44 28 12 13 15 32 16 55 1 38-2 78-6 116-2 18-4 32-8 44"
        stroke="rgba(255, 205, 120, 0.28)"
        strokeWidth="1.4"
      />
      <path
        d="M6 8c24 12 48 24 66 36 13 9 21 17 25 29"
        stroke="rgba(126, 164, 58, 0.32)"
        strokeWidth="1.2"
        strokeDasharray="2 5"
      />

      {CORNER_MARIGOLDS.map(([x, y, scale, tone], index) => (
        <g key={`${x}-${y}`}>
          {(index % 3 === 0 || index % 5 === 0) && (
            <ellipse
              cx={x + 12}
              cy={y + 8}
              rx="6"
              ry="2.8"
              fill={index % 2 === 0 ? '#7DA626' : '#5F8434'}
              fillOpacity="0.55"
              transform={`rotate(26 ${x + 12} ${y + 8})`}
            />
          )}
          {index % 4 === 0 && (
            <ellipse
              cx={x - 11}
              cy={y + 9}
              rx="5.4"
              ry="2.5"
              fill="#87AD32"
              fillOpacity="0.42"
              transform={`rotate(-24 ${x - 11} ${y + 9})`}
            />
          )}
          {index % 2 === 1 && (
            <path
              d={`M${x - 2} ${y + 15}l4 6-4 8-4-8z`}
              fill="#F6C15A"
              fillOpacity="0.78"
            />
          )}
          <Marigold x={x} y={y} scale={scale} tone={tone} />
        </g>
      ))}

      <path d="M114 270v10" stroke="#F6C15A" strokeOpacity="0.7" />
      <path d="M114 280l5 8-5 7-5-7z" fill="#F4B84C" fillOpacity="0.86" />
      <circle cx="114" cy="299" r="2.6" fill="#FFE1A0" />
    </svg>
  )
}

export function SideGarland({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 70 736"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M34 0c-17 74 18 132 0 204-15 61 19 113 1 179-14 54 16 99 1 157-10 39 6 72 0 112"
        stroke="rgba(255, 205, 120, 0.24)"
        strokeWidth="1.2"
      />

      {SIDE_MARIGOLDS.map((flower, index) => (
        <g key={index}>
          {index % 3 === 0 && (
            <ellipse
              cx={flower.x + 13}
              cy={flower.y + 8}
              rx="6"
              ry="2.6"
              fill="#6F8F3A"
              fillOpacity="0.58"
              transform={`rotate(28 ${flower.x + 13} ${flower.y + 8})`}
            />
          )}
          {index % 4 === 1 && (
            <ellipse
              cx={flower.x - 12}
              cy={flower.y + 9}
              rx="5.2"
              ry="2.4"
              fill="#87AD32"
              fillOpacity="0.45"
              transform={`rotate(-28 ${flower.x - 12} ${flower.y + 9})`}
            />
          )}
          {index < SIDE_MARIGOLDS.length - 1 && (
            <path
              d={`M${flower.x} ${flower.y + 18}l3.5 6-3.5 7-3.5-7z`}
              fill="#F6C15A"
              fillOpacity="0.72"
            />
          )}
          <circle
            cx={flower.x}
            cy={flower.y}
            r="11"
            fill="#FFB347"
            fillOpacity="0.07"
          />
          <Marigold
            x={flower.x}
            y={flower.y}
            scale={flower.scale}
            tone={flower.tone}
          />
        </g>
      ))}

      <path d="M34 706v8" stroke="#F6C15A" strokeOpacity="0.66" />
      <path d="M34 714l4 7-4 6-4-6z" fill="#F4B84C" fillOpacity="0.82" />
    </svg>
  )
}

export function Trails({ className = 'diwali__trails' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 620 420"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="diwali-trail" x1="0" y1="1" x2="1" y2="0">
          <stop stopColor="#FFB347" stopOpacity="0" />
          <stop offset="0.45" stopColor="#FFD98A" stopOpacity="0.75" />
          <stop offset="1" stopColor="#FFB347" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        className="diwali__trail"
        d="M18 392C116 300 186 196 306 168c118-28 208-72 296-144"
        stroke="url(#diwali-trail)"
        strokeWidth="1.4"
      />
      <path
        className="diwali__trail diwali__trail--slow"
        d="M82 414c94-62 158-102 262-140 112-41 190-96 256-174"
        stroke="url(#diwali-trail)"
        strokeWidth="1"
        strokeOpacity="0.65"
      />
    </svg>
  )
}

export default function DiwaliHeroDecorations() {
  return (
    <div className="diwali" aria-hidden="true">
      <DiyaDefs />

      <div className="diwali__pattern" />
      <div className="diwali__glow diwali__glow--content" />
      <div className="diwali__glow diwali__glow--corner" />

      <div className="diwali__rangoli diwali__rangoli--main">
        <Rangoli className="diwali__rangoli-svg" />
      </div>
      <div className="diwali__rangoli diwali__rangoli--small">
        <Rangoli className="diwali__rangoli-svg" />
      </div>

      <Garland />

      <div className="diwali__lantern diwali__lantern--left">
        <Lantern className="diwali__lantern-svg" />
      </div>
      <div className="diwali__lantern diwali__lantern--right">
        <Lantern className="diwali__lantern-svg" />
      </div>

      <Trails />

      <div className="diwali__diyas">
        <Diya className="diwali__diya diwali__diya--1" />
        <Diya className="diwali__diya diwali__diya--2" />
      </div>

      <div className="diwali__particles">
        {PARTICLES.map((p, i) => (
          <span
            key={i}
            className="diwali__particle"
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

      <div className="diwali__sparkles">
        {SPARKLES.map((s, i) => (
          <span
            key={i}
            className="diwali__sparkle"
            style={{
              left: s.left,
              top: s.top,
              '--s': `${s.size}px`,
              '--dur': `${s.duration}s`,
              '--delay': `${s.delay}s`,
            }}
          />
        ))}
      </div>

      <DiwaliFireworks />
    </div>
  )
}
