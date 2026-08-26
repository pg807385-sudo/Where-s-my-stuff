import { useCallback, useEffect, useRef, useState } from 'react'

export function useToasts() {
  const [toasts, setToasts] = useState([])
  const counter = useRef(0)
  const timers = useRef(new Map())

  useEffect(() => {
    return () => {
      timers.current.forEach((timerId) => clearTimeout(timerId))
      timers.current.clear()
    }
  }, [])

  const dismissToast = useCallback((id) => {
    const timerId = timers.current.get(id)
    if (timerId) {
      clearTimeout(timerId)
      timers.current.delete(id)
    }
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const showToast = useCallback(
    (message, variant = 'success') => {
      const id = ++counter.current
      setToasts((prev) => [...prev, { id, message, variant }])

      const timerId = setTimeout(() => {
        timers.current.delete(id)
        dismissToast(id)
      }, 3200)
      timers.current.set(id, timerId)
    },
    [dismissToast]
  )

  return { toasts, showToast, dismissToast }
}
