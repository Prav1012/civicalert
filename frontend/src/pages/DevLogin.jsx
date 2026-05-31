import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const DEV_PASSWORD = 'prav@1012'

export default function DevLogin() {
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const navigate = useNavigate()

  const handleLogin = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      if (password === DEV_PASSWORD) {
        sessionStorage.setItem('dev_auth', 'true')
        navigate('/dev/dashboard')
      } else {
        setError('⛔ ACCESS DENIED — Invalid credentials')
      }
      setLoading(false)
    }, 800)
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#010b13',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Courier New', monospace",
      backgroundImage: `
        linear-gradient(rgba(0,170,255,0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0,170,255,0.03) 1px, transparent 1px)`,
      backgroundSize: '40px 40px'
    }}>
      <div style={{ width: '100%', maxWidth: '380px', padding: '16px' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>🛡️</div>
          <div style={{ fontSize: '10px', color: 'rgba(0,170,255,0.5)', letterSpacing: '6px', marginBottom: '4px' }}>
            RESTRICTED ACCESS
          </div>
          <div style={{ fontSize: '20px', color: '#00aaff', fontWeight: 'bold', letterSpacing: '3px' }}>
            DEV PORTAL
          </div>
          <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.2)', marginTop: '6px', letterSpacing: '1px' }}>
            CIVICALERT ADMIN SYSTEM v1.0
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '8px', fontSize: '10px', color: 'rgba(0,170,255,0.5)', letterSpacing: '3px' }}>
            🔑 ACCESS KEY
          </div>
          <input
            type="password"
            value={password}
            onChange={e => { setPassword(e.target.value); setError('') }}
            placeholder="Enter developer password..."
            style={{
              width: '100%', background: 'rgba(0,170,255,0.04)',
              border: '1px solid rgba(0,170,255,0.3)', borderRadius: '4px',
              padding: '12px 16px', color: '#e0f7fa',
              fontFamily: 'inherit', fontSize: '14px',
              outline: 'none', marginBottom: '16px',
              boxSizing: 'border-box', letterSpacing: '3px'
            }}
          />

          {error && (
            <div style={{
              padding: '10px 14px', marginBottom: '16px',
              border: '1px solid rgba(255,68,68,0.3)', borderRadius: '4px',
              color: '#ff4444', fontSize: '11px', letterSpacing: '1px'
            }}>{error}</div>
          )}

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '14px',
            background: loading ? 'rgba(0,170,255,0.05)' : 'rgba(0,170,255,0.1)',
            border: '1px solid #00aaff', borderRadius: '4px',
            color: '#00aaff', cursor: loading ? 'not-allowed' : 'pointer',
            fontFamily: 'inherit', fontSize: '12px',
            letterSpacing: '4px', fontWeight: 'bold'
          }}>
            {loading ? '⏳ VERIFYING...' : '🔓 AUTHENTICATE'}
          </button>
        </form>

        <div style={{
          marginTop: '24px', textAlign: 'center',
          fontSize: '10px', color: 'rgba(255,255,255,0.15)', letterSpacing: '1px'
        }}>
          ⚠️ UNAUTHORIZED ACCESS IS PROHIBITED<br/>
          ALL ACTIVITY IS MONITORED & LOGGED 🔍
        </div>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <a href="/" style={{ fontSize: '10px', color: 'rgba(0,255,180,0.4)', letterSpacing: '2px', textDecoration: 'none' }}>
            ← BACK TO CIVICALERT
          </a>
        </div>
      </div>
    </div>
  )
}