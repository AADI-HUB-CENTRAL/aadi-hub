import { useState, useRef, useEffect, useCallback } from 'react'

const COVER_RATIO = 3
const MIN_ZOOM = 0.5
const MAX_ZOOM = 4
const ZOOM_STEP = 0.05
const OUTPUT_W = 1500
const OUTPUT_H = 500

export default function CoverCropper({ src, onApply, onCancel }) {
  const [zoom, setZoom] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [offsetStart, setOffsetStart] = useState({ x: 0, y: 0 })
  const [imgSize, setImgSize] = useState({ w: 0, h: 0 })

  const cropRef = useRef(null)
  const imgRef = useRef(null)
  const previewRef = useRef(null)
  const imgSrcRef = useRef(src)

  const clampOffset = useCallback((ox, oy, z) => {
    const crop = cropRef.current
    if (!crop) return { x: ox, y: oy }
    const cw = crop.offsetWidth
    const ch = crop.offsetHeight
    const iw = imgSize.w * z
    const ih = imgSize.h * z
    const maxX = Math.max(0, (iw - cw) / 2)
    const maxY = Math.max(0, (ih - ch) / 2)
    return {
      x: Math.max(-maxX, Math.min(maxX, ox)),
      y: Math.max(-maxY, Math.min(maxY, oy)),
    }
  }, [imgSize])

  const initFit = useCallback(() => {
    const img = imgRef.current
    const crop = cropRef.current
    if (!img || !crop) return
    const cw = crop.offsetWidth
    const ch = crop.offsetHeight
    const iw = img.naturalWidth
    const ih = img.naturalHeight
    if (!iw || !ih) return
    const z = Math.max(cw / iw, ch / ih)
    setZoom(z)
    setOffset({ x: 0, y: 0 })
  }, [])

  useEffect(() => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      imgRef.current = img
      setImgSize({ w: img.naturalWidth, h: img.naturalHeight })
      requestAnimationFrame(initFit)
    }
    img.src = src
    imgSrcRef.current = src
  }, [src])

  useEffect(() => {
    const canvas = previewRef.current
    const img = imgRef.current
    const crop = cropRef.current
    if (!canvas || !img || !crop || !imgSize.w) return
    const ctx = canvas.getContext('2d')
    const cw = crop.offsetWidth
    const ch = crop.offsetHeight
    const scale = OUTPUT_W / cw
    canvas.width = OUTPUT_W
    canvas.height = OUTPUT_H
    ctx.clearRect(0, 0, OUTPUT_W, OUTPUT_H)
    const drawW = imgSize.w * zoom * scale
    const drawH = imgSize.h * zoom * scale
    const dx = (cw / 2 - offset.x) * scale - drawW / 2
    const dy = (ch / 2 - offset.y) * scale - drawH / 2
    ctx.drawImage(img, dx, dy, drawW, drawH)
  }, [zoom, offset, imgSize])

  const handlePointerDown = (e) => {
    if (e.button && e.button !== 0) return
    e.preventDefault()
    setDragging(true)
    setDragStart({ x: e.clientX, y: e.clientY })
    setOffsetStart({ ...offset })
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const handlePointerMove = (e) => {
    if (!dragging) return
    e.preventDefault()
    const newOffset = clampOffset(
      offsetStart.x + (e.clientX - dragStart.x),
      offsetStart.y + (e.clientY - dragStart.y),
      zoom
    )
    setOffset(newOffset)
  }

  const handlePointerUp = () => setDragging(false)

  const handleWheel = (e) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? -ZOOM_STEP * 3 : ZOOM_STEP * 3
    setZoom(prev => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, prev + delta)))
  }

  const handleApply = () => {
    const canvas = previewRef.current
    if (!canvas) return
    onApply(canvas.toDataURL('image/jpeg', 0.92))
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') onCancel()
    if (e.key === 'Enter' && !e.shiftKey) handleApply()
  }

  return (
    <div
      className="crop-editor"
      onClick={(e) => { if (e.target === e.currentTarget) onCancel() }}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-label="Cover photo crop editor"
    >
      <div className="crop-editor__panel">
        <div className="crop-editor__header">
          <div>
            <h2 className="crop-editor__title">Adjust your cover photo</h2>
            <p className="crop-editor__sub">Drag here with your fingers to adjust</p>
          </div>
          <button className="crop-editor__close" onClick={onCancel} aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div className="crop-editor__body">
          <div className="crop-editor__main">
            <div
              className="crop-editor__crop-area"
              ref={cropRef}
              style={{ aspectRatio: `${COVER_RATIO} / 1`, cursor: dragging ? 'grabbing' : 'grab' }}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onWheel={handleWheel}
            >
              <div className="crop-editor__crop-frame" style={{ aspectRatio: `${COVER_RATIO} / 1` }}>
                {src && (
                  <img
                    src={src}
                    alt="Cover crop preview"
                    className="crop-editor__img"
                    draggable={false}
                    style={{
                      transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
                      transformOrigin: 'center center',
                    }}
                  />
                )}
                <div className="crop-editor__frame-border" />
                {!dragging && (
                  <div className="crop-editor__hint">
                    <span>Drag here with your fingers to adjust</span>
                  </div>
                )}
              </div>
            </div>

            <div className="crop-editor__controls">
              <div className="crop-editor__zoom">
                <button className="crop-editor__zoom-btn" onClick={() => setZoom(prev => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, prev - ZOOM_STEP * 4)))} aria-label="Zoom out">−</button>
                <input
                  type="range"
                  className="crop-editor__slider"
                  min={MIN_ZOOM} max={MAX_ZOOM} step={ZOOM_STEP}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  aria-label="Zoom level"
                />
                <button className="crop-editor__zoom-btn" onClick={() => setZoom(prev => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, prev + ZOOM_STEP * 4)))} aria-label="Zoom in">+</button>
              </div>
              <button className="crop-editor__reset" onClick={initFit} aria-label="Reset position">Reset</button>
            </div>
          </div>

          <div className="crop-editor__preview-col crop-editor__preview-col--cover">
            <span className="crop-editor__preview-label">Preview</span>
            <div className="crop-editor__preview-wrap crop-editor__preview-wrap--cover" style={{ aspectRatio: `${COVER_RATIO} / 1` }}>
              <canvas ref={previewRef} className="crop-editor__preview-canvas" />
            </div>
          </div>
        </div>

        <div className="crop-editor__actions">
          <button className="crop-editor__btn crop-editor__btn--cancel" onClick={onCancel}>Cancel</button>
          <button className="crop-editor__btn crop-editor__btn--apply" onClick={handleApply}>Use Cover</button>
        </div>
      </div>
    </div>
  )
}
