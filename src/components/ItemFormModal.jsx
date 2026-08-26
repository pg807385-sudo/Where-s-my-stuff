import { useEffect, useMemo, useRef, useState } from 'react'
import { X, Camera, Trash2, MapPin, Tag, AlignLeft, Bell } from 'lucide-react'

const EMPTY = { name: '', location: '', description: '', photo: null, reminder: '' }

export default function ItemFormModal({ open, onClose, onSubmit, initialItem, knownLocations }) {
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false)
  const fileInputRef = useRef(null)
  const nameInputRef = useRef(null)

  const filteredLocations = useMemo(() => {
    const q = form.location.trim().toLowerCase()
    const matches = q
      ? knownLocations.filter((loc) => loc.toLowerCase().includes(q) && loc.toLowerCase() !== q)
      : knownLocations
    return matches.slice(0, 6)
  }, [form.location, knownLocations])

  useEffect(() => {
    if (open) {
      if (initialItem) {
        setForm({
          name: initialItem.name || '',
          location: initialItem.location || '',
          description: initialItem.description || '',
          photo: initialItem.photo || null,
          reminder: initialItem.reminder ? initialItem.reminder.slice(0, 16) : '',
        })
      } else {
        setForm(EMPTY)
      }
      setErrors({})
      setShowLocationSuggestions(false)
      setTimeout(() => nameInputRef.current?.focus(), 50)
    }
  }, [open, initialItem])

  if (!open) return null

  const handlePhoto = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    // Photos are read locally and stored as data URLs in localStorage on this
    // device only — never uploaded anywhere.
    const reader = new FileReader()
    reader.onload = () => setForm((f) => ({ ...f, photo: reader.result }))
    reader.readAsDataURL(file)
  }

  const validate = () => {
    const next = {}
    if (!form.name.trim()) next.name = 'Give this item a name.'
    if (!form.location.trim()) next.location = 'Where did you put it?'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    onSubmit({
      ...form,
      reminder: form.reminder ? new Date(form.reminder).toISOString() : null,
    })
  }

  return (
    <div className="fixed inset-0 z-[75] flex items-end md:items-center justify-center">
      <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm animate-toast-in" onClick={onClose} />
      <form
        onSubmit={handleSubmit}
        className="relative w-full md:w-[480px] md:mx-4 max-h-[92vh] overflow-y-auto bg-paper dark:bg-card-dark rounded-t-[28px] md:rounded-[28px] shadow-pop animate-sheet-in md:animate-pop-in"
      >
        <div className="sticky top-0 bg-paper/95 dark:bg-card-dark/95 backdrop-blur px-6 pt-5 pb-4 flex items-center justify-between border-b border-ink/[0.06] dark:border-moss-800 z-10">
          <h2 className="font-display font-semibold text-lg text-ink dark:text-moss-50">
            {initialItem ? 'Edit item' : 'Add item'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-ink/5 dark:hover:bg-moss-800 text-ink-soft dark:text-moss-300 transition-colors"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          <div className="flex items-center gap-4">
            <div className="shrink-0 w-20 h-20 rounded-2xl bg-white dark:bg-ink overflow-hidden border border-ink/10 dark:border-moss-800 flex items-center justify-center">
              {form.photo ? (
                <img src={form.photo} alt="Item preview" className="w-full h-full object-cover" />
              ) : (
                <Camera size={20} className="text-moss-300" />
              )}
            </div>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-sm font-semibold text-moss-600 dark:text-moss-300 hover:text-moss-700 transition-colors"
              >
                {form.photo ? 'Change photo' : 'Add photo (optional)'}
              </button>
              {form.photo && (
                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, photo: null }))}
                  className="text-xs font-medium text-clay-500 hover:text-clay-600 flex items-center gap-1 w-fit"
                >
                  <Trash2 size={12} /> Remove
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhoto}
                className="hidden"
              />
              <p className="text-[11px] text-ink-faint dark:text-moss-500">Saved on this device only.</p>
            </div>
          </div>

          <Field
            icon={Tag}
            label="Item name"
            required
            error={errors.name}
            input={
              <input
                ref={nameInputRef}
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Calculator"
                className={inputClass(errors.name)}
              />
            }
          />

          <Field
            icon={MapPin}
            label="Location"
            required
            error={errors.location}
            input={
              <div className="relative">
                <input
                  value={form.location}
                  onChange={(e) => {
                    setForm((f) => ({ ...f, location: e.target.value }))
                    setShowLocationSuggestions(true)
                  }}
                  onFocus={() => setShowLocationSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowLocationSuggestions(false), 120)}
                  placeholder="Blue desk drawer"
                  autoComplete="off"
                  className={inputClass(errors.location)}
                />
                {showLocationSuggestions && filteredLocations.length > 0 && (
                  <div className="absolute left-0 right-0 top-full mt-1.5 bg-white dark:bg-ink border border-ink/10 dark:border-moss-800 rounded-2xl shadow-tagHover overflow-hidden z-20 max-h-40 overflow-y-auto">
                    {filteredLocations.map((loc) => (
                      <button
                        key={loc}
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => {
                          setForm((f) => ({ ...f, location: loc }))
                          setShowLocationSuggestions(false)
                        }}
                        className="w-full text-left px-3.5 py-2.5 text-sm text-ink dark:text-moss-50 hover:bg-moss-50 dark:hover:bg-moss-800 transition-colors"
                      >
                        {loc}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            }
          />

          <Field
            icon={AlignLeft}
            label="Description"
            optional
            input={
              <textarea
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="My science calculator"
                rows={2}
                className={inputClass() + ' resize-none'}
              />
            }
          />

          <Field
            icon={Bell}
            label="Reminder"
            optional
            input={
              <input
                type="datetime-local"
                value={form.reminder}
                onChange={(e) => setForm((f) => ({ ...f, reminder: e.target.value }))}
                className={inputClass()}
              />
            }
          />
        </div>

        <div className="sticky bottom-0 bg-paper/95 dark:bg-card-dark/95 backdrop-blur px-6 py-4 border-t border-ink/[0.06] dark:border-moss-800">
          <button
            type="submit"
            className="w-full rounded-full bg-moss-500 hover:bg-moss-600 text-white font-semibold py-3 text-sm transition-colors shadow-tag"
          >
            {initialItem ? 'Save changes' : 'Save item'}
          </button>
        </div>
      </form>
    </div>
  )
}

function inputClass(error) {
  return `w-full rounded-2xl border bg-white dark:bg-ink px-3.5 py-2.5 text-sm text-ink dark:text-moss-50
    placeholder:text-ink-faint dark:placeholder:text-moss-600 outline-none transition-colors
    ${error ? 'border-clay-500' : 'border-ink/10 dark:border-moss-800 focus:border-moss-400'}`
}

function Field({ icon: Icon, label, input, error, required, optional }) {
  return (
    <label className="block">
      <span className="flex items-center gap-1.5 text-xs font-semibold text-ink-soft dark:text-moss-300 mb-1.5">
        <Icon size={13} />
        {label}
        {optional && <span className="font-normal text-ink-faint dark:text-moss-500">(optional)</span>}
      </span>
      {input}
      {error && <span className="text-[11px] text-clay-500 mt-1 block">{error}</span>}
    </label>
  )
    }
