import { useMemo } from 'react'
import { Bell, MapPin, Pencil, Trash2 } from 'lucide-react'
import EmptyState from './EmptyState'

function formatReminder(iso) {
  const d = new Date(iso)
  return d.toLocaleString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export default function RemindersView({ items, onOpenItem, onEditItem, onDeleteItem }) {
  const { upcoming, past } = useMemo(() => {
    const now = Date.now()
    const withReminders = items.filter((i) => i.reminder)
    return {
      upcoming: withReminders
        .filter((i) => new Date(i.reminder).getTime() >= now)
        .sort((a, b) => new Date(a.reminder) - new Date(b.reminder)),
      past: withReminders
        .filter((i) => new Date(i.reminder).getTime() < now)
        .sort((a, b) => new Date(b.reminder) - new Date(a.reminder)),
    }
  }, [items])

  if (upcoming.length === 0 && past.length === 0) {
    return (
      <EmptyState
        icon={Bell}
        title="No reminders set"
        description={'Add a reminder to an item, like “take my calculator tomorrow at 8:00 AM.”'}
      />
    )
  }

  return (
    <div className="space-y-8">
      {upcoming.length > 0 && (
        <section>
          <h2 className="font-display font-semibold text-[15px] text-ink dark:text-moss-50 mb-3">
            Upcoming reminders
          </h2>
          <div className="flex flex-col gap-2.5">
            {upcoming.map((item) => (
              <ReminderRow
                key={item.id}
                item={item}
                onOpenItem={onOpenItem}
                onEditItem={onEditItem}
                onDeleteItem={onDeleteItem}
              />
            ))}
          </div>
        </section>
      )}

      {past.length > 0 && (
        <section>
          <h2 className="font-display font-semibold text-[15px] text-ink-soft dark:text-moss-400 mb-3">
            Past reminders
          </h2>
          <div className="flex flex-col gap-2.5 opacity-70">
            {past.map((item) => (
              <ReminderRow
                key={item.id}
                item={item}
                onOpenItem={onOpenItem}
                onEditItem={onEditItem}
                onDeleteItem={onDeleteItem}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

function ReminderRow({ item, onOpenItem, onEditItem, onDeleteItem }) {
  return (
    <div
      className="flex items-center gap-3 bg-white dark:bg-card-dark border border-ink/[0.06] dark:border-moss-800 rounded-2xl px-4 py-3.5 cursor-pointer hover:shadow-tag transition-all"
      onClick={() => onOpenItem(item)}
    >
      <div className="w-9 h-9 rounded-full bg-amber-400/15 flex items-center justify-center shrink-0">
        <Bell size={15} className="text-amber-600" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm text-ink dark:text-moss-50 truncate">{item.name}</p>
        <div className="flex items-center gap-1 text-xs text-ink-faint dark:text-moss-500 mt-0.5">
          <MapPin size={11} />
          <span className="truncate">{item.location}</span>
          <span>·</span>
          <span>{formatReminder(item.reminder)}</span>
        </div>
      </div>
      <div className="flex gap-1 shrink-0">
        <button
          onClick={(e) => {
            e.stopPropagation()
            onEditItem(item)
          }}
          className="p-1.5 rounded-full text-ink-soft hover:text-moss-600 hover:bg-moss-50 dark:text-moss-400 dark:hover:bg-moss-800 transition-colors"
          aria-label={`Edit ${item.name}`}
        >
          <Pencil size={14} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDeleteItem(item)
          }}
          className="p-1.5 rounded-full text-ink-soft hover:text-clay-500 hover:bg-clay-500/10 dark:text-moss-400 transition-colors"
          aria-label={`Delete ${item.name}`}
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  )
}
