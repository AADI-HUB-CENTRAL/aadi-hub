const base = (size) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
})

export const ArrowUpRight = ({ size = 20 }) => (
  <svg {...base(size)}>
    <path d="M7 17L17 7M8 7h9v9" />
  </svg>
)

export const ArrowRight = ({ size = 20 }) => (
  <svg {...base(size)}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)

export const ArrowDown = ({ size = 20 }) => (
  <svg {...base(size)}>
    <path d="M12 4v16M6 14l6 6 6-6" />
  </svg>
)

export const Heart = ({ size = 20 }) => (
  <svg {...base(size)}>
    <path d="M12 20.5C7.2 16.4 3.5 13.1 3.5 9.3 3.5 6.6 5.5 4.8 8 4.8c1.6 0 3.1.8 4 2.1.9-1.3 2.4-2.1 4-2.1 2.5 0 4.5 1.8 4.5 4.5 0 3.8-3.7 7.1-8.5 11.2z" />
  </svg>
)

export const Message = ({ size = 20 }) => (
  <svg {...base(size)}>
    <path d="M21 11.5a8.4 8.4 0 0 1-8.5 8.4 8.7 8.7 0 0 1-4.3-1.1L3 20l1.2-4.7A8.4 8.4 0 1 1 21 11.5z" />
  </svg>
)

export const Share = ({ size = 20 }) => (
  <svg {...base(size)}>
    <path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7" />
    <path d="M16 6l-4-4-4 4M12 2v14" />
  </svg>
)

export const Bookmark = ({ size = 20 }) => (
  <svg {...base(size)}>
    <path d="M6 3h12v18l-6-4-6 4z" />
  </svg>
)

export const LinkIcon = ({ size = 20 }) => (
  <svg {...base(size)}>
    <path d="M10 13a5 5 0 0 0 7.5.5l2-2a5 5 0 0 0-7-7l-1.1 1.1" />
    <path d="M14 11a5 5 0 0 0-7.5-.5l-2 2a5 5 0 0 0 7 7l1.1-1.1" />
  </svg>
)

export const Plus = ({ size = 20 }) => (
  <svg {...base(size)}>
    <path d="M12 5v14M5 12h14" />
  </svg>
)

export const Check = ({ size = 20 }) => (
  <svg {...base(size)}>
    <path d="M20 6L9 17l-5-5" />
  </svg>
)

export const Menu = ({ size = 20 }) => (
  <svg {...base(size)}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
)

export const X = ({ size = 20 }) => (
  <svg {...base(size)}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
)

export const Users = ({ size = 20 }) => (
  <svg {...base(size)}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8" />
  </svg>
)

export const Trophy = ({ size = 20 }) => (
  <svg {...base(size)}>
    <path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0zM7 5H4a2 2 0 0 0 2 4h1M17 5h3a2 2 0 0 1-2 4h-1" />
  </svg>
)

export const Target = ({ size = 20 }) => (
  <svg {...base(size)}>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="5" />
    <circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" />
  </svg>
)

export const Briefcase = ({ size = 20 }) => (
  <svg {...base(size)}>
    <rect x="3" y="7" width="18" height="13" rx="2" />
    <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18" />
  </svg>
)

export const Award = ({ size = 20 }) => (
  <svg {...base(size)}>
    <circle cx="12" cy="9" r="6" />
    <path d="M8.5 14.5L7 22l5-3 5 3-1.5-7.5" />
  </svg>
)

export const Graduation = ({ size = 20 }) => (
  <svg {...base(size)}>
    <path d="M2 9l10-5 10 5-10 5z" />
    <path d="M6 11v5c0 1.1 2.7 2.5 6 2.5s6-1.4 6-2.5v-5" />
    <path d="M22 9v6" />
  </svg>
)

export const Code = ({ size = 20 }) => (
  <svg {...base(size)}>
    <path d="M8 6l-6 6 6 6M16 6l6 6-6 6" />
  </svg>
)

export const Palette = ({ size = 20 }) => (
  <svg {...base(size)}>
    <path d="M12 21a9 9 0 1 1 9-9c0 2.5-1.6 4-3.2 4H16c-1.4 0-2 .6-2 1.5 0 .4.2.7.5 1 .6.7.3 2-1.5 2.5H12z" />
    <circle cx="7.5" cy="11.5" r="1" fill="currentColor" stroke="none" />
    <circle cx="10.5" cy="7.5" r="1" fill="currentColor" stroke="none" />
    <circle cx="14.5" cy="7.5" r="1" fill="currentColor" stroke="none" />
  </svg>
)

export const Music = ({ size = 20 }) => (
  <svg {...base(size)}>
    <path d="M9 18V5l12-2v13" />
    <circle cx="6" cy="18" r="3" />
    <circle cx="18" cy="16" r="3" />
  </svg>
)

export const Camera = ({ size = 20 }) => (
  <svg {...base(size)}>
    <path d="M4 8h3l2-3h6l2 3h3v12H4z" />
    <circle cx="12" cy="13" r="3.5" />
  </svg>
)

export const Gamepad = ({ size = 20 }) => (
  <svg {...base(size)}>
    <path d="M7 12h4M9 10v4M15 11h.01M18 13h.01" />
    <path d="M17.3 5H6.7a3 3 0 0 0-2.9 2.3L2 17a3 3 0 0 0 5.9 1.3L9 15h6l1.1 3.3A3 3 0 0 0 22 17l-1.8-9.7A3 3 0 0 0 17.3 5z" />
  </svg>
)

export const Globe = ({ size = 20 }) => (
  <svg {...base(size)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3a13.5 13.5 0 0 1 0 18 13.5 13.5 0 0 1 0-18z" />
  </svg>
)

export const TrendingUp = ({ size = 20 }) => (
  <svg {...base(size)}>
    <path d="M3 17l6-6 4 4 8-8" />
    <path d="M15 7h6v6" />
  </svg>
)

export const Clock = ({ size = 20 }) => (
  <svg {...base(size)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 3" />
  </svg>
)

export const Spark = ({ size = 20 }) => (
  <svg {...base(size)}>
    <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" />
    <path d="M19 3v3M20.5 4.5h-3M5 17v3M6.5 18.5h-3" />
  </svg>
)

export const Rocket = ({ size = 20 }) => (
  <svg {...base(size)}>
    <path d="M4.5 16.5c-1.5 1.5-2 5-2 5s3.5-.5 5-2" />
    <path d="M15 9l-6 6" />
    <path d="M12 2c3 1 6 4 6 8l-2 2H8l-2-2c0-4 3-7 6-8z" />
    <circle cx="14" cy="8" r="1.3" fill="currentColor" stroke="none" />
    <path d="M9 15l-2 2 2 2 2-2" />
  </svg>
)

export const Star = ({ size = 20 }) => (
  <svg {...base(size)}>
    <path d="M12 3l2.7 5.5 6 .9-4.3 4.2 1 6-5.4-2.8-5.4 2.8 1-6L3.3 9.4l6-.9z" />
  </svg>
)

export const Zap = ({ size = 20 }) => (
  <svg {...base(size)}>
    <path d="M13 2L4 14h6l-1 8 9-12h-6z" />
  </svg>
)

export const Layers = ({ size = 20 }) => (
  <svg {...base(size)}>
    <path d="M12 3l9 5-9 5-9-5z" />
    <path d="M3 13l9 5 9-5" />
  </svg>
)

export const Compass = ({ size = 20 }) => (
  <svg {...base(size)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M15.5 8.5l-2 5-5 2 2-5z" />
  </svg>
)

export const Search = ({ size = 20 }) => (
  <svg {...base(size)}>
    <circle cx="11" cy="11" r="7" />
    <path d="M21 21l-4.3-4.3" />
  </svg>
)

export const Database = ({ size = 20 }) => (
  <svg {...base(size)}>
    <ellipse cx="12" cy="5" rx="8" ry="3" />
    <path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5" />
    <path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" />
  </svg>
)

export const PenTool = ({ size = 20 }) => (
  <svg {...base(size)}>
    <path d="M12 19l7-7 3 3-7 7-3-3z" />
    <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 13l5-5-4-4M2 2l7.6 7.6" />
  </svg>
)

export const MapPin = ({ size = 20 }) => (
  <svg {...base(size)}>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
)

export const Flag = ({ size = 20 }) => (
  <svg {...base(size)}>
    <path d="M6 21V4" />
    <path d="M6 5c4 0 3 4 7 4s5-3 5-3v8c0 1-2 3-5 3s-7-3-7-3" />
  </svg>
)

export const Shield = ({ size = 20 }) => (
  <svg {...base(size)}>
    <path d="M12 3l8 3v6c0 4.5-3.2 7.9-8 9-4.8-1.1-8-4.5-8-9V6z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
)

export const Lightbulb = ({ size = 20 }) => (
  <svg {...base(size)}>
    <path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1.1 2.1h4.8c.1-.9.5-1.6 1.1-2.1A6 6 0 0 0 12 3z" />
  </svg>
)

export const Instagram = ({ size = 20 }) => (
  <svg {...base(size)}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
  </svg>
)

export const LinkedIn = ({ size = 20 }) => (
  <svg {...base(size)}>
    <rect x="3" y="3" width="18" height="18" rx="4" />
    <path d="M8 10.5V17M8 7.2v.1" />
    <path d="M12 17v-3.6c0-1.1.9-2 2-2s2 .9 2 2V17M12 13.2v-.7" />
  </svg>
)

export const XIcon = ({ size = 20 }) => (
  <svg {...base(size)}>
    <path d="M4 4l16 16M20 4L4 20" />
  </svg>
)

export const Github = ({ size = 20 }) => (
  <svg {...base(size)}>
    <path d="M12 3a9 9 0 0 0-2.9 17.6c.5.1.6-.2.6-.5v-1.7c-2.6.6-3.1-1.2-3.1-1.2-.4-1.1-1-1.4-1-1.4-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.9.8.1-.6.3-1.1.6-1.3-2.1-.2-4.4-1.1-4.4-4.8 0-1.1.4-1.9 1-2.6 0-.2-.4-1.1.1-2.3 0 0 .8-.2 2.6 1a9.3 9.3 0 0 1 4.7 0c1.8-1.2 2.6-1 2.6-1 .5 1.2.2 2.1.1 2.3.6.7 1 1.5 1 2.6 0 3.8-2.3 4.6-4.4 4.8.3.3.6.9.6 1.8v2.7c0 .3.1.6.6.5A9 9 0 0 0 12 3z" />
  </svg>
)

export const WhatsApp = ({ size = 20 }) => (
  <svg {...base(size)} viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
)

