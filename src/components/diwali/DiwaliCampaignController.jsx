import { useEffect, useState } from 'react'
import {
  isDiwaliActive,
  msUntilDiwaliTransition,
} from '../../lib/diwaliCampaign.js'
import '../../styles/diwali.css'

export function useDiwaliCampaign() {
  const [active, setActive] = useState(() => isDiwaliActive())

  useEffect(() => {
    let timer

    const sync = () => {
      const now = Date.now()
      setActive(isDiwaliActive(now))

      const remaining = msUntilDiwaliTransition(now)
      if (remaining > 0) {
        timer = window.setTimeout(
          sync,
          Math.min(remaining + 100, 2147483647)
        )
      }
    }

    sync()
    return () => window.clearTimeout(timer)
  }, [])

  return active
}
