import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext.jsx'
import { useToast } from '../../../context/ToastContext.jsx'
import {
  fetchProject, createProject, updateProject,
  PROJECT_CATEGORIES, PROJECT_STATUSES, COLLAB_ROLES,
} from '../../../features/projects/projectsApi.js'
import {
  Button, Field, TextInput, TextArea, Select, Chip, InlineError, Spinner, PageState,
} from '../../ui/kit.jsx'

/* ---------------------------------------------------------------------------
   Project create / edit form. Validation comes from projectsApi (single
   source of truth) and server errors surface inline.
--------------------------------------------------------------------------- */

const empty = {
  title: '', description: '', category: '',
  technologies: [], roles_needed: [], skills_needed: [],
  status: 'planning', repo_url: '', demo_url: '', visibility: 'public',
}

export default function ProjectFormPage() {
  const { id } = useParams()                 // present only when editing
  const editing = Boolean(id)
  const navigate = useNavigate()
  const { user, profile } = useAuth()
  const toast = useToast()

  const [form, setForm] = useState(empty)
  const [errors, setErrors] = useState({})
  const [pageError, setPageError] = useState('')
  const [loading, setLoading] = useState(editing)
  const [saving, setSaving] = useState(false)
  const [techDraft, setTechDraft] = useState('')

  useEffect(() => {
    if (!editing) return undefined
    let active = true
    fetchProject(id).then(({ data, error }) => {
      if (!active) return
      if (error || !data) {
        setPageError('This project could not be loaded for editing. It may have been deleted.')
        setLoading(false)
        return
      }
      if (data.owner_id !== user?.id) {
        setPageError('Only the project owner can edit it.')
        setLoading(false)
        return
      }
      setForm({
        title: data.title || '',
        description: data.description || '',
        category: data.category || '',
        technologies: data.technologies || [],
        roles_needed: data.roles_needed || [],
        skills_needed: data.skills_needed || [],
        status: PROJECT_STATUSES.some(s => s.value === data.status) ? data.status : 'planning',
        repo_url: data.repo_url || '',
        demo_url: data.demo_url || '',
        visibility: data.visibility || 'public',
      })
      setLoading(false)
    })
    return () => { active = false }
  }, [editing, id, user?.id])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  function toggle(key, value) {
    setForm(f => ({
      ...f,
      [key]: f[key].includes(value) ? f[key].filter(x => x !== value) : [...f[key], value],
    }))
  }

  function addTech() {
    const v = techDraft.trim().slice(0, 40)
    if (!v || form.technologies.includes(v)) return
    set('technologies', [...form.technologies, v])
    setTechDraft('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setPageError('')
    if (saving) return

    const payload = {
      title: form.title,
      description: form.description,
      category: form.category,
      technologies: form.technologies,
      roles_needed: form.roles_needed,
      skills_needed: form.skills_needed,
      status: form.status,
      repo_url: form.repo_url,
      demo_url: form.demo_url,
      visibility: form.visibility,
    }

    setSaving(true)
    const { data, error } = editing
      ? await updateProject(id, payload)
      : await createProject(user.id, payload)
    setSaving(false)

    if (error) {
      if (error.fields) setErrors(error.fields)
      setPageError(error.message || 'Could not save the project.')
      return
    }
    toast.success(editing ? 'Project updated.' : 'Project created.')
    navigate(`/projects/${data.id}`, { replace: true })
  }

  if (loading) return <Spinner label="Loading project…" />

  if (pageError && editing && !form.title) {
    return (
      <PageState title="Cannot edit this project." body={pageError}
        action={<Link to="/projects" className="p-btn p-btn--secondary p-btn--md">Back to projects</Link>} />
    )
  }

  return (
    <div>
      <Link to={editing ? `/projects/${id}` : '/projects'} className="detail-back">
        {editing ? '← Back to project' : '← All projects'}
      </Link>

      <div className="page-head" style={{ marginTop: 14 }}>
        <div>
          <h1 className="page-head__title">{editing ? 'Edit project' : 'Start a project'}</h1>
          <p className="page-head__sub">
            {editing
              ? 'Changes apply immediately to everyone who can see this project.'
              : 'Describe what you are building so the right teammates can request to join. You stay in control of approvals.'}
          </p>
        </div>
      </div>

      <form className="form-grid" onSubmit={handleSubmit} noValidate>
        <InlineError>{pageError}</InlineError>

        <Field label="Project title" required error={errors.title}>
          {({ id: fid }) => (
            <TextInput id={fid} value={form.title} onChange={e => set('title', e.target.value)}
              placeholder="e.g. Campus study-group matcher" maxLength={120} error={errors.title} />
          )}
        </Field>

        <Field label="What is it?" error={errors.description}
          hint="What does it do, and what stage is it at? Optional but strongly recommended.">
          {({ id: fid }) => (
            <TextArea id={fid} rows={5} value={form.description} onChange={e => set('description', e.target.value)}
              placeholder="A short description of the problem and your approach…" maxLength={2000} />
          )}
        </Field>

        <div className="form-grid--2">
          <Field label="Category" error={errors.category}>
            {({ id: fid }) => (
              <Select id={fid} value={form.category} onChange={e => set('category', e.target.value)}
                placeholder="Choose a category"
                options={PROJECT_CATEGORIES.map(c => ({ value: c, label: c }))} />
            )}
          </Field>
          <Field label="Status">
            {({ id: fid }) => (
              <Select id={fid} value={form.status} onChange={e => set('status', e.target.value)}
                options={PROJECT_STATUSES} />
            )}
          </Field>
        </div>

        <div>
          <p className="form-section-title" style={{ marginBottom: 8 }}>Roles you are looking for</p>
          <div className="chip-cloud">
            {COLLAB_ROLES.map(r => (
              <Chip key={r} label={r} selected={form.roles_needed.includes(r)}
                onToggle={() => toggle('roles_needed', r)} />
            ))}
          </div>
        </div>

        <div>
          <p className="form-section-title" style={{ marginBottom: 8 }}>Skills needed</p>
          <div className="chip-cloud">
            {['Python', 'JavaScript', 'React', 'UI/UX Design', 'AI / ML', 'Data', 'Writing', 'Marketing'].map(s => (
              <Chip key={s} label={s} selected={form.skills_needed.includes(s)}
                onToggle={() => toggle('skills_needed', s)} />
            ))}
          </div>
        </div>

        <div>
          <p className="form-section-title" style={{ marginBottom: 8 }}>Technologies</p>
          {form.technologies.length > 0 && (
            <div className="chip-cloud" style={{ marginBottom: 10 }}>
              {form.technologies.map(t => (
                <Chip key={t} label={t} selected onToggle={() => toggle('technologies', t)} removable
                  onRemove={() => toggle('technologies', t)} />
              ))}
            </div>
          )}
          <div className="custom-add">
            <TextInput value={techDraft} onChange={e => setTechDraft(e.target.value)}
              placeholder="e.g. Vite, Supabase, Flutter"
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTech() } }} />
            <Button variant="secondary" type="button" onClick={addTech} disabled={!techDraft.trim()}>Add</Button>
          </div>
        </div>

        <div className="form-grid--2">
          <Field label="Repository URL" error={errors.repo_url} hint="Optional — must start with http(s)://">
            {({ id: fid }) => (
              <TextInput id={fid} type="url" value={form.repo_url} onChange={e => set('repo_url', e.target.value)}
                placeholder="https://github.com/…" error={errors.repo_url} />
            )}
          </Field>
          <Field label="Live demo URL" error={errors.demo_url} hint="Optional — must start with http(s)://">
            {({ id: fid }) => (
              <TextInput id={fid} type="url" value={form.demo_url} onChange={e => set('demo_url', e.target.value)}
                placeholder="https://…" error={errors.demo_url} />
            )}
          </Field>
        </div>

        <Field label="Visibility"
          hint="Private projects are visible only to you and approved members. Private projects never appear in the directory.">
          {({ id: fid }) => (
            <Select id={fid} value={form.visibility} onChange={e => set('visibility', e.target.value)}
              options={[{ value: 'public', label: 'Public — listed in the directory' },
                        { value: 'private', label: 'Private — members only' }]} />
          )}
        </Field>

        <div className="form-actions">
          <Link to={editing ? `/projects/${id}` : '/projects'} className="p-btn p-btn--ghost p-btn--md">Cancel</Link>
          <Button type="submit" loading={saving}>
            {editing ? 'Save changes' : 'Create project'}
          </Button>
        </div>
      </form>
    </div>
  )
}
