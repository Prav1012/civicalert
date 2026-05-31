import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'

const QUEUE_KEY = 'civic_offline_queue'

export function useOfflineQueue() {
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  const flushQueue = useCallback(async () => {
    const queue = JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]')
    if (!queue.length) return
    for (const report of queue) {
      try {
        await axios.post('http://127.0.0.1:8000/reports/submit', report)
      } catch  { return }
    }
    localStorage.removeItem(QUEUE_KEY)
  }, [])

  useEffect(() => {
    const goOnline  = () => { setIsOnline(true); flushQueue(); }
    const goOffline = () => setIsOnline(false)
    window.addEventListener('online',  goOnline)
    window.addEventListener('offline', goOffline)
    return () => {
      window.removeEventListener('online',  goOnline)
      window.removeEventListener('offline', goOffline)
    }
  }, [flushQueue])

  const queueReport = (formData) => {
    const queue = JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]')
    queue.push({ ...formData, queuedAt: Date.now() })
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue))
  }

  return { isOnline, queueReport, flushQueue }
}