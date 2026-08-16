const PAL = {
  bgTop: '#0D1424',
  line: 'rgba(237, 241, 247, 0.16)',
  faint: 'rgba(237, 241, 247, 0.4)',
  kiwi: '#B5E84A',
  kiwiDeep: '#7CA825',
  kiwiSoft: 'rgba(181, 232, 74, 0.22)',
  blue: '#5B8CFF',
  blueSoft: 'rgba(91, 140, 255, 0.24)',
  lavender: '#A78BFA',
  lavenderSoft: 'rgba(167, 139, 250, 0.24)',
  card: '#1B2A4B',
  cardDark: '#15203B',
  cardLine: '#24345C',
  ink: '#0D1424',
}

function Sparkle({ x, y, s = 4, fill }) {
  return (
    <path
      transform={`translate(${x} ${y}) scale(${s / 4})`}
      d="M0 -4 L1.2 -1.2 L4 0 L1.2 1.2 L0 4 L-1.2 1.2 L-4 0 L-1.2 -1.2 Z"
      fill={fill}
    />
  )
}

function Lines({ x, y, w, l = 4, gap = 8, fw = 1 }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={l} rx={l / 2} fill={PAL.cardLine} />
      <rect x={x} y={y + gap} width={w * fw} height={l} rx={l / 2} fill={PAL.cardLine} />
      <rect x={x} y={y + gap * 2} width={w * fw} height={l} rx={l / 2} fill={PAL.cardLine} />
    </g>
  )
}

const DOTS = [
  [26, 118, 1.4], [56, 24, 1.6], [92, 48, 1.2], [128, 90, 1.5], [300, 120, 1.3],
  [356, 30, 1.4], [384, 96, 1.2], [226, 22, 1.3], [318, 132, 1.4], [40, 84, 1.2],
]

function Dots({ fill }) {
  return (
    <g>
      {DOTS.map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill={fill} />
      ))}
    </g>
  )
}

export default function FeedArt({ id }) {
  if (id === 'aarav') {
    return (
      <svg viewBox="0 0 400 150" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id="aarav-bg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#0E1728" />
            <stop offset="1" stopColor="#1B2745" />
          </linearGradient>
          <radialGradient id="aarav-glow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor={PAL.kiwiSoft} />
            <stop offset="1" stopColor="rgba(181,232,74,0)" />
          </radialGradient>
        </defs>
        <rect width="400" height="150" fill="url(#aarav-bg)" />
        <circle cx="318" cy="68" r="96" fill="url(#aarav-glow)" />
        <Dots fill={PAL.faint} />

        <g>
          <rect x="176" y="30" width="172" height="88" rx="14" fill="#182440" stroke={PAL.line} />
          <rect x="190" y="44" width="48" height="18" rx="9" fill={PAL.kiwiSoft} stroke="rgba(181,232,74,0.45)" />
          <text x="214" y="57" textAnchor="middle" fontFamily="var(--font-display)" fontSize="9" fontWeight="700" fill={PAL.kiwi} letterSpacing="1.2">AI</text>
          <rect x="250" y="47" width="70" height="12" rx="6" fill="rgba(237,241,247,0.06)" />
          <rect x="190" y="74" width="130" height="6" rx="3" fill={PAL.cardLine} />
          <rect x="190" y="87" width="104" height="6" rx="3" fill={PAL.cardLine} />
          <rect x="190" y="100" width="118" height="6" rx="3" fill={PAL.cardLine} />
          <circle cx="330" cy="95" r="9" fill={PAL.kiwiSoft} />
          <Sparkle x={330} y={95} s={5} fill={PAL.kiwi} />
        </g>

        <g>
          <rect x="34" y="44" width="96" height="66" rx="12" fill={PAL.card} stroke={PAL.line} />
          <rect x="46" y="58" width="40" height="7" rx="3.5" fill={PAL.blueSoft} />
          <Lines x={46} y={72} w={62} l={4} gap={8} fw={0.7} />
          <rect x="46" y="96" width="26" height="8" rx="4" fill={PAL.kiwiSoft} stroke="rgba(181,232,74,0.4)" />
        </g>

        <g>
          <rect x="126" y="102" width="74" height="38" rx="10" fill={PAL.cardDark} stroke={PAL.line} />
          <rect x="136" y="114" width="50" height="5" rx="2.5" fill={PAL.cardLine} />
          <rect x="136" y="125" width="36" height="5" rx="2.5" fill={PAL.cardLine} />
          <circle cx="190" cy="123" r="4" fill={PAL.blue} />
        </g>

        <Sparkle x={24} y={26} s={4} fill={PAL.blue} />
        <Sparkle x={150} y={20} s={3} fill={PAL.kiwi} />
        <Sparkle x={372} y={122} s={5} fill={PAL.kiwi} />
      </svg>
    )
  }

  if (id === 'sanya') {
    return (
      <svg viewBox="0 0 400 150" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id="sanya-bg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#0E1628" />
            <stop offset="1" stopColor="#1D2748" />
          </linearGradient>
          <radialGradient id="sanya-glow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor={PAL.blueSoft} />
            <stop offset="1" stopColor="rgba(91,140,255,0)" />
          </radialGradient>
        </defs>
        <rect width="400" height="150" fill="url(#sanya-bg)" />
        <circle cx="316" cy="42" r="90" fill="url(#sanya-glow)" />
        <Dots fill={PAL.faint} />

        <path d="M84 92 C 108 78 126 62 156 52" stroke="rgba(237,241,247,0.28)" strokeWidth="1.5" strokeDasharray="3 5" fill="none" />
        <path d="M184 64 C 206 78 220 90 242 98" stroke="rgba(237,241,247,0.28)" strokeWidth="1.5" strokeDasharray="3 5" fill="none" />

        <g>
          <circle cx="66" cy="104" r="18" fill={PAL.cardDark} stroke={PAL.kiwiSoft} strokeWidth="2" />
          <circle cx="66" cy="98" r="6.5" fill={PAL.kiwi} />
          <path d="M54 120 a12 12 0 0 1 24 0 z" fill={PAL.kiwi} opacity="0.55" />
        </g>
        <g>
          <circle cx="172" cy="56" r="18" fill={PAL.cardDark} stroke={PAL.blueSoft} strokeWidth="2" />
          <circle cx="172" cy="50" r="6.5" fill={PAL.blue} />
          <path d="M160 72 a12 12 0 0 1 24 0 z" fill={PAL.blue} opacity="0.55" />
        </g>
        <g>
          <circle cx="258" cy="106" r="18" fill={PAL.cardDark} stroke={PAL.lavenderSoft} strokeWidth="2" />
          <circle cx="258" cy="100" r="6.5" fill={PAL.lavender} />
          <path d="M246 122 a12 12 0 0 1 24 0 z" fill={PAL.lavender} opacity="0.55" />
        </g>

        <g>
          <circle cx="170" cy="88" r="8" fill={PAL.kiwi} stroke={PAL.ink} strokeWidth="2" />
          <rect x="166" y="84" width="8" height="8" rx="2" fill={PAL.ink} transform="rotate(45 170 88)" />
        </g>

        <g>
          <rect x="286" y="20" width="98" height="110" rx="10" fill={PAL.cardDark} stroke={PAL.line} />
          <rect x="286" y="20" width="98" height="22" rx="10" fill="rgba(237,241,247,0.05)" />
          <rect x="286" y="31" width="98" height="11" fill="rgba(237,241,247,0.05)" />
          <circle cx="298" cy="31" r="3" fill={PAL.kiwi} />
          <circle cx="310" cy="31" r="3" fill="rgba(237,241,247,0.3)" />
          <circle cx="322" cy="31" r="3" fill="rgba(237,241,247,0.3)" />
          <rect x="332" y="27" width="38" height="8" rx="4" fill="#0E1728" />
          <rect x="296" y="46" width="16" height="78" rx="4" fill="#0E1728" />
          <rect x="320" y="46" width="54" height="22" rx="6" fill={PAL.card} stroke={PAL.line} />
          <rect x="328" y="54" width="38" height="4" rx="2" fill={PAL.cardLine} />
          <rect x="320" y="74" width="54" height="16" rx="6" fill={PAL.card} stroke={PAL.line} />
          <rect x="320" y="96" width="54" height="16" rx="6" fill={PAL.card} stroke={PAL.line} />
        </g>

        <circle cx="120" cy="38" r="15" fill="none" stroke={PAL.kiwi} strokeWidth="2.5" />
        <line x1="131" y1="49" x2="142" y2="60" stroke={PAL.kiwi} strokeWidth="3" strokeLinecap="round" />

        <Sparkle x={78} y={26} s={3} fill={PAL.lavender} />
        <Sparkle x={210} y={118} s={3} fill={PAL.blue} />
        <Sparkle x={372} y={118} s={4} fill={PAL.kiwi} />
      </svg>
    )
  }

  if (id === 'diya') {
    return (
      <svg viewBox="0 0 400 150" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id="diya-bg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#0D1526" />
            <stop offset="1" stopColor="#182039" />
          </linearGradient>
          <radialGradient id="diya-glow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor={PAL.kiwiSoft} />
            <stop offset="1" stopColor="rgba(181,232,74,0)" />
          </radialGradient>
        </defs>
        <rect width="400" height="150" fill="url(#diya-bg)" />
        <circle cx="60" cy="34" r="70" fill="url(#diya-glow)" />

        <path d="M0 116 Q 60 96 130 114 T 260 116 T 400 106 V150 H0 Z" fill="#121A30" />
        <path d="M0 128 Q 90 112 190 124 T 400 120 V150 H0 Z" fill="#0F1730" opacity="0.9" />

        <path
          d="M48 116 C 110 112 120 78 170 76 C 220 74 230 44 284 42 C 320 40 330 26 360 22"
          stroke={PAL.kiwi}
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />

        <g>
          <circle cx="170" cy="76" r="9" fill={PAL.ink} stroke={PAL.kiwi} strokeWidth="2" />
          <text x="170" y="80" textAnchor="middle" fontFamily="var(--font-display)" fontSize="9" fontWeight="700" fill={PAL.kiwi}>1</text>
        </g>
        <g>
          <circle cx="284" cy="42" r="10" fill={PAL.ink} stroke={PAL.kiwi} strokeWidth="2" />
          <text x="284" y="47" textAnchor="middle" fontFamily="var(--font-display)" fontSize="9" fontWeight="700" fill={PAL.kiwi}>10</text>
        </g>

        <line x1="360" y1="22" x2="360" y2="4" stroke={PAL.kiwi} strokeWidth="2.5" strokeLinecap="round" />
        <path d="M360 4 L380 11 L360 18 Z" fill={PAL.kiwi} />
        <text x="384" y="16" fontFamily="var(--font-display)" fontSize="11" fontWeight="700" fill={PAL.kiwi}>30</text>

        <g>
          <rect x="22" y="22" width="42" height="17" rx="8.5" fill={PAL.blueSoft} stroke="rgba(91,140,255,0.5)" />
          <text x="43" y="34" textAnchor="middle" fontFamily="var(--font-display)" fontSize="9" fontWeight="700" fill={PAL.blue} letterSpacing="1">PY</text>
        </g>

        <Sparkle x={120} y={48} s={3} fill={PAL.kiwi} />
        <Sparkle x={300} y={74} s={3} fill={PAL.kiwi} />
        <Sparkle x={52} y={96} s={3} fill="rgba(237,241,247,0.5)" />
      </svg>
    )
  }

  if (id === 'kunal') {
    return (
      <svg viewBox="0 0 400 150" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id="kunal-bg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#0E1626" />
            <stop offset="1" stopColor="#1D2136" />
          </linearGradient>
          <radialGradient id="kunal-glow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor={PAL.kiwiSoft} />
            <stop offset="1" stopColor="rgba(181,232,74,0)" />
          </radialGradient>
        </defs>
        <rect width="400" height="150" fill="url(#kunal-bg)" />
        <circle cx="262" cy="52" r="90" fill="url(#kunal-glow)" />

        <g stroke="rgba(181,232,74,0.5)" strokeWidth="1.5">
          <line x1="258" y1="78" x2="222" y2="34" />
          <line x1="258" y1="78" x2="250" y2="28" />
          <line x1="258" y1="78" x2="268" y2="28" />
          <line x1="258" y1="78" x2="296" y2="34" />
        </g>

        <g>
          <rect x="188" y="104" width="36" height="32" rx="6" fill="#141D36" stroke={PAL.line} />
          <rect x="234" y="84" width="42" height="52" rx="6" fill="#182244" stroke="rgba(181,232,74,0.35)" />
          <rect x="286" y="96" width="36" height="40" rx="6" fill="#141D36" stroke={PAL.line} />
          <text x="255" y="126" textAnchor="middle" fontFamily="var(--font-display)" fontSize="15" fontWeight="700" fill={PAL.kiwi}>1</text>
        </g>

        <g>
          <rect x="242" y="48" width="32" height="6" rx="3" fill={PAL.kiwiDeep} />
          <path d="M244 52 l2 14 a14 12 0 0 0 26 0 l2 -14 z" fill={PAL.kiwi} />
          <path d="M244 56 c-9 -2 -9 12 0 10" stroke={PAL.kiwi} strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M272 56 c9 -2 9 12 0 10" stroke={PAL.kiwi} strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <rect x="255" y="68" width="6" height="10" rx="2" fill={PAL.kiwiDeep} />
          <rect x="248" y="78" width="20" height="6" rx="3" fill={PAL.kiwi} />
        </g>

        <g>
          <path d="M66 40 C 56 60 56 84 66 96 C 76 84 76 60 66 40 Z" fill={PAL.cardDark} stroke="rgba(91,140,255,0.5)" strokeWidth="1.5" />
          <circle cx="66" cy="62" r="5.5" fill={PAL.blue} stroke={PAL.ink} strokeWidth="1.5" />
          <path d="M66 76 l-10 16 h10 z" fill={PAL.blue} />
          <path d="M66 76 l10 16 h-10 z" fill={PAL.blue} />
          <path d="M66 96 q-8 14 0 22 q8 -8 0 -22 z" fill={PAL.kiwi} />
          <path d="M66 100 q-3 8 0 14 q3 -6 0 -14 z" fill={PAL.kiwiDeep} />
        </g>
        <path d="M66 118 C 122 112 152 60 196 32" stroke={PAL.kiwiSoft} strokeWidth="3" strokeDasharray="5 6" fill="none" strokeLinecap="round" />

        <rect x="140" y="38" width="6" height="6" rx="1.5" fill={PAL.kiwi} transform="rotate(20 143 41)" />
        <rect x="176" y="66" width="6" height="6" rx="1.5" fill={PAL.blue} transform="rotate(45 179 69)" />
        <rect x="118" y="104" width="6" height="6" rx="1.5" fill={PAL.lavender} transform="rotate(-15 121 107)" />
        <rect x="214" y="34" width="5" height="5" rx="1.5" fill="rgba(181,232,74,0.8)" transform="rotate(30 216 36)" />
        <Sparkle x={178} y={30} s={3} fill={PAL.lavender} />
        <Sparkle x={320} y={66} s={3} fill="rgba(237,241,247,0.55)" />
        <Sparkle x={372} y={124} s={4} fill={PAL.kiwi} />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 400 150" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="riya-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0D1526" />
          <stop offset="1" stopColor="#192844" />
        </linearGradient>
        <radialGradient id="riya-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor={PAL.blueSoft} />
          <stop offset="1" stopColor="rgba(91,140,255,0)" />
        </radialGradient>
      </defs>
      <rect width="400" height="150" fill="url(#riya-bg)" />
      <circle cx="112" cy="40" r="76" fill="url(#riya-glow)" />
      <Dots fill={PAL.faint} />

      <g>
        <line x1="70" y1="24" x2="70" y2="14" stroke={PAL.kiwi} strokeWidth="2.5" strokeLinecap="round" />
        <line x1="90" y1="30" x2="97" y2="23" stroke={PAL.kiwi} strokeWidth="2.5" strokeLinecap="round" />
        <line x1="98" y1="46" x2="108" y2="46" stroke={PAL.kiwi} strokeWidth="2.5" strokeLinecap="round" />
        <line x1="90" y1="62" x2="97" y2="69" stroke={PAL.kiwi} strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="70" cy="48" r="26" fill={PAL.kiwiSoft} />
        <circle cx="70" cy="48" r="16" fill={PAL.cardDark} stroke={PAL.kiwi} strokeWidth="2" />
        <rect x="62" y="68" width="16" height="8" rx="2" fill={PAL.kiwi} />
        <rect x="58" y="64" width="24" height="4" rx="2" fill={PAL.kiwiDeep} />
      </g>

      <g>
        <path d="M212 108 C 190 104 174 104 158 110 L158 72 C 174 66 192 66 212 72 Z" fill={PAL.card} stroke={PAL.line} />
        <path d="M212 108 C 234 104 250 104 266 110 L266 72 C 250 66 232 66 212 72 Z" fill={PAL.card} stroke={PAL.line} />
        <line x1="212" y1="72" x2="212" y2="108" stroke="rgba(237,241,247,0.28)" />
        <rect x="166" y="84" width="28" height="4" rx="2" fill={PAL.cardLine} />
        <rect x="166" y="92" width="32" height="4" rx="2" fill={PAL.cardLine} />
        <rect x="226" y="84" width="30" height="4" rx="2" fill={PAL.cardLine} />
        <rect x="226" y="92" width="26" height="4" rx="2" fill={PAL.cardLine} />
      </g>

      <g>
        <path d="M302 96 C 324 88 342 66 362 42" stroke={PAL.kiwi} strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M356 34 l12 3 -7 11 z" fill={PAL.kiwi} />
        <circle cx="324" cy="78" r="5" fill={PAL.blue} stroke={PAL.ink} strokeWidth="1.5" />
        <circle cx="346" cy="58" r="5" fill={PAL.lavender} stroke={PAL.ink} strokeWidth="1.5" />
        <circle cx="366" cy="38" r="5" fill={PAL.kiwi} stroke={PAL.ink} strokeWidth="1.5" />
      </g>

      <Sparkle x={144} y={26} s={3} fill={PAL.kiwi} />
      <Sparkle x={32} y={108} s={3} fill={PAL.blue} />
      <Sparkle x={288} y={122} s={3} fill={PAL.lavender} />
      <Sparkle x={378} y={120} s={4} fill={PAL.kiwi} />
    </svg>
  )
}
