import { CheckCircle2, AlertTriangle, X } from 'lucide-react'

export default function ToastStack({ toasts, onDismiss }) {
  if (toasts.length === 0) return null
  return (
    <div className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-[70] flex flex-col gap-2 w-[calc(100%-2rem)] max-w-sm">
      {toasts.map((t) => (
        <div
          key={t.id}
          role="status"
          className={`animate-toast-in flex items-center gap-2.5 rounded-2xl border px-4 py-3 shadow-tagHover backdrop-blur
            ${
              t.variant === 'error'
                ? 'bg-clay-500/95 border-clay-600 text-white'
                : 'bg-ink/95 dark:bg-moss-800/95 border-ink/10 text-paper'
            }`}
        >
          {t.variant === 'error' ? (
            <AlertTriangle size={18} className="shrink-0" />
          ) : (
            <CheckCircle2 size={18} className="shrink-0 text-moss-300" />
          )}
          <p className="text-sm font-medium flex-1">{t.message}</p>
          <button
            onClick={() => onDismiss(t.id)}
            className="shrink-0 opacity-70 hover:opacity-100 transition-opacity"
            aria-label="Dismiss notification"
          >
            <X size={15} />
          </button>
        </div>
      ))}
    </div>
  )
}
