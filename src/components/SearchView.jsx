import { useMemo } from 'react'
import { Search as SearchIcon } from 'lucide-react'
import ItemCard from './ItemCard'
import EmptyState from './EmptyState'
import { searchItems } from '../utils/search'

export default function SearchView({ items, query, onOpenItem, onEditItem, onDeleteItem }) {
  const results = useMemo(() => searchItems(items, query), [items, query])

  if (!query.trim()) {
    return (
      <EmptyState
        icon={SearchIcon}
        title="Search your stuff"
        description={'Try “calculator”, “blue drawer”, or “things in my backpack.”'}
      />
    )
  }

  if (results.length === 0) {
    return (
      <EmptyState
        icon={SearchIcon}
        title="No matches"
        description={`Nothing found for “${query}”. Try a different word or location.`}
      />
    )
  }

  return (
    <div className="space-y-3">
      <p className="text-xs font-mono uppercase tracking-wide text-ink-faint dark:text-moss-500">
        {results.length} {results.length === 1 ? 'match' : 'matches'} for “{query}”
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {results.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            onOpen={onOpenItem}
            onEdit={onEditItem}
            onDelete={onDeleteItem}
          />
        ))}
      </div>
    </div>
  )
}
