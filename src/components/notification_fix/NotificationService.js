// // import {PermissionsAndroid, Platform} from 'react-native';
// // import notifee, {
// //   AndroidImportance,
// //   AndroidVisibility,
// //   AndroidCategory,
// // } from '@notifee/react-native';
// // import messaging from '@react-native-firebase/messaging';

// // const requestPermission = async () => {
// //   if (Platform.OS === 'android') {
// //     const authStatus = await PermissionsAndroid.request(
// //       PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
// //     );
// //     if (authStatus === PermissionsAndroid.RESULTS.GRANTED) {
// //       console.log('Notification permission granted');
// //     } else {
// //       console.log('Notification permission denied');
// //     }
// //   } else {
// //     const authStatus = await messaging().requestPermission();
// //     console.log('Authorization status:', authStatus);
// //   }
// // };

// // const getUserToken = async () => {
// //   try {
// //     const token = await messaging().getToken();
// //     console.log('FCM Token:', token);
// //     return token;
// //   } catch (error) {
// //     console.error('Error getting FCM token:', error);
// //     return null;
// //   }
// // };

// // const configureNotifications = async () => {
// //   try {
// //     await requestPermission();

// //     await notifee.createChannel({
// //       id: 'prayer-times',
// //       name: 'Prayer Times',
// //       sound: 'adhan',
// //       importance: AndroidImportance.HIGH,
// //       visibility: AndroidVisibility.PUBLIC,
// //       vibration: true,
// //       lights: true,
// //       badge: true,
// //     });

// //     // Check if this method exists (for backward compatibility)
// //     if (typeof notifee.setForegroundServiceBehavior === 'function') {
// //       await notifee.setForegroundServiceBehavior({
// //         whenScreenLocked: 'continue',
// //       });
// //     }

// //     console.log('🔔 Notification channels configured successfully');
// //   } catch (error) {
// //     console.error('Notification setup error:', error);
// //   }
// // };
// // const showNotification = async (prayerName, prayerTime) => {
// //   try {
// //     await notifee.displayNotification({
// //       title: `${prayerName} Prayer Time`,
// //       body: `It's time for ${prayerName} prayer`,
// //       android: {
// //         channelId: 'prayer-times',
// //         importance: AndroidImportance.HIGH,
// //         priority: 'high',
// //         sound: 'adhan',
// //         visibility: AndroidVisibility.PUBLIC,
// //         category: AndroidCategory.ALARM,
// //         fullScreenAction: {
// //           id: 'prayer-fullscreen',
// //           launchActivity: 'default',
// //         },
// //         wakeLockTimeout: 10000,
// //         vibrationPattern: [300, 500, 300, 500],
// //       },
// //       ios: {
// //         sound: 'adhan.mp3',
// //         critical: true,
// //         importance: 'high',
// //       },
// //     });
// //     console.log('Test notification displayed');
// //   } catch (error) {
// //     console.error('Error displaying test notification:', error);
// //   }
// // };

// // // Function to check time and trigger notification
// // const checkPrayerTime = async (prayerName, prayerTime) => {
// //   const now = new Date();

// //   // Format current time to "h:mm AM/PM"
// //   const currentTime = now.toLocaleTimeString([], {
// //     hour: 'numeric',
// //     minute: '2-digit',
// //     hour12: true,
// //   });

// //   console.log(`Current Time: ${currentTime} | Target: ${prayerTime}`);

// //   if (currentTime === prayerTime) {
// //     await showNotification(prayerName, prayerTime);
// //   }
// // };

// // // Start interval that checks every minute
// // const startPrayerTimeWatcher = (prayerName, prayerTime) => {
// //   checkPrayerTime(prayerName, prayerTime); // Immediate check
// //   setInterval(() => {
// //     checkPrayerTime(prayerName, prayerTime);
// //   }, 60000); // Every 1 minute
// // };

// // const cancelAllNotifications = async () => {
// //   await notifee.cancelAllNotifications();
// //   console.log('All notifications canceled');
// // };

// // // 🔧 Now make initializeNotificationService async properly
// // const initializeNotificationService = async () => {
// //   await configureNotifications();

// //   const unsubscribe = messaging().onMessage(async remoteMessage => {
// //     if (remoteMessage.notification) {
// //       await notifee.displayNotification({
// //         title: remoteMessage.notification.title,
// //         body: remoteMessage.notification.body,
// //         android: {
// //           channelId: 'prayer-times',
// //           importance: AndroidImportance.HIGH,
// //           sound: 'adhan',
// //           visibility: AndroidVisibility.PUBLIC,
// //         },
// //         ios: {
// //           sound: 'adhan.mp3',
// //         },
// //       });
// //     }
// //   });

// //   return unsubscribe;
// // };

// // export {
// //   requestPermission,
// //   getUserToken,
// //   configureNotifications,
// //   showNotification,
// //   cancelAllNotifications,
// //   initializeNotificationService,
// //   startPrayerTimeWatcher,
// // };

// import { PermissionsAndroid, Platform } from 'react-native';
// import notifee, {
//   AndroidImportance,
//   AndroidVisibility,
//   AndroidCategory,
//   TriggerType,
// } from '@notifee/react-native';
// import messaging from '@react-native-firebase/messaging';

// const requestPermission = async () => {
//   if (Platform.OS === 'android') {
//     const authStatus = await PermissionsAndroid.request(
//       PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
//     );
//     if (authStatus === PermissionsAndroid.RESULTS.GRANTED) {
//       console.log('Notification permission granted');
//     } else {
//       console.log('Notification permission denied');
//     }
//   } else {
//     const authStatus = await messaging().requestPermission();
//     console.log('Authorization status:', authStatus);
//   }
// };

// const configureNotifications = async () => {
//   try {
//     await requestPermission();

//     await notifee.createChannel({
//       id: 'prayer-times',
//       name: 'Prayer Times',
//       sound: 'adhan', // Make sure you have added this sound properly in your android/app/src/main/res/raw/
//       importance: AndroidImportance.HIGH,
//       visibility: AndroidVisibility.PUBLIC,
//       vibration: true,
//       lights: true,
//       badge: true,
//     });

//     console.log('Notification channels configured successfully');
//   } catch (error) {
//     console.error('Notification setup error:', error);
//   }
// };

// // Schedule notification at a specific date/time (Trigger Notification)
// const schedulePrayerNotification = async (prayerName, dateTime) => {
//   try {
//     await notifee.createTriggerNotification(
//       {
//         title: `${prayerName} Prayer Time`,
//         body: `It's time for ${prayerName} prayer`,
//         android: {
//           channelId: 'prayer-times',
//           importance: AndroidImportance.HIGH,
//           sound: 'adhan',
//           visibility: AndroidVisibility.PUBLIC,
//           category: AndroidCategory.ALARM,
//           vibrationPattern: [300, 500, 300, 500],
//         },
//         ios: {
//           sound: 'adhan.mp3',
//           critical: true,
//           importance: 'high',
//         },
//       },
//       {
//         type: TriggerType.TIMESTAMP,
//         timestamp: dateTime.getTime(), // JS Date object to timestamp in milliseconds
//       },
//     );
//     console.log(`Notification scheduled for ${prayerName} at ${dateTime}`);
//   } catch (error) {
//     console.error('Error scheduling notification:', error);
//   }
// };

// const cancelAllNotifications = async () => {
//   await notifee.cancelAllNotifications();
//   await notifee.cancelAllTriggerNotifications();
//   console.log('All notifications canceled');
// };

// // Initialize and listen to FCM messages (for remote notifications)
// const initializeNotificationService = async () => {
//   await configureNotifications();

//   const unsubscribe = messaging().onMessage(async remoteMessage => {
//     if (remoteMessage.notification) {
//       await notifee.displayNotification({
//         title: remoteMessage.notification.title,
//         body: remoteMessage.notification.body,
//         android: {
//           channelId: 'prayer-times',
//           importance: AndroidImportance.HIGH,
//           sound: 'adhan',
//           visibility: AndroidVisibility.PUBLIC,
//         },
//         ios: {
//           sound: 'adhan.mp3',
//         },
//       });
//     }
//   });

//   return unsubscribe;
// };

// export {
//   requestPermission,
//   configureNotifications,
//   schedulePrayerNotification,
//   cancelAllNotifications,
//   initializeNotificationService,
// };

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


// const schedulePrayerNotification = async (prayerName, dateTime) => {
//   console.log(
//     `Scheduling notification for: ${prayerName} at ${dateTime.toISOString()}`,
//   );
//   try {
//     await notifee.createTriggerNotification(
//       {
//         title: `${prayerName} Prayer Time`,
//         body: `It's time for ${prayerName} prayer`,
//         android: {
//           channelId: 'prayer-times',
//           importance: AndroidImportance.HIGH,
//           sound: 'adhan',
//           visibility: AndroidVisibility.PUBLIC,
//           category: AndroidCategory.ALARM,
//           vibrationPattern: [300, 500, 300, 500],
//         },
//         ios: {
//           sound: 'adhan.mp3',
//           critical: true,
//           importance: 'high',
//         },
//       },
//       {
//         type: TriggerType.TIMESTAMP,
//         timestamp: dateTime.getTime(),
//       },
//     );
//     console.log(
//       `Notification scheduled for ${prayerName} at ${dateTime.toISOString()}`,
//     );
//   } catch (error) {
//     console.error('Error scheduling notification:', error);
//   }
// };

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
