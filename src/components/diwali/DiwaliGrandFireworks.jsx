import { useEffect, useRef } from 'react'

const GOLD = ['#FFF6DA', '#FFE19A', '#FFC24A', '#FF9A3C']
const PINK = ['#FF8FC7', '#FF6FA8', '#FFD166']
const BLUE = ['#8DE8FF', '#7CE7FF', '#B794FF']
const ORANGE = ['#FFB347', '#FF8A2A', '#FFE0A0']
const PURPLE = ['#C9A6FF', '#B794FF', '#FF8FC7']
const EMERALD = ['#7EF0C2', '#8DE8FF', '#FFE19A']

const ACCENTS = [PINK, BLUE, ORANGE, PURPLE, EMERALD, GOLD]
const MAX_PARTICLES = 520

function createGlowSprite() {
  const size = 96
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
  gradient.addColorStop(0, 'rgba(255, 248, 224, 1)')
  gradient.addColorStop(0.2, 'rgba(255, 222, 146, 0.9)')
  gradient.addColorStop(0.5, 'rgba(255, 180, 78, 0.34)')
  gradient.addColorStop(1, 'rgba(255, 150, 50, 0)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size)
  return sprite
}

export default function DiwaliGrandFireworks({ onDone }) {
  const canvasRef = useRef(null)
  const doneRef = useRef(onDone)

  useEffect(() => {
    doneRef.current = onDone
  }, [onDone])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (motionQuery.matches) {
      doneRef.current?.()
      return
    }

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const glow = createGlowSprite()
    const particles = []
    const rings = []
    const flashes = []
    let width = 0
    let height = 0
    let dpr = 1
    let isMobile = false
    let rafId = 0
    let running = false
    let lastTime = 0
    let elapsed = 0
    let nextBurst = 0
    let finished = false

    const resize = () => {
      width = Math.max(1, window.innerWidth)
      height = Math.max(1, window.innerHeight)
      dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2)
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.lineCap = 'round'
    }

    isMobile = window.innerWidth < 760
    resize()

    const pushParticles = (list) => {
      const room = MAX_PARTICLES - particles.length
      if (room <= 0) return
      if (list.length <= room) {
        particles.push(...list)
      } else {
        particles.push(...list.slice(0, room))
      }
    }

    const makeBurst = (x, y, count, palette, strength) => {
      const list = []
      const baseSpeed = (isMobile ? 70 : 105) * strength
      const speedRange = (isMobile ? 150 : 235) * strength

      for (let i = 0; i < count; i += 1) {
        const angle = Math.random() * Math.PI * 2
        const speed = baseSpeed + Math.random() * speedRange
        const life = 1.2 + Math.random() * 1.8
        list.push({
          x,
          y,
          px: x,
          py: y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          gravity: 38 + Math.random() * 32,
          friction: 0.93 + Math.random() * 0.025,
          life,
          maxLife: life,
          size: 1.1 + Math.random() * (isMobile ? 1.5 : 2.1),
          color: palette[Math.floor(Math.random() * palette.length)],
          twinkle: Math.random() < 0.32,
        })
      }

      pushParticles(list)
    }

    const makeGlitter = (x, y, count) => {
      const list = []
      for (let i = 0; i < count; i += 1) {
        const angle = Math.random() * Math.PI * 2
        const speed = 10 + Math.random() * 70
        const life = 2.8 + Math.random() * 2.4
        list.push({
          x,
          y,
          px: x,
          py: y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          gravity: 18 + Math.random() * 14,
          friction: 0.985,
          life,
          maxLife: life,
          size: 0.7 + Math.random() * 1.1,
          color: GOLD[Math.floor(Math.random() * GOLD.length)],
          twinkle: true,
        })
      }
      pushParticles(list)
    }

    const makeFlash = (x, y, size) => {
      flashes.push({ x, y, size, life: 0.32, maxLife: 0.32 })
    }

    const makeRing = (x, y, maxRadius, color) => {
      rings.push({
        x,
        y,
        radius: 4,
        maxRadius,
        speed: (isMobile ? 120 : 210) + Math.random() * 60,
        life: 1.1,
        maxLife: 1.1,
        color,
      })
    }

    const spawnMain = () => {
      makeBurst(width * 0.5, height * 0.27, isMobile ? 78 : 132, GOLD, 1.15)
      makeBurst(width * 0.29, height * 0.22, isMobile ? 34 : 64, PINK, 0.9)
      makeBurst(width * 0.7, height * 0.2, isMobile ? 34 : 64, BLUE, 0.9)
      makeBurst(width * 0.4, height * 0.4, isMobile ? 28 : 52, ORANGE, 0.8)
      makeBurst(width * 0.63, height * 0.39, isMobile ? 28 : 52, PURPLE, 0.8)
      makeGlitter(width * 0.5, height * 0.27, isMobile ? 26 : 48)
      makeFlash(width * 0.5, height * 0.27, isMobile ? 220 : 340)
      makeRing(width * 0.5, height * 0.27, isMobile ? 180 : 270, '#FFD27A')
      makeRing(width * 0.29, height * 0.22, isMobile ? 110 : 170, '#FF8FC7')
      makeRing(width * 0.7, height * 0.2, isMobile ? 110 : 170, '#8DE8FF')
    }

    const spawnAccent = () => {
      const palette = ACCENTS[Math.floor(Math.random() * ACCENTS.length)]
      const x = width * (0.18 + Math.random() * 0.64)
      const y = height * (0.14 + Math.random() * 0.3)
      const strength = 0.55 + Math.random() * 0.5
      makeBurst(x, y, isMobile ? 22 : 40 + Math.random() * 18, palette, strength)
      makeFlash(x, y, isMobile ? 90 : 150)
      if (Math.random() < 0.4) {
        makeRing(x, y, isMobile ? 70 : 120, palette[0])
      }
    }

    const update = (dt) => {
      if (!finished && elapsed >= nextBurst) {
        nextBurst = elapsed + 0.55 + Math.random() * 0.65
        spawnAccent()
      }

      for (let i = particles.length - 1; i >= 0; i -= 1) {
        const p = particles[i]
        p.px = p.x
        p.py = p.y
        const damping = Math.pow(p.friction, dt * 60)
        p.vx *= damping
        p.vy *= damping
        p.vy += p.gravity * dt
        p.x += p.vx * dt
        p.y += p.vy * dt
        p.life -= dt
        if (p.life <= 0) particles.splice(i, 1)
      }

      for (let i = rings.length - 1; i >= 0; i -= 1) {
        const ring = rings[i]
        ring.radius += ring.speed * dt
        ring.life -= dt
        if (ring.life <= 0 || ring.radius > ring.maxRadius) rings.splice(i, 1)
      }

      for (let i = flashes.length - 1; i >= 0; i -= 1) {
        flashes[i].life -= dt
        if (flashes[i].life <= 0) flashes.splice(i, 1)
      }

      if (!finished && elapsed > 5.6) finished = true
      if (finished && particles.length === 0 && rings.length === 0) {
        cancelAnimationFrame(rafId)
        rafId = 0
        running = false
        doneRef.current?.()
      }
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height)
      ctx.globalCompositeOperation = 'lighter'

      for (let i = 0; i < rings.length; i += 1) {
        const ring = rings[i]
        const alpha = Math.max(0, ring.life / ring.maxLife)
        ctx.globalAlpha = alpha * 0.5
        ctx.strokeStyle = ring.color
        ctx.lineWidth = 2.2 * alpha
        ctx.beginPath()
        ctx.arc(ring.x, ring.y, ring.radius, 0, Math.PI * 2)
        ctx.stroke()
      }

      for (let i = 0; i < flashes.length; i += 1) {
        const flash = flashes[i]
        const alpha = Math.max(0, flash.life / flash.maxLife)
        ctx.globalAlpha = alpha * 0.7
        ctx.drawImage(
          glow,
          flash.x - flash.size / 2,
          flash.y - flash.size / 2,
          flash.size,
          flash.size
        )
      }

      for (let i = 0; i < particles.length; i += 1) {
        const p = particles[i]
        const progress = Math.max(0, p.life / p.maxLife)
        let alpha = Math.min(1, progress * 1.7)
        if (p.twinkle) {
          alpha *= 0.5 + Math.abs(Math.sin(p.life * 20 + i)) * 0.5
        }
        ctx.globalAlpha = alpha
        ctx.strokeStyle = p.color
        ctx.lineWidth = p.size * 0.85
        ctx.beginPath()
        ctx.moveTo(p.px, p.py)
        ctx.lineTo(p.x, p.y)
        ctx.stroke()

        ctx.fillStyle = p.color
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.globalAlpha = 1
      ctx.globalCompositeOperation = 'source-over'
    }

    const frame = (time) => {
      if (!running) return
      const dt = Math.min((time - lastTime) / 1000, 0.05)
      lastTime = time
      elapsed += dt
      update(dt)
      draw()
      if (running) rafId = window.requestAnimationFrame(frame)
    }

    const start = () => {
      if (running) return
      running = true
      lastTime = performance.now()
      rafId = window.requestAnimationFrame(frame)
    }

    const stop = () => {
      running = false
      if (rafId) {
        cancelAnimationFrame(rafId)
        rafId = 0
      }
    }

    const handleVisibility = () => {
      if (document.hidden) {
        stop()
      } else if (rafId === 0) {
        if (finished) {
          doneRef.current?.()
        } else {
          start()
        }
      }
    }

    const handleResize = () => {
      isMobile = window.innerWidth < 760
      resize()
    }

    spawnMain()
    nextBurst = 0.7
    start()

    document.addEventListener('visibilitychange', handleVisibility)
    window.addEventListener('resize', handleResize)

    return () => {
      stop()
      document.removeEventListener('visibilitychange', handleVisibility)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return <canvas ref={canvasRef} className="dw-finale" aria-hidden="true" />
}
