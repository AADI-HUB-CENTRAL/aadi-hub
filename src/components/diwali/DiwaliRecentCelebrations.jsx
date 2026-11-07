import { useEffect, useMemo, useState } from 'react'
import { Rangoli } from './DiwaliHeroDecorations.jsx'
import {
  DIWALI_CELEBRATION_LIMIT,
  fetchDiwaliCelebrations,
  subscribeToDiwaliCelebrations,
} from '../../lib/diwaliCelebrations.js'

const MIN_LOOP_ITEMS = 6
const REFRESH_INTERVAL_MS = 15000

const CONFETTI = [
  { left: '6%', top: '16%', size: 6, duration: 6.2, delay: 0.4 },
  { left: '16%', top: '72%', size: 4, duration: 5.4, delay: 1.8 },
  { left: '32%', top: '10%', size: 5, duration: 7.1, delay: 3.1 },
  { left: '48%', top: '80%', size: 7, duration: 4.8, delay: 0.9 },
  { left: '66%', top: '14%', size: 4, duration: 6.6, delay: 2.4 },
  { left: '81%', top: '68%', size: 6, duration: 5.8, delay: 1.2 },
  { left: '93%', top: '28%', size: 5, duration: 6.9, delay: 3.6 },
]

function mergeCelebrations(entries, ownCelebration) {
  const byId = new Map()

  if (ownCelebration) {
    byId.set(ownCelebration.id, ownCelebration)
  }

  entries.forEach((entry) => {
    if (!byId.has(entry.id)) {
      byId.set(entry.id, entry)
    }
  })

  return Array.from(byId.values()).sort((first, second) => {
    const firstTime = Date.parse(first.created_at) || 0
    const secondTime = Date.parse(second.created_at) || 0
    return secondTime - firstTime
  })
}

function buildLoopItems(entries) {
  if (entries.length === 0) return []

  const repeats =
    entries.length >= MIN_LOOP_ITEMS
      ? 1
      : Math.ceil(MIN_LOOP_ITEMS / entries.length)

  return Array.from({ length: repeats }, () => entries).flat()
}

export default function DiwaliRecentCelebrations({
  ownCelebration = null,
  refreshKey = 0,
}) {
  const [entries, setEntries] = useState([])
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    let cancelled = false
    let intervalId = 0
    let unsubscribeRealtime = () => {}

    const load = async ({ showLoading = false } = {}) => {
      if (showLoading && !cancelled) {
        setStatus((current) => (current === 'ready' ? current : 'loading'))
      }

      const result = await fetchDiwaliCelebrations()

      if (cancelled) return

      if (result.entries.length > 0) {
        setEntries(result.entries)
      }

      if (result.unavailable) {
        setStatus('unavailable')
      } else if (result.error) {
        setStatus('error')
      } else {
        setEntries(result.entries)
        setStatus('ready')
      }
    }

    load({ showLoading: true })

    unsubscribeRealtime = subscribeToDiwaliCelebrations({
      onInsert: (entry) => {
        if (cancelled) return

        setEntries((current) => {
          if (current.some((item) => item.id === entry.id)) {
            return current
          }

          const next = [entry, ...current]
          next.sort((first, second) => {
            const firstTime = Date.parse(first.created_at) || 0
            const secondTime = Date.parse(second.created_at) || 0
            return secondTime - firstTime
          })

          return next.slice(0, DIWALI_CELEBRATION_LIMIT)
        })
        setStatus('ready')
      },
      onError: () => {
        if (!cancelled) {
          // Keep polling as fallback when realtime cannot connect.
          setStatus((current) => (current === 'ready' ? current : 'error'))
        }
      },
    })

    intervalId = window.setInterval(() => {
      if (document.visibilityState === 'visible') {
        load()
      }
    }, REFRESH_INTERVAL_MS)

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        load()
      }
    }

    document.addEventListener('visibilitychange', handleVisibility)
    window.addEventListener('focus', handleVisibility)
    window.addEventListener('online', handleVisibility)

    return () => {
      cancelled = true
      unsubscribeRealtime()
      window.clearInterval(intervalId)
      document.removeEventListener('visibilitychange', handleVisibility)
      window.removeEventListener('focus', handleVisibility)
      window.removeEventListener('online', handleVisibility)
    }
  }, [refreshKey])

  const celebrations = useMemo(
    () => mergeCelebrations(entries, ownCelebration),
    [entries, ownCelebration]
  )

  const loopItems = useMemo(() => buildLoopItems(celebrations), [celebrations])

  const duration = Math.min(
    120,
    Math.max(20, loopItems.length * 4.2)
  )

  const hasCelebrations = celebrations.length > 0
  const isWaiting = !hasCelebrations && status === 'loading'

  return (
    <section className="dw-recent" aria-labelledby="dw-recent-title">
      <div className="dw-recent__ambient" aria-hidden="true">
        <div className="dw-recent__glow dw-recent__glow--gold" />
        <div className="dw-recent__glow dw-recent__glow--violet" />

        <div className="dw-recent__rangoli dw-recent__rangoli--left">
          <Rangoli className="dw-recent__rangoli-svg" />
        </div>
        <div className="dw-recent__rangoli dw-recent__rangoli--right">
          <Rangoli className="dw-recent__rangoli-svg" />
        </div>

        <div className="dw-recent__confetti">
          {CONFETTI.map((sparkle, index) => (
            <span
              key={index}
              className="dw-recent__sparkle"
              style={{
                left: sparkle.left,
                top: sparkle.top,
                '--s': `${sparkle.size}px`,
                '--dur': `${sparkle.duration}s`,
                '--delay': `${sparkle.delay}s`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="dw-recent__inner">
        <header className="dw-recent__head">
          <span className="dw-recent__eyebrow">AADI HUB &middot; Diwali Family</span>
          <h2 className="dw-recent__title" id="dw-recent-title">
            Recent Celebrations by Family
          </h2>
          <p className="dw-recent__subtitle">
            Celebrating Diwali together with the AADI HUB family.
          </p>
        </header>

        {isWaiting && (
          <div className="dw-recent__empty" role="status">
            <span className="dw-recent__empty-diya" aria-hidden="true">
              &#129684;
            </span>
            <p>Gathering the celebrations&hellip;</p>
          </div>
        )}

        {!isWaiting && !hasCelebrations && (
          <div className="dw-recent__empty" role="status">
            <span className="dw-recent__empty-diya" aria-hidden="true">
              &#129684;
            </span>
            <p className="dw-recent__empty-title">Be the first to light a diya.</p>
            <p className="dw-recent__empty-text">
              {status === 'unavailable'
                ? 'Celebration wall setup is in progress. Please try again in a moment.'
                : 'Your name will appear here with the rest of the AADI HUB family.'}
            </p>
          </div>
        )}

        {hasCelebrations && (
          <div
            className="dw-recent__marquee"
            style={{ '--dw-recent-duration': `${duration}s` }}
          >
            <div className="dw-recent__track">
              {[0, 1].map((pass) => (
                <div
                  className="dw-recent__group"
                  key={pass}
                  aria-hidden={pass === 0 ? undefined : 'true'}
                  inert={pass === 0 ? undefined : true}
                >
                  {loopItems.map((entry, index) => {
                    const isOwn = ownCelebration && entry.id === ownCelebration.id

                    return (
                      <p
                        className={`dw-recent__item${isOwn ? ' is-own' : ''}`}
                        key={`${pass}-${entry.id}-${index}`}
                      >
                        <span className="dw-recent__item-diya" aria-hidden="true">
                          &#129684;
                        </span>
                        <span className="dw-recent__item-text">
                          <strong className="dw-recent__name">
                            {entry.display_name}
                          </strong>{' '}
                          celebrated Diwali with AADI HUB
                        </span>
                        <span className="dw-recent__item-star" aria-hidden="true">
                          &#10022;
                        </span>
                      </p>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        )}

        <p className="dw-recent__note">
          {status === 'error'
            ? 'Connection is unstable. We are retrying automatically.'
            : ownCelebration
              ? 'You are part of the AADI HUB Diwali family.'
              : 'Every celebration adds a little more light.'}
        </p>
      </div>
    </section>
  )
}
