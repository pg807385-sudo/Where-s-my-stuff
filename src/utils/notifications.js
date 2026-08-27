import { Capacitor } from '@capacitor/core'
import { LocalNotifications } from '@capacitor/local-notifications'

// LocalNotifications requires a numeric id per notification. Items use
// string ids, so this deterministically derives a stable positive integer
// from an item's id — the same item always maps to the same notification id,
// which lets us reschedule/cancel it later without tracking anything extra.
function toNotificationId(itemId) {
  let hash = 0
  for (let i = 0; i < itemId.length; i++) {
    hash = (hash * 31 + itemId.charCodeAt(i)) | 0
  }
  return Math.abs(hash) || 1
}

const CHANNEL_ID = 'wms-reminders'
let channelReady = false

// Android 8+ (API 26+) requires notifications to belong to a "channel" —
// without one, some OEM Android skins (Samsung, Xiaomi, etc.) silently
// suppress or downgrade the alert instead of showing it. Creating an
// explicit high-importance channel makes reminders show as a heads-up
// banner with sound on every Android 8+ device, not just a silent entry
// in the notification shade.
async function ensureChannel() {
  if (channelReady || Capacitor.getPlatform() !== 'android') return
  try {
    await LocalNotifications.createChannel({
      id: CHANNEL_ID,
      name: 'Item reminders',
      description: "Reminders you've set on items in Where's My Stuff?",
      importance: 5, // IMPORTANCE_HIGH — heads-up banner + sound
      visibility: 1, // public — shown in full on the lock screen
      vibration: true,
    })
    channelReady = true
  } catch (e) {
    console.error('Failed to create notification channel', e)
  }
}

/**
 * Requests everything needed for reminders to fire reliably. Call once on
 * app startup. Safe to call repeatedly — it only prompts the user when
 * something isn't already granted.
 */
export async function initNotifications() {
  if (!Capacitor.isNativePlatform()) return
  try {
    const status = await LocalNotifications.checkPermissions()
    if (status.display !== 'granted') {
      await LocalNotifications.requestPermissions()
    }
    await ensureChannel()
  } catch (e) {
    console.error('Failed to initialize notifications', e)
  }
}

/**
 * Schedules (or reschedules) a real device notification for an item's
 * reminder. Falls back to a non-exact alarm automatically on Android 12+
 * devices where the user hasn't granted the separate "exact alarm" toggle —
 * the reminder still fires, just without to-the-second precision, which
 * avoids needing to redirect every user to a special settings screen.
 */
export async function scheduleReminderNotification(item) {
  if (!Capacitor.isNativePlatform()) return
  const id = toNotificationId(item.id)

  // Always clear any existing notification for this item first, so editing
  // or removing a reminder doesn't leave a stale one behind.
  await cancelReminderNotification(item.id)

  if (!item.reminder) return
  const fireDate = new Date(item.reminder)
  if (fireDate.getTime() <= Date.now()) return // don't schedule reminders in the past

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

export async function cancelReminderNotification(itemId) {
  if (!Capacitor.isNativePlatform()) return
  try {
    await LocalNotifications.cancel({ notifications: [{ id: toNotificationId(itemId) }] })
  } catch {
    // Nothing scheduled — fine.
  }
}

export async function cancelAllReminderNotifications() {
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

/**
 * Re-schedules every item with a future reminder. Call this once after
 * items load, so reminders survive an app update or a device reboot even
 * on OEM skins that clear pending alarms more aggressively than stock Android.
 */
export async function rescheduleAllReminders(items) {
  if (!Capacitor.isNativePlatform()) return
  for (const item of items) {
    if (item.reminder) {
      await scheduleReminderNotification(item)
    }
  }
}

/**
 * Checks whether precise "exact alarm" scheduling is available (Android
 * 12+ gates this behind a user-granted toggle). Returns true on platforms
 * where the check doesn't apply (older Android, iOS, web).
 */
export async function hasExactAlarmPermission() {
  if (!Capacitor.isNativePlatform() || Capacitor.getPlatform() !== 'android') return true
  try {
    if (!LocalNotifications.checkExactNotificationSetting) return true
    const result = await LocalNotifications.checkExactNotificationSetting()
    return result.exact_alarm === 'granted' || result.exact_alarm === 'unsupported'
  } catch {
    return true
  }
}

/** Opens the system settings screen where the user can grant exact-alarm scheduling. */
export async function openExactAlarmSettings() {
  if (!Capacitor.isNativePlatform() || Capacitor.getPlatform() !== 'android') return
  try {
    if (LocalNotifications.changeExactNotificationSetting) {
      await LocalNotifications.changeExactNotificationSetting()
    }
  } catch (e) {
    console.error('Failed to open exact alarm settings', e)
  }
}
// Aliases matching older/alternate names used elsewhere in the app.
export const requestNotificationPermission = initNotifications
export const scheduleReminder = scheduleReminderNotification
export const cancelReminder = cancelReminderNotification
