import { LocalNotifications } from '@capacitor/local-notifications'
import { Capacitor } from '@capacitor/core'

const isNative = Capacitor.isNativePlatform()
const SHOWN_KEY = 'wms:shown-reminders'

function hashId(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash) % 2147483647
}

function getShownReminders() {
  try {
    return new Set(JSON.parse(localStorage.getItem(SHOWN_KEY) || '[]'))
  } catch {
    return new Set()
  }
}

function saveShownReminders(shown) {
  localStorage.setItem(SHOWN_KEY, JSON.stringify([...shown]))
}

export async function requestNotificationPermission() {
  if (isNative) {
    try {
      const result = await LocalNotifications.requestPermissions()
      return result.display === 'granted'
    } catch (e) {
      console.error('Native permission request failed', e)
      return false
    }
  }

  if (!('Notification' in window)) {
    console.warn('This browser does not support notifications')
    return false
  }

  const permission = await Notification.requestPermission()
  return permission === 'granted'
}

export async function scheduleReminder(item) {
  if (!item?.reminder) return
  const time = new Date(item.reminder).getTime()
  if (time <= Date.now()) return

  if (isNative) {
    try {
      await LocalNotifications.schedule({
        notifications: [
          {
            title: "Don't forget!",
            body: `${item.name} — ${item.location}`,
            id: hashId(item.id),
            schedule: { at: new Date(time) },
            extra: { itemId: item.id },
          },
        ],
      })
    } catch (e) {
      console.error('Failed to schedule reminder', e)
    }
  }
}

export async function cancelReminder(itemId) {
  if (isNative) {
    try {
      await LocalNotifications.cancel({
        notifications: [{ id: hashId(itemId) }],
      })
    } catch (e) {
      console.error('Failed to cancel reminder', e)
    }
  }
}

export async function cancelAllReminders() {
  if (isNative) {
    try {
      await LocalNotifications.cancel({ notifications: [] })
    } catch (e) {
      console.error('Failed to cancel all reminders', e)
    }
  }
  localStorage.removeItem(SHOWN_KEY)
}

export function markReminderShown(itemId) {
  const shown = getShownReminders()
  shown.add(itemId)
  saveShownReminders(shown)
}

export function clearReminderShown(itemId) {
  const shown = getShownReminders()
  shown.delete(itemId)
  saveShownReminders(shown)
}

export function checkDueReminders(items, onDue) {
  const now = Date.now()
  const shown = getShownReminders()

  for (const item of items) {
    if (!item.reminder) continue
    const time = new Date(item.reminder).getTime()
    if (time <= now && !shown.has(item.id)) {
      markReminderShown(item.id)
      onDue(item)
    }
  }
}

export function showBrowserNotification(item) {
  if (!('Notification' in window)) return
  if (Notification.permission !== 'granted') return

  try {
    new Notification("Don't forget!", {
      body: `${item.name} — ${item.location}`,
      icon: '/logo.png',
      tag: item.id,
    })
  } catch (e) {
    console.error('Failed to show browser notification', e)
  }
  }
        
