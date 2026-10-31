import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext.jsx'
import { useToast } from '../../../context/ToastContext.jsx'
import {
  submitOpportunity, OPPORTUNITY_TYPES, OPPORTUNITY_MODES,
} from '../../../features/opportunities/opportunitiesApi.js'
import { Button, Field, TextInput, TextArea, Select, InlineError, InlineSuccess } from '../../ui/kit.jsx'

/* ---------------------------------------------------------------------------
   Student submission form. The row is created as status='pending' with
   is_verified=false (RLS enforces this); the confirmation screen says so
   in plain words instead of pretending the listing went live.
--------------------------------------------------------------------------- */

const empty = {
  title: '', type: 'internship', organization: '', location: '', mode: '',
  eligibility: '', apply_url: '', deadline: '', description: '',
}

export default function SubmitOpportunityPage() {
  const { user, profile, isAuthenticated } = useAuth()
  const toast = useToast()

  const [form, setForm] = useState(empty)
  const [errors, setErrors] = useState({})
  const [pageError, setPageError] = useState('')
  const [saving, setSaving] = useState(false)
  const [submitted, setSubmitted] = useState(null)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  if (!isAuthenticated) {
    return (
      <div>
        <Link to="/opportunities" className="detail-back">← All opportunities</Link>
        <div style={{ marginTop: 20 }}>
          <InlineError>Sign in to submit an opportunity.</InlineError>
        </div>
      </div>
    )
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setPageError('')
    if (saving) return

    setSaving(true)
    const { data, error } = await submitOpportunity(user.id, form)
    setSaving(false)

    if (error) {
      if (error.fields) setErrors(error.fields)
      setPageError(error.message || 'Could not submit the opportunity.')
      return
    }
    setSubmitted(data)
    toast.success('Submitted for review.')
  }

  if (submitted) {
    return (
      <div>
        <Link to="/opportunities" className="detail-back">← All opportunities</Link>
        <div className="page-head" style={{ marginTop: 14 }}>
          <div>
            <h1 className="page-head__title">Submission received</h1>
            <p className="page-head__sub">Here is exactly what happens next.</p>
          </div>
        </div>
        <div className="form-grid">
          <InlineSuccess>
            “{submitted.title}” was saved as a private submission.
          </InlineSuccess>
          <div className="p-card">
            <ol style={{ fontSize: 14, lineHeight: 1.8, paddingLeft: 20, color: 'var(--text-on-dark)' }}>
              <li>It is visible only to you and moderators — not to other students.</li>
              <li>A moderator reviews the details and the application link.</li>
              <li>If it passes review it is published to the hub; you will see the status change in “My submissions”.</li>
              <li>If it is rejected it stays private, and you can delete it yourself.</li>
            </ol>
            <p style={{ fontSize: 13, color: 'var(--muted-on-dark)', marginTop: 14 }}>
              There is no automatic approval, and publishing is not guaranteed.
            </p>
          </div>
          <div className="form-actions" style={{ justifyContent: 'flex-start' }}>
            <Link to="/opportunities" className="p-btn p-btn--primary p-btn--md">Back to opportunities</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Link to="/opportunities" className="detail-back">← All opportunities</Link>

      <div className="page-head" style={{ marginTop: 14 }}>
        <div>
          <h1 className="page-head__title">Submit an opportunity</h1>
          <p className="page-head__sub">
            Share something real with other students. Submissions are reviewed before publication —
            unverified listings never appear in the public hub.
          </p>
        </div>
      </div>

      <form className="form-grid" onSubmit={handleSubmit} noValidate>
        <InlineError>{pageError}</InlineError>

        <div className="p-card" style={{ fontSize: 13, color: 'var(--muted-on-dark)', lineHeight: 1.6 }}>
          Post only opportunities you have verified yourself: check the deadline, the organisation and
          the application link. Fake or promotional submissions will be rejected.
          {profile?.full_name && <> Submitted as <b style={{ color: 'var(--text-on-dark)' }}>{profile.full_name}</b>.</>}
        </div>

        <Field label="Title" required error={errors.title}>
          {({ id }) => (
            <TextInput id={id} value={form.title} onChange={e => set('title', e.target.value)}
              placeholder="e.g. Google Summer of Code 2026" maxLength={160} error={errors.title} />
          )}
        </Field>

        <div className="form-grid--2">
          <Field label="Type" error={errors.type}>
            {({ id }) => (
              <Select id={id} value={form.type} onChange={e => set('type', e.target.value)} options={OPPORTUNITY_TYPES} />
            )}
          </Field>
          <Field label="Mode" hint="Optional">
            {({ id }) => (
              <Select id={id} value={form.mode} onChange={e => set('mode', e.target.value)}
                placeholder="Not specified" options={OPPORTUNITY_MODES} />
            )}
          </Field>
        </div>

        <Field label="Organisation" hint="The company, institution or community running it.">
          {({ id }) => (
            <TextInput id={id} value={form.organization} onChange={e => set('organization', e.target.value)}
              placeholder="e.g. Ministry of Education" maxLength={160} />
          )}
        </Field>

        <div className="form-grid--2">
          <Field label="Location" hint="Optional — city, state or country for on-site roles.">
            {({ id }) => (
              <TextInput id={id} value={form.location} onChange={e => set('location', e.target.value)}
                placeholder="e.g. Bengaluru" maxLength={160} />
            )}
          </Field>
          <Field label="Deadline" error={errors.deadline} hint="Leave empty if there is none.">
            {({ id }) => (
              <TextInput id={id} type="date" value={form.deadline} onChange={e => set('deadline', e.target.value)} />
            )}
          </Field>
        </div>

        <Field label="Application link" error={errors.apply_url}
          hint="Must be a real http(s) URL to the official page — students will click straight through to it.">
          {({ id }) => (
            <TextInput id={id} type="url" value={form.apply_url} onChange={e => set('apply_url', e.target.value)}
              placeholder="https://…" error={errors.apply_url} />
          )}
        </Field>

        <Field label="Who can apply?" hint="Optional — year of study, skills, region, etc.">
          {({ id }) => (
            <TextInput id={id} value={form.eligibility} onChange={e => set('eligibility', e.target.value)}
              placeholder="e.g. Final-year students, any branch" maxLength={300} />
          )}
        </Field>

        <Field label="Description" hint="What is it, what does the student get, and anything they should watch out for.">
          {({ id }) => (
            <TextArea id={id} rows={6} value={form.description} onChange={e => set('description', e.target.value)}
              placeholder="Describe the opportunity…" maxLength={4000} />
          )}
        </Field>

        <div className="form-actions">
          <Link to="/opportunities" className="p-btn p-btn--ghost p-btn--md">Cancel</Link>
          <Button type="submit" loading={saving}>Submit for review</Button>
        </div>
      </form>
    </div>
  )
}
