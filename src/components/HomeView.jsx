import { useMemo } from 'react'
import { Plus, MapPin, PackagePlus } from 'lucide-react'
import ItemCard from './ItemCard'
import EmptyState from './EmptyState'
import SuggestionsSection from './SuggestionsSection'
import { buildSuggestions } from '../utils/suggestions'

export default function HomeView({ items, onOpenItem, onEditItem, onDeleteItem, onAdd, onGoToLocation }) {
  const recent = useMemo(
    () => [...items].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 6),
    [items]
  )

  const locationCounts = useMemo(() => {
    const counts = {}
    for (const it of items) {
      if (!it.location) continue
      counts[it.location] = (counts[it.location] || 0) + 1
    }
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
  }, [items])

  const suggestions = useMemo(() => buildSuggestions(items), [items])

  if (items.length === 0) {
    return (
      <EmptyState
        icon={PackagePlus}
        title="Nothing tracked yet"
        description="Add your first item and you'll always know exactly where you left it."
        action={
          <button
            onClick={onAdd}
            className="inline-flex items-center gap-2 rounded-full bg-moss-500 hover:bg-moss-600 text-white font-semibold text-sm px-5 py-2.5 transition-colors shadow-tag"
          >
            <Plus size={16} /> Add Item
          </button>
        }
      />
    )
  }

  return (
    <div className="space-y-8">
      <SuggestionsSection suggestions={suggestions} />

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display font-semibold text-[15px] text-ink dark:text-moss-50">
            Recently added
          </h2>
          <span className="label-chip text-ink-faint dark:text-moss-500">{items.length} total</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {recent.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              onOpen={onOpenItem}
              onEdit={onEditItem}
              onDelete={onDeleteItem}
            />
          ))}
        </div>
      </section>

      {locationCounts.length > 0 && (
        <section>
          <h2 className="font-display font-semibold text-[15px] text-ink dark:text-moss-50 mb-3">
            Frequently used locations
          </h2>
          <div className="flex flex-wrap gap-2">
            {locationCounts.map(([loc, count]) => (
              <button
                key={loc}
                onClick={() => onGoToLocation(loc)}
                className="flex items-center gap-1.5 bg-white dark:bg-card-dark border border-ink/[0.07] dark:border-moss-800 rounded-full pl-3 pr-3.5 py-2 text-sm font-medium text-ink dark:text-moss-100 hover:border-moss-300 hover:shadow-tag transition-all"
              >
                <MapPin size={13} className="text-moss-500" />
                {loc}
                <span className="text-ink-faint dark:text-moss-500 font-mono text-xs">{count}</span>
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
