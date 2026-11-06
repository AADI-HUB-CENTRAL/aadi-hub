import { useEffect, useRef } from 'react'

const GOLD_PALETTES = [
  ['#FFE7B0', '#FFC24A', '#FF9F3C'],
  ['#FFF3D0', '#FFD37A', '#FFAB4A'],
  ['#FFD98A', '#FFB347', '#FF8A2A'],
]

const FESTIVE_PALETTE = ['#FF6FA8', '#7CE7FF', '#FFD166', '#B794FF']

const MAX_PARTICLES_DESKTOP = 300
const MAX_PARTICLES_MOBILE = 140

function createGlowSprite() {
  const size = 64
  const sprite = document.createElement('canvas')
  sprite.width = size
  sprite.height = size
  const ctx = sprite.getContext('2d')
  const gradient = ctx.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2
  )
  gradient.addColorStop(0, 'rgba(255, 246, 218, 1)')
  gradient.addColorStop(0.22, 'rgba(255, 214, 128, 0.85)')
  gradient.addColorStop(0.55, 'rgba(255, 170, 70, 0.28)')
  gradient.addColorStop(1, 'rgba(255, 150, 50, 0)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size)
  return sprite
}

function pickPalette() {
  if (Math.random() < 0.14) return FESTIVE_PALETTE
  return GOLD_PALETTES[Math.floor(Math.random() * GOLD_PALETTES.length)]
}

function pickBurstPosition(width, height, isMobile) {
  if (isMobile) {
    if (Math.random() < 0.58) {
      return {
        x: width * (0.14 + Math.random() * 0.72),
        y: height * (0.04 + Math.random() * 0.1),
      }
    }
    return {
      x:
        Math.random() < 0.5
          ? width * (0.04 + Math.random() * 0.15)
          : width * (0.81 + Math.random() * 0.15),
      y: height * (0.17 + Math.random() * 0.16),
    }
  }

  if (Math.random() < 0.6) {
    return {
      x:
        Math.random() < 0.5
          ? width * (0.04 + Math.random() * 0.18)
          : width * (0.78 + Math.random() * 0.18),
      y: height * (0.09 + Math.random() * 0.3),
    }
  }

  return {
    x: width * (0.3 + Math.random() * 0.4),
    y: height * (0.05 + Math.random() * 0.11),
  }
}

export default function DiwaliFireworks() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (motionQuery.matches) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const glowSprite = createGlowSprite()
    const particles = []
    const flashes = []
    let width = 0
    let height = 0
    let dpr = 1
    let isMobile = false
    let running = false
    let visible = true
    let rafId = 0
    let lastTime = 0
    let burstTimer = 0
    let fountainTimer = 0
    let nextBurst = 0.7 + Math.random() * 1.1
    let nextFountain = 3.6 + Math.random() * 3.6

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const nextWidth = Math.max(1, Math.round(rect.width))
      const nextHeight = Math.max(1, Math.round(rect.height))
      const nextDpr = Math.min(window.devicePixelRatio || 1, 2)

      if (nextWidth === width && nextHeight === height && nextDpr === dpr) return

      width = nextWidth
      height = nextHeight
      dpr = nextDpr
      isMobile = width < 760

      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.lineCap = 'round'
    }

    const particleCap = () =>
      isMobile ? MAX_PARTICLES_MOBILE : MAX_PARTICLES_DESKTOP

    const pushParticles = (list) => {
      const room = particleCap() - particles.length
      if (room <= 0) return
      if (list.length <= room) {
        particles.push(...list)
      } else {
        particles.push(...list.slice(0, room))
      }
    }

    const spawnBurst = (x, y, strength) => {
      const palette = pickPalette()
      const base = isMobile ? 14 : 26
      const spread = isMobile ? 9 : 17
      const count = Math.round((base + Math.random() * spread) * strength)
      const baseSpeed = isMobile ? 48 : 74
      const speedRange = isMobile ? 88 : 158
      const list = []

      for (let i = 0; i < count; i += 1) {
        const angle = Math.random() * Math.PI * 2
        const speed = (baseSpeed + Math.random() * speedRange) * strength
        const life = 0.9 + Math.random() * 1.3
        list.push({
          x,
          y,
          px: x,
          py: y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          gravity: 34 + Math.random() * 26,
          friction: 0.925 + Math.random() * 0.03,
          life,
          maxLife: life,
          size: 1 + Math.random() * (isMobile ? 1.2 : 1.8),
          color: palette[Math.floor(Math.random() * palette.length)],
          twinkle: Math.random() < 0.28,
        })
      }

      pushParticles(list)
      flashes.push({
        x,
        y,
        life: 0.26,
        maxLife: 0.26,
        size: (isMobile ? 62 : 96) * strength * (0.8 + Math.random() * 0.5),
      })
    }

    const spawnFountain = () => {
      const fromLeft = Math.random() < 0.5
      const x = fromLeft
        ? width * (0.04 + Math.random() * 0.12)
        : width * (0.84 + Math.random() * 0.12)
      const y = height * (0.9 + Math.random() * 0.04)
      const count = isMobile ? 7 + Math.random() * 5 : 15 + Math.random() * 10
      const list = []

      for (let i = 0; i < count; i += 1) {
        const angle = -Math.PI / 2 + (Math.random() - 0.5) * 0.56
        const speed = (isMobile ? 70 : 95) + Math.random() * (isMobile ? 90 : 140)
        const life = 0.55 + Math.random() * 0.85
        list.push({
          x,
          y,
          px: x,
          py: y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          gravity: 150 + Math.random() * 70,
          friction: 0.986,
          life,
          maxLife: life,
          size: 0.9 + Math.random() * 1.2,
          color: GOLD_PALETTES[Math.floor(Math.random() * GOLD_PALETTES.length)][
            Math.floor(Math.random() * 3)
          ],
          twinkle: Math.random() < 0.45,
        })
      }

      pushParticles(list)
      flashes.push({
        x,
        y,
        life: 0.2,
        maxLife: 0.2,
        size: isMobile ? 30 : 46,
      })
    }

    const update = (dt) => {
      burstTimer += dt
      fountainTimer += dt

      if (burstTimer >= nextBurst) {
        burstTimer = 0
        nextBurst = (isMobile ? 2.4 : 1.7) + Math.random() * (isMobile ? 2.4 : 2.1)
        const position = pickBurstPosition(width, height, isMobile)
        spawnBurst(
          position.x,
          position.y,
          isMobile ? 0.72 + Math.random() * 0.28 : 0.75 + Math.random() * 0.55
        )
      }

      if (fountainTimer >= nextFountain) {
        fountainTimer = 0
        nextFountain = (isMobile ? 7 : 5) + Math.random() * (isMobile ? 5 : 5)
        spawnFountain()
      }

      for (let i = particles.length - 1; i >= 0; i -= 1) {
        const particle = particles[i]
        particle.px = particle.x
        particle.py = particle.y
        const damping = Math.pow(particle.friction, dt * 60)
        particle.vx *= damping
        particle.vy *= damping
        particle.vy += particle.gravity * dt
        particle.x += particle.vx * dt
        particle.y += particle.vy * dt
        particle.life -= dt

        if (
          particle.life <= 0 ||
          particle.x < -40 ||
          particle.x > width + 40 ||
          particle.y < -40 ||
          particle.y > height + 40
        ) {
          particles.splice(i, 1)
        }
      }

      for (let i = flashes.length - 1; i >= 0; i -= 1) {
        flashes[i].life -= dt
        if (flashes[i].life <= 0) flashes.splice(i, 1)
      }
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height)
      ctx.globalCompositeOperation = 'lighter'

      for (let i = 0; i < flashes.length; i += 1) {
        const flash = flashes[i]
        const alpha = Math.max(0, flash.life / flash.maxLife)
        ctx.globalAlpha = alpha * 0.55
        ctx.drawImage(
          glowSprite,
          flash.x - flash.size / 2,
          flash.y - flash.size / 2,
          flash.size,
          flash.size
        )
      }

      for (let i = 0; i < particles.length; i += 1) {
        const particle = particles[i]
        const progress = Math.max(0, particle.life / particle.maxLife)
        let alpha = Math.min(1, progress * 1.6)

        if (particle.twinkle) {
          alpha *= 0.55 + Math.abs(Math.sin(particle.life * 22 + i)) * 0.45
        }

        ctx.globalAlpha = alpha
        ctx.strokeStyle = particle.color
        ctx.lineWidth = particle.size * 0.9
        ctx.beginPath()
        ctx.moveTo(particle.px, particle.py)
        ctx.lineTo(particle.x, particle.y)
        ctx.stroke()

        ctx.fillStyle = particle.color
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.globalAlpha = 1
      ctx.globalCompositeOperation = 'source-over'
    }

    const frame = (time) => {
      if (!running) return
      const dt = Math.min((time - lastTime) / 1000, 0.05)
      lastTime = time
      update(dt)
      draw()
      rafId = window.requestAnimationFrame(frame)
    }

    const start = () => {
      if (running || !visible || document.hidden || motionQuery.matches) return
      running = true
      lastTime = performance.now()
      rafId = window.requestAnimationFrame(frame)
    }

    const stop = () => {
      running = false
      if (rafId) {
        window.cancelAnimationFrame(rafId)
        rafId = 0
      }
    }

    const handleVisibility = () => {
      if (document.hidden) {
        stop()
      } else {
        start()
      }
    }

    const handleMotionChange = () => {
      if (motionQuery.matches) {
        stop()
        ctx.clearRect(0, 0, width, height)
      } else {
        start()
      }
    }

    resize()

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(canvas)
    window.addEventListener('resize', resize)
    document.addEventListener('visibilitychange', handleVisibility)
    motionQuery.addEventListener('change', handleMotionChange)

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        visible = entries[0]?.isIntersecting ?? true
        if (visible) {
          start()
        } else {
          stop()
        }
      },
      { threshold: 0.01 }
    )
    intersectionObserver.observe(canvas)

    start()

    return () => {
      stop()
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', handleVisibility)
      motionQuery.removeEventListener('change', handleMotionChange)
    }
  }, [])

  return <canvas ref={canvasRef} className="diwali__fireworks" aria-hidden="true" />
}
