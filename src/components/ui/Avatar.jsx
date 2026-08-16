const PALETTE = [
  '#F0C96E',
  '#E8A87C',
  '#9CD3F0',
  '#C8A6F0',
  '#A6E8C8',
  '#F0A6B8',
  '#8FE3D9',
  '#F0D86E',
]

export default function Avatar({ name = '', size, className = '', style }) {
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()

  const hash = name.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  const bg = PALETTE[hash % PALETTE.length]

  return (
    <span
      className={`post__avatar ${className}`.trim()}
      style={{ background: bg, ...(size ? { width: size, height: size } : {}), ...style }}
      aria-hidden="true"
    >
      {initials}
    </span>
  )
}
