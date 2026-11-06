/* ============================================================
   AADI Account — localStorage prototype
   ============================================================
   FRONTEND-ONLY prototype. Passwords are NEVER stored.
   A future backend will replace this with real authentication.
   ============================================================ */

const ACCOUNT_KEY = 'aadi_account'

export function saveAccount({ fullName, email }) {
  const account = {
    fullName,
    email,
    accountCreatedAt: new Date().toISOString(),
  }
  localStorage.setItem(ACCOUNT_KEY, JSON.stringify(account))
  return account
}

export function getAccount() {
  try {
    const raw = localStorage.getItem(ACCOUNT_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function hasAccount() {
  return Boolean(getAccount())
}

export function clearAccount() {
  localStorage.removeItem(ACCOUNT_KEY)
}
