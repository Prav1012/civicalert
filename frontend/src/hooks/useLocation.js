import { useState } from 'react'

export function useLocation() {
  const [coords, setCoords]   = useState(null)
  const [error,  setError]    = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchLocation = () => {
    setLoading(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setLoading(false)
      },
      (err) => { setError(err.message); setLoading(false) },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  return { coords, error, loading, fetchLocation }
}