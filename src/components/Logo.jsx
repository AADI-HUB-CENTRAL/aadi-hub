export function BrandSymbol({ size = 42, className = 'brand-symbol', style }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      role="img"
      aria-label="AADI HUB symbol"
      style={style}
    >
      <path
        d="M20 6.5 L34.5 34.5 H27.5 L20 18.9 L12.5 34.5 H5.5 Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <circle cx="20" cy="26.6" r="6.4" fill="var(--night-900)" stroke="currentColor" strokeWidth="2.6" />
      <circle cx="20" cy="26.6" r="2.2" fill="currentColor" />
    </svg>
  )
}

export default function Logo({ className = '', size = 20, symbol = 26 }) {
  return (
    <span className={`logo${className ? ` ${className}` : ''}`}>
      <BrandSymbol size={symbol} />
      <span className="nav__logo__text" style={{ fontSize: size }}>
        AADI <b>HUB</b>
      </span>
    </span>
  )
}
