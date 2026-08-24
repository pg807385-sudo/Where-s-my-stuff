import { useMemo } from 'react'
import { MapPin, ChevronLeft, ChevronRight } from 'lucide-react'
import ItemCard from './ItemCard'
import EmptyState from './EmptyState'

export default function LocationsView({
  items,
  selectedLocation,
  onSelectLocation,
  onOpenItem,
  onEditItem,
  onDeleteItem,
}) {
  const locations = useMemo(() => {
    const map = {}
    for (const it of items) {
      const loc = it.location || 'Unspecified'
      if (!map[loc]) map[loc] = []
      map[loc].push(it)
    }
    return Object.entries(map).sort((a, b) => b[1].length - a[1].length)
  }, [items])

  if (locations.length === 0) {
    return (
      <EmptyState
        icon={MapPin}
        title="No locations yet"
        description="Once you add items, the places you use most will show up here."
      />
    )
  }

  if (selectedLocation) {
    const itemsHere = items.filter((it) => (it.location || 'Unspecified') === selectedLocation)
    return (
      <div>
        <button
          onClick={() => onSelectLocation(null)}
          className="flex items-center gap-1 text-sm font-medium text-moss-600 dark:text-moss-300 mb-4 hover:text-moss-700 transition-colors"
        >
          <ChevronLeft size={16} /> All locations
        </button>
        <div className="flex items-center gap-2 mb-4">
          <MapPin size={18} className="text-moss-500" />
          <h2 className="font-display font-semibold text-xl text-ink dark:text-moss-50">
            {selectedLocation}
          </h2>
          <span className="label-chip text-ink-faint dark:text-moss-500">
            {itemsHere.length} {itemsHere.length === 1 ? 'item' : 'items'}
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {itemsHere.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              onOpen={onOpenItem}
              onEdit={onEditItem}
              onDelete={onDeleteItem}
              compact
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2.5">
      {locations.map(([loc, its]) => (
        <button
          key={loc}
          onClick={() => onSelectLocation(loc)}
          className="flex items-center gap-3 bg-white dark:bg-card-dark border border-ink/[0.06] dark:border-moss-800 rounded-2xl px-4 py-3.5 text-left hover:shadow-tag hover:-translate-y-0.5 transition-all"
        >
          <div className="w-9 h-9 rounded-full bg-moss-500/10 flex items-center justify-center shrink-0">
            <MapPin size={16} className="text-moss-600 dark:text-moss-300" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm text-ink dark:text-moss-50 truncate">{loc}</p>
            <p className="text-xs text-ink-faint dark:text-moss-500">
              {its.length} {its.length === 1 ? 'item' : 'items'}
            </p>
          </div>
          <ChevronRight size={16} className="text-ink-faint dark:text-moss-600 shrink-0" />
        </button>
      ))}
    </div>
  )
}
