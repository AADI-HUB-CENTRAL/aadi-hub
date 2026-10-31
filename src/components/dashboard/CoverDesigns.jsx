const COVER_W = 1500
const COVER_H = 500

function Cover01Network() {
  return (
    <svg viewBox={`0 0 ${COVER_W} ${COVER_H}`} preserveAspectRatio="xMidYMid slice" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', display: 'block' }}>
      <rect width={COVER_W} height={COVER_H} fill="#0D1322" />
      <defs>
        <radialGradient id="n1" cx="30%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#B5E84A" stopOpacity="0.12" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <radialGradient id="n2" cx="75%" cy="60%" r="40%">
          <stop offset="0%" stopColor="#B5E84A" stopOpacity="0.08" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      <rect width={COVER_W} height={COVER_H} fill="url(#n1)" />
      <rect width={COVER_W} height={COVER_H} fill="url(#n2)" />
      {/* Connection lines */}
      <g stroke="#B5E84A" strokeWidth="1" opacity="0.25">
        <line x1="120" y1="180" x2="320" y2="120" />
        <line x1="320" y1="120" x2="520" y2="200" />
        <line x1="520" y1="200" x2="680" y2="140" />
        <line x1="680" y1="140" x2="880" y2="220" />
        <line x1="880" y1="220" x2="1050" y2="160" />
        <line x1="1050" y1="160" x2="1250" y2="200" />
        <line x1="1250" y1="200" x2="1400" y2="150" />
        <line x1="200" y1="320" x2="400" y2="380" />
        <line x1="400" y1="380" x2="600" y2="300" />
        <line x1="600" y1="300" x2="800" y2="360" />
        <line x1="800" y1="360" x2="1000" y2="310" />
        <line x1="1000" y1="310" x2="1200" y2="370" />
        <line x1="1200" y1="370" x2="1380" y2="320" />
        <line x1="320" y1="120" x2="400" y2="380" />
        <line x1="680" y1="140" x2="600" y2="300" />
        <line x1="880" y1="220" x2="1000" y2="310" />
        <line x1="120" y1="180" x2="200" y2="320" />
        <line x1="1250" y1="200" x2="1200" y2="370" />
      </g>
      {/* Nodes */}
      <g>
        <circle cx="120" cy="180" r="5" fill="#B5E84A" opacity="0.7" />
        <circle cx="320" cy="120" r="6" fill="#B5E84A" opacity="0.8" />
        <circle cx="520" cy="200" r="4" fill="#B5E84A" opacity="0.6" />
        <circle cx="680" cy="140" r="7" fill="#B5E84A" opacity="0.9" />
        <circle cx="880" cy="220" r="5" fill="#B5E84A" opacity="0.7" />
        <circle cx="1050" cy="160" r="4" fill="#B5E84A" opacity="0.6" />
        <circle cx="1250" cy="200" r="6" fill="#B5E84A" opacity="0.8" />
        <circle cx="1400" cy="150" r="4" fill="#B5E84A" opacity="0.5" />
        <circle cx="200" cy="320" r="5" fill="#B5E84A" opacity="0.6" />
        <circle cx="400" cy="380" r="4" fill="#B5E84A" opacity="0.5" />
        <circle cx="600" cy="300" r="6" fill="#B5E84A" opacity="0.7" />
        <circle cx="800" cy="360" r="5" fill="#B5E84A" opacity="0.6" />
        <circle cx="1000" cy="310" r="4" fill="#B5E84A" opacity="0.5" />
        <circle cx="1200" cy="370" r="5" fill="#B5E84A" opacity="0.7" />
        <circle cx="1380" cy="320" r="4" fill="#B5E84A" opacity="0.5" />
      </g>
      {/* Glowing centers */}
      <g>
        <circle cx="320" cy="120" r="12" fill="#B5E84A" opacity="0.08" />
        <circle cx="680" cy="140" r="16" fill="#B5E84A" opacity="0.06" />
        <circle cx="880" cy="220" r="14" fill="#B5E84A" opacity="0.07" />
        <circle cx="600" cy="300" r="18" fill="#B5E84A" opacity="0.05" />
      </g>
      {/* Subtle grid dots */}
      <g fill="#B5E84A" opacity="0.06">
        {[...Array(12)].map((_, i) => [...Array(4)].map((_, j) => (
          <circle key={`${i}-${j}`} cx={125 * i + 60} cy={125 * j + 40} r="1.5" />
        )))}
      </g>
    </svg>
  )
}

function Cover02Build() {
  return (
    <svg viewBox={`0 0 ${COVER_W} ${COVER_H}`} preserveAspectRatio="xMidYMid slice" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', display: 'block' }}>
      <rect width={COVER_W} height={COVER_H} fill="#0D1322" />
      <defs>
        <linearGradient id="b1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0D1322" />
          <stop offset="50%" stopColor="#131B2E" />
          <stop offset="100%" stopColor="#0D1322" />
        </linearGradient>
      </defs>
      <rect width={COVER_W} height={COVER_H} fill="url(#b1)" />
      {/* Grid lines */}
      <g stroke="#B5E84A" strokeWidth="0.5" opacity="0.1">
        {[...Array(20)].map((_, i) => (
          <line key={`vl${i}`} x1={75 * i} y1="0" x2={75 * i} y2={COVER_H} />
        ))}
        {[...Array(8)].map((_, i) => (
          <line key={`hl${i}`} x1="0" y1={62.5 * i} x2={COVER_W} y2={62.5 * i} />
        ))}
      </g>
      {/* Building blocks */}
      <g>
        <rect x="180" y="280" width="60" height="120" rx="4" fill="#B5E84A" opacity="0.12" />
        <rect x="260" y="200" width="60" height="200" rx="4" fill="#B5E84A" opacity="0.16" />
        <rect x="340" y="240" width="60" height="160" rx="4" fill="#B5E84A" opacity="0.12" />
        <rect x="420" y="160" width="60" height="240" rx="4" fill="#B5E84A" opacity="0.2" />
        <rect x="500" y="220" width="60" height="180" rx="4" fill="#B5E84A" opacity="0.14" />
        <rect x="580" y="180" width="60" height="220" rx="4" fill="#B5E84A" opacity="0.18" />
        <rect x="660" y="260" width="60" height="140" rx="4" fill="#B5E84A" opacity="0.1" />
      </g>
      {/* Code-like lines */}
      <g stroke="#B5E84A" strokeWidth="2" opacity="0.15" strokeLinecap="round">
        <line x1="850" y1="140" x2="1100" y2="140" />
        <line x1="870" y1="170" x2="1050" y2="170" />
        <line x1="890" y1="200" x2="1120" y2="200" />
        <line x1="870" y1="230" x2="1000" y2="230" />
        <line x1="850" y1="260" x2="1080" y2="260" />
        <line x1="890" y1="290" x2="1060" y2="290" />
        <line x1="870" y1="320" x2="1100" y2="320" />
        <line x1="910" y1="350" x2="1040" y2="350" />
      </g>
      {/* Accent highlights */}
      <g>
        <rect x="850" y="135" width="80" height="3" rx="1.5" fill="#B5E84A" opacity="0.5" />
        <rect x="890" y="195" width="60" height="3" rx="1.5" fill="#B5E84A" opacity="0.4" />
        <rect x="850" y="255" width="50" height="3" rx="1.5" fill="#B5E84A" opacity="0.45" />
        <rect x="890" y="315" width="70" height="3" rx="1.5" fill="#B5E84A" opacity="0.35" />
      </g>
      {/* Floating particles */}
      <g fill="#B5E84A">
        <circle cx="750" cy="100" r="3" opacity="0.3" />
        <circle cx="1200" cy="180" r="2" opacity="0.25" />
        <circle cx="1300" cy="400" r="2.5" opacity="0.2" />
        <circle cx="100" cy="80" r="2" opacity="0.2" />
        <circle cx="1400" cy="100" r="3" opacity="0.15" />
      </g>
      {/* Diagonal accent */}
      <line x1="1100" y1="0" x2="1500" y2="400" stroke="#B5E84A" strokeWidth="1" opacity="0.06" />
      <line x1="1150" y1="0" x2="1500" y2="350" stroke="#B5E84A" strokeWidth="1" opacity="0.06" />
    </svg>
  )
}

function Cover03Community() {
  return (
    <svg viewBox={`0 0 ${COVER_W} ${COVER_H}`} preserveAspectRatio="xMidYMid slice" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', display: 'block' }}>
      <rect width={COVER_W} height={COVER_H} fill="#0D1322" />
      <defs>
        <radialGradient id="c1" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#B5E84A" stopOpacity="0.08" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      <rect width={COVER_W} height={COVER_H} fill="url(#c1)" />
      {/* Large interlocking circles */}
      <g stroke="#B5E84A" strokeWidth="1.5" opacity="0.1">
        <circle cx="400" cy="250" r="150" />
        <circle cx="550" cy="250" r="150" />
        <circle cx="475" cy="150" r="150" />
        <circle cx="475" cy="350" r="150" />
      </g>
      {/* Medium circles */}
      <g stroke="#FFFFFF" strokeWidth="1" opacity="0.06">
        <circle cx="900" cy="200" r="100" />
        <circle cx="1050" cy="280" r="100" />
        <circle cx="1150" cy="180" r="80" />
        <circle cx="980" cy="350" r="90" />
      </g>
      {/* Small accent circles */}
      <g fill="#B5E84A" opacity="0.15">
        <circle cx="475" cy="250" r="40" />
        <circle cx="475" cy="250" r="80" fill="none" stroke="#B5E84A" strokeWidth="1" />
      </g>
      <g fill="#B5E84A" opacity="0.1">
        <circle cx="1020" cy="260" r="30" />
        <circle cx="1020" cy="260" r="60" fill="none" stroke="#B5E84A" strokeWidth="0.8" />
      </g>
      {/* Connecting arcs */}
      <g stroke="#B5E84A" strokeWidth="1" opacity="0.12" fill="none">
        <path d="M625 250 Q750 150 900 200" />
        <path d="M625 250 Q750 350 980 350" />
        <path d="M625 250 Q800 250 1020 260" />
      </g>
      {/* Scattered dots */}
      <g fill="#B5E84A">
        <circle cx="200" cy="100" r="2" opacity="0.2" />
        <circle cx="1300" cy="120" r="2.5" opacity="0.15" />
        <circle cx="1350" cy="400" r="2" opacity="0.12" />
        <circle cx="80" cy="400" r="2" opacity="0.18" />
        <circle cx="750" cy="80" r="3" opacity="0.1" />
        <circle cx="1400" cy="250" r="2" opacity="0.15" />
      </g>
    </svg>
  )
}

function Cover04NextGen() {
  return (
    <svg viewBox={`0 0 ${COVER_W} ${COVER_H}`} preserveAspectRatio="xMidYMid slice" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', display: 'block' }}>
      <rect width={COVER_W} height={COVER_H} fill="#0D1322" />
      <defs>
        <linearGradient id="ng1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#B5E84A" stopOpacity="0.1" />
          <stop offset="40%" stopColor="transparent" />
        </linearGradient>
        <linearGradient id="ng2" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#B5E84A" stopOpacity="0.06" />
          <stop offset="50%" stopColor="transparent" />
        </linearGradient>
      </defs>
      <rect width={COVER_W} height={COVER_H} fill="url(#ng1)" />
      <rect width={COVER_W} height={COVER_H} fill="url(#ng2)" />
      {/* Horizon line */}
      <line x1="0" y1="350" x2={COVER_W} y2="350" stroke="#B5E84A" strokeWidth="1" opacity="0.15" />
      {/* Perspective grid */}
      <g stroke="#B5E84A" strokeWidth="0.5" opacity="0.08">
        <line x1="750" y1="350" x2="0" y2={COVER_H} />
        <line x1="750" y1="350" x2="300" y2={COVER_H} />
        <line x1="750" y1="350" x2="600" y2={COVER_H} />
        <line x1="750" y1="350" x2="900" y2={COVER_H} />
        <line x1="750" y1="350" x2="1200" y2={COVER_H} />
        <line x1="750" y1="350" x2={COVER_W} y2={COVER_H} />
      </g>
      {/* Horizontal perspective lines */}
      <g stroke="#B5E84A" strokeWidth="0.5" opacity="0.06">
        <line x1="200" y1="380" x2="1300" y2="380" />
        <line x1="350" y1="410" x2="1150" y2="410" />
        <line x1="450" y1="440" x2="1050" y2="440" />
        <line x1="550" y1="465" x2="950" y2="465" />
      </g>
      {/* Light trails */}
      <g>
        <line x1="0" y1="200" x2="600" y2="320" stroke="#B5E84A" strokeWidth="1.5" opacity="0.12" strokeLinecap="round" />
        <line x1="0" y1="160" x2="500" y2="280" stroke="#B5E84A" strokeWidth="1" opacity="0.08" strokeLinecap="round" />
        <line x1="1500" y1="180" x2="900" y2="320" stroke="#B5E84A" strokeWidth="1" opacity="0.08" strokeLinecap="round" />
        <line x1="1500" y1="140" x2="1000" y2="280" stroke="#B5E84A" strokeWidth="0.8" opacity="0.06" strokeLinecap="round" />
      </g>
      {/* Glow orb */}
      <circle cx="750" cy="200" r="80" fill="#B5E84A" opacity="0.04" />
      <circle cx="750" cy="200" r="40" fill="#B5E84A" opacity="0.06" />
      <circle cx="750" cy="200" r="8" fill="#B5E84A" opacity="0.2" />
      {/* Floating particles */}
      <g fill="#B5E84A">
        <circle cx="300" cy="120" r="2" opacity="0.2" />
        <circle cx="500" cy="100" r="1.5" opacity="0.15" />
        <circle cx="1000" cy="130" r="2" opacity="0.18" />
        <circle cx="1200" cy="100" r="1.5" opacity="0.12" />
        <circle cx="1400" cy="180" r="2.5" opacity="0.1" />
        <circle cx="100" cy="350" r="2" opacity="0.15" />
      </g>
    </svg>
  )
}

function Cover05Identity() {
  return (
    <svg viewBox={`0 0 ${COVER_W} ${COVER_H}`} preserveAspectRatio="xMidYMid slice" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', display: 'block' }}>
      <rect width={COVER_W} height={COVER_H} fill="#0D1322" />
      <defs>
        <linearGradient id="id1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#0D1322" />
          <stop offset="50%" stopColor="#131B2E" />
          <stop offset="100%" stopColor="#0D1322" />
        </linearGradient>
      </defs>
      <rect width={COVER_W} height={COVER_H} fill="url(#id1)" />
      {/* Abstract ID card shape */}
      <g>
        <rect x="580" y="80" width="340" height="210" rx="12" fill="none" stroke="#B5E84A" strokeWidth="1.5" opacity="0.15" />
        <rect x="590" y="90" width="320" height="190" rx="8" fill="#B5E84A" opacity="0.03" />
        {/* Photo circle */}
        <circle cx="660" cy="175" r="35" fill="none" stroke="#B5E84A" strokeWidth="1.5" opacity="0.2" />
        <circle cx="660" cy="175" r="30" fill="#B5E84A" opacity="0.06" />
        {/* Text lines */}
        <rect x="710" y="145" width="180" height="8" rx="4" fill="#B5E84A" opacity="0.12" />
        <rect x="710" y="165" width="120" height="6" rx="3" fill="#B5E84A" opacity="0.08" />
        <rect x="710" y="185" width="140" height="6" rx="3" fill="#B5E84A" opacity="0.06" />
        {/* QR-like pattern */}
        <g transform="translate(820, 135)">
          <rect width="60" height="60" rx="4" fill="#B5E84A" opacity="0.04" />
          <g fill="#B5E84A" opacity="0.15">
            <rect x="4" y="4" width="14" height="14" rx="2" />
            <rect x="42" y="4" width="14" height="14" rx="2" />
            <rect x="4" y="42" width="14" height="14" rx="2" />
            <rect x="22" y="22" width="8" height="8" rx="1" />
            <rect x="42" y="42" width="14" height="14" rx="2" />
          </g>
        </g>
      </g>
      {/* Decorative QR-inspired pattern left */}
      <g opacity="0.06" fill="#B5E84A">
        {[...Array(6)].map((_, i) => [...Array(3)].map((_, j) => (
          <rect key={`pl${i}-${j}`} x={80 + j * 20} y={120 + i * 20} width="12" height="12" rx="2" />
        )))}
      </g>
      {/* Decorative pattern right */}
      <g opacity="0.05" fill="#B5E84A">
        {[...Array(6)].map((_, i) => [...Array(3)].map((_, j) => (
          <rect key={`pr${i}-${j}`} x={1300 + j * 20} y={280 + i * 20} width="12" height="12" rx="2" />
        )))}
      </g>
      {/* Accent lines */}
      <g stroke="#B5E84A" strokeWidth="0.8" opacity="0.1">
        <line x1="100" y1="400" x2="450" y2="400" />
        <line x1="100" y1="420" x2="350" y2="420" />
        <line x1="1050" y1="100" x2="1400" y2="100" />
        <line x1="1100" y1="120" x2="1380" y2="120" />
      </g>
      {/* Corner accents */}
      <g stroke="#B5E84A" strokeWidth="1.5" opacity="0.12">
        <path d="M40 40 L40 80" />
        <path d="M40 40 L80 40" />
        <path d={`${COVER_W - 40} 40 L${COVER_W - 40} 80`} />
        <path d={`${COVER_W - 40} 40 L${COVER_W - 80} 40`} />
        <path d={`M40 ${COVER_H - 40} L40 ${COVER_H - 80}`} />
        <path d={`M40 ${COVER_H - 40} L80 ${COVER_H - 40}`} />
        <path d={`M${COVER_W - 40} ${COVER_H - 40} L${COVER_W - 40} ${COVER_H - 80}`} />
        <path d={`M${COVER_W - 40} ${COVER_H - 40} L${COVER_W - 80} ${COVER_H - 40}`} />
      </g>
    </svg>
  )
}

export const COVER_PRESETS = [
  { id: 'cover-01', label: 'Network', Component: Cover01Network },
  { id: 'cover-02', label: 'Build', Component: Cover02Build },
  { id: 'cover-03', label: 'Community', Component: Cover03Community },
  { id: 'cover-04', label: 'Next Generation', Component: Cover04NextGen },
  { id: 'cover-05', label: 'Identity', Component: Cover05Identity },
]

export function getCoverComponent(coverId) {
  const preset = COVER_PRESETS.find(c => c.id === coverId)
  return preset ? preset.Component : COVER_PRESETS[0].Component
}

export function getCoverSrc(cover) {
  if (!cover || cover.type === 'preset') {
    return cover?.value || 'cover-01'
  }
  return cover.value
}
