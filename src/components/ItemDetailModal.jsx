import { X, MapPin, Calendar, Bell, Pencil, Trash2, ImageOff } from 'lucide-react'

function formatFull(iso) {
  return new Date(iso).toLocaleString(undefined, {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export default function ItemDetailModal({ item, onClose, onEdit, onDelete }) {
  if (!item) return null

  return (
    <div className="fixed inset-0 z-[75] flex items-end md:items-center justify-center">
      <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm animate-toast-in" onClick={onClose} />
      <div className="relative w-full md:w-[440px] md:mx-4 max-h-[92vh] overflow-y-auto bg-paper dark:bg-card-dark rounded-t-[28px] md:rounded-[28px] shadow-pop animate-sheet-in md:animate-pop-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 dark:bg-ink/80 text-ink dark:text-moss-100 hover:bg-white transition-colors shadow-tag"
          aria-label="Close"
        >
          <X size={17} />
        </button>

        <div className="w-full aspect-[4/3] bg-moss-50 dark:bg-moss-800 flex items-center justify-center overflow-hidden">
          {item.photo ? (
            <img src={item.photo} alt={item.name} className="w-full h-full object-cover" />
          ) : (
            <ImageOff size={36} className="text-moss-300 dark:text-moss-600" />
          )}
        </div>

        <div className="px-6 py-5 space-y-5">
          <div>
            <h2 className="font-display font-semibold text-2xl text-ink dark:text-moss-50">
              {item.name}
            </h2>
            <div className="flex items-center gap-1.5 mt-2 text-moss-600 dark:text-moss-300">
              <MapPin size={14} />
              <span className="label-chip">{item.location || 'No location set'}</span>
            </div>
          </div>

          {item.description && (
            <p className="text-sm text-ink-soft dark:text-moss-300 leading-relaxed">
              {item.description}
            </p>
          )}

          <div className="space-y-2.5 border-t border-ink/[0.06] dark:border-moss-800 pt-4">
            <div className="flex items-center gap-2.5 text-sm text-ink-soft dark:text-moss-400">
              <Calendar size={14} className="text-moss-500" />
              <span>Added {formatFull(item.createdAt)}</span>
            </div>
            {item.reminder && (
              <div className="flex items-center gap-2.5 text-sm text-ink-soft dark:text-moss-400">
                <Bell size={14} className="text-amber-500" />
                <span>Reminder {formatFull(item.reminder)}</span>
              </div>
            )}
          </div>

          <div className="flex gap-2.5 pt-1">
            <button
              onClick={() => onEdit(item)}
              className="flex-1 flex items-center justify-center gap-1.5 rounded-full border border-ink/10 dark:border-moss-700 py-2.5 text-sm font-semibold text-ink dark:text-moss-100 hover:bg-ink/5 dark:hover:bg-moss-800 transition-colors"
            >
              <Pencil size={14} /> Edit
            </button>
            <button
              onClick={() => onDelete(item)}
              className="flex-1 flex items-center justify-center gap-1.5 rounded-full bg-clay-500/10 text-clay-500 py-2.5 text-sm font-semibold hover:bg-clay-500/20 transition-colors"
            >
              <Trash2 size={14} /> Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
