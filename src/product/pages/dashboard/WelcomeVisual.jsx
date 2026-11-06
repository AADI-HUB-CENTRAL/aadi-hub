import { useEffect, useState } from 'react'

const NIGHT_STARS = [
  [430, 100, 1.2, 0.2],
  [472, 148, 0.9, 1.1],
  [520, 94, 1.4, 2.4],
  [560, 180, 0.8, 0.8],
  [610, 110, 1.1, 1.7],
  [740, 94, 1.3, 0.4],
  [780, 170, 0.9, 2.2],
  [800, 120, 1.1, 1.3],
  [450, 240, 0.8, 2.9],
  [600, 260, 0.7, 1.5],
  [760, 240, 1, 0.9],
  [810, 280, 0.8, 2.6],
]

const MIDNIGHT_STARS = [
  [360, 90, 1.1, 0.3],
  [410, 150, 0.9, 1.2],
  [460, 82, 1.3, 2.1],
  [500, 190, 0.8, 0.7],
  [540, 122, 1, 1.8],
  [580, 220, 0.7, 2.7],
  [700, 90, 1.2, 0.5],
  [740, 130, 0.9, 1.6],
  [780, 190, 1.1, 2.4],
  [810, 100, 0.8, 1.1],
  [430, 270, 0.7, 2.9],
  [620, 280, 0.8, 1.4],
  [760, 290, 0.7, 0.9],
  [350, 210, 0.8, 2.2],
]

function useHour() {
  const [hour, setHour] = useState(() => new Date().getHours())

  useEffect(() => {
    const timer = window.setInterval(() => setHour(new Date().getHours()), 60000)
    return () => window.clearInterval(timer)
  }, [])

  return hour
}

function getPhase(hour) {
  if (hour >= 5 && hour < 11) return 'morning'
  if (hour >= 11 && hour < 16) return 'afternoon'
  if (hour >= 16 && hour < 19) return 'evening'
  if (hour >= 19 && hour < 23) return 'night'
  return 'midnight'
}

function Stars({ points }) {
  return (
    <g>
      {points.map(([x, y, r, delay], i) => (
        <circle
          key={i}
          cx={x}
          cy={y}
          r={r}
          className="wv__star"
          style={{ animationDelay: `${delay}s` }}
        />
      ))}
    </g>
  )
}

function SunRays({ cx, cy, r, count, length }) {
  return (
    <g>
      {Array.from({ length: count }, (_, i) => {
        const angle = (i / count) * Math.PI * 2
        const x1 = cx + Math.cos(angle) * (r + 7)
        const y1 = cy + Math.sin(angle) * (r + 7)
        const x2 = cx + Math.cos(angle) * (r + 7 + length)
        const y2 = cy + Math.sin(angle) * (r + 7 + length)

        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            className="wv__ray"
            style={{ animationDelay: `${i * 0.18}s` }}
          />
        )
      })}
    </g>
  )
}

function Pine({ x, y, scale = 1, delay = 0 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <g className="wv__sway" style={{ animationDelay: `${delay}s` }}>
        <path d="M0 0V-58" className="wv__line wv__draw" pathLength="1" stroke="rgba(200,235,190,.45)" />
        <path d="M0 -52 L-18 -24 H18 Z" className="wv__line wv__draw" pathLength="1" stroke="rgba(200,235,190,.4)" />
        <path d="M0 -38 L-24 -4 H24 Z" className="wv__line wv__draw" pathLength="1" stroke="rgba(200,235,190,.35)" />
        <path d="M0 -22 L-30 14 H30 Z" className="wv__line wv__draw" pathLength="1" stroke="rgba(200,235,190,.3)" />
      </g>
    </g>
  )
}

function Palm({ x, y, scale = 1, flip = 1, delay = 0 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip * scale} ${scale})`}>
      <g className="wv__sway" style={{ animationDelay: `${delay}s` }}>
        <path d="M0 0 C -3 -28 2 -58 9 -86" className="wv__line wv__draw" pathLength="1" stroke="rgba(255,200,130,.5)" />
        <path d="M9 -86 C -8 -104 -30 -108 -46 -96" className="wv__line wv__draw" pathLength="1" stroke="rgba(255,200,130,.42)" />
        <path d="M9 -86 C 0 -112 14 -130 34 -132" className="wv__line wv__draw" pathLength="1" stroke="rgba(255,200,130,.42)" />
        <path d="M9 -86 C 30 -104 52 -100 64 -84" className="wv__line wv__draw" pathLength="1" stroke="rgba(255,200,130,.4)" />
        <path d="M9 -86 C -14 -88 -32 -78 -42 -60" className="wv__line wv__draw" pathLength="1" stroke="rgba(255,200,130,.38)" />
        <path d="M4 -60 C -2 -50 -4 -40 -2 -30" className="wv__line wv__draw" pathLength="1" stroke="rgba(255,200,130,.24)" />
      </g>
    </g>
  )
}

function BareTree({ x, y, scale = 1, delay = 0 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <g className="wv__sway" style={{ animationDelay: `${delay}s` }}>
        <path d="M0 0 C -2 -34 4 -66 12 -92" className="wv__line wv__draw" pathLength="1" stroke="rgba(210,230,255,.4)" />
        <path d="M8 -64 C -10 -80 -24 -84 -36 -82" className="wv__line wv__draw" pathLength="1" stroke="rgba(210,230,255,.32)" />
        <path d="M10 -76 C 28 -94 42 -96 54 -92" className="wv__line wv__draw" pathLength="1" stroke="rgba(210,230,255,.32)" />
        <path d="M6 -48 C -12 -56 -22 -54 -30 -48" className="wv__line wv__draw" pathLength="1" stroke="rgba(210,230,255,.26)" />
      </g>
    </g>
  )
}

function Fox() {
  return (
    <g transform="translate(560 366) scale(1.05)">
      <ellipse cx="6" cy="0" rx="34" ry="4" fill="rgba(0,0,0,.35)" />
      <path
        d="M-8 0 C -24 -4 -34 -22 -28 -40 C -22 -56 -2 -60 12 -50 C 24 -42 26 -24 18 -8 L 18 0 Z"
        fill="rgba(2,6,12,.94)"
        stroke="rgba(210,230,255,.55)"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path
        d="M8 -50 C 0 -58 2 -72 12 -80 C 22 -72 24 -58 16 -50 Z"
        fill="rgba(2,6,12,.94)"
        stroke="rgba(210,230,255,.55)"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path
        d="M4 -74 L0 -90 L14 -80"
        fill="rgba(2,6,12,.94)"
        stroke="rgba(210,230,255,.5)"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path
        d="M16 -80 L28 -90 L24 -72"
        fill="rgba(2,6,12,.94)"
        stroke="rgba(210,230,255,.5)"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path
        d="M-8 -40 C -34 -38 -48 -54 -42 -72"
        fill="none"
        stroke="rgba(210,230,255,.45)"
        strokeWidth="8"
        strokeLinecap="round"
        className="wv__fox-tail"
      />
      <circle cx="17" cy="-64" r="1.6" fill="rgba(230,242,255,.85)" />
      <path d="M16 -56 L26 -53" stroke="rgba(210,230,255,.4)" strokeWidth="1.2" strokeLinecap="round" />
    </g>
  )
}

function MorningScene() {
  return (
    <g className="wv__scene">
      <circle cx="655" cy="286" r="74" fill="url(#wv-glow-warm)" />
      <circle cx="655" cy="286" r="38" fill="url(#wv-sun-warm)" className="wv__float" />
      <circle cx="655" cy="286" r="38" className="wv__line wv__draw" pathLength="1" stroke="rgba(255,220,165,.75)" />
      <SunRays cx={655} cy={286} r={44} count={12} length={22} />
      <g>
        <path d="M360 292 C 430 284 500 300 560 292" className="wv__line wv__draw wv__mist" pathLength="1" />
        <path d="M520 314 C 590 306 660 320 730 310" className="wv__line wv__draw wv__mist" pathLength="1" />
        <path d="M430 332 C 500 326 570 338 640 330" className="wv__line wv__draw wv__mist" pathLength="1" />
      </g>
      <g>
        <path d="M480 178 q 8 -8 16 0 q 8 -8 16 0" className="wv__line wv__bird" />
        <path d="M540 156 q 7 -7 14 0 q 7 -7 14 0" className="wv__line wv__bird" style={{ animationDelay: '1.2s' }} />
        <path d="M590 190 q 6 -6 12 0 q 6 -6 12 0" className="wv__line wv__bird" style={{ animationDelay: '2.1s' }} />
      </g>
      <path d="M320 350 C 440 312 540 332 630 300 C 710 274 780 306 840 286 L 840 460 L 320 460 Z" fill="rgba(10,24,26,.74)" stroke="rgba(181,232,74,.18)" className="wv__draw" pathLength="1" />
      <path d="M350 384 C 470 346 580 372 680 340 C 750 320 800 342 840 332 L 840 460 L 350 460 Z" fill="rgba(7,18,20,.9)" stroke="rgba(181,232,74,.14)" className="wv__draw" pathLength="1" />
      <path d="M380 422 C 500 392 620 414 740 380 L 840 398 L 840 460 L 380 460 Z" fill="rgba(4,10,12,.96)" stroke="rgba(181,232,74,.12)" className="wv__draw" pathLength="1" />
      <Pine x={510} y={360} scale={0.9} delay={0.2} />
      <Pine x={724} y={336} scale={0.68} delay={0.5} />
      <Pine x={792} y={356} scale={0.52} delay={0.8} />
    </g>
  )
}

function AfternoonScene() {
  return (
    <g className="wv__scene">
      <circle cx="690" cy="150" r="96" fill="url(#wv-glow-heat)" />
      <circle cx="690" cy="150" r="38" fill="url(#wv-sun-heat)" className="wv__float" />
      <circle cx="690" cy="150" r="38" className="wv__line wv__draw" pathLength="1" stroke="rgba(255,205,130,.8)" />
      <SunRays cx={690} cy={150} r={44} count={16} length={30} />
      <g>
        <path d="M360 286 q 34 -12 68 0 t 68 0 t 68 0 t 68 0" className="wv__line wv__heat" />
        <path d="M400 310 q 32 -10 64 0 t 64 0 t 64 0" className="wv__line wv__heat" style={{ animationDelay: '1.1s' }} />
        <path d="M520 334 q 30 -9 60 0 t 60 0 t 60 0" className="wv__line wv__heat" style={{ animationDelay: '2.2s' }} />
      </g>
      <ellipse cx="610" cy="338" rx="180" ry="18" fill="url(#wv-mirage)" />
      <path d="M430 338 q 40 -8 80 0 t 80 0 t 80 0" className="wv__line wv__draw" pathLength="1" stroke="rgba(255,230,180,.4)" />
      <path d="M470 350 q 35 -7 70 0 t 70 0 t 70 0" className="wv__line wv__draw" pathLength="1" stroke="rgba(255,230,180,.28)" />
      <path d="M320 352 C 440 320 530 336 620 312 C 710 290 780 318 840 300 L 840 460 L 320 460 Z" fill="rgba(58,30,13,.72)" stroke="rgba(255,190,110,.2)" className="wv__draw" pathLength="1" />
      <path d="M350 386 C 470 352 580 378 680 346 C 750 326 800 348 840 338 L 840 460 L 350 460 Z" fill="rgba(38,19,7,.9)" stroke="rgba(255,190,110,.16)" className="wv__draw" pathLength="1" />
      <path d="M380 424 C 500 396 620 416 740 384 L 840 404 L 840 460 L 380 460 Z" fill="rgba(21,10,4,.96)" stroke="rgba(255,190,110,.12)" className="wv__draw" pathLength="1" />
      <Palm x={505} y={366} scale={0.86} delay={0.2} />
      <Palm x={760} y={350} scale={0.72} flip={-1} delay={0.5} />
      <g>
        <circle cx="430" cy="258" r="1.4" className="wv__dust-dot" />
        <circle cx="486" cy="228" r="1" className="wv__dust-dot" style={{ animationDelay: '1.2s' }} />
        <circle cx="560" cy="276" r="1.6" className="wv__dust-dot" style={{ animationDelay: '2.1s' }} />
        <circle cx="718" cy="246" r="1.2" className="wv__dust-dot" style={{ animationDelay: '.6s' }} />
        <circle cx="780" cy="296" r="1" className="wv__dust-dot" style={{ animationDelay: '1.8s' }} />
      </g>
    </g>
  )
}

function EveningScene() {
  return (
    <g className="wv__scene">
      <circle cx="650" cy="314" r="94" fill="url(#wv-glow-sunset)" />
      <circle cx="650" cy="314" r="42" fill="url(#wv-sun-sunset)" className="wv__float" />
      <circle cx="650" cy="314" r="42" className="wv__line wv__draw" pathLength="1" stroke="rgba(255,190,150,.75)" />
      <SunRays cx={650} cy={314} r={48} count={12} length={22} />
      <g>
        <path d="M400 190 q 30 -18 60 0 t 60 0 t 60 0" className="wv__line wv__draw wv__cloud" pathLength="1" />
        <path d="M520 232 q 26 -14 52 0 t 52 0" className="wv__line wv__draw wv__cloud" pathLength="1" />
      </g>
      <g>
        <path d="M460 164 q 8 -8 16 0 q 8 -8 16 0" className="wv__line wv__bird" />
        <path d="M520 142 q 7 -7 14 0 q 7 -7 14 0" className="wv__line wv__bird" style={{ animationDelay: '1.4s' }} />
        <path d="M570 176 q 6 -6 12 0 q 6 -6 12 0" className="wv__line wv__bird" style={{ animationDelay: '2.4s' }} />
      </g>
      <path d="M320 350 C 440 316 540 334 630 306 C 710 282 780 310 840 292 L 840 460 L 320 460 Z" fill="rgba(26,18,36,.78)" stroke="rgba(255,170,130,.18)" className="wv__draw" pathLength="1" />
      <path d="M350 384 C 470 350 580 376 680 344 C 750 324 800 346 840 336 L 840 460 L 350 460 Z" fill="rgba(18,12,26,.92)" stroke="rgba(255,170,130,.14)" className="wv__draw" pathLength="1" />
      <path d="M380 422 C 500 394 620 414 740 382 L 840 402 L 840 460 L 380 460 Z" fill="rgba(9,6,14,.97)" stroke="rgba(255,170,130,.1)" className="wv__draw" pathLength="1" />
      <Pine x={520} y={362} scale={0.82} delay={0.2} />
      <Pine x={760} y={338} scale={0.64} delay={0.5} />
    </g>
  )
}

function NightScene() {
  return (
    <g className="wv__scene">
      <Stars points={NIGHT_STARS} />
      <circle cx="690" cy="150" r="96" fill="url(#wv-glow-moon)" />
      <circle cx="690" cy="150" r="36" fill="url(#wv-moon)" className="wv__float" />
      <circle cx="678" cy="140" r="5" fill="rgba(120,150,190,.18)" />
      <circle cx="700" cy="162" r="4" fill="rgba(120,150,190,.16)" />
      <circle cx="688" cy="172" r="3" fill="rgba(120,150,190,.15)" />
      <circle cx="706" cy="138" r="2.5" fill="rgba(120,150,190,.14)" />
      <g className="wv__drift">
        <path d="M520 186 q 30 -16 60 0 t 60 0 t 60 0" className="wv__line wv__cloud" />
      </g>
      <path d="M320 352 C 440 318 540 338 640 306 C 720 282 790 312 840 292 L 840 460 L 320 460 Z" fill="rgba(7,20,34,.8)" stroke="rgba(150,200,255,.12)" className="wv__draw" pathLength="1" />
      <path d="M350 386 C 470 352 580 378 690 344 C 760 324 810 348 840 338 L 840 460 L 350 460 Z" fill="rgba(5,14,24,.93)" stroke="rgba(150,200,255,.1)" className="wv__draw" pathLength="1" />
      <path d="M380 424 C 500 396 620 416 750 384 L 840 404 L 840 460 L 380 460 Z" fill="rgba(3,8,16,.98)" stroke="rgba(150,200,255,.08)" className="wv__draw" pathLength="1" />
      <Pine x={520} y={362} scale={0.84} delay={0.2} />
      <Pine x={750} y={340} scale={0.64} delay={0.5} />
      <g>
        <circle cx="470" cy="306" r="2" className="wv__firefly" />
        <circle cx="502" cy="326" r="1.5" className="wv__firefly" style={{ animationDelay: '1.2s' }} />
        <circle cx="558" cy="342" r="1.8" className="wv__firefly" style={{ animationDelay: '2.3s' }} />
        <circle cx="722" cy="320" r="1.4" className="wv__firefly" style={{ animationDelay: '.8s' }} />
      </g>
    </g>
  )
}

function MidnightScene() {
  return (
    <g className="wv__scene">
      <Stars points={MIDNIGHT_STARS} />
      <circle cx="650" cy="160" r="112" fill="url(#wv-glow-moon)" />
      <circle cx="650" cy="160" r="48" fill="url(#wv-moon)" className="wv__float" />
      <circle cx="636" cy="148" r="7" fill="rgba(120,150,190,.16)" />
      <circle cx="664" cy="176" r="5.5" fill="rgba(120,150,190,.14)" />
      <circle cx="652" cy="188" r="4" fill="rgba(120,150,190,.13)" />
      <circle cx="672" cy="144" r="3.5" fill="rgba(120,150,190,.12)" />
      <path d="M400 124 L482 102" className="wv__line wv__shoot" pathLength="1" />
      <path d="M392 126 L402 123" className="wv__line wv__shoot" pathLength="1" style={{ animationDelay: '2s' }} />
      <path d="M320 352 C 440 318 540 338 640 306 C 720 282 790 312 840 292 L 840 460 L 320 460 Z" fill="rgba(4,16,26,.82)" stroke="rgba(150,200,255,.1)" className="wv__draw" pathLength="1" />
      <path d="M350 386 C 470 352 580 378 690 344 C 760 324 810 348 840 338 L 840 460 L 350 460 Z" fill="rgba(2,10,18,.94)" stroke="rgba(150,200,255,.08)" className="wv__draw" pathLength="1" />
      <path d="M380 424 C 500 396 620 416 750 384 L 840 404 L 840 460 L 380 460 Z" fill="rgba(1,5,10,.98)" stroke="rgba(150,200,255,.06)" className="wv__draw" pathLength="1" />
      <BareTree x={420} y={370} scale={0.9} delay={0.3} />
      <Fox />
      <g>
        <circle cx="460" cy="318" r="1.6" className="wv__firefly" />
        <circle cx="500" cy="344" r="1.2" className="wv__firefly" style={{ animationDelay: '1.6s' }} />
        <circle cx="720" cy="334" r="1.4" className="wv__firefly" style={{ animationDelay: '.9s' }} />
      </g>
    </g>
  )
}

export default function WelcomeVisual() {
  const hour = useHour()
  const phase = getPhase(hour)

  return (
    <svg
      className={`wv wv--${phase}`}
      viewBox="0 0 820 460"
      preserveAspectRatio="xMaxYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="wv-sky-morning" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#06111b" />
          <stop offset="58%" stopColor="#0e1b22" />
          <stop offset="82%" stopColor="#263026" />
          <stop offset="100%" stopColor="#3b3221" />
        </linearGradient>
        <linearGradient id="wv-sky-afternoon" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0a0a10" />
          <stop offset="40%" stopColor="#24140b" />
          <stop offset="78%" stopColor="#5a2e11" />
          <stop offset="100%" stopColor="#8a4a17" />
        </linearGradient>
        <linearGradient id="wv-sky-evening" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0b0a18" />
          <stop offset="40%" stopColor="#24172c" />
          <stop offset="72%" stopColor="#552633" />
          <stop offset="100%" stopColor="#a14b2a" />
        </linearGradient>
        <linearGradient id="wv-sky-night" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#030712" />
          <stop offset="55%" stopColor="#07101e" />
          <stop offset="100%" stopColor="#0b1b2e" />
        </linearGradient>
        <linearGradient id="wv-sky-midnight" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#010208" />
          <stop offset="55%" stopColor="#040812" />
          <stop offset="100%" stopColor="#07101b" />
        </linearGradient>
        <radialGradient id="wv-glow-warm">
          <stop offset="0%" stopColor="#ffd9a0" stopOpacity=".5" />
          <stop offset="45%" stopColor="#f5b45e" stopOpacity=".18" />
          <stop offset="100%" stopColor="#f5b45e" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="wv-sun-warm">
          <stop offset="0%" stopColor="#fff4d6" />
          <stop offset="55%" stopColor="#ffd48a" />
          <stop offset="100%" stopColor="#f0a84e" />
        </radialGradient>
        <radialGradient id="wv-glow-heat">
          <stop offset="0%" stopColor="#ffd27a" stopOpacity=".55" />
          <stop offset="45%" stopColor="#f08a2e" stopOpacity=".2" />
          <stop offset="100%" stopColor="#f08a2e" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="wv-sun-heat">
          <stop offset="0%" stopColor="#fff6d8" />
          <stop offset="55%" stopColor="#ffd06a" />
          <stop offset="100%" stopColor="#e88b2c" />
        </radialGradient>
        <radialGradient id="wv-glow-sunset">
          <stop offset="0%" stopColor="#ffc09a" stopOpacity=".55" />
          <stop offset="45%" stopColor="#ff7a5a" stopOpacity=".2" />
          <stop offset="100%" stopColor="#ff7a5a" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="wv-sun-sunset">
          <stop offset="0%" stopColor="#fff0d4" />
          <stop offset="55%" stopColor="#ffb07a" />
          <stop offset="100%" stopColor="#f06a4a" />
        </radialGradient>
        <radialGradient id="wv-glow-moon">
          <stop offset="0%" stopColor="#dceaff" stopOpacity=".45" />
          <stop offset="45%" stopColor="#9fc4f0" stopOpacity=".14" />
          <stop offset="100%" stopColor="#9fc4f0" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="wv-moon">
          <stop offset="0%" stopColor="#f6faff" />
          <stop offset="62%" stopColor="#cfe0f5" />
          <stop offset="100%" stopColor="#91accb" />
        </radialGradient>
        <linearGradient id="wv-mirage" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ffd89a" stopOpacity="0" />
          <stop offset="45%" stopColor="#ffe7b8" stopOpacity=".22" />
          <stop offset="55%" stopColor="#fff3d4" stopOpacity=".28" />
          <stop offset="100%" stopColor="#ffd89a" stopOpacity="0" />
        </linearGradient>
      </defs>

      <rect width="820" height="460" fill={`url(#wv-sky-${phase})`} />
      {phase === 'morning' && <MorningScene />}
      {phase === 'afternoon' && <AfternoonScene />}
      {phase === 'evening' && <EveningScene />}
      {phase === 'night' && <NightScene />}
      {phase === 'midnight' && <MidnightScene />}
    </svg>
  )
}
