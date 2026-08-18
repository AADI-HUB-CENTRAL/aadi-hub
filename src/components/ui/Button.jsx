import { Link } from 'react-router-dom'
import { ArrowUpRight } from './Icons.jsx'

export default function Button({
  variant = 'primary',
  size = 'md',
  href,
  arrow = false,
  className = '',
  children,
  ...rest
}) {
  const cls = `btn btn--${variant} btn--${size} ${className}`.trim()
  const content = (
    <>
      {children}
      {arrow && (
        <span className="btn__arrow" aria-hidden="true">
          <ArrowUpRight size={16} />
        </span>
      )}
    </>
  )
  if (href) {
    if (href.startsWith('/') && !href.startsWith('//')) {
      return (
        <Link className={cls} to={href} {...rest}>
          {content}
        </Link>
      )
    }
    return (
      <a className={cls} href={href} {...rest}>
        {content}
      </a>
    )
  }
  return (
    <button className={cls} {...rest}>
      {content}
    </button>
  )
}
