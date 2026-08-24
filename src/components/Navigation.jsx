import { Home, Search, MapPin, Bell, Settings, Plus } from 'lucide-react'

const TABS = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'search', label: 'Search', icon: Search },
  { id: 'locations', label: 'Locations', icon: MapPin },
  { id: 'reminders', label: 'Reminders', icon: Bell },
  { id: 'settings', label: 'Settings', icon: Settings },
]

export function Sidebar({ active, onChange, onAdd }) {
  return (
    <aside className="hidden md:flex flex-col w-64 shrink-0 h-screen sticky top-0 border-r border-ink/[0.06] dark:border-moss-800 px-4 py-6">
      <div className="flex items-center gap-2 px-2 mb-8">
        <div className="w-9 h-9 rounded-xl overflow-hidden shrink-0">
          <img src="/logo.png" alt="Where's My Stuff? logo" className="w-full h-full object-contain" />
        </div>
        <span className="font-display font-semibold text-[17px] text-ink dark:text-moss-50 leading-tight">
          Where's My Stuff?
        </span>
      </div>

      <button
        onClick={onAdd}
        className="flex items-center justify-center gap-2 rounded-full bg-moss-500 hover:bg-moss-600 text-white font-semibold text-sm py-2.5 mb-6 transition-colors shadow-tag"
      >
        <Plus size={16} /> Add item
      </button>

      <nav className="flex flex-col gap-1">
        {TABS.map((tab) => {
          const Icon = tab.icon
          const isActive = active === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left
                ${
                  isActive
                    ? 'bg-moss-500/10 text-moss-700 dark:text-moss-200'
                    : 'text-ink-soft dark:text-moss-400 hover:bg-ink/5 dark:hover:bg-moss-800'
                }`}
            >
              <Icon size={17} strokeWidth={isActive ? 2.4 : 2} />
              {tab.label}
            </button>
          )
        })}
      </nav>

      <p className="mt-auto px-3 text-[11px] text-ink-faint dark:text-moss-600">
        Stored locally on this device.
      </p>
    </aside>
  )
}

export function BottomNav({ active, onChange }) {
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-white/95 dark:bg-card-dark/95 backdrop-blur border-t border-ink/[0.06] dark:border-moss-800 pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-stretch justify-around">
        {TABS.map((tab) => {
          const Icon = tab.icon
          const isActive = active === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className="flex flex-col items-center gap-1 py-2.5 px-3 flex-1 relative"
              aria-label={tab.label}
              aria-current={isActive}
            >
              <Icon
                size={20}
                strokeWidth={isActive ? 2.4 : 2}
                className={isActive ? 'text-moss-600 dark:text-moss-300' : 'text-ink-faint dark:text-moss-500'}
              />
              <span
                className={`text-[10px] font-medium ${
                  isActive ? 'text-moss-700 dark:text-moss-200' : 'text-ink-faint dark:text-moss-500'
                }`}
              >
                {tab.label}
              </span>
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[2.5px] rounded-full bg-moss-500" />
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
