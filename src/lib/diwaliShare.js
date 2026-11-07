const CARD_WIDTH = 1080
const CARD_HEIGHT = 1350

function normalizeName(value) {
  return String(value ?? '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 48)
}

export function buildDiwaliGreeting(name) {
  const displayName = normalizeName(name)

  if (!displayName) {
    throw new Error('A name is required to build a Diwali greeting.')
  }

  return `\u{1FAA9} Happy Diwali from ${displayName}! \u2728

This Diwali, let's celebrate happiness, new beginnings, friendship, and togetherness.

I'm celebrating Diwali with AADI HUB \u2013 a growing student ecosystem built to connect students, ideas, communities, and opportunities.

Join the AADI HUB family and be part of something bigger!

Celebrating together with the trust and support of the AADI HUB Founding Team.

Let's celebrate, connect, and grow together!

\u2014 ${displayName}
AADI HUB | Student Ecosystem`
}

export function diwaliCardFileName(name) {
  const slug = normalizeName(name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40)

  return `aadi-hub-diwali-${slug || 'celebration'}.png`
}

export async function copyToClipboard(text) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch {
    // Fall through to the legacy path below.
  }

  try {
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.setAttribute('readonly', '')
    textarea.style.position = 'fixed'
    textarea.style.top = '-1000px'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    const copied = document.execCommand('copy')
    document.body.removeChild(textarea)
    return copied
  } catch {
    return false
  }
}

function wrapText(ctx, text, maxWidth) {
  const words = String(text).split(/\s+/).filter(Boolean)
  if (words.length === 0) return ['']

  const lines = []
  let line = words[0]

  for (let index = 1; index < words.length; index += 1) {
    const candidate = `${line} ${words[index]}`
    if (ctx.measureText(candidate).width <= maxWidth) {
      line = candidate
    } else {
      lines.push(line)
      line = words[index]
    }
  }

  lines.push(line)
  return lines
}

function roundedRect(ctx, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2)

  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + width, y, x + width, y + height, r)
  ctx.arcTo(x + width, y + height, x, y + height, r)
  ctx.arcTo(x, y + height, x, y, r)
  ctx.arcTo(x, y, x + width, y, r)
  ctx.closePath()
}

function drawStar(ctx, x, y, radius, color, alpha = 1) {
  ctx.save()
  ctx.translate(x, y)
  ctx.scale(1, 1)
  ctx.beginPath()
  for (let point = 0; point < 8; point += 1) {
    const angle = (Math.PI / 4) * point - Math.PI / 2
    const distance = point % 2 === 0 ? radius : radius * 0.36
    const px = Math.cos(angle) * distance
    const py = Math.sin(angle) * distance
    if (point === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.closePath()
  ctx.globalAlpha = alpha
  ctx.fillStyle = color
  ctx.fill()
  ctx.restore()
}

function drawRangoli(ctx, x, y, radius, color) {
  ctx.save()
  ctx.translate(x, y)
  ctx.strokeStyle = color
  ctx.lineWidth = 2

  for (let ring = 0.32; ring <= 1.001; ring += 0.17) {
    ctx.beginPath()
    ctx.arc(0, 0, radius * ring, 0, Math.PI * 2)
    ctx.stroke()
  }

  for (let petal = 0; petal < 16; petal += 1) {
    const angle = (Math.PI / 8) * petal
    ctx.beginPath()
    ctx.moveTo(Math.cos(angle) * radius * 0.28, Math.sin(angle) * radius * 0.28)
    ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius)
    ctx.stroke()
  }

  ctx.restore()
}

function drawDiya(ctx, x, y, scale = 1) {
  ctx.save()
  ctx.translate(x, y)
  ctx.scale(scale, scale)

  const flame = ctx.createRadialGradient(0, -30, 1, 0, -30, 26)
  flame.addColorStop(0, 'rgba(255, 252, 232, 1)')
  flame.addColorStop(0.4, 'rgba(255, 210, 122, 0.9)')
  flame.addColorStop(1, 'rgba(255, 138, 42, 0)')
  ctx.fillStyle = flame
  ctx.beginPath()
  ctx.ellipse(0, -30, 17, 27, 0, 0, Math.PI * 2)
  ctx.fill()

  const bowl = ctx.createLinearGradient(0, -4, 0, 28)
  bowl.addColorStop(0, '#ffd27a')
  bowl.addColorStop(1, '#a94c17')
  ctx.fillStyle = bowl
  ctx.beginPath()
  ctx.moveTo(-40, 0)
  ctx.quadraticCurveTo(0, 36, 40, 0)
  ctx.quadraticCurveTo(0, 16, -40, 0)
  ctx.fill()

  ctx.strokeStyle = 'rgba(255, 231, 176, 0.78)'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(-40, 0)
  ctx.quadraticCurveTo(0, 11, 40, 0)
  ctx.stroke()

  ctx.restore()
}

function drawDivider(ctx, y, halfWidth) {
  const gradient = ctx.createLinearGradient(
    CARD_WIDTH / 2 - halfWidth,
    y,
    CARD_WIDTH / 2 + halfWidth,
    y
  )
  gradient.addColorStop(0, 'rgba(255, 205, 120, 0)')
  gradient.addColorStop(0.5, 'rgba(255, 220, 150, 0.85)')
  gradient.addColorStop(1, 'rgba(255, 205, 120, 0)')

  ctx.strokeStyle = gradient
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(CARD_WIDTH / 2 - halfWidth, y)
  ctx.lineTo(CARD_WIDTH / 2 + halfWidth, y)
  ctx.stroke()

  drawStar(ctx, CARD_WIDTH / 2, y, 10, '#ffe7b0', 0.9)
}

function drawCenteredLines(ctx, lines, startY, lineHeight, font, color) {
  ctx.font = font
  ctx.fillStyle = color
  lines.forEach((line, index) => {
    ctx.fillText(line, CARD_WIDTH / 2, startY + index * lineHeight)
  })
  return startY + (lines.length - 1) * lineHeight
}

export function renderDiwaliCard(name) {
  if (typeof document === 'undefined') return null

  const displayName = normalizeName(name)
  if (!displayName) return null

  const canvas = document.createElement('canvas')
  canvas.width = CARD_WIDTH
  canvas.height = CARD_HEIGHT

  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  const width = CARD_WIDTH
  const height = CARD_HEIGHT

  // Deep night-sky background -------------------------------------------------
  const background = ctx.createLinearGradient(0, 0, 0, height)
  background.addColorStop(0, '#0a0715')
  background.addColorStop(0.46, '#150b22')
  background.addColorStop(1, '#06050c')
  ctx.fillStyle = background
  ctx.fillRect(0, 0, width, height)

  const glow = (x, y, radius, inner, outer) => {
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius)
    gradient.addColorStop(0, inner)
    gradient.addColorStop(1, outer)
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)
  }

  glow(width * 0.82, height * 0.13, 560, 'rgba(255, 176, 72, 0.24)', 'rgba(255, 176, 72, 0)')
  glow(width * 0.12, height * 0.82, 520, 'rgba(255, 116, 40, 0.18)', 'rgba(255, 116, 40, 0)')
  glow(width * 0.5, height * 0.46, 620, 'rgba(137, 92, 255, 0.16)', 'rgba(137, 92, 255, 0)')

  // Deterministic stars and sparkles -----------------------------------------
  let seed = 20261107
  const random = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296
    return seed / 4294967296
  }

  for (let index = 0; index < 150; index += 1) {
    const x = random() * width
    const y = random() * height
    const radius = 0.7 + random() * 1.8
    const alpha = 0.12 + random() * 0.5
    ctx.globalAlpha = alpha
    ctx.fillStyle = index % 5 === 0 ? '#ffe6a8' : '#ffffff'
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.globalAlpha = 1

  for (let index = 0; index < 18; index += 1) {
    drawStar(
      ctx,
      70 + random() * (width - 140),
      90 + random() * (height - 180),
      5 + random() * 8,
      '#ffe6a8',
      0.18 + random() * 0.45
    )
  }

  drawRangoli(ctx, 86, 96, 150, 'rgba(255, 196, 92, 0.14)')
  drawRangoli(ctx, width - 72, height - 88, 178, 'rgba(255, 196, 92, 0.11)')

  // Gold frame ---------------------------------------------------------------
  roundedRect(ctx, 44, 44, width - 88, height - 88, 48)
  ctx.strokeStyle = 'rgba(255, 205, 120, 0.55)'
  ctx.lineWidth = 3
  ctx.stroke()

  roundedRect(ctx, 62, 62, width - 124, height - 124, 38)
  ctx.strokeStyle = 'rgba(255, 205, 120, 0.22)'
  ctx.lineWidth = 1.5
  ctx.stroke()

  // Header -------------------------------------------------------------------
  ctx.textAlign = 'center'
  ctx.textBaseline = 'alphabetic'

  ctx.font = "600 23px 'Segoe UI', system-ui, sans-serif"
  ctx.fillStyle = 'rgba(255, 207, 120, 0.9)'
  ctx.fillText('AADI HUB  \u00b7  FESTIVAL OF LIGHTS 2026', width / 2, 142)

  drawDivider(ctx, 174, 220)

  ctx.font = "500 42px Georgia, 'Times New Roman', serif"
  ctx.fillStyle = 'rgba(255, 236, 206, 0.82)'
  ctx.fillText('Happy Diwali from', width / 2, 262)

  // Name ---------------------------------------------------------------------
  let nameFont = 88
  let nameLines = []

  while (nameFont >= 52) {
    ctx.font = `600 ${nameFont}px Georgia, 'Times New Roman', serif`
    nameLines = wrapText(ctx, displayName, 850)
    if (nameLines.length <= 2) break
    nameFont -= 6
  }

  const nameLineHeight = Math.round(nameFont * 1.08)
  const nameStartY = 262 + 92
  const nameGradient = ctx.createLinearGradient(140, nameStartY - nameFont, 940, nameStartY + nameFont)
  nameGradient.addColorStop(0, '#fff3d0')
  nameGradient.addColorStop(0.48, '#ffc46a')
  nameGradient.addColorStop(1, '#ff9a3c')

  ctx.font = `600 ${nameFont}px Georgia, 'Times New Roman', serif`
  ctx.fillStyle = nameGradient
  nameLines.forEach((line, index) => {
    ctx.fillText(line, width / 2, nameStartY + index * nameLineHeight)
  })

  let cursorY = nameStartY + (nameLines.length - 1) * nameLineHeight + 66
  drawDivider(ctx, cursorY, 280)

  // Message ------------------------------------------------------------------
  cursorY += 74

  const message = [
    "This Diwali, let's celebrate happiness,",
    'new beginnings, friendship, and togetherness.',
  ]

  cursorY = drawCenteredLines(
    ctx,
    message,
    cursorY,
    48,
    "400 33px 'Segoe UI', system-ui, sans-serif",
    'rgba(237, 241, 247, 0.78)'
  )
  cursorY += 76

  const ecosystem = [
    "I'm celebrating Diwali with AADI HUB \u2014",
    'a growing student ecosystem built to connect',
    'students, ideas, communities, and opportunities.',
  ]

  cursorY = drawCenteredLines(
    ctx,
    ecosystem,
    cursorY,
    48,
    "400 33px 'Segoe UI', system-ui, sans-serif",
    'rgba(237, 241, 247, 0.7)'
  )
  cursorY += 68

  ctx.font = "600 30px 'Segoe UI', system-ui, sans-serif"
  const joinLines = wrapText(
    ctx,
    'Join the AADI HUB family and be part of something bigger!',
    870
  )
  cursorY = drawCenteredLines(
    ctx,
    joinLines,
    cursorY,
    44,
    "600 30px 'Segoe UI', system-ui, sans-serif",
    '#ffe0a0'
  )
  cursorY += 62

  ctx.font = "400 26px 'Segoe UI', system-ui, sans-serif"
  const supportLines = wrapText(
    ctx,
    'Celebrating together with the trust and support of the AADI HUB Founding Team.',
    900
  )
  cursorY = drawCenteredLines(
    ctx,
    supportLines,
    cursorY,
    38,
    "400 26px 'Segoe UI', system-ui, sans-serif",
    'rgba(237, 241, 247, 0.56)'
  )
  cursorY += 74

  ctx.font = "600 35px Georgia, 'Times New Roman', serif"
  ctx.fillStyle = '#ffcf78'
  ctx.fillText("Let's celebrate, connect, and grow together!", width / 2, cursorY)

  // Footer -------------------------------------------------------------------
  cursorY += 66
  drawDivider(ctx, cursorY, 190)

  cursorY += 58
  ctx.font = "italic 30px Georgia, 'Times New Roman', serif"
  ctx.fillStyle = 'rgba(255, 224, 160, 0.88)'
  ctx.fillText(`\u2014 ${displayName}`, width / 2, cursorY)

  cursorY += 46
  ctx.font = "600 22px 'Segoe UI', system-ui, sans-serif"
  ctx.fillStyle = 'rgba(255, 207, 120, 0.82)'
  ctx.fillText('AADI HUB  |  STUDENT ECOSYSTEM', width / 2, cursorY)

  drawDiya(ctx, 154, 1196, 0.92)
  drawDiya(ctx, width - 154, 1196, 0.92)

  return canvas
}
