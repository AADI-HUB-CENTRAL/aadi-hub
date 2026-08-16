import Reveal from './Reveal.jsx'

export default function SectionHeader({
  kicker,
  title,
  lead,
  tag,
  tone = 'dark',
  align = 'left',
  center = false,
  className = '',
}) {
  const cls = `sec-head sec-head--${center ? 'center' : align} ${className}`.trim()
  const chipTone = tone === 'light' ? 'chip--light' : ''
  return (
    <Reveal className={cls}>
      {kicker && (
        <p className="sec-kicker">
          {kicker}
          {tag && <span className={`chip ${chipTone}`}>{tag}</span>}
        </p>
      )}
      <h2 className="sec-title">{title}</h2>
      {lead && <p className="sec-lead">{lead}</p>}
    </Reveal>
  )
}
