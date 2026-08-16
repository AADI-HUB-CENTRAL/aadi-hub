const PATTERN = [
  '111111000',
  '100001010',
  '111111100',
  '000101001',
  '101000010',
  '010011101',
  '001110000',
  '100100111',
  '111000000',
]

export default function Qr({ className = 'qr-grid' }) {
  return (
    <span className={className} role="img" aria-label="QR code for AADI digital profile">
      {PATTERN.map((row, r) =>
        row.split('').map((cell, c) => (
          <span key={`${r}-${c}`} className={`qr-grid__cell${cell === '0' ? ' qr-grid__cell--off' : ''}`} />
        ))
      )}
    </span>
  )
}
