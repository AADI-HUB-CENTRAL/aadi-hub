import { useCallback, useEffect, useRef, useState } from 'react'
import { useAuth } from '../../../context/AuthContext.jsx'
import { useToast } from '../../../context/ToastContext.jsx'
import {
  updateMyProfile, uploadProfileMedia, validateImageFile,
} from '../../../features/profile/profileApi.js'
import { listMyProjects } from '../../../features/projects/projectsApi.js'
import { shareProfile } from '../../../utils/identity.js'
import { Spinner } from '../../ui/kit.jsx'
import ProfileView from './ProfileView.jsx'
import EditProfileModal from './EditProfileModal.jsx'
import PhotoCropEditor from '../../../components/PhotoCropEditor.jsx'
import CoverSelector from '../../../components/dashboard/CoverSelector.jsx'
import CoverCropper from '../../../components/dashboard/CoverCropper.jsx'

/* ---------------------------------------------------------------------------
   My profile — the signed-in student's profile, not a settings form.
   The page is the same LinkedIn-style view the public sees; editing happens
   in focused modals (profile sections, cover, photo) so the view stays intact.
--------------------------------------------------------------------------- */

function dataUrlToFile(dataUrl, filename) {
  const [meta, base64] = dataUrl.split(',')
  const mime = meta.match(/data:(.*?);base64/)?.[1] || 'image/jpeg'
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i)
  return new File([bytes], filename, { type: mime })
}

export default function MyProfilePage() {
  const { profile, profileStatus, refreshProfile } = useAuth()
  const toast = useToast()

  const photoInputRef = useRef(null)
  const [projects, setProjects] = useState([])
  const [editing, setEditing] = useState(null)
  const [photoSrc, setPhotoSrc] = useState(null)
  const [coverPickerOpen, setCoverPickerOpen] = useState(false)
  const [coverCropSrc, setCoverCropSrc] = useState(null)
  const [mediaBusy, setMediaBusy] = useState(false)

  const loadProjects = useCallback(async () => {
    if (!profile?.id) return
    const { data } = await listMyProjects(profile.id, { limit: 12 })
    setProjects(data || [])
  }, [profile?.id])

  useEffect(() => { loadProjects() }, [loadProjects])

  function openPhotoPicker() {
    photoInputRef.current?.click()
  }

  function handlePhotoPick(event) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    const invalid = validateImageFile(file)
    if (invalid) { toast.error(invalid); return }
    setPhotoSrc(URL.createObjectURL(file))
  }

  function closePhotoEditor() {
    if (photoSrc) URL.revokeObjectURL(photoSrc)
    setPhotoSrc(null)
  }

  async function saveMedia(patch, message) {
    setMediaBusy(true)
    const { error } = await updateMyProfile(profile.id, patch)
    setMediaBusy(false)
    if (error) {
      toast.error(error.message || 'Could not save your photo.')
      return false
    }
    await refreshProfile()
    toast.success(message)
    return true
  }

  async function handlePhotoApply(dataUrl) {
    const file = dataUrlToFile(dataUrl, `avatar-${Date.now()}.jpg`)
    const { path, error } = await uploadProfileMedia(profile.id, file, 'avatar')
    if (error) {
      toast.error('Photo upload failed. Please try again.')
      return
    }
    const saved = await saveMedia({ avatar_path: path }, 'Profile photo updated.')
    if (saved) closePhotoEditor()
  }

  function handleCoverSelect(cover) {
    setCoverPickerOpen(false)
    if (!cover) return
    saveMedia({ cover_type: cover.type, cover_value: cover.value }, 'Cover updated.')
  }

  function handleCoverUpload(dataUrl) {
    setCoverPickerOpen(false)
    if (dataUrl) setCoverCropSrc(dataUrl)
  }

  async function handleCoverApply(dataUrl) {
    const file = dataUrlToFile(dataUrl, `cover-${Date.now()}.jpg`)
    const { path, error } = await uploadProfileMedia(profile.id, file, 'cover')
    if (error) {
      toast.error('Cover upload failed. Please try again.')
      return
    }
    const saved = await saveMedia(
      { cover_type: 'custom', cover_value: path },
      'Cover updated.',
    )
    if (saved) setCoverCropSrc(null)
  }

  async function handleShare() {
    const result = await shareProfile(profile.aadi_id)
    if (result === 'copied') toast.success('Profile link copied to clipboard.')
    else if (result === 'failed') toast.error('Could not copy the link. Copy it from the address bar.')
  }

  if (profileStatus === 'loading' || (!profile && profileStatus !== 'error')) {
    return <Spinner label="Loading your profile…" />
  }

  if (!profile) {
    return (
      <div className="p-pagestate">
        <h3 className="p-pagestate__title">Profile unavailable</h3>
        <p className="p-pagestate__body">Your profile could not be loaded right now.</p>
      </div>
    )
  }

  return (
    <>
      <ProfileView
        profile={profile}
        isOwner
        projects={projects}
        onEdit={section => setEditing(section || 'identity')}
        onEditCover={() => setCoverPickerOpen(true)}
        onChangePhoto={openPhotoPicker}
        onShare={handleShare}
      />

      <input
        ref={photoInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handlePhotoPick}
        className="lp-sr-only"
        aria-label="Choose a profile photo"
      />

      {mediaBusy && (
        <div className="lp-modal" role="status" aria-live="polite" style={{ zIndex: 600 }}>
          <div className="lp-modal__panel" style={{ maxWidth: 320, padding: 26 }}>
            <Spinner label="Saving…" />
          </div>
        </div>
      )}

      {editing && (
        <EditProfileModal
          profile={profile}
          initialSection={editing}
          onChangePhoto={openPhotoPicker}
          onClose={() => setEditing(null)}
          onSaved={loadProjects}
        />
      )}

      {photoSrc && (
        <PhotoCropEditor
          src={photoSrc}
          onApply={handlePhotoApply}
          onCancel={closePhotoEditor}
        />
      )}

      {coverPickerOpen && (
        <CoverSelector
          currentCover={{ type: profile.cover_type, value: profile.cover_value }}
          onSelect={handleCoverSelect}
          onUpload={handleCoverUpload}
          onCancel={() => setCoverPickerOpen(false)}
        />
      )}

      {coverCropSrc && (
        <CoverCropper
          src={coverCropSrc}
          onApply={handleCoverApply}
          onCancel={() => setCoverCropSrc(null)}
        />
      )}
    </>
  )
}
