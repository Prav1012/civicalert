import axios from 'axios'
import { useLocation } from '../hooks/useLocation'

const SERVICES = [
  { key: 'police',    label: 'POLICE',      number: '100',  emoji: '👮', color: '#4488ff' },
  { key: 'ambulance', label: 'AMBULANCE',   number: '108',  emoji: '🚑', color: '#ff4444' },
  { key: 'fire',      label: 'FIRE',        number: '101',  emoji: '🔥', color: '#ff8800' },
  { key: 'disaster',  label: 'DISASTER',    number: '1077', emoji: '⚠️', color: '#ffcc00' },
  { key: 'women',     label: 'WOMEN HELP',  number: '1091', emoji: '🛡️', color: '#ff66cc' },
  { key: 'child',     label: 'CHILD HELP',  number: '1098', emoji: '👶', color: '#aa88ff' },
]

export default function EmergencyPanel() {
  const { coords, fetchLocation } = useLocation()

  const sendAlert = async (service) => {
    if (!coords) { fetchLocation(); return }
    try {
      await axios.post('http://localhost:8000/emergency/alert', {
        service_type: service.key,
        latitude: coords.lat,
        longitude: coords.lng,
        description: 'Emergency alert from CivicAlert'
      })
      alert(`🚨 Alert sent to ${service.label}!`)
    } catch {
      alert('⚠️ Alert failed. Please call directly.')
    }
  }

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <div style={{ fontSize: '32px', marginBottom: '8px' }}>🆘</div>
        <div style={{ fontSize: '10px', letterSpacing: '4px', color: '#ff4444' }}>EMERGENCY SERVICES</div>
        <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', marginTop: '4px' }}>
          TAP CALL TO DIAL · TAP ALERT TO SEND LOCATION 📍
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        {SERVICES.map(s => (
          <div key={s.key} style={{
            border: `1px solid ${s.color}33`,
            borderRadius: '8px', padding: '16px',
            background: `${s.color}08`
          }}>
            <div style={{ fontSize: '24px', marginBottom: '6px' }}>{s.emoji}</div>
            <div style={{ fontSize: '10px', letterSpacing: '2px', color: s.color, marginBottom: '2px' }}>{s.label}</div>
            <div style={{ fontSize: '16px', fontWeight: 'bold', color: 'white', marginBottom: '12px' }}>{s.number}</div>
            <div style={{ display: 'flex', gap: '6px' }}>
              <a href={`tel:${s.number}`} style={{
                flex: 1, padding: '7px', textAlign: 'center',
                background: s.color, borderRadius: '4px',
                color: '#000', fontSize: '10px', fontWeight: 'bold',
                textDecoration: 'none', letterSpacing: '1px'
              }}>📞 CALL</a>
              <button onClick={() => sendAlert(s)} style={{
                flex: 1, padding: '7px',
                border: `1px solid ${s.color}`, borderRadius: '4px',
                background: 'transparent', color: s.color,
                cursor: 'pointer', fontSize: '10px',
                fontFamily: 'inherit', letterSpacing: '1px'
              }}>📡 ALERT</button>
            </div>
          </div>
        ))}
      </div>

      <div style={{
        marginTop: '20px', padding: '12px',
        border: '1px solid rgba(255,68,68,0.2)', borderRadius: '4px',
        fontSize: '10px', color: 'rgba(255,255,255,0.3)',
        textAlign: 'center', letterSpacing: '1px'
      }}>
        ⚠️ FOR LIFE-THREATENING EMERGENCIES ALWAYS CALL DIRECTLY
      </div>
    </div>
  )
}