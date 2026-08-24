import { Search, Plus } from 'lucide-react'

const TITLES = {
  home: 'Home',
  search: 'Search',
  locations: 'Locations',
  reminders: 'Reminders',
  settings: 'Settings',
}

export default function TopBar({ active, query, onQueryChange, onSubmitSearch, onAdd }) {
  return (
    <header className="sticky top-0 z-40 bg-paper/90 dark:bg-paper-dark/90 backdrop-blur px-4 md:px-8 pt-5 pb-3 md:pt-8">
      <div className="flex items-center justify-between md:hidden mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg overflow-hidden">
            <img src="/logo.png" alt="Where's My Stuff? logo" className="w-full h-full object-contain" />
          </div>
          <span className="font-display font-semibold text-[16px] text-ink dark:text-moss-50">
            Where's My Stuff?
          </span>
        </div>
        <button
          onClick={onAdd}
          className="w-9 h-9 rounded-full bg-moss-500 hover:bg-moss-600 text-white flex items-center justify-center transition-colors shadow-tag"
          aria-label="Add item"
        >
          <Plus size={18} />
        </button>
      </div>

      <div className="hidden md:flex items-center justify-between mb-5">
        <h1 className="font-display font-semibold text-2xl text-ink dark:text-moss-50">
          {TITLES[active]}
        </h1>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 rounded-full bg-moss-500 hover:bg-moss-600 text-white font-semibold text-sm px-4 py-2.5 transition-colors shadow-tag"
        >
          <Plus size={16} /> Add Item
        </button>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          onSubmitSearch()
        }}
        className="relative"
      >
        <Search
          size={17}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-faint dark:text-moss-500"
        />
        <input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Where is my stuff?"
          className="w-full rounded-full bg-white dark:bg-card-dark border border-ink/[0.08] dark:border-moss-800 pl-11 pr-4 py-3 text-sm text-ink dark:text-moss-50 placeholder:text-ink-faint dark:placeholder:text-moss-500 outline-none focus:border-moss-400 transition-colors shadow-tag"
        />
      </form>
    </header>
  )
}
