import { useState, useRef } from 'react'
import { COVER_PRESETS } from './CoverDesigns.jsx'

export default function CoverSelector({ currentCover, onSelect, onUpload, onCancel }) {
  const [selectedId, setSelectedId] = useState(
    currentCover?.type === 'preset' ? currentCover.value : 'cover-01'
  )
  const [uploadError, setUploadError] = useState('')
  const fileRef = useRef(null)

  const handleSave = () => {
    const preset = COVER_PRESETS.find(c => c.id === selectedId)
    if (preset) {
      onSelect({ type: 'preset', value: selectedId })
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('Please choose an image smaller than 10 MB.')
      return
    }
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setUploadError('Please choose a JPG, PNG, or WEBP image.')
      return
    }
    setUploadError('')
    const reader = new FileReader()
    reader.onload = (ev) => onUpload(ev.target.result)
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  return (
    <div
      className="crop-editor"
      onClick={(e) => { if (e.target === e.currentTarget) onCancel() }}
      role="dialog"
      aria-modal="true"
      aria-label="Choose cover photo"
    >
      <div className="cover-selector">
        <div className="crop-editor__header">
          <div>
            <h2 className="crop-editor__title">Choose your cover</h2>
            <p className="crop-editor__sub">Select an AADI cover or upload your own.</p>
          </div>
          <button className="crop-editor__close" onClick={onCancel} aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div className="cover-selector__body">
          <p className="cover-selector__section-label">Choose an AADI cover</p>
          <div className="cover-selector__grid">
            {COVER_PRESETS.map(preset => {
              const Cover = preset.Component
              const isSelected = selectedId === preset.id
              return (
                <button
                  key={preset.id}
                  className={`cover-selector__thumb${isSelected ? ' cover-selector__thumb--active' : ''}`}
                  onClick={() => setSelectedId(preset.id)}
                  aria-label={`Cover: ${preset.label}`}
                  aria-pressed={isSelected}
                >
                  <div className="cover-selector__thumb-inner">
                    <Cover />
                    {isSelected && (
                      <span className="cover-selector__check">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                      </span>
                    )}
                  </div>
                  <span className="cover-selector__label">{preset.label}</span>
                </button>
              )
            })}
          </div>

          <div className="cover-selector__divider" />

          <p className="cover-selector__section-label">Upload your own cover</p>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            className="pf-sr-only"
            aria-label="Upload custom cover photo"
          />
          <button className="cover-selector__upload" onClick={() => fileRef.current?.click()}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            Upload Cover Photo
          </button>
          {uploadError && <p className="cover-selector__error">{uploadError}</p>}
        </div>

        <div className="crop-editor__actions">
          <button className="crop-editor__btn crop-editor__btn--cancel" onClick={onCancel}>Cancel</button>
          <button className="crop-editor__btn crop-editor__btn--apply" onClick={handleSave}>Save Cover</button>
        </div>
      </div>
    </div>
  )
}
