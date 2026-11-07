import { useEffect, useRef } from 'react'
import { Garland, Marigold } from './DiwaliHeroDecorations.jsx'

const FLOWERS = Array.from({ length: 23 }, (_, index) => {
  const tones = ['deep', 'orange', 'gold']
  return {
    x: 45 + Math.sin(index * 1.12) * 8,
    y: 30 + index * 66,
    scale: 0.86 + (index % 4) * 0.07,
    tone: tones[index % tones.length],
    tilt: Math.sin(index * 0.9) * 14,
  }
})

const BELLS = [
  { x: 56, y: 250 },
  { x: 35, y: 640 },
  { x: 57, y: 1010 },
  { x: 34, y: 1370 },
]

const SPARKLES = [
  { left: '8%', top: '18%', size: 5, delay: 0.2 },
  { left: '92%', top: '24%', size: 4, delay: 1.4 },
  { left: '10%', top: '47%', size: 4, delay: 2.6 },
  { left: '90%', top: '58%', size: 5, delay: 0.8 },
  { left: '7%', top: '76%', size: 3, delay: 3.2 },
  { left: '93%', top: '82%', size: 4, delay: 2.1 },
]

const PETALS = [
  { left: '6%', top: '30%', size: 5, drift: 34, duration: 16, delay: -2 },
  { left: '92%', top: '38%', size: 6, drift: -42, duration: 19, delay: -7 },
  { left: '9%', top: '64%', size: 4, drift: 48, duration: 21, delay: -4 },
  { left: '89%', top: '72%', size: 5, drift: -36, duration: 17, delay: -11 },
]

const PERMISSION_KEY = 'aadi-diwali-motion'
let permissionRequested = false

const clamp = (value, min, max) => Math.min(max, Math.max(min, value))

function HangingGarland() {
  return (
    <svg
      className="hero-garland__svg"
      viewBox="0 0 90 1500"
      preserveAspectRatio="xMidYMin slice"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M46 0C34 160 58 320 42 480c-14 160 14 320-2 480-14 160 14 320-2 480"
        stroke="rgba(255, 205, 120, 0.3)"
        strokeWidth="1.4"
      />
      <path
        d="M44 0c-9 150 12 300-2 450-11 122 6 228 4 350-3 130 9 250 1 380-5 100 2 190 0 280"
        stroke="rgba(126, 164, 58, 0.34)"
        strokeWidth="1.1"
        strokeDasharray="2 7"
      />

      {FLOWERS.map((flower, index) => (
        <g key={index}>
          {index % 2 === 0 && (
            <>
              <ellipse
                cx={flower.x + 12}
                cy={flower.y + 7}
                rx="6.2"
                ry="2.8"
                fill="#7DA626"
                fillOpacity="0.58"
                transform={`rotate(28 ${flower.x + 12} ${flower.y + 7})`}
              />
              <ellipse
                cx={flower.x - 11}
                cy={flower.y + 9}
                rx="5.4"
                ry="2.4"
                fill="#5F8434"
                fillOpacity="0.46"
                transform={`rotate(-24 ${flower.x - 11} ${flower.y + 9})`}
              />
            </>
          )}
          {index < FLOWERS.length - 1 && (
            <path
              d={`M${flower.x} ${flower.y + 17}l3.6 6-3.6 7-3.6-7z`}
              fill="#F6C15A"
              fillOpacity="0.76"
            />
          )}
          <circle
            cx={flower.x}
            cy={flower.y}
            r="12"
            fill="#FFB347"
            fillOpacity="0.075"
          />
          <g
            className="hero-garland__bloom"
            style={{ '--bloom-delay': `${index * -0.19}s` }}
          >
            <Marigold
              x={flower.x}
              y={flower.y}
              scale={flower.scale}
              tone={flower.tone}
            />
          </g>
          <circle
            cx={flower.x + 8}
            cy={flower.y + 28}
            r="1.5"
            fill="#FFE1A0"
            fillOpacity="0.72"
          />
        </g>
      ))}

      {BELLS.map((bell, index) => (
        <g key={index}>
          <path
            d={`M${bell.x} ${bell.y - 18}v10`}
            stroke="#F6C15A"
            strokeOpacity="0.7"
          />
          <path
            d={`M${bell.x - 6} ${bell.y - 8}h12l-2 9H${bell.x - 4}z`}
            fill="#F4B84C"
            fillOpacity="0.86"
          />
          <path
            d={`M${bell.x - 4} ${bell.y + 1}h8l-1 3h-6z`}
            fill="#D9942E"
            fillOpacity="0.8"
          />
          <circle cx={bell.x} cy={bell.y + 7} r="2" fill="#FFE1A0" />
        </g>
      ))}
    </svg>
  )
}

export default function SwingingHeroGarlands() {
  const leftRef = useRef(null)
  const rightRef = useRef(null)
  const topRef = useRef(null)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const mobile = window.matchMedia('(max-width: 768px)').matches
    if (reduced || !mobile) return undefined
    if (typeof window.DeviceOrientationEvent === 'undefined') return undefined

    const left = leftRef.current
    const right = rightRef.current
    const top = topRef.current
    if (!left || !right || !top) return undefined

    const motion = {
      left: { angle: 0, velocity: 0, target: 0, stiffness: 30, damping: 6.8, gain: 1 },
      right: { angle: 0, velocity: 0, target: 0, stiffness: 24, damping: 6.1, gain: 0.82 },
      top: { x: 0, velocity: 0, target: 0, stiffness: 26, damping: 6.6 },
    }

    let frame = 0
    let lastFrame = 0
    let lastSensor = 0
    let lastGamma = null
    let lastBeta = null
    let smoothedGamma = null
    let baseline = null
    let lastMovement = 0
    let live = false

    const settleAngle = (entry, dt, desired) => {
      const accel = (desired - entry.angle) * entry.stiffness - entry.velocity * entry.damping
      entry.velocity += accel * dt
      entry.angle += entry.velocity * dt
      entry.angle = clamp(entry.angle, -7, 7)
    }

    const settleX = (entry, dt, desired) => {
      const accel = (desired - entry.x) * entry.stiffness - entry.velocity * entry.damping
      entry.velocity += accel * dt
      entry.x += entry.velocity * dt
      entry.x = clamp(entry.x, -16, 16)
    }

    const tick = (time) => {
      const dt = lastFrame ? Math.min((time - lastFrame) / 1000, 0.034) : 1 / 60
      lastFrame = time

      const ambient = Math.sin(time / 1500) * 0.7

      settleAngle(motion.left, dt, motion.left.target + ambient)
      settleAngle(motion.right, dt, motion.right.target - ambient * 0.75)
      settleX(motion.top, dt, motion.top.target + ambient * 2.4)

      left.style.setProperty('--sway-angle', `${motion.left.angle.toFixed(3)}deg`)
      right.style.setProperty('--sway-angle', `${motion.right.angle.toFixed(3)}deg`)
      top.style.setProperty('--sway-x', `${motion.top.x.toFixed(2)}px`)

      frame = window.requestAnimationFrame(tick)
    }

    const startLoop = () => {
      if (frame) return
      lastFrame = 0
      frame = window.requestAnimationFrame(tick)
    }

    const handleOrientation = (event) => {
      const gamma = Number(event.gamma)
      const beta = Number(event.beta)
      if (!Number.isFinite(gamma) || !Number.isFinite(beta)) return

      const now = performance.now()
      if (!live || smoothedGamma === null) {
        live = true
        left.classList.add('is-live')
        right.classList.add('is-live')
        top.classList.add('is-live')
        smoothedGamma = gamma
        baseline = gamma
        lastGamma = gamma
        lastBeta = beta
        lastSensor = now
        lastMovement = now
        startLoop()
        return
      }

      const sensorDt = Math.max((now - lastSensor) / 1000, 0.008)
      lastSensor = now
      const dGamma = gamma - lastGamma
      const dBeta = beta - lastBeta
      lastGamma = gamma
      lastBeta = beta

      smoothedGamma += (gamma - smoothedGamma) * 0.16
      const relativeTilt = smoothedGamma - baseline
      const target = clamp(relativeTilt * -0.18, -5.5, 5.5)

      const angularRate = (Math.abs(dGamma) + Math.abs(dBeta) * 0.32) / sensorDt
      const shake = angularRate > 95 ? Math.min((angularRate - 95) * 0.045, 24) : 0

      if (shake > 0) {
        const direction = Math.sign(dGamma) || Math.sign(dBeta) || 1
        motion.left.velocity += direction * shake
        motion.right.velocity += direction * shake * 0.78
        motion.top.velocity += direction * shake * 2.2
        lastMovement = now
      }

      motion.left.target = target * motion.left.gain
      motion.right.target = target * motion.right.gain
      motion.top.target = clamp(relativeTilt * 1.4, -13, 13)

      if (now - lastMovement > 900) {
        baseline += (smoothedGamma - baseline) * 0.035
      }
    }

    const cleanup = []
    const attach = () => {
      window.addEventListener('deviceorientation', handleOrientation, true)
      cleanup.push(() =>
        window.removeEventListener('deviceorientation', handleOrientation, true),
      )
    }

    const canRequest =
      typeof window.DeviceOrientationEvent.requestPermission === 'function'

    if (!canRequest) {
      attach()
    } else {
      let stored = 'unknown'
      try {
        stored = window.sessionStorage.getItem(PERMISSION_KEY) || 'unknown'
      } catch {
        stored = 'unknown'
      }

      if (stored !== 'denied') {
        const ask = async () => {
          if (permissionRequested) return
          permissionRequested = true
          try {
            const result = await window.DeviceOrientationEvent.requestPermission()
            try {
              window.sessionStorage.setItem(PERMISSION_KEY, result)
            } catch {
              // ignore
            }
            if (result === 'granted') attach()
          } catch {
            try {
              window.sessionStorage.setItem(PERMISSION_KEY, 'denied')
            } catch {
              // ignore
            }
          }
        }
        window.addEventListener('pointerdown', ask, { once: true, passive: true })
        cleanup.push(() => window.removeEventListener('pointerdown', ask))
      }
    }

    return () => {
      if (frame) window.cancelAnimationFrame(frame)
      cleanup.forEach((remove) => remove())
    }
  }, [])

  return (
    <div className="hero-garlands" aria-hidden="true">
      <div className="hero-garland-top" ref={topRef}>
        <div className="hero-garland-top__rest">
          <Garland className="hero-garland-top__svg" />
        </div>
      </div>

      <div className="hero-garland hero-garland--left" ref={leftRef}>
        <div className="hero-garland__mirror">
          <div className="hero-garland__rest">
            <HangingGarland />
          </div>
        </div>
      </div>

      <div className="hero-garland hero-garland--right" ref={rightRef}>
        <div className="hero-garland__mirror">
          <div className="hero-garland__rest">
            <HangingGarland />
          </div>
        </div>
      </div>

      <div className="hero-garland__sparkles">
        {SPARKLES.map((sparkle, index) => (
          <span
            key={index}
            className="hero-garland__sparkle"
            style={{
              left: sparkle.left,
              top: sparkle.top,
              '--s': `${sparkle.size}px`,
              '--delay': `${sparkle.delay}s`,
            }}
          />
        ))}
      </div>

      <div className="hero-garland__petals">
        {PETALS.map((petal, index) => (
          <span
            key={index}
            className="hero-garland__petal"
            style={{
              left: petal.left,
              top: petal.top,
              '--s': `${petal.size}px`,
              '--drift': `${petal.drift}px`,
              '--dur': `${petal.duration}s`,
              '--delay': `${petal.delay}s`,
            }}
          />
        ))}
      </div>
    </div>
  )
}
