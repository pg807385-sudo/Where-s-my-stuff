import { useEffect, useMemo, useRef, useState } from 'react'
import { Sidebar, BottomNav } from './components/Navigation'
import TopBar from './components/TopBar'
import HomeView from './components/HomeView'
import SearchView from './components/SearchView'
import LocationsView from './components/LocationsView'
import RemindersView from './components/RemindersView'
import SettingsView from './components/SettingsView'
import ItemFormModal from './components/ItemFormModal'
import ItemDetailModal from './components/ItemDetailModal'
import ConfirmDialog from './components/ConfirmDialog'
import ToastStack from './components/ToastStack'
import { useItems } from './hooks/useItems'
import { useLocalStorage } from './hooks/useLocalStorage'
import { useToasts } from './hooks/useToasts'
// NEW: notification utilities
import {
  requestNotificationPermission,
  scheduleReminder,
  cancelReminder,
  cancelAllReminders,
  checkDueReminders,
  showBrowserNotification,
  clearReminderShown,
} from './utils/notifications'

export default function App() {
  const { items, status, addItem, updateItem, deleteItem, clearAll, importItems } = useItems()
  const [darkMode, setDarkMode] = useLocalStorage('wms:dark-mode', false)
  const { toasts, showToast, dismissToast } = useToasts()

  const [activeTab, setActiveTab] = useState('home')
  const [query, setQuery] = useState('')
  const [selectedLocation, setSelectedLocation] = useState(null)

  const [formOpen, setFormOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [detailItem, setDetailItem] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  // Ref to access latest items inside the interval without restarting it
  const itemsRef = useRef(items)
  itemsRef.current = items

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  // NEW: Request notification permission on first load
  useEffect(() => {
    requestNotificationPermission()

    // Check immediately for reminders that became due while app was closed
    checkDueReminders(itemsRef.current, (item) => {
      showBrowserNotification(item)
      showToast(`Reminder: ${item.name} at ${item.location}`, 'error')
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // NEW: Background check every 30s for due reminders while app is open
  useEffect(() => {
    const interval = setInterval(() => {
      checkDueReminders(itemsRef.current, (item) => {
        showBrowserNotification(item)
        showToast(`Reminder: ${item.name} at ${item.location}`, 'error')
      })
    }, 30000)
    return () => clearInterval(interval)
  }, [showToast])

  const knownLocations = useMemo(
    () => [...new Set(items.map((i) => i.location).filter(Boolean))].sort(),
    [items]
  )

  const openAdd = () => {
    setEditingItem(null)
    setFormOpen(true)
  }

  const openEdit = (item) => {
    setDetailItem(null)
    setEditingItem(item)
    setFormOpen(true)
  }

  const handleFormSubmit = (data) => {
    if (editingItem) {
      // NEW: clear the old \"shown\" lock so the updated reminder can fire
      clearReminderShown(editingItem.id)
      updateItem(editingItem.id, data)
      // NEW: schedule the updated reminder (or cancel if removed)
      if (data.reminder) {
        scheduleReminder({ ...editingItem, ...data })
      } else {
        cancelReminder(editingItem.id)
      }
      showToast(`${data.name} updated!`)
    } else {
      const newItem = addItem(data)
      // NEW: schedule native reminder if set
      if (data.reminder) {
        scheduleReminder(newItem)
      }
      showToast(`${data.name} saved!`)
    }
    setFormOpen(false)
    setEditingItem(null)
  }

  const handleDeleteConfirmed = () => {
    if (!deleteTarget) return
    // NEW: cancel the native reminder before deleting
    cancelReminder(deleteTarget.id)
    deleteItem(deleteTarget.id)
    showToast(`${deleteTarget.name} deleted.`)
    setDeleteTarget(null)
    setDetailItem(null)
  }

  const handleGoToLocation = (loc) => {
    setActiveTab('locations')
    setSelectedLocation(loc)
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    if (tab !== 'locations') setSelectedLocation(null)
  }

  // NEW: wrapped clearAll so we also wipe pending native notifications
  const handleClearAll = () => {
    cancelAllReminders()
    clearAll()
  }

  const sharedItemHandlers = {
    onOpenItem: setDetailItem,
    onEditItem: openEdit,
    onDeleteItem: setDeleteTarget,
  }

  return (
    <div className="min-h-screen flex bg-paper dark:bg-paper-dark">
      <Sidebar active={activeTab} onChange={handleTabChange} onAdd={openAdd} />

      <div className="flex-1 min-w-0 pb-24 md:pb-10">
        <TopBar
          active={activeTab}
          query={query}
          onQueryChange={(v) => {
            setQuery(v)
            if (activeTab !== 'search') setActiveTab('search')
          }}
          onSubmitSearch={() => setActiveTab('search')}
          onAdd={openAdd}
        />

        <main className="px-4 md:px-8 pt-2">
          {status === 'loading' && <LoadingGrid />}

          {status === 'error' && (
            <div className="text-center py-16">
              <p className="text-sm text-clay-500 font-medium">
                Something went wrong loading your items.
              </p>
              <p className="text-xs text-ink-faint dark:text-moss-500 mt-1">
                Try refreshing the page.
              </p>
            </div>
          )}

          {status === 'ready' && (
            <>
              {activeTab === 'home' && (
                <HomeView
                  items={items}
                  onAdd={openAdd}
                  onGoToLocation={handleGoToLocation}
                  {...sharedItemHandlers}
                />
              )}
              {activeTab === 'search' && (
                <SearchView items={items} query={query} {...sharedItemHandlers} />
              )}
              {activeTab === 'locations' && (
                <LocationsView
                  items={items}
                  selectedLocation={selectedLocation}
                  onSelectLocation={setSelectedLocation}
                  {...sharedItemHandlers}
                />
              )}
              {activeTab === 'reminders' && <RemindersView items={items} {...sharedItemHandlers} />}
              {activeTab === 'settings' && (
                <SettingsView
                  darkMode={darkMode}
                  onToggleDarkMode={() => setDarkMode((d) => !d)}
                  items={items}
                  onImport={(data) => {
                    importItems(data)
                    setActiveTab('home')
                  }}
                  onClearAll={handleClearAll}
                  showToast={showToast}
                />
              )}
            </>
          )}
        </main>
      </div>

      <BottomNav active={activeTab} onChange={handleTabChange} />

      <ItemFormModal
        open={formOpen}
        onClose={() => {
          setFormOpen(false)
          setEditingItem(null)
        }}
        onSubmit={handleFormSubmit}
        initialItem={editingItem}
        knownLocations={knownLocations}
      />

      <ItemDetailModal
        item={detailItem}
        onClose={() => setDetailItem(null)}
        onEdit={openEdit}
        onDelete={setDeleteTarget}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title={`Delete ${deleteTarget?.name || 'item'}?`}
        description="This item will be permanently removed from this device. This cannot be undone."
        confirmLabel="Delete"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirmed}
      />

      <ToastStack toasts={toasts} onDismiss={dismissToast} />
    </div>
  )
}

function LoadingGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="skeleton h-24 rounded-tag" />
      ))}
    </div>
  )
        }
