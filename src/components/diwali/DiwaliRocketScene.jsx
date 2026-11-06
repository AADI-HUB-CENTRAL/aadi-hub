import { useEffect, useRef, useState } from 'react'
import { Rangoli, Diya } from './DiwaliHeroDecorations.jsx'

const CAPTIONS = {
  enter: 'A little celebration is about to begin...',
  walking: 'Our little friend is walking to the rocket.',
  lighting: 'A spark of light, a heart full of joy.',
  retreating: 'Stepping back safely...',
  watching: 'Looking up at the night sky...',
  launching: 'Here it goes!',
  exploding: 'The sky is celebrating with you!',
  static: 'A little spark, a sky full of wishes.',
}

function StickFigure() {
  return (
    <svg
      className="dw-figure"
      viewBox="0 0 120 180"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <g className="dw-figure__scarf">
        <path d="M47 62c8 4 18 5 27 1l4 10c-11 5-24 4-34-2z" fill="#FF8A3C" />
      </g>
      <g className="dw-figure__head">
        <circle cx="60" cy="40" r="19" fill="#FFE0B2" stroke="#FFC46A" strokeWidth="2" />
        <circle cx="53" cy="38" r="2.4" fill="#2A1A0C" />
        <circle cx="67" cy="38" r="2.4" fill="#2A1A0C" />
        <path
          d="M53 47c4 4 10 4 14 0"
          stroke="#2A1A0C"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path d="M60 21c7-7 16-2 16-2" stroke="#FFC46A" strokeWidth="2.4" />
      </g>
      <path
        className="dw-figure__torso"
        d="M60 59v49"
        stroke="#FFD27A"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <g className="dw-figure__arm dw-figure__arm--left">
        <path
          d="M60 72 42 92"
          stroke="#FFD27A"
          strokeWidth="5"
          strokeLinecap="round"
        />
      </g>
      <g className="dw-figure__arm dw-figure__arm--right">
        <path
          d="M60 72 81 88"
          stroke="#FFD27A"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <circle className="dw-figure__hand" cx="83" cy="90" r="3.4" fill="#FFE7B0" />
      </g>
      <g className="dw-figure__leg dw-figure__leg--left">
        <path
          d="M60 108 45 145"
          stroke="#FFD27A"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <path d="M45 145h-9" stroke="#FFD27A" strokeWidth="5" strokeLinecap="round" />
      </g>
      <g className="dw-figure__leg dw-figure__leg--right">
        <path
          d="M60 108 76 145"
          stroke="#FFD27A"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <path d="M76 145h9" stroke="#FFD27A" strokeWidth="5" strokeLinecap="round" />
      </g>
    </svg>
  )
}

function Rocket() {
  return (
    <svg
      className="dw-rocket"
      viewBox="0 0 80 190"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        className="dw-rocket__trail"
        d="M40 138c-4 16-3 28 0 44 3-16 4-28 0-44Z"
        fill="url(#dw-rocket-trail)"
      />
      <path d="M40 12c12 15 18 34 18 56v52H22V68c0-22 6-41 18-56Z" fill="#C65A22" />
      <path d="M40 12c8 11 13 24 16 39H24c3-15 8-28 16-39Z" fill="#FFC24A" />
      <path d="M22 104h36v18H22z" fill="#8F3B16" />
      <path d="M22 88c-12 9-15 23-15 34 8-4 13-8 15-13V88Z" fill="#FF9A3C" />
      <path d="M58 88c12 9 15 23 15 34-8-4-13-8-15-13V88Z" fill="#FF9A3C" />
      <circle cx="40" cy="76" r="10" fill="#7CE7FF" fillOpacity="0.85" />
      <circle cx="40" cy="76" r="5" fill="#FFF6DA" fillOpacity="0.8" />
      <path d="M22 122h36l-7 14H29z" fill="#8F3B16" />
      <path
        className="dw-rocket__flame"
        d="M32 136c1 12 4 21 8 28 4-7 7-16 8-28-5 4-11 4-16 0Z"
        fill="url(#dw-rocket-flame)"
      />
      <defs>
        <linearGradient id="dw-rocket-trail" x1="40" y1="138" x2="40" y2="182">
          <stop stopColor="#FFD27A" stopOpacity="0.9" />
          <stop offset="1" stopColor="#FF8A2A" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="dw-rocket-flame" x1="40" y1="136" x2="40" y2="166">
          <stop stopColor="#FFF6DA" />
          <stop offset="0.5" stopColor="#FFC24A" />
          <stop offset="1" stopColor="#FF7A1F" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export default function DiwaliRocketScene({
  name,
  reducedMotion,
  onLaunch,
  onExplode,
  onComplete,
}) {
  const [stage, setStage] = useState(reducedMotion ? 'static' : 'enter')
  const callbacks = useRef({ onLaunch, onExplode, onComplete })

  useEffect(() => {
    callbacks.current = { onLaunch, onExplode, onComplete }
  }, [onLaunch, onExplode, onComplete])

  useEffect(() => {
    if (reducedMotion) {
      const timer = window.setTimeout(() => {
        callbacks.current.onExplode?.()
        callbacks.current.onComplete?.()
      }, 900)
      return () => window.clearTimeout(timer)
    }

    const timers = [
      window.setTimeout(() => setStage('walking'), 350),
      window.setTimeout(() => setStage('lighting'), 1700),
      window.setTimeout(() => setStage('retreating'), 2700),
      window.setTimeout(() => setStage('watching'), 3700),
      window.setTimeout(() => {
        setStage('launching')
        callbacks.current.onLaunch?.()
      }, 4400),
      window.setTimeout(() => {
        setStage('exploding')
        callbacks.current.onExplode?.()
      }, 6000),
      window.setTimeout(() => {
        callbacks.current.onComplete?.()
      }, 8300),
    ]

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer))
    }
  }, [reducedMotion])

  const walking = stage === 'walking' || stage === 'retreating'

  return (
    <div
      className={`dw-scene dw-scene--${stage}`}
      role="img"
      aria-label={`A friendly character helps light a Diwali rocket for ${name}.`}
    >
      <div className="dw-scene__sky" aria-hidden="true">
        <div className="dw-scene__stars" />
        <div className="dw-scene__moon" />
      </div>

      <div className="dw-scene__world" aria-hidden="true">
        <div className="dw-scene__ground">
          <div className="dw-scene__ground-glow" />
          <div className="dw-scene__rangoli">
            <Rangoli className="dw-scene__rangoli-svg" />
          </div>
          <Diya className="dw-scene__diya dw-scene__diya--one" />
          <Diya className="dw-scene__diya dw-scene__diya--two" />
          <Diya className="dw-scene__diya dw-scene__diya--three" />
        </div>
      </div>

      <div className="dw-scene__rocket-wrap" aria-hidden="true">
        <div className="dw-scene__bottle" />
        <div className="dw-scene__rocket-holder">
          <Rocket />
        </div>
        <div className="dw-scene__launch-glow" />
      </div>

      <div
        className={`dw-scene__character${walking ? ' is-walking' : ''}`}
        aria-hidden="true"
      >
        <StickFigure />
      </div>

      <div className="dw-scene__spark" aria-hidden="true">
        <span />
      </div>

      <p className="dw-scene__caption" aria-live="polite">
        {CAPTIONS[stage]}
      </p>

      <div className="dw-scene__flash" aria-hidden="true" />
    </div>
  )
}
