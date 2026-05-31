import { useState } from 'react'
import ReportForm from './components/ReportForm'
import EmergencyPanel from './components/EmergencyPanel'

export default function App() {
  const [tab, setTab] = useState('report')

  return (
    <div style={{
      minHeight: '100vh',
      background: '#010b13',
      color: '#e0f7fa',
      fontFamily: "'Courier New', monospace",
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Grid background */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0,
        backgroundImage: `
          linear-gradient(rgba(0,255,200,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,255,200,0.03) 1px, transparent 1px)`,
        backgroundSize: '40px 40px'
      }} />

      {/* Glow orb */}
      <div style={{
        position: 'fixed', top: '-100px', left: '50%',
        transform: 'translateX(-50%)',
        width: '400px', height: '400px',
        background: 'radial-gradient(circle, rgba(0,255,180,0.08) 0%, transparent 70%)',
        zIndex: 0, pointerEvents: 'none'
      }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '520px', margin: '0 auto', padding: '20px 16px' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', borderBottom: '1px solid rgba(0,255,180,0.15)', paddingBottom: '16px' }}>
          <div>
            <div style={{ fontSize: '11px', color: '#00ffb4', letterSpacing: '4px', marginBottom: '2px' }}>◈ SYSTEM ACTIVE</div>
            <h1 style={{ fontSize: '22px', fontWeight: 'bold', color: '#00ffb4', margin: 0, letterSpacing: '2px' }}>
              ⚡ CIVICALERT
            </h1>
          </div>
          <div style={{
            fontSize: '10px', letterSpacing: '2px',
            border: '1px solid rgba(0,255,180,0.3)',
            padding: '6px 12px', borderRadius: '4px',
            color: navigator.onLine ? '#00ffb4' : '#ff4444',
            background: navigator.onLine ? 'rgba(0,255,180,0.05)' : 'rgba(255,68,68,0.05)'
          }}>
            {navigator.onLine ? '🟢 ONLINE' : '🔴 OFFLINE'}
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '24px' }}>
          {[
            { key: 'report',    label: '📋 REPORT',    color: '#00ffb4' },
            { key: 'emergency', label: '🚨 SOS',        color: '#ff4444' },
            { key: 'dev',       label: '🛠️ DEV PANEL', color: '#00aaff' },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              flex: 1, padding: '10px 4px',
              background: tab === t.key ? 'rgba(0,255,180,0.08)' : 'transparent',
              border: `1px solid ${tab === t.key ? t.color : 'rgba(255,255,255,0.1)'}`,
              borderRadius: '4px', cursor: 'pointer',
              color: tab === t.key ? t.color : 'rgba(255,255,255,0.4)',
              fontSize: '10px', letterSpacing: '1px', fontFamily: 'inherit',
              fontWeight: tab === t.key ? 'bold' : 'normal',
              transition: 'all 0.2s'
            }}>{t.label}</button>
          ))}
        </div>

        {tab === 'report'    && <ReportForm />}
        {tab === 'emergency' && <EmergencyPanel />}

      </div>
    </div>
  )
}