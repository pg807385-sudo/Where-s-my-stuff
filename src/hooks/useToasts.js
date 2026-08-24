import { useCallback, useRef, useState } from 'react'

export function useToasts() {
  const [toasts, setToasts] = useState([])
  const counter = useRef(0)

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const showToast = useCallback(
    (message, variant = 'success') => {
      const id = ++counter.current
      setToasts((prev) => [...prev, { id, message, variant }])
      setTimeout(() => dismissToast(id), 3200)
    },
    [dismissToast]
  )

  return { toasts, showToast, dismissToast }
}
