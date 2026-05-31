import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'

const SEV_COLOR    = { low:'#00ffb4', medium:'#ffcc00', high:'#ff8800', critical:'#ff3333' }
const STATUS_COLOR = { pending:'#ffcc00', resolved:'#00ffb4', rejected:'#ff4444' }
const CAT_EMOJI    = {
  'Pothole':'🕳️','Flood':'🌊','Fire Hazard':'🔥','Garbage':'🗑️',
  'Broken Light':'💡','Water Leak':'💧','Encroachment':'🚧','Other':'📌'
}

export default function DevDashboard() {
  const [reports, setReports]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState('')
  const [selected, setSelected] = useState(null)
  const [filter, setFilter]     = useState('all')
  const navigate = useNavigate()

  const fetchReports = async () => {
    setLoading(true)
    setError('')
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) setError('❌ Failed to fetch reports')
    else setReports(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchReports() }, [])

  const logout = () => {
    sessionStorage.removeItem('dev_auth')
    navigate('/dev')
  }

  const updateStatus = async (id, newStatus) => {
    await supabase.from('reports').update({ status: newStatus }).eq('id', id)
    fetchReports()
  }

  const filtered = filter === 'all'
    ? reports
    : reports.filter(r => r.severity === filter)

  return (
    <div style={{
      minHeight:'100vh', background:'#010b13',
      color:'#e0f7fa', fontFamily:"'Courier New', monospace",
      backgroundImage:`
        linear-gradient(rgba(0,170,255,0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0,170,255,0.03) 1px, transparent 1px)`,
      backgroundSize:'40px 40px'
    }}>
      <div style={{ maxWidth:'800px', margin:'0 auto', padding:'20px 16px' }}>

        <div style={{
          display:'flex', justifyContent:'space-between', alignItems:'center',
          marginBottom:'28px', borderBottom:'1px solid rgba(0,170,255,0.15)', paddingBottom:'16px'
        }}>
          <div>
            <div style={{ fontSize:'10px', color:'rgba(0,170,255,0.5)', letterSpacing:'4px', marginBottom:'2px' }}>
              ◈ AUTHENTICATED SESSION
            </div>
            <h1 style={{ margin:0, fontSize:'20px', color:'#00aaff', letterSpacing:'3px' }}>
              🛠️ DEV DASHBOARD
            </h1>
          </div>
          <div style={{ display:'flex', gap:'8px' }}>
            <button onClick={fetchReports} style={{
              padding:'8px 14px', border:'1px solid rgba(0,170,255,0.3)',
              borderRadius:'4px', background:'rgba(0,170,255,0.08)',
              color:'#00aaff', cursor:'pointer', fontFamily:'inherit',
              fontSize:'10px', letterSpacing:'2px'
            }}>🔄 REFRESH</button>
            <button onClick={logout} style={{
              padding:'8px 14px', border:'1px solid rgba(255,68,68,0.3)',
              borderRadius:'4px', background:'rgba(255,68,68,0.08)',
              color:'#ff4444', cursor:'pointer', fontFamily:'inherit',
              fontSize:'10px', letterSpacing:'2px'
            }}>🔒 LOGOUT</button>
          </div>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'10px', marginBottom:'24px' }}>
          {[
            { label:'TOTAL',    value:reports.length,                                    color:'#00aaff' },
            { label:'CRITICAL', value:reports.filter(r=>r.severity==='critical').length, color:'#ff3333' },
            { label:'HIGH',     value:reports.filter(r=>r.severity==='high').length,     color:'#ff8800' },
            { label:'PENDING',  value:reports.filter(r=>r.status==='pending').length,    color:'#ffcc00' },
          ].map(s => (
            <div key={s.label} style={{
              border:`1px solid ${s.color}33`, borderRadius:'6px',
              padding:'16px', textAlign:'center', background:`${s.color}08`
            }}>
              <div style={{ fontSize:'28px', fontWeight:'bold', color:s.color }}>{s.value}</div>
              <div style={{ fontSize:'9px', color:'rgba(255,255,255,0.4)', letterSpacing:'2px', marginTop:'4px' }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display:'flex', gap:'6px', marginBottom:'16px' }}>
          {['all','low','medium','high','critical'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              flex:1, padding:'8px 4px',
              border:`1px solid ${filter===f ? (SEV_COLOR[f]||'#00aaff') : 'rgba(255,255,255,0.1)'}`,
              borderRadius:'4px',
              background: filter===f ? `${SEV_COLOR[f]||'#00aaff'}15` : 'transparent',
              color: filter===f ? (SEV_COLOR[f]||'#00aaff') : 'rgba(255,255,255,0.3)',
              cursor:'pointer', fontFamily:'inherit', fontSize:'9px', letterSpacing:'1px'
            }}>{f.toUpperCase()}</button>
          ))}
        </div>

        {loading && <div style={{ textAlign:'center', padding:'60px', color:'rgba(0,170,255,0.5)', letterSpacing:'3px' }}>⏳ LOADING...</div>}
        {error   && <div style={{ padding:'16px', border:'1px solid rgba(255,68,68,0.3)', borderRadius:'4px', color:'#ff4444', fontSize:'12px' }}>{error}</div>}
        {!loading && !error && filtered.length === 0 && (
          <div style={{ textAlign:'center', padding:'60px', color:'rgba(255,255,255,0.2)', letterSpacing:'2px', fontSize:'12px' }}>📭 NO REPORTS FOUND</div>
        )}

        <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
          {filtered.map(r => (
            <div key={r.id} onClick={() => setSelected(selected?.id===r.id ? null : r)}
              style={{
                border:`1px solid ${selected?.id===r.id ? '#00aaff' : 'rgba(255,255,255,0.08)'}`,
                borderRadius:'8px', padding:'16px',
                background: selected?.id===r.id ? 'rgba(0,170,255,0.06)' : 'rgba(255,255,255,0.02)',
                cursor:'pointer', transition:'all 0.2s'
              }}>

              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'10px' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                  <span style={{ fontSize:'22px' }}>{CAT_EMOJI[r.category]||'📌'}</span>
                  <div>
                    <div style={{ fontSize:'13px', color:'white', letterSpacing:'1px' }}>{r.category}</div>
                    <div style={{ fontSize:'9px', color:'rgba(255,255,255,0.3)', marginTop:'2px' }}>#{r.id}</div>
                  </div>
                </div>
                <div style={{ display:'flex', gap:'6px' }}>
                  <span style={{
                    fontSize:'9px', padding:'4px 10px', borderRadius:'3px',
                    border:`1px solid ${SEV_COLOR[r.severity]}`,
                    color:SEV_COLOR[r.severity], letterSpacing:'1px'
                  }}>{r.severity?.toUpperCase()}</span>
                  <span style={{
                    fontSize:'9px', padding:'4px 10px', borderRadius:'3px',
                    border:`1px solid ${STATUS_COLOR[r.status]||'#888'}`,
                    color:STATUS_COLOR[r.status]||'#888', letterSpacing:'1px'
                  }}>{r.status?.toUpperCase()}</span>
                </div>
              </div>

              <div style={{ fontSize:'12px', color:'rgba(255,255,255,0.5)', marginBottom:'8px' }}>
                📝 {r.description?.slice(0,100)}{r.description?.length>100?'...':''}
              </div>

              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', fontSize:'9px', color:'rgba(255,255,255,0.25)', letterSpacing:'1px' }}>
                <span>📍 {r.latitude?.toFixed(4)}°, {r.longitude?.toFixed(4)}°</span>
                <div style={{ display:'flex', gap:'6px', alignItems:'center' }}>
                  <a href={`https://maps.google.com/?q=${r.latitude},${r.longitude}`}
                    target="_blank" rel="noreferrer"
                    onClick={e => e.stopPropagation()}
                    style={{
                      fontSize:'9px', padding:'4px 10px',
                      border:'1px solid rgba(0,170,255,0.4)',
                      borderRadius:'3px', color:'#00aaff',
                      textDecoration:'none', letterSpacing:'1px',
                      background:'rgba(0,170,255,0.08)'
                    }}>🗺️ MAP</a>
                  <span>🕐 {new Date(r.created_at).toLocaleString()}</span>
                </div>
              </div>

              {selected?.id === r.id && (
                <div style={{ marginTop:'14px', paddingTop:'14px', borderTop:'1px solid rgba(0,170,255,0.2)' }}>
                  <div style={{ fontSize:'9px', color:'rgba(0,170,255,0.6)', letterSpacing:'3px', marginBottom:'10px' }}>◈ FULL REPORT DATA</div>
                  <div style={{ fontSize:'11px', color:'rgba(255,255,255,0.4)', lineHeight:'2' }}>
                    <div>🆔 ID: <span style={{color:'#00aaff'}}>#{r.id}</span></div>
                    <div>👤 ANON ID: <span style={{color:'#00aaff'}}>{r.anonymous_id?.slice(0,32)}</span></div>
                    <div>⛓️ TX: <span style={{color:'#00aaff'}}>{r.blockchain_tx_hash?.slice(0,32)||'N/A'}</span></div>
                    <div>🖼️ PHOTO: <span style={{color:'#00aaff'}}>{r.photo_url ? <a href={r.photo_url} target="_blank" rel="noreferrer" style={{color:'#00aaff'}}>View Photo</a> : 'No photo'}</span></div>
                    <div>📍 COORDS: <span style={{color:'#00aaff'}}>{r.latitude}, {r.longitude}</span></div>
                    <div>📝 DESC: <span style={{color:'white'}}>{r.description}</span></div>
                  </div>
                  <div style={{ display:'flex', gap:'8px', marginTop:'12px' }}>
                    <button onClick={e => { e.stopPropagation(); updateStatus(r.id, 'resolved') }} style={{
                      padding:'6px 14px', border:'1px solid #00ffb4',
                      borderRadius:'4px', background:'rgba(0,255,180,0.08)',
                      color:'#00ffb4', cursor:'pointer', fontFamily:'inherit',
                      fontSize:'9px', letterSpacing:'1px'
                    }}>✅ MARK RESOLVED</button>
                    <button onClick={e => { e.stopPropagation(); updateStatus(r.id, 'rejected') }} style={{
                      padding:'6px 14px', border:'1px solid #ff4444',
                      borderRadius:'4px', background:'rgba(255,68,68,0.08)',
                      color:'#ff4444', cursor:'pointer', fontFamily:'inherit',
                      fontSize:'9px', letterSpacing:'1px'
                    }}>❌ REJECT</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{ marginTop:'30px', textAlign:'center' }}>
          <a href="/" style={{ fontSize:'10px', color:'rgba(0,255,180,0.3)', letterSpacing:'2px', textDecoration:'none' }}>
            ← BACK TO CIVICALERT APP
          </a>
        </div>
      </div>
    </div>
  )
}