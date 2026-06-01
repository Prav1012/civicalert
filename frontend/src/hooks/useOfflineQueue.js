import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../supabase'

const QUEUE_KEY = 'civic_offline_queue'

export function useOfflineQueue() {
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  const flushQueue = useCallback(async () => {
    const queue = JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]')
    if (!queue.length) return
    for (const report of queue) {
      try {
        await supabase.from('reports').insert([{
          anonymous_id:       'anon_' + Math.random().toString(36).slice(2),
          category:           report.category,
          severity:           report.severity,
          description:        report.description,
          latitude:           report.latitude,
          longitude:          report.longitude,
          blockchain_tx_hash: '0xoffline_' + Date.now(),
          status:             'pending'
        }])
      } catch { return }
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