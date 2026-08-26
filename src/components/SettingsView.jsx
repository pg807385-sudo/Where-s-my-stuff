import { useRef, useState } from 'react'
import { Moon, Sun, Download, Upload, Trash2, ChevronRight } from 'lucide-react'
import ConfirmDialog from './ConfirmDialog'

export default function SettingsView({
  darkMode,
  onToggleDarkMode,
  items,
  onImport,
  onClearAll,
  showToast,
}) {
  const [confirmClear, setConfirmClear] = useState(false)
  const fileInputRef = useRef(null)

  const handleExport = () => {
    try {
      const blob = new Blob([JSON.stringify(items, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `wheres-my-stuff-${new Date().toISOString().slice(0, 10)}.json`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
      showToast('Data exported!')
    } catch (e) {
      showToast('Export failed. Please try again.', 'error')
    }
  }

  const handleImportClick = () => fileInputRef.current?.click()

  const handleImportFile = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result)
        if (!Array.isArray(parsed)) throw new Error('Invalid format')
        onImport(parsed)
        showToast(`Imported ${parsed.length} item${parsed.length === 1 ? '' : 's'}!`)
      } catch (err) {
        showToast('That file could not be imported. Check it is a valid export.', 'error')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  return (
    <div className="space-y-6">
      <SettingsGroup title="Appearance">
        <SettingsRow
          icon={darkMode ? Moon : Sun}
          label="Dark mode"
          description="Switch between light and dark themes"
          control={
            <button
              onClick={onToggleDarkMode}
              role="switch"
              aria-checked={darkMode}
              className={`w-11 h-6 rounded-full relative transition-colors ${
                darkMode ? 'bg-moss-500' : 'bg-ink/15'
              }`}
            >
              <span
                className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                  darkMode ? 'translate-x-5' : 'translate-x-0.5'
                }`}
              />
            </button>
          }
        />
      </SettingsGroup>

      <SettingsGroup title="Your data">
        <SettingsRow
          icon={Download}
          label="Export data as JSON"
          description={`Download all ${items.length} items as a backup file`}
          onClick={handleExport}
          control={<ChevronRight size={16} className="text-ink-faint dark:text-moss-600" />}
        />
        <span
                className={`absolute left-0.5 top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                  darkMode ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
        <SettingsRow
          icon={Upload}
          label="Import data from JSON"
          description="Replace current items with a backup file"
          onClick={handleImportClick}
          control={<ChevronRight size={16} className="text-ink-faint dark:text-moss-600" />}
        />
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json"
          onChange={handleImportFile}
          className="hidden"
        />
        <SettingsRow
          icon={Trash2}
          label="Clear all data"
          description="Permanently remove every item from this device"
          danger
          onClick={() => setConfirmClear(true)}
          control={<ChevronRight size={16} className="text-clay-400" />}
        />
      </SettingsGroup>

      <p className="text-xs text-ink-faint dark:text-moss-500 text-center pt-2">
        Where's My Stuff? stores everything locally on this device. Nothing is sent to a server.
      </p>

      <ConfirmDialog
        open={confirmClear}
        title="Clear all data?"
        description="This deletes every item and reminder from this device. This cannot be undone."
        confirmLabel="Clear everything"
        onCancel={() => setConfirmClear(false)}
        onConfirm={() => {
          onClearAll()
          setConfirmClear(false)
          showToast('All data cleared.')
        }}
      />
    </div>
  )
}

function SettingsGroup({ title, children }) {
  return (
    <section>
      <h2 className="label-chip text-ink-faint dark:text-moss-500 mb-2 px-1">{title}</h2>
      <div className="bg-white dark:bg-card-dark border border-ink/[0.06] dark:border-moss-800 rounded-2xl divide-y divide-ink/[0.06] dark:divide-moss-800 overflow-hidden">
        {children}
      </div>
    </section>
  )
}

function SettingsRow({ icon: Icon, label, description, control, onClick, danger }) {
  const Comp = onClick ? 'button' : 'div'
  return (
    <Comp
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors ${
        onClick ? 'hover:bg-ink/[0.03] dark:hover:bg-moss-800/60' : ''
      }`}
    >
      <div
        className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
          danger ? 'bg-clay-500/10 text-clay-500' : 'bg-moss-500/10 text-moss-600 dark:text-moss-300'
        }`}
      >
        <Icon size={16} />
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium ${danger ? 'text-clay-500' : 'text-ink dark:text-moss-50'}`}>
          {label}
        </p>
        <p className="text-xs text-ink-faint dark:text-moss-500 mt-0.5">{description}</p>
      </div>
      {control}
    </Comp>
  )
}
