// import React, { useEffect } from 'react';
// import { Alert, View, Text } from 'react-native';
// import messaging from '@react-native-firebase/messaging';

// const App = () => {
//   useEffect(() => {
//     // 🔐 Permission maango
//     messaging().requestPermission()
//       .then(authStatus => {
//         console.log('Permission Status:', authStatus);
//       });

//     // 🔗 Token lo aur backend ko bhejo
//     messaging().getToken().then(token => {
//       console.log('FCM Token:', token);

//       // 🔄 Token backend ko bhejna
//       fetch('localhost:5000/api/save-token', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ token }),
//       });
//     });

//     // 🔔 Foreground Notification listener
//     const unsubscribe = messaging().onMessage(async remoteMessage => {
//       Alert.alert(
//         remoteMessage.notification.title,
//         remoteMessage.notification.body
//       );
//     });

//     return unsubscribe;
//   }, []);

//   return (
//     <View>
//       <Text>Push Notification Handler Active</Text>
//     </View>
//   );
// };

// export default App;

// import {PermissionsAndroid} from 'react-native';
//   PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);

import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';

const requestPermission = async () => {
  const authStatus = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
  );
  if (authStatus === PermissionsAndroid.RESULTS.GRANTED) {
    console.log('Notification permission granted');
  } else {
    console.log('Notification permission denied');
  }
};

const usertoken = async () => {
  try {
    const token = await messaging().getToken();
    console.log('FCM Token:', token);
  } catch (error) {
    console.error('Error getting FCM token:', error);
  }
};

const NotificationService = () => {
  useEffect(() => {
    requestPermission();
    usertoken();
  }, []);
};

export default NotificationService;

const styles = StyleSheet.create({});
