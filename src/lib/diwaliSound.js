let audioContext = null
let noiseBuffer = null

export function primeDiwaliAudio() {
  if (typeof window === 'undefined') return false
  const AudioContextCtor = window.AudioContext || window.webkitAudioContext
  if (!AudioContextCtor) return false

  try {
    if (!audioContext) audioContext = new AudioContextCtor()
    if (audioContext.state === 'suspended') audioContext.resume()
    return true
  } catch {
    return false
  }
}

function getNoiseBuffer(ctx) {
  if (noiseBuffer) return noiseBuffer
  const length = Math.floor(ctx.sampleRate * 2)
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < length; i += 1) {
    data[i] = Math.random() * 2 - 1
  }
  noiseBuffer = buffer
  return buffer
}

function createNoiseSource(ctx) {
  const source = ctx.createBufferSource()
  source.buffer = getNoiseBuffer(ctx)
  return source
}

export function playDiwaliLaunch() {
  if (!audioContext || audioContext.state !== 'running') return

  const ctx = audioContext
  const now = ctx.currentTime
  const source = createNoiseSource(ctx)
  const filter = ctx.createBiquadFilter()
  const gain = ctx.createGain()

  filter.type = 'bandpass'
  filter.Q.value = 0.9
  filter.frequency.setValueAtTime(180, now)
  filter.frequency.exponentialRampToValueAtTime(1500, now + 0.95)

  gain.gain.setValueAtTime(0.0001, now)
  gain.gain.exponentialRampToValueAtTime(0.075, now + 0.16)
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.15)

  source.connect(filter)
  filter.connect(gain)
  gain.connect(ctx.destination)
  source.start(now)
  source.stop(now + 1.18)
}

export function playDiwaliExplosion() {
  if (!audioContext || audioContext.state !== 'running') return

  const ctx = audioContext
  const now = ctx.currentTime

  const boom = ctx.createOscillator()
  const boomGain = ctx.createGain()
  boom.type = 'sine'
  boom.frequency.setValueAtTime(82, now)
  boom.frequency.exponentialRampToValueAtTime(34, now + 0.7)
  boomGain.gain.setValueAtTime(0.22, now)
  boomGain.gain.exponentialRampToValueAtTime(0.0001, now + 1)
  boom.connect(boomGain)
  boomGain.connect(ctx.destination)
  boom.start(now)
  boom.stop(now + 1.05)

  const burst = createNoiseSource(ctx)
  const burstFilter = ctx.createBiquadFilter()
  const burstGain = ctx.createGain()
  burstFilter.type = 'lowpass'
  burstFilter.frequency.setValueAtTime(2600, now)
  burstFilter.frequency.exponentialRampToValueAtTime(240, now + 0.9)
  burstGain.gain.setValueAtTime(0.16, now)
  burstGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.15)
  burst.connect(burstFilter)
  burstFilter.connect(burstGain)
  burstGain.connect(ctx.destination)
  burst.start(now, Math.random() * 0.3)
  burst.stop(now + 1.2)
}
