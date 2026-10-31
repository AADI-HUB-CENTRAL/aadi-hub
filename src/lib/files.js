/* ---------------------------------------------------------------------------
   Small file helpers
--------------------------------------------------------------------------- */

export function formatBytes(bytes) {
  if (!bytes) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / 1024 ** i).toFixed(i === 0 ? 0 : 1)} ${units[i]}`
}

/** Convert a data: URL produced by the crop editor into a real File. */
export function dataUrlToFile(dataUrl, filename = 'image.jpg') {
  const [header, base64] = String(dataUrl).split(',')
  const mimeMatch = /data:([^;]+);base64/.exec(header)
  const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg'
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i)
  const ext = mime === 'image/png' ? 'png' : mime === 'image/webp' ? 'webp' : 'jpg'
  return new File([bytes], filename.replace(/\.\w+$/, `.${ext}`), { type: mime })
}

/** Read a File into a data URL (used by the crop editor preview). */
export function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target.result)
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}
