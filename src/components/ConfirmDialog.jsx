import { AlertTriangle } from 'lucide-react'

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  danger = true,
  onConfirm,
  onCancel,
}) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-[80] flex items-end md:items-center justify-center">
      <div
        className="absolute inset-0 bg-ink/40 backdrop-blur-sm animate-toast-in"
        onClick={onCancel}
      />
      <div className="relative w-full md:w-[420px] md:mx-4 bg-white dark:bg-card-dark rounded-t-3xl md:rounded-3xl p-6 shadow-pop animate-sheet-in md:animate-pop-in">
        <div className="flex items-start gap-3">
          <div
            className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
              danger ? 'bg-clay-500/10 text-clay-500' : 'bg-moss-500/10 text-moss-600'
            }`}
          >
            <AlertTriangle size={19} />
          </div>
          <div>
            <h3 className="font-display font-semibold text-lg text-ink dark:text-moss-50">
              {title}
            </h3>
            <p className="text-sm text-ink-soft dark:text-moss-300 mt-1 leading-relaxed">
              {description}
            </p>
          </div>
        </div>
        <div className="flex gap-2.5 mt-6">
          <button
            onClick={onCancel}
            className="flex-1 rounded-full border border-ink/10 dark:border-moss-700 py-2.5 text-sm font-semibold text-ink dark:text-moss-100 hover:bg-ink/5 dark:hover:bg-moss-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 rounded-full py-2.5 text-sm font-semibold text-white transition-colors ${
              danger ? 'bg-clay-500 hover:bg-clay-600' : 'bg-moss-500 hover:bg-moss-600'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
