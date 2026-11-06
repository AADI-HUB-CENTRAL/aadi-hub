import { Link } from 'react-router-dom'
import { publicMediaUrl } from '../../../features/profile/profileApi.js'
import { getCoverComponent } from '../../../components/dashboard/CoverDesigns.jsx'
import { Avatar, Badge } from '../../ui/kit.jsx'
import { Pencil, Eye, IdCard } from '../../ui/icons.jsx'
import {
  ArrowUpRight, Briefcase, Camera, Code, Github, Globe, Graduation,
  LinkedIn, MapPin, Rocket, Share,
} from '../../../components/ui/Icons.jsx'
import '../../styles/profile-linkedin.css'

/* ---------------------------------------------------------------------------
   ProfileView — one LinkedIn-style profile used everywhere.
   The owner sees edit affordances; a visitor gets the same read-only layout.
--------------------------------------------------------------------------- */

const SKILL_LEVEL_ORDER = ['Beginner', 'Intermediate', 'Advanced']

const STATUS_LABELS = {
  planning: 'Planning',
  in_progress: 'In progress',
  completed: 'Completed',
  archived: 'Archived',
}

function timeAgo(iso) {
  if (!iso) return ''
  const then = new Date(iso).getTime()
  if (Number.isNaN(then)) return ''
  const seconds = Math.max(0, Math.floor((Date.now() - then) / 1000))
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d`
  const months = Math.floor(days / 30)
  if (months < 12) return `${months}mo`
  return `${Math.floor(months / 12)}y`
}

function completion(profile) {
  const checks = [
    Boolean(profile.full_name?.trim()),
    Boolean(profile.headline?.trim()),
    Boolean(profile.bio?.trim()),
    Boolean(profile.avatar_path),
    Boolean(profile.college?.trim()),
    Boolean(profile.location?.trim()),
    (profile.skills?.length || 0) > 0,
    (profile.interests?.length || 0) > 0,
    Boolean(profile.github_url || profile.portfolio_url || profile.linkedin_url),
  ]
  const done = checks.filter(Boolean).length
  return Math.round((done / checks.length) * 100)
}

const LINK_ITEMS = [
  { key: 'github_url', label: 'GitHub', Icon: Github },
  { key: 'portfolio_url', label: 'Portfolio', Icon: Globe },
  { key: 'linkedin_url', label: 'LinkedIn', Icon: LinkedIn },
]

function SectionHead({ title, icon, isOwner, onEdit, editLabel }) {
  return (
    <div className="lp-section__head">
      <h2 className="lp-section__title">
        {icon}
        {title}
      </h2>
      {isOwner && onEdit && (
        <button
          type="button"
          className="lp-edit-btn"
          onClick={onEdit}
          aria-label={editLabel || `Edit ${title}`}
        >
          <Pencil size={15} />
        </button>
      )}
    </div>
  )
}

function EmptyLine({ children }) {
  return <p className="lp-section__empty">{children}</p>
}

export default function ProfileView({
  profile,
  isOwner = false,
  projects = [],
  onEdit,
  onEditCover,
  onChangePhoto,
  onShare,
  viewerIsOwner = false,
}) {
  const p = profile
  const avatar = publicMediaUrl(p.avatar_path)
  const links = LINK_ITEMS
    .map(item => ({ ...item, url: p[item.key] }))
    .filter(item => Boolean(item.url))

  const skills = [...(p.skills || [])].sort(
    (a, b) =>
      SKILL_LEVEL_ORDER.indexOf(p.skill_levels?.[b] || 'Beginner') -
      SKILL_LEVEL_ORDER.indexOf(p.skill_levels?.[a] || 'Beginner'),
  )

  const currently = [
    { label: 'Building', value: p.building },
    { label: 'Learning', value: p.learning },
    { label: 'Exploring', value: p.exploring },
    { label: 'Looking for', value: p.looking_for },
    { label: 'Open to', value: p.open_to },
  ].filter(item => item.value)

  const educationBits = [
    [p.course, p.department].filter(Boolean).join(', '),
    p.study_year,
    p.graduation_year ? `Class of ${p.graduation_year}` : '',
  ].filter(Boolean)

  const hasEducation = Boolean(
    p.college || p.course || p.department || p.study_year || p.graduation_year,
  )

  const pct = completion(p)
  const publicUrl = p.aadi_id ? `/u/${p.aadi_id}` : '#'

  const coverIsCustom = p.cover_type === 'custom' && p.cover_value
  const CoverArt = getCoverComponent(p.cover_value || 'cover-01')

  const editSection = (key) => { if (isOwner && onEdit) onEdit(key) }

  return (
    <div className="lp-page">
      <div className="lp-layout">
        <div className="lp-main">
          {/* ------------------------------- hero ------------------------------- */}
          <section className="lp-hero">
            <div className="lp-hero__cover">
              {coverIsCustom ? (
                <img
                  className="lp-hero__cover-img"
                  src={publicMediaUrl(p.cover_value)}
                  alt=""
                />
              ) : (
                <div className="lp-hero__cover-art"><CoverArt /></div>
              )}

              {isOwner && onEditCover && (
                <button type="button" className="lp-hero__cover-edit" onClick={onEditCover}>
                  <Camera size={15} />
                  Edit cover
                </button>
              )}
            </div>

            <div className="lp-hero__body">
              <div className="lp-hero__avatar-row">
                <div className="lp-hero__avatar">
                  <Avatar src={avatar} name={p.full_name} size={132} />
                  {isOwner && onChangePhoto && (
                    <button
                      type="button"
                      className="lp-hero__avatar-btn"
                      onClick={onChangePhoto}
                      aria-label="Change profile photo"
                    >
                      <Camera size={16} />
                    </button>
                  )}
                </div>

                <div className="lp-hero__actions">
                  {isOwner ? (
                    <>
                      <button
                        type="button"
                        className="p-btn p-btn--primary p-btn--sm"
                        onClick={() => editSection('identity')}
                      >
                        <Pencil size={14} />
                        Edit profile
                      </button>
                      {onShare && (
                        <button
                          type="button"
                          className="p-btn p-btn--secondary p-btn--sm"
                          onClick={onShare}
                        >
                          <Share size={14} />
                          Share
                        </button>
                      )}
                      {p.aadi_id && (
                        <Link
                          to={publicUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-btn p-btn--ghost p-btn--sm"
                        >
                          <Eye size={14} />
                          View public
                        </Link>
                      )}
                    </>
                  ) : (
                    onShare && (
                      <button
                        type="button"
                        className="p-btn p-btn--secondary p-btn--sm"
                        onClick={onShare}
                      >
                        <Share size={14} />
                        Share profile
                      </button>
                    )
                  )}
                </div>
              </div>

              <div className="lp-hero__info">
                <div className="lp-hero__titleline">
                  <h1 className="lp-hero__name">{p.full_name}</h1>
                  {p.aadi_id && <Badge tone="kiwi">{p.aadi_id}</Badge>}
                  {p.is_public === false && <Badge tone="warn">Restricted</Badge>}
                </div>

                {p.headline ? (
                  <p className="lp-tagline">{p.headline}</p>
                ) : (
                  <p className="lp-tagline lp-tagline--empty">
                    {isOwner ? 'Add a headline so people know what you build.' : 'No headline yet.'}
                  </p>
                )}

                {(p.location || p.college || links.length > 0) && (
                  <p className="lp-hero__meta">
                    {p.location && (
                      <span className="lp-hero__meta-item">
                        <MapPin size={14} />
                        {p.location}
                      </span>
                    )}
                    {p.location && p.college && <span className="lp-hero__meta-dot" />}
                    {p.college && (
                      <span className="lp-hero__meta-item">
                        <Graduation size={14} />
                        {p.college}
                      </span>
                    )}
                    {links.length > 0 && (
                      <>
                        <span className="lp-hero__meta-dot" />
                        <a href="#lp-links">Contact info</a>
                      </>
                    )}
                  </p>
                )}

                {(p.roles?.length > 0 || p.looking_for) && (
                  <div className="lp-hero__chips">
                    {p.roles?.map(role => (
                      <span key={role} className="lp-role">{role}</span>
                    ))}
                    {p.looking_for && (
                      <span className="lp-open">
                        <span className="lp-open__dot" />
                        Open to {p.looking_for}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* ------------------------------- about ------------------------------ */}
          <section className="lp-card">
            <SectionHead
              title="About"
              isOwner={isOwner}
              onEdit={isOwner ? () => editSection('about') : undefined}
            />
            {p.bio ? (
              <p className="lp-section__body lp-about__bio">{p.bio}</p>
            ) : (
              <EmptyLine>
                {isOwner
                  ? 'Tell people what you are building, learning and looking for.'
                  : 'No about section yet.'}
              </EmptyLine>
            )}

            {currently.length > 0 && (
              <div className="lp-currently">
                {currently.map(item => (
                  <div key={item.label} className="lp-currently__item">
                    <span className="lp-currently__label">{item.label}</span>
                    <span className="lp-currently__value">{item.value}</span>
                  </div>
                ))}
              </div>
            )}

            {isOwner && !p.bio && currently.length === 0 && (
              <button
                type="button"
                className="lp-text-btn"
                style={{ marginTop: 10 }}
                onClick={() => editSection('about')}
              >
                Add an about section
              </button>
            )}
          </section>

          {/* ----------------------------- education ---------------------------- */}
          {(hasEducation || isOwner) && (
            <section className="lp-card">
              <SectionHead
                title="Education"
                icon={<Graduation size={17} />}
                isOwner={isOwner}
                onEdit={isOwner ? () => editSection('education') : undefined}
              />
              {hasEducation ? (
                <div className="lp-edu">
                  <span className="lp-edu__icon"><Graduation size={22} /></span>
                  <div>
                    <p className="lp-edu__school">{p.college || 'Your institution'}</p>
                    {educationBits.length > 0 && (
                      <p className="lp-edu__degree">{educationBits.join(' · ')}</p>
                    )}
                    {p.location && <p className="lp-edu__meta">{p.location}</p>}
                  </div>
                </div>
              ) : (
                <EmptyLine>Add your college and course to show where you study.</EmptyLine>
              )}
              {isOwner && !hasEducation && (
                <button
                  type="button"
                  className="lp-text-btn"
                  style={{ marginTop: 10 }}
                  onClick={() => editSection('education')}
                >
                  Add education
                </button>
              )}
            </section>
          )}

          {/* ------------------------------ skills ------------------------------ */}
          {(skills.length > 0 || p.interests?.length > 0 || p.goals?.length > 0 || isOwner) && (
            <section className="lp-card">
              <SectionHead
                title="Skills & interests"
                icon={<Code size={17} />}
                isOwner={isOwner}
                onEdit={isOwner ? () => editSection('skills') : undefined}
              />

              {skills.length > 0 ? (
                <div className="lp-skills">
                  {skills.map(skill => (
                    <span className="lp-skill" key={skill}>
                      {skill}
                      <span className="lp-skill__level">
                        {p.skill_levels?.[skill] || 'Beginner'}
                      </span>
                    </span>
                  ))}
                </div>
              ) : (
                <EmptyLine>No skills added yet.</EmptyLine>
              )}

              {p.interests?.length > 0 && (
                <>
                  <p className="lp-subhead">Interests</p>
                  <div className="lp-chips">
                    {p.interests.map(item => (
                      <span className="lp-chip" key={item}>{item}</span>
                    ))}
                  </div>
                </>
              )}

              {p.goals?.length > 0 && (
                <>
                  <p className="lp-subhead">Goals</p>
                  <div className="lp-chips">
                    {p.goals.map(item => (
                      <span className="lp-chip" key={item}>{item}</span>
                    ))}
                  </div>
                </>
              )}

              {isOwner && skills.length === 0 && (
                <button
                  type="button"
                  className="lp-text-btn"
                  style={{ marginTop: 10 }}
                  onClick={() => editSection('skills')}
                >
                  Add skills
                </button>
              )}
            </section>
          )}

          {/* ------------------------------ projects ---------------------------- */}
          {(projects.length > 0 || isOwner) && (
            <section className="lp-card">
              <SectionHead
                title="Projects"
                icon={<Rocket size={17} />}
                isOwner={false}
              />
              {projects.length > 0 ? (
                <div className="lp-projects">
                  {projects.map(project => (
                    <Link
                      className="lp-project"
                      key={project.id}
                      to={`/projects/${project.id}`}
                    >
                      <div className="lp-project__top">
                        <span className="lp-project__title">{project.title}</span>
                        <span className="lp-project__status">
                          {STATUS_LABELS[project.status] || project.status}
                        </span>
                      </div>
                      {project.description && (
                        <p className="lp-project__desc">{project.description}</p>
                      )}
                      {(project.technologies?.length > 0 || project.created_at) && (
                        <div className="lp-project__tags">
                          {project.technologies?.slice(0, 6).map(tech => (
                            <span className="lp-project__tag" key={tech}>{tech}</span>
                          ))}
                          {project.created_at && (
                            <span className="lp-project__tag">{timeAgo(project.created_at)}</span>
                          )}
                        </div>
                      )}
                    </Link>
                  ))}
                </div>
              ) : (
                <EmptyLine>No public projects yet.</EmptyLine>
              )}
              {isOwner && projects.length === 0 && (
                <Link to="/projects/new" className="lp-text-btn" style={{ marginTop: 10, display: 'inline-block' }}>
                  Start a project
                </Link>
              )}
            </section>
          )}
        </div>

        {/* -------------------------------- sidebar ----------------------------- */}
        <aside className="lp-side">
          {isOwner && (
            <section className="lp-card lp-side-card">
              <h2 className="lp-side-card__title">Profile strength</h2>
              <div className="lp-strength__row">
                <span className="lp-strength__label">Your profile is</span>
                <span className="lp-strength__pct">{pct}%</span>
              </div>
              <div className="lp-strength__bar">
                <div className="lp-strength__fill" style={{ width: `${pct}%` }} />
              </div>
              <p className="lp-strength__hint">
                {pct >= 100
                  ? 'Complete. People have everything they need to reach you.'
                  : 'Add a photo, headline, about section and links to complete your profile.'}
              </p>
            </section>
          )}

          {(p.collab_prefs?.length > 0 || p.looking_for || isOwner) && (
            <section className="lp-card lp-side-card">
              <h2 className="lp-side-card__title">Open to</h2>
              {p.collab_prefs?.length > 0 ? (
                <div className="lp-chips">
                  {p.collab_prefs.map(item => (
                    <span className="lp-chip" key={item}>{item}</span>
                  ))}
                </div>
              ) : (
                <p className="lp-section__empty">
                  {isOwner
                    ? 'Add collaboration preferences from Edit profile.'
                    : 'Not specified.'}
                </p>
              )}
              {p.looking_for && (
                <p className="lp-section__body" style={{ marginTop: 12, fontSize: 13.5 }}>
                  {p.looking_for}
                </p>
              )}
            </section>
          )}

          {links.length > 0 && (
            <section className="lp-card lp-side-card" id="lp-links">
              <h2 className="lp-side-card__title">Contact info</h2>
              <div className="lp-side-list">
                {links.map(item => (
                  <a
                    key={item.key}
                    className="lp-side-link"
                    href={item.url}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    <item.Icon size={16} />
                    <span className="lp-side-link__label">{item.label}</span>
                    <ArrowUpRight size={14} />
                  </a>
                ))}
              </div>
            </section>
          )}

          <section className="lp-card lp-side-card">
            <h2 className="lp-side-card__title">AADI identity</h2>
            <div className="lp-idcard">
              <span className="lp-idcard__mark"><IdCard size={22} /></span>
              <div>
                <p className="lp-idcard__id">{p.aadi_id}</p>
                <p className="lp-idcard__note">Verified student on AADI HUB</p>
              </div>
            </div>
            {isOwner && (
              <Link to="/aadi-id" className="p-btn p-btn--secondary p-btn--sm p-btn--full">
                <IdCard size={15} />
                View AADI ID card
              </Link>
            )}
          </section>

          {isOwner && p.aadi_id && (
            <section className="lp-card lp-side-card">
              <h2 className="lp-side-card__title">Public profile &amp; URL</h2>
              <a
                className="lp-public-url"
                href={publicUrl}
                target="_blank"
                rel="noreferrer"
              >
                /u/{p.aadi_id}
              </a>
              <p className="lp-strength__hint" style={{ marginTop: 8 }}>
                Anyone with this link can view your profile when it is set to public.
              </p>
            </section>
          )}

          {!isOwner && !viewerIsOwner && (
            <section className="lp-card lp-side-card">
              <h2 className="lp-side-card__title">Explore AADI HUB</h2>
              <p className="lp-section__empty" style={{ marginBottom: 12 }}>
                Build projects, find teammates and grow with students across India.
              </p>
              <Link to="/register" className="p-btn p-btn--primary p-btn--sm p-btn--full">
                <Briefcase size={15} />
                Join AADI HUB
              </Link>
            </section>
          )}
        </aside>
      </div>
    </div>
  )
}
