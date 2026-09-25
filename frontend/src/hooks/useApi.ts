import { useState, useEffect } from 'react'

const safeErrorMessage = (err: any): string => {
  if (!err) return 'Unknown error'
  if (err.response?.data?.detail) {
    const d = err.response.data.detail
    if (typeof d === 'string') return d
    try { return JSON.stringify(d) } catch { return 'Request failed' }
  }
  if (typeof err.message === 'string') return err.message
  return 'Request failed'
}

export function useApi<T>(fetcher: () => Promise<T[]>, deps: any[] = []) {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await fetcher()
      setData(result)
      setLastUpdated(new Date().toLocaleTimeString())
    } catch (err: any) {
      setError(safeErrorMessage(err))
      setLastUpdated(new Date().toLocaleTimeString())
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, deps) // Auto-refetch when deps change

  return { data, loading, error, lastUpdated, refetch: fetchData }
}
