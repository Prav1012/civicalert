import { useState } from 'react'

export default function PhotoUpload({ onPhotoSelected }) {
  const [preview, setPreview] = useState(null)

  const handleFile = (e) => {
    const file = e.target.files[0]
    if (!file) return
    onPhotoSelected(file)
    setPreview(URL.createObjectURL(file))
  }

  return (
    <div>
      <label className="block text-sm mb-1">Photo (optional)</label>
      <input type="file" accept="image/*" capture="environment"
             onChange={handleFile} className="text-sm" />
      {preview && (
        <img src={preview} alt="preview"
             className="mt-2 w-full h-40 object-cover rounded" />
      )}
    </div>
  )
}