import { useState, useRef, useEffect, useCallback } from 'react'

const MIN_ZOOM = 0.5
const MAX_ZOOM = 4
const ZOOM_STEP = 0.05
const OUTPUT_SIZE = 512

export default function PhotoCropEditor({ src, onApply, onCancel }) {
  const [zoom, setZoom] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [fitMode, setFitMode] = useState('fill')
  const [dragging, setDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [offsetStart, setOffsetStart] = useState({ x: 0, y: 0 })
  const [imgSize, setImgSize] = useState({ w: 0, h: 0 })

  const cropRef = useRef(null)
  const imgRef = useRef(null)
  const previewCanvasRef = useRef(null)
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

  const initFit = useCallback((mode) => {
    const img = imgRef.current
    const crop = cropRef.current
    if (!img || !crop) return
    const cw = crop.offsetWidth
    const ch = crop.offsetHeight
    const iw = img.naturalWidth
    const ih = img.naturalHeight
    if (!iw || !ih) return

    let z
    if (mode === 'fill') {
      z = Math.max(cw / iw, ch / ih)
    } else {
      z = Math.min(cw / iw, ch / ih)
    }
    setZoom(z)
    setOffset({ x: 0, y: 0 })
  }, [])

  useEffect(() => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      imgRef.current = img
      setImgSize({ w: img.naturalWidth, h: img.naturalHeight })
      requestAnimationFrame(() => initFit(fitMode))
    }
    img.src = src
    imgSrcRef.current = src
  }, [src])

  useEffect(() => {
    initFit(fitMode)
  }, [fitMode])

  useEffect(() => {
    const canvas = previewCanvasRef.current
    const img = imgRef.current
    const crop = cropRef.current
    if (!canvas || !img || !crop || !imgSize.w) return

    const ctx = canvas.getContext('2d')
    const cw = crop.offsetWidth
    const ch = crop.offsetHeight
    const scale = OUTPUT_SIZE / cw
    canvas.width = OUTPUT_SIZE
    canvas.height = OUTPUT_SIZE

    ctx.clearRect(0, 0, OUTPUT_SIZE, OUTPUT_SIZE)

    const drawW = imgSize.w * zoom * scale
    const drawH = imgSize.h * zoom * scale
    const dx = (cw / 2 - offset.x) * scale - drawW / 2
    const dy = (ch / 2 - offset.y) * scale - drawH / 2

    ctx.drawImage(img, dx, dy, drawW, drawH)
  }, [zoom, offset, imgSize])

  const handleZoomSlider = (e) => {
    setZoom(Number(e.target.value))
  }

  const handleZoomBtn = (delta) => {
    setZoom(prev => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, prev + delta)))
  }

  const handleReset = () => {
    initFit(fitMode)
  }

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
    const dx = e.clientX - dragStart.x
    const dy = e.clientY - dragStart.y
    const newOffset = clampOffset(offsetStart.x + dx, offsetStart.y + dy, zoom)
    setOffset(newOffset)
  }

  const handlePointerUp = () => {
    setDragging(false)
  }

  const handleWheel = (e) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? -ZOOM_STEP * 3 : ZOOM_STEP * 3
    setZoom(prev => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, prev + delta)))
  }

  const handleApply = () => {
    const canvas = previewCanvasRef.current
    if (!canvas) return
    const dataUrl = canvas.toDataURL('image/jpeg', 0.92)
    onApply(dataUrl)
  }

  const handleFitMode = (mode) => {
    setFitMode(mode)
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
      aria-label="Profile photo crop editor"
    >
      <div className="crop-editor__panel">
        <div className="crop-editor__header">
          <div>
            <h2 className="crop-editor__title">Adjust your profile photo</h2>
            <p className="crop-editor__sub">Position your photo so it looks perfect on your AADI ID.</p>
          </div>
          <button className="crop-editor__close" onClick={onCancel} aria-label="Close editor">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div className="crop-editor__body">
          <div className="crop-editor__main">
            <div
              className="crop-editor__crop-area"
              ref={cropRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onWheel={handleWheel}
              style={{ cursor: dragging ? 'grabbing' : 'grab' }}
            >
              <div className="crop-editor__crop-frame">
                {src && (
                  <img
                    src={src}
                    alt="Crop preview"
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
                    <span>Place your finger and drag here to adjust</span>
                  </div>
                )}
              </div>
            </div>

            <div className="crop-editor__controls">
              <div className="crop-editor__zoom">
                <button
                  className="crop-editor__zoom-btn"
                  onClick={() => handleZoomBtn(-ZOOM_STEP * 4)}
                  aria-label="Zoom out"
                >
                  −
                </button>
                <input
                  type="range"
                  className="crop-editor__slider"
                  min={MIN_ZOOM}
                  max={MAX_ZOOM}
                  step={ZOOM_STEP}
                  value={zoom}
                  onChange={handleZoomSlider}
                  aria-label="Zoom level"
                />
                <button
                  className="crop-editor__zoom-btn"
                  onClick={() => handleZoomBtn(ZOOM_STEP * 4)}
                  aria-label="Zoom in"
                >
                  +
                </button>
              </div>

              <div className="crop-editor__mode-row">
                <div className="crop-editor__fit-toggle" role="radiogroup" aria-label="Fit mode">
                  <button
                    className={`crop-editor__fit-btn${fitMode === 'fit' ? ' is-active' : ''}`}
                    onClick={() => handleFitMode('fit')}
                    role="radio"
                    aria-checked={fitMode === 'fit'}
                  >
                    Fit
                  </button>
                  <button
                    className={`crop-editor__fit-btn${fitMode === 'fill' ? ' is-active' : ''}`}
                    onClick={() => handleFitMode('fill')}
                    role="radio"
                    aria-checked={fitMode === 'fill'}
                  >
                    Fill
                  </button>
                </div>
                <button className="crop-editor__reset" onClick={handleReset} aria-label="Reset crop position">
                  Reset
                </button>
              </div>
            </div>
          </div>

          <div className="crop-editor__preview-col">
            <span className="crop-editor__preview-label">Preview</span>
            <div className="crop-editor__preview-wrap">
              <canvas ref={previewCanvasRef} className="crop-editor__preview-canvas" width={OUTPUT_SIZE} height={OUTPUT_SIZE} />
            </div>
          </div>
        </div>

        <div className="crop-editor__actions">
          <button className="crop-editor__btn crop-editor__btn--cancel" onClick={onCancel}>
            Cancel
          </button>
          <button className="crop-editor__btn crop-editor__btn--apply" onClick={handleApply}>
            Apply photo
          </button>
        </div>
      </div>
    </div>
  )
}
