import { useCallback, useEffect, useState } from 'react'
import { scheduleItemNotification, cancelNotification } from '../utils/notificationStorage'
import { SAMPLE_ITEMS } from '../utils/sampleData'

const STORAGE_KEY = 'wms:items'
const SEEDED_KEY = 'wms:seeded'

function loadItems() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)

    const alreadySeeded = localStorage.getItem(SEEDED_KEY)
    if (!alreadySeeded) {
      localStorage.setItem(SEEDED_KEY, 'true')
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_ITEMS))
      return SAMPLE_ITEMS
    }
    return []
  } catch (e) {
    console.error('Failed to load items from localStorage', e)
    return []
  }
}

function persist(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    return true
  } catch (e) {
    console.error('Failed to save items to localStorage', e)
    return false
  }
}

export function useItems() {
  const [items, setItems] = useState([])
  const [status, setStatus] = useState('loading') // loading | ready | error

  useEffect(() => {
    try {
      const loaded = loadItems()
      setItems(loaded)
      setStatus('ready')
      
      // Initialize reminders on app load
      loaded.forEach((item) => {
        if (item.reminder) {
          scheduleItemNotification({
            id: item.id,
            title: `Reminder: ${item.name}`,
            body: `Located at: ${item.location}`,
            scheduleAt: item.reminder,
          }).catch((err) => {
            console.warn(`Failed to schedule reminder for ${item.id}:`, err)
          })
        }
      })
    } catch (e) {
      setStatus('error')
    }
  }, [])

  const addItem = useCallback((data) => {
    const now = new Date().toISOString()
    const newItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: data.name.trim(),
      location: data.location.trim(),
      description: (data.description || '').trim(),
      photo: data.photo || null,
      reminder: data.reminder || null,
      createdAt: now,
      updatedAt: now,
    }
    
    // Schedule notification if reminder is set
    if (newItem.reminder) {
      scheduleItemNotification({
        id: newItem.id,
        title: `Reminder: ${newItem.name}`,
        body: `Located at: ${newItem.location}`,
        scheduleAt: newItem.reminder,
      }).catch((err) => {
        console.warn(`Failed to schedule reminder for ${newItem.id}:`, err)
      })
    }
    
    setItems((prev) => {
      const next = [newItem, ...prev]
      persist(next)
      return next
    })
    return newItem
  }, [])

  const updateItem = useCallback((id, data) => {
    setItems((prev) => {
      const oldItem = prev.find((it) => it.id === id)
      
      const next = prev.map((it) =>
        it.id === id
          ? {
              ...it,
              ...data,
              updatedAt: new Date().toISOString(),
            }
          : it
      )
      persist(next)
      
      // Update reminder notification
      if (oldItem && oldItem.reminder !== data.reminder) {
        // Cancel old reminder
        if (oldItem.reminder) {
          cancelNotification(id).catch((err) => {
            console.warn(`Failed to cancel reminder for ${id}:`, err)
          })
        }
        
        // Schedule new reminder
        if (data.reminder) {
          scheduleItemNotification({
            id,
            title: `Reminder: ${data.name || oldItem.name}`,
            body: `Located at: ${data.location || oldItem.location}`,
            scheduleAt: data.reminder,
          }).catch((err) => {
            console.warn(`Failed to schedule reminder for ${id}:`, err)
          })
        }
      }
      
      return next
    })
  }, [])

  const deleteItem = useCallback((id) => {
    setItems((prev) => {
      // Cancel notification before deleting
      cancelNotification(id).catch((err) => {
        console.warn(`Failed to cancel reminder for ${id}:`, err)
      })
      
      const next = prev.filter((it) => it.id !== id)
      persist(next)
      return next
    })
  }, [])

  const clearAll = useCallback(() => {
    setItems([])
    persist([])
  }, [])

  const importItems = useCallback((incoming) => {
    // Schedule reminders for all imported items
    incoming.forEach((item) => {
      if (item.reminder) {
        scheduleItemNotification({
          id: item.id,
          title: `Reminder: ${item.name}`,
          body: `Located at: ${item.location}`,
          scheduleAt: item.reminder,
        }).catch((err) => {
          console.warn(`Failed to schedule reminder for ${item.id}:`, err)
        })
      }
    })
    
    setItems(() => {
      persist(incoming)
      return incoming
    })
  }, [])

  return { items, status, addItem, updateItem, deleteItem, clearAll, importItems }
}
