import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';

/**
 * Creates notification channels required for Android 9+
 */
export const initNotifications = async () => {
  if (!Capacitor.isNativePlatform()) return;

  // Notification channels are mandatory starting in Android 8/9
  await LocalNotifications.createChannel({
    id: 'default_channel',
    name: 'General Notifications',
    description: 'Item alerts and system reminders',
    importance: 4, // High importance (makes sound and shows heads-up alert)
    visibility: 1, // Public
    vibration: true,
  });
};

/**
 * Requests notification permissions (Mandatory for Android 13+)
 */
export const requestNotificationPermissions = async () => {
  if (!Capacitor.isNativePlatform()) return true;

  const currentStatus = await LocalNotifications.checkPermissions();
  
  if (currentStatus.display === 'granted') {
    return true;
  }

  const requestStatus = await LocalNotifications.requestPermissions();
  return requestStatus.display === 'granted';
};

/**
 * Schedules a local notification across Android 9+ devices
 */
export const scheduleItemNotification = async ({ id, title, body, scheduleAt }) => {
  if (!Capacitor.isNativePlatform()) return;

  const granted = await requestNotificationPermissions();
  if (!granted) {
    console.warn('Notification permissions denied by user.');
    return;
  }

  await initNotifications();

  // Convert string/numeric IDs to a valid 32-bit integer for native Android
  const notificationId = typeof id === 'number' ? id : Math.abs(hashCode(String(id)));

  await LocalNotifications.schedule({
    notifications: [
      {
        id: notificationId,
        title: title,
        body: body,
        channelId: 'default_channel', // Required for Android 9+
        schedule: { at: new Date(scheduleAt) },
        smallIcon: 'ic_stat_icon_config_sample', // Uses app default icon
        actionTypeId: '',
        extra: null,
      },
    ],
  });
};

/**
 * Cancels a scheduled notification by ID
 */
export const cancelNotification = async (id) => {
  if (!Capacitor.isNativePlatform()) return;

  const notificationId = typeof id === 'number' ? id : Math.abs(hashCode(String(id)));

  await LocalNotifications.cancel({
    notifications: [{ id: notificationId }],
  });
};

// Helper function to map non-numeric IDs to 32-bit positive integers
function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
                                    }
