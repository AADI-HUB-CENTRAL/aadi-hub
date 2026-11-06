import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { publicMediaUrl } from '../../features/profile/profileApi.js'
import { Avatar } from './kit.jsx'
import { ChevronDown, IdCard, LogOut, Settings, User } from './icons.jsx'

/* ---------------------------------------------------------------------------
   Account menu — profile shortcuts, workspace settings and sign out. The public profile lives inside My profile (share / preview) instead of its own menu entry.

   These actions used to sit as loose buttons in the top bar. They now
   live behind one avatar trigger so the application header stays quiet and
   nothing is duplicated across the shell.

   Keyboard and screen-reader behaviour:
     * the trigger is a real button with aria-expanded / aria-haspopup
     * the menu closes on Escape and returns focus to the trigger
     * the menu closes on an outside click
     * menu entries are real links/buttons in DOM order
   --------------------------------------------------------------------------- */

export default function AccountMenu({ variant = 'compact', align = 'right', placement = 'below' }) {
  const { profile, signOut } = useAuth()
  const navigate = useNavigate()

  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)
  const triggerRef = useRef(null)
  const menuRef = useRef(null)

  const name = profile?.full_name || 'Student'
  const aadiId = profile?.aadi_id || ''
  const avatarUrl = profile?.avatar_path ? publicMediaUrl(profile.avatar_path) : null

  // Close when the pointer goes down outside the component.
  useEffect(() => {
    if (!open) return undefined
    function onPointerDown(event) {
      if (rootRef.current && !rootRef.current.contains(event.target)) setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [open])

  // Escape closes and hands focus back to the trigger.
  useEffect(() => {
    if (!open) return undefined
    function onKeyDown(event) {
      if (event.key !== 'Escape') return
      setOpen(false)
      triggerRef.current?.focus()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open])

  // Move focus into the menu when it opens.
  useEffect(() => {
    if (!open) return
    const first = menuRef.current?.querySelector('[role="menuitem"]')
    first?.focus()
  }, [open])

  function toggle() {
    setOpen(o => !o)
  }

  function close() {
    setOpen(false)
    triggerRef.current?.focus()
  }

  async function handleSignOut() {
    setOpen(false)
    await signOut()
    navigate('/', { replace: true })
  }

  const isFull = variant === 'full'

  return (
    <div className={`acct acct--${variant}`} ref={rootRef}>
      <button
        type="button"
        ref={triggerRef}
        className="acct__trigger"
        onClick={toggle}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Account menu for ${name}`}
      >
        <Avatar src={avatarUrl} name={name} size={isFull ? 34 : 32} />
        {isFull && (
          <span className="acct__idblock">
            <span className="acct__name">{name}</span>
            <span className="acct__id">{aadiId || 'AADI ID pending'}</span>
          </span>
        )}
        <ChevronDown size={16} />
      </button>

      {open && (
        <div
          className={`acct__menu acct__menu--${align} acct__menu--${placement}`}
          role="menu"
          aria-label="Account"
          ref={menuRef}
        >
          <div className="acct__head">
            <p className="acct__head-name">{name}</p>
            <p className="acct__head-id">{aadiId || 'AADI ID pending'}</p>
          </div>

          <Link to="/profile" className="acct__item" role="menuitem" onClick={close}>
            <User size={17} />
            <span>My profile</span>
          </Link>

          <Link to="/aadi-id" className="acct__item" role="menuitem" onClick={close}>
            <IdCard size={17} />
            <span>AADI ID card</span>
          </Link>

          <Link to="/settings" className="acct__item" role="menuitem" onClick={close}>
            <Settings size={17} />
            <span>Settings</span>
          </Link>

          <div className="acct__sep" role="separator" />

          <button type="button" className="acct__item acct__item--danger" role="menuitem" onClick={handleSignOut}>
            <LogOut size={17} />
            <span>Sign out</span>
          </button>
        </div>
      )}
    </div>
  )
}
