import { MapPin, Pencil, Trash2, ImageOff } from 'lucide-react'

function formatDate(iso) {
  const d = new Date(iso)
  const now = new Date()
  const isToday = d.toDateString() === now.toDateString()
  if (isToday) {
    return `Today, ${d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}`
  }
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

export default function ItemCard({ item, onOpen, onEdit, onDelete, compact = false }) {
  return (
    <div
      className="tag-hole group relative bg-white dark:bg-card-dark rounded-tag shadow-tag hover:shadow-tagHover
        border border-ink/[0.06] dark:border-moss-800 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer overflow-hidden"
      onClick={() => onOpen(item)}
    >
      <div className="flex gap-3 p-3.5 pl-5">
        <div className="shrink-0 w-16 h-16 rounded-2xl overflow-hidden bg-moss-50 dark:bg-moss-800 flex items-center justify-center">
          {item.photo ? (
            <img src={item.photo} alt={item.name} className="w-full h-full object-cover" />
          ) : (
            <ImageOff size={18} className="text-moss-300 dark:text-moss-600" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display font-semibold text-[15px] text-ink dark:text-moss-50 truncate">
              {item.name}
            </h3>
          </div>
          <div className="flex items-center gap-1 text-moss-600 dark:text-moss-300 mt-1">
            <MapPin size={12} className="shrink-0" />
            <span className="label-chip truncate">{item.location || 'No location'}</span>
          </div>
          {!compact && item.description && (
            <p className="text-xs text-ink-soft dark:text-moss-400 mt-1.5 line-clamp-1">
              {item.description}
            </p>
          )}
          <p className="text-[11px] text-ink-faint dark:text-moss-500 mt-1.5">
            Added {formatDate(item.createdAt)}
          </p>
        </div>

        <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onEdit(item)
            }}
            className="p-1.5 rounded-full text-ink-soft hover:text-moss-600 hover:bg-moss-50 dark:text-moss-400 dark:hover:bg-moss-800 transition-colors"
            aria-label={`Edit ${item.name}`}
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDelete(item)
            }}
            className="p-1.5 rounded-full text-ink-soft hover:text-clay-500 hover:bg-clay-500/10 dark:text-moss-400 transition-colors"
            aria-label={`Delete ${item.name}`}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
      <div className="tag-stub h-[1px] mx-3.5" />
    </div>
  )
}
