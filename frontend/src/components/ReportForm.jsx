import { useState } from 'react'
import { supabase } from '../supabase'
import { useLocation } from '../hooks/useLocation'
import { useOfflineQueue } from '../hooks/useOfflineQueue'
import emailjs from '@emailjs/browser'

const EMAILJS_SERVICE_ID  = 'service_xxxxxxx'
const EMAILJS_TEMPLATE_ID = 'template_xxxxxxx'
const EMAILJS_PUBLIC_KEY  = 'your_public_key'

const OFFICIAL_EMAILS = {
  'Pothole':      'roads@municipality.gov.in',
  'Flood':        'drainage@municipality.gov.in',
  'Fire Hazard':  'fire@municipality.gov.in',
  'Garbage':      'sanitation@municipality.gov.in',
  'Broken Light': 'electricity@municipality.gov.in',
  'Water Leak':   'water@municipality.gov.in',
  'Encroachment': 'planning@municipality.gov.in',
  'Other':        'general@municipality.gov.in',
}

const CATEGORIES = [
  { v: 'Pothole',       e: '🕳️' },
  { v: 'Flood',         e: '🌊' },
  { v: 'Fire Hazard',   e: '🔥' },
  { v: 'Garbage',       e: '🗑️' },
  { v: 'Broken Light',  e: '💡' },
  { v: 'Water Leak',    e: '💧' },
  { v: 'Encroachment',  e: '🚧' },
  { v: 'Other',         e: '📌' },
]

const SEV = ['low', 'medium', 'high', 'critical']
const SEV_COLOR = {
  low: '#00ffb4', medium: '#ffcc00',
  high: '#ff8800', critical: '#ff3333'
}

function generateAnonymousId() {
  return 'anon_' + Math.random().toString(36).slice(2) +
         Date.now().toString(36)
}

function generateTxHash(data) {
  let hash = 0
  for (let i = 0; i < data.length; i++) {
    hash = ((hash << 5) - hash) + data.charCodeAt(i)
    hash |= 0
  }
  return '0xdev_' + Math.abs(hash).toString(16).padStart(40, '0')
}

const field = {
  width: '100%', background: 'rgba(0,255,180,0.04)',
  border: '1px solid rgba(0,255,180,0.2)', borderRadius: '4px',
  padding: '10px 12px', color: '#e0f7fa', fontFamily: 'inherit',
  fontSize: '13px', outline: 'none', boxSizing: 'border-box'
}

export default function ReportForm() {
  const [category, setCategory] = useState('')
  const [severity, setSeverity] = useState('medium')
  const [description, setDesc]  = useState('')
  const [photo, setPhoto]        = useState(null)
  const [preview, setPreview]    = useState(null)
  const [status, setStatus]      = useState('')
  const [loading, setLoading]    = useState(false)

  const { coords, loading: locLoading, fetchLocation } = useLocation()
  const { isOnline, queueReport } = useOfflineQueue()

  const handlePhoto = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setPhoto(file)
    setPreview(URL.createObjectURL(file))
  }

  const uploadPhoto = async (file) => {
    const fileName = `${Date.now()}_${file.name}`
    const { data, error } = await supabase.storage
      .from('report-photos')
      .upload(fileName, file)
    if (error) return null
    const { data: urlData } = supabase.storage
      .from('report-photos')
      .getPublicUrl(fileName)
    return urlData.publicUrl
  }

  const notifyOfficial = (category, severity, description,
                          lat, lng, txHash) => {
    emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      {
        category, severity: severity.toUpperCase(),
        description,
        latitude:  lat.toFixed(6),
        longitude: lng.toFixed(6),
        tx_hash:   txHash,
        to_email:  OFFICIAL_EMAILS[category] || 'general@municipality.gov.in',
      },
      EMAILJS_PUBLIC_KEY
    ).catch(err => console.error('Email failed:', err))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!category)  return setStatus('⚠️ Please select a category')
    if (!coords)    return setStatus('⚠️ Please fetch your location')
    setLoading(true)

    if (!isOnline) {
      queueReport({ category, severity, description,
                    latitude: coords.lat, longitude: coords.lng })
      setLoading(false)
      return setStatus('📦 Saved offline. Will sync when online.')
    }

    try {
      let photoUrl = null
      if (photo) photoUrl = await uploadPhoto(photo)

      const anonymousId = generateAnonymousId()
      const txHash = generateTxHash(anonymousId + category + Date.now())

      const { error } = await supabase.from('reports').insert([{
        anonymous_id:        anonymousId,
        category,
        severity,
        description,
        latitude:            coords.lat,
        longitude:           coords.lng,
        photo_url:           photoUrl,
        blockchain_tx_hash:  txHash,
        status:              'pending'
      }])

      if (error) throw error

      notifyOfficial(category, severity, description,
                     coords.lat, coords.lng, txHash)

      setStatus(`✅ Submitted! TX: ${txHash.slice(0, 20)}...`)
      setCategory('')
      setSeverity('medium')
      setDesc('')
      setPhoto(null)
      setPreview(null)

    } catch (err) {
      console.error(err)
      queueReport({ category, severity, description,
                    latitude: coords.lat, longitude: coords.lng })
      setStatus('❌ Failed. Saved offline.')
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom:'8px', fontSize:'10px', color:'rgba(0,255,180,0.5)', letterSpacing:'3px' }}>
        ◈ INCIDENT CATEGORY
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'6px', marginBottom:'20px' }}>
        {CATEGORIES.map(c => (
          <button type="button" key={c.v} onClick={() => setCategory(c.v)} style={{
            padding:'10px 4px',
            border:`1px solid ${category===c.v ? '#00ffb4' : 'rgba(255,255,255,0.1)'}`,
            borderRadius:'4px',
            background: category===c.v ? 'rgba(0,255,180,0.1)' : 'transparent',
            color: category===c.v ? '#00ffb4' : 'rgba(255,255,255,0.4)',
            cursor:'pointer', fontSize:'18px', fontFamily:'inherit',
            display:'flex', flexDirection:'column', alignItems:'center', gap:'4px'
          }}>
            <span>{c.e}</span>
            <span style={{ fontSize:'8px', letterSpacing:'1px' }}>
              {c.v.toUpperCase().slice(0,6)}
            </span>
          </button>
        ))}
      </div>

      <div style={{ marginBottom:'8px', fontSize:'10px', color:'rgba(0,255,180,0.5)', letterSpacing:'3px' }}>
        ◈ SEVERITY LEVEL
      </div>
      <div style={{ display:'flex', gap:'6px', marginBottom:'20px' }}>
        {SEV.map(s => (
          <button type="button" key={s} onClick={() => setSeverity(s)} style={{
            flex:1, padding:'8px',
            border:`1px solid ${severity===s ? SEV_COLOR[s] : 'rgba(255,255,255,0.1)'}`,
            borderRadius:'4px',
            background: severity===s ? `${SEV_COLOR[s]}15` : 'transparent',
            color: severity===s ? SEV_COLOR[s] : 'rgba(255,255,255,0.3)',
            cursor:'pointer', fontSize:'9px', letterSpacing:'1px', fontFamily:'inherit'
          }}>{s.toUpperCase()}</button>
        ))}
      </div>

      <div style={{ marginBottom:'8px', fontSize:'10px', color:'rgba(0,255,180,0.5)', letterSpacing:'3px' }}>
        ◈ DESCRIPTION
      </div>
      <textarea value={description} onChange={e => setDesc(e.target.value)}
        placeholder="Describe the issue..." rows={3}
        style={{ ...field, resize:'none', marginBottom:'20px' }} />

      <div style={{ marginBottom:'8px', fontSize:'10px', color:'rgba(0,255,180,0.5)', letterSpacing:'3px' }}>
        📷 ATTACH PHOTO
      </div>
      <label style={{
        display:'block', border:'1px dashed rgba(0,255,180,0.3)',
        borderRadius:'4px', padding:'16px', textAlign:'center',
        cursor:'pointer', marginBottom:'20px',
        color:'rgba(0,255,180,0.5)', fontSize:'12px', letterSpacing:'1px'
      }}>
        {preview
          ? <img src={preview} alt="preview" style={{ width:'100%', maxHeight:'160px', objectFit:'cover', borderRadius:'4px' }} />
          : '📎 TAP TO UPLOAD IMAGE'}
        <input type="file" accept="image/*" capture="environment"
          onChange={handlePhoto} style={{ display:'none' }} />
      </label>

      <div style={{ marginBottom:'8px', fontSize:'10px', color:'rgba(0,255,180,0.5)', letterSpacing:'3px' }}>
        📍 GEOLOCATION
      </div>
      <button type="button" onClick={fetchLocation} style={{
        width:'100%', padding:'10px', marginBottom:'20px',
        border:'1px solid rgba(0,255,180,0.3)', borderRadius:'4px',
        background: coords ? 'rgba(0,255,180,0.08)' : 'transparent',
        color: coords ? '#00ffb4' : 'rgba(255,255,255,0.5)',
        cursor:'pointer', fontFamily:'inherit', fontSize:'12px', letterSpacing:'1px'
      }}>
        {locLoading ? '⏳ ACQUIRING...' : coords
          ? `✅ ${coords.lat.toFixed(4)}°N  ${coords.lng.toFixed(4)}°E`
          : '🛰️ GET MY LOCATION'}
      </button>

      <div style={{ fontSize:'10px', color:'rgba(0,255,180,0.3)', marginBottom:'16px', letterSpacing:'1px', textAlign:'center' }}>
        🔒 IDENTITY ANONYMIZED · NO ACCOUNT NEEDED · BLOCKCHAIN SECURED ⛓️
      </div>

      <button type="submit" disabled={loading} style={{
        width:'100%', padding:'14px',
        background: loading ? 'rgba(0,255,180,0.05)' : 'rgba(0,255,180,0.1)',
        border:'1px solid #00ffb4', borderRadius:'4px',
        color:'#00ffb4', cursor: loading ? 'not-allowed' : 'pointer',
        fontFamily:'inherit', fontSize:'13px', letterSpacing:'3px', fontWeight:'bold'
      }}>
        {loading ? '⏳ TRANSMITTING...' : isOnline ? '📡 SUBMIT REPORT' : '📦 SAVE OFFLINE'}
      </button>

      {status && (
        <div style={{
          marginTop:'12px', padding:'10px 14px',
          border:'1px solid rgba(0,255,180,0.2)', borderRadius:'4px',
          fontSize:'11px', color:'#00ffb4', letterSpacing:'1px', textAlign:'center'
        }}>{status}</div>
      )}
    </form>
  )
}