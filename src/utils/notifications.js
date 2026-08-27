import { Capacitor } from '@capacitor/core'
import { LocalNotifications } from '@capacitor/local-notifications'

function toNotificationId(itemId) {
  let hash = 0
  for (let i = 0; i < itemId.length; i++) {
    hash = (hash * 31 + itemId.charCodeAt(i)) | 0
  }
  return Math.abs(hash) || 1
}

const CHANNEL_ID = 'wms-reminders'
let channelReady = false

async function ensureChannel() {
  if (channelReady || Capacitor.getPlatform() !== 'android') return
  try {
    await LocalNotifications.createChannel({
      id: CHANNEL_ID,
      name: 'Item reminders',
      description: "Reminders you've set on items in Where's My Stuff?",
      importance: 5,
      visibility: 1,
      vibration: true,
    })
    channelReady = true
  } catch (e) {
    console.error('Failed to create notification channel', e)
  }
}

/** Requests native (Android) and/or browser Notification permission. */
export async function requestNotificationPermission() {
  if (Capacitor.isNativePlatform()) {
    try {
      const status = await LocalNotifications.checkPermissions()
      if (status.display !== 'granted') {
        await LocalNotifications.requestPermissions()
      }
      await ensureChannel()
    } catch (e) {
      console.error('Failed to initialize native notifications', e)
    }
  } else if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
    try {
      await Notification.requestPermission()
    } catch (e) {
      console.error('Failed to request browser notification permission', e)
    }
  }
}

/** Schedules a real native Android notification for an item's reminder. */
export async function scheduleReminder(item) {
  if (!Capacitor.isNativePlatform()) return
  const id = toNotificationId(item.id)
  await cancelReminder(item.id)
  if (!item.reminder) return
  const fireDate = new Date(item.reminder)
  if (fireDate.getTime() <= Date.now()) return
  await ensureChannel()
  try {
    await LocalNotifications.schedule({
      notifications: [
        {
          id,
          title: "Where's My Stuff?",
          body: `Reminder: ${item.name} is at ${item.location}.`,
          channelId: CHANNEL_ID,
          smallIcon: 'ic_stat_notify',
          schedule: { at: fireDate, allowWhileIdle: true },
        },
      ],
    })
  } catch (e) {
    console.error('Failed to schedule reminder notification', e)
  }
}

export async function cancelReminder(itemId) {
  if (!Capacitor.isNativePlatform()) return
  try {
    await LocalNotifications.cancel({ notifications: [{ id: toNotificationId(itemId) }] })
  } catch {
    // Nothing scheduled — fine.
  }
}

export async function cancelAllReminders() {
  if (!Capacitor.isNativePlatform()) return
  try {
    const pending = await LocalNotifications.getPending()
    if (pending.notifications.length > 0) {
      await LocalNotifications.cancel({ notifications: pending.notifications.map((n) => ({ id: n.id })) })
    }
  } catch {
    // Nothing scheduled — fine.
  }
}

// --- Foreground polling fallback (used by App.jsx's 30s interval) ---
// Tracks which item ids already fired a foreground alert this session, so
// the same reminder doesn't re-trigger on every poll.
const shownReminders = new Set()

export function clearReminderShown(itemId) {
  shownReminders.delete(itemId)
}

/** Scans items for reminders whose time has passed and haven't fired yet; calls onDue(item) for each. */
export function checkDueReminders(items, onDue) {
  const now = Date.now()
  for (const item of items) {
    if (!item.reminder) continue
    const t = new Date(item.reminder).getTime()
    if (t <= now && !shownReminders.has(item.id)) {
      shownReminders.add(item.id)
      onDue(item)
    }
  }
}

/** Shows a browser Notification (foreground fallback, mainly relevant on web). */
export function showBrowserNotification(item) {
  if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return
  try {
    new Notification("Where's My Stuff?", {
      body: `Reminder: ${item.name} is at ${item.location}.`,
    })
  } catch (e) {
    console.error('Failed to show browser notification', e)
  }
}
