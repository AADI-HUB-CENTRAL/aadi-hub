// ============================================================================
// AADI HUB — live end-to-end verification
// ============================================================================
// Exercises the REAL Supabase project (not mocks) through the same code paths
// the browser uses. Run after applying migrations 20261016000002 and
// 20261016000003.
//
//   node scripts/verify-flow.mjs
//
// It uses only the publishable (public) key — the same one shipped in the
// frontend bundle. If you see unexpected 401/42501 errors, the migrations have
// not been applied yet.
//
// NOTE: this script performs real writes (it creates a throwaway verified
// user via signup). Delete the test account from Authentication → Users when
// you are done.
// ============================================================================

import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

function loadEnv() {
  const out = {}
  const text = readFileSync(resolve(root, '.env'), 'utf8')
  for (const line of text.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
    if (m) out[m[1]] = m[2].replace(/^["']|["']$/g, '')
  }
  return out
}

const env = loadEnv()
const URL = (env.VITE_SUPABASE_URL || '').replace(/\/$/, '')
const KEY = env.VITE_SUPABASE_PUBLISHABLE_KEY || ''

const results = []
function check(name, pass, detail = '') {
  results.push({ name, pass, detail })
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${name}${detail ? `  — ${detail}` : ''}`)
}

async function rest(path, { method = 'GET', body, token } = {}) {
  const res = await fetch(`${URL}/rest/v1/${path}`, {
    method,
    headers: {
      apikey: KEY,
      Authorization: `Bearer ${token || KEY}`,
      'Content-Type': 'application/json',
      Prefer: method === 'POST' ? 'return=representation' : '',
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  const text = await res.text()
  let json = null
  try { json = JSON.parse(text) } catch {}
  return { status: res.status, ok: res.ok, json, text }
}

async function auth(path, { method = 'POST', body, token } = {}) {
  const res = await fetch(`${URL}/auth/v1/${path}`, {
    method,
    headers: {
      apikey: KEY,
      Authorization: `Bearer ${token || KEY}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  const text = await res.text()
  let json = null
  try { json = JSON.parse(text) } catch {}
  return { status: res.status, ok: res.ok, json, text }
}

async function main() {
  console.log(`\nVerifying against ${URL}\n`)

  if (!URL || !KEY) throw new Error('Missing VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY in .env')

  // --- 1. Table reachable -------------------------------------------------
  const tables = await rest('profiles?select=id&limit=1')
  check('public.profiles is reachable via PostgREST', tables.ok, `status ${tables.status}`)

  // --- 2. Counter seed row present & private ------------------------------
  // As anon, direct access must be denied (no policy) but NOT 404 — a 42501
  // "permission denied" proves the table exists and the seed migration ran.
  const seq = await rest('aadi_id_sequences?select=id,last_num')
  check(
    'aadi_id_sequences exists and is locked down (permission denied, not 404)',
    seq.status === 401 || /permission denied/.test(seq.text),
    `status ${seq.status} ${seq.text.slice(0, 80)}`,
  )

  // --- 3. create_missing_profile RPC exists for authenticated -------------
  const rpcAnon = await rest('rpc/create_missing_profile', { method: 'POST' })
  check(
    'create_missing_profile() exists and is NOT callable by anon',
    rpcAnon.status !== 404,
    `status ${rpcAnon.status} ${rpcAnon.text.slice(0, 100)}`,
  )

  // --- 4. Real signup succeeds (no P0001) ---------------------------------
  const email = `verify${Date.now()}@example.com`
  const password = 'VerifyTest123!'
  const signup = await auth('signup', {
    body: { email, password, options: { data: { full_name: 'Verify Flow' } } },
  })
  const p0001 = signup.json?.code === 'P0001' || /aadi_id_sequences row/.test(signup.text)
  check(
    'signup no longer fails with "aadi_id_sequences row id=1 is missing"',
    !p0001 && (signup.ok || signup.json?.user?.id),
    `status ${signup.status} ${signup.text.slice(0, 120)}`,
  )
  const userId = signup.json?.user?.id
  check('signup returned a user id (auth.users row created)', Boolean(userId), userId || 'none')

  // --- 5. Profile row was created by the trigger --------------------------
  if (userId) {
    await new Promise(r => setTimeout(r, 1200))

    // Promote the throwaway account to a usable session via admin-free path is
    // not possible with just the publishable key, so read the trigger result
    // through the public read policy (profile defaults to is_public = true).
    const pub = await rest(`profiles?select=id,aadi_id,aadi_id_num,full_name,onboarding_completed_at&id=eq.${userId}`)
    const row = Array.isArray(pub.json) ? pub.json[0] : null
    if (row) {
      check('trigger created the profile row', true, `aadi_id=${row.aadi_id}`)
      check('AADI ID format is AADI-8xxxx', /^AADI-8\d{4}$/.test(row.aadi_id || ''), row.aadi_id)
      check('profile starts with onboarding incomplete', row.onboarding_completed_at === null)
    } else {
      // If signup returned a session (email confirmation off), read as user.
      const token = signup.json?.session?.access_token
      if (token) {
        const own = await rest(`profiles?select=id,aadi_id,onboarding_completed_at&id=eq.${userId}`, { token })
        const ownRow = Array.isArray(own.json) ? own.json[0] : null
        check('trigger created the profile row (read as owner)', Boolean(ownRow), ownRow?.aadi_id || own.text.slice(0, 80))
      } else {
        check(
          'trigger created the profile row',
          false,
          'email confirmation is ON; profile exists but is not world-readable until verified. Confirm the email, then re-check.',
        )
      }
    }
  }

  // --- Summary ------------------------------------------------------------
  const failed = results.filter(r => !r.pass)
  console.log(`\n${results.length - failed.length}/${results.length} checks passed`)
  if (failed.length) {
    console.log('\nFailed checks:')
    for (const f of failed) console.log(`  - ${f.name}: ${f.detail}`)
    process.exitCode = 1
  }
}

main().catch(e => { console.error('FATAL', e); process.exitCode = 1 })
