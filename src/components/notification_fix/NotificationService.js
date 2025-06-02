import {PermissionsAndroid, Platform} from 'react-native';
import notifee, {
  AndroidImportance,
  AndroidVisibility,
  AndroidCategory,
  TriggerType,
} from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';

// Request notification permissions
const requestPermission = async () => {
  if (Platform.OS === 'android') {
    const authStatus = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
    if (authStatus === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('Notification permission granted');
    } else {
      console.log('Notification permission denied');
    }
  } else {
    const authStatus = await messaging().requestPermission();
    console.log('Authorization status:', authStatus);
  }
};

// Configure notification channel
const configureNotifications = async () => {
  try {
    await requestPermission();

    await notifee.createChannel({
      id: 'prayer-times',
      name: 'Prayer Times',
      sound: 'adhan', // Make sure adhan sound added in android/app/src/main/res/raw/
      importance: AndroidImportance.HIGH,
      visibility: AndroidVisibility.PUBLIC,
      vibration: true,
      lights: true,
      badge: true,
    });

    console.log('Notification channels configured successfully');
  } catch (error) {
    console.error('Notification setup error:', error);
  }
};

// Helper: Convert "5:00 AM" string to JS Date object for today
const parseTimeToDate = timeStr => {
  const [time, modifier] = timeStr.split(' ');
  let [hours, minutes] = time.split(':').map(Number);

  if (modifier === 'PM' && hours < 12) {
    hours += 12;
  } else if (modifier === 'AM' && hours === 12) {
    hours = 0;
  }

  const now = new Date();
  now.setHours(hours);
  now.setMinutes(minutes);
  now.setSeconds(0);
  now.setMilliseconds(0);

  return now;
};


const schedulePrayerNotification = async (prayerName, dateTime) => {
  const notificationId = `prayer-${prayerName.toLowerCase()}`;

  console.log(`⏰ Scheduling notification for: ${prayerName} at ${dateTime.toISOString()}`);

  try {
    // Cancel previous notification if exists
    await notifee.cancelNotification(notificationId);

    await notifee.createTriggerNotification(
      {
        id: notificationId, // Unique ID
        title: `${prayerName} Prayer Time`,
        body: `It's time for ${prayerName} prayer`,
        android: {
          channelId: 'prayer-times',
          importance: AndroidImportance.HIGH,
          sound: 'adhan',
          visibility: AndroidVisibility.PUBLIC,
          category: AndroidCategory.ALARM,
          vibrationPattern: [300, 500, 300, 500],
        },
        ios: {
          sound: 'adhan.mp3',
          critical: true,
          importance: 'high',
        },
      },
      {
        type: TriggerType.TIMESTAMP,
        timestamp: dateTime.getTime(),
      }
    );

    console.log(`✅ Notification scheduled for ${prayerName} at ${dateTime}`);
  } catch (error) {
    console.error('❌ Error scheduling notification:', error);
  }
};


// Cancel all notifications
const cancelAllNotifications = async () => {
  await notifee.cancelAllNotifications();
  await notifee.cancelAllTriggerNotifications();
  console.log('🔕 All prayer notifications cancelled');
};

// Initialize notification service and listen to Firebase messages
const initializeNotificationService = async () => {
  await configureNotifications();

  const unsubscribe = messaging().onMessage(async remoteMessage => {
    if (remoteMessage.notification) {
      await notifee.displayNotification({
        title: remoteMessage.notification.title,
        body: remoteMessage.notification.body,
        android: {
          channelId: 'prayer-times',
          importance: AndroidImportance.HIGH,
          sound: 'adhan',
          visibility: AndroidVisibility.PUBLIC,
        },
        ios: {
          sound: 'adhan.mp3',
        },
      });
    }
  });

  return unsubscribe;
};

export {
  requestPermission,
  configureNotifications,
  schedulePrayerNotification,
  cancelAllNotifications,
  initializeNotificationService,
  parseTimeToDate, // export helper for your component use
};
