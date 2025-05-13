
// import {NavigationContainer} from '@react-navigation/native';
// import React, {useEffect} from 'react';
// import {StyleSheet} from 'react-native';
// import Routes from './src/navigations/Routes';
// import {SafeAreaView} from 'react-native-safe-area-context';
// import {
//   heightPercentageToDP as hp,
//   widthPercentageToDP as wp,
// } from 'react-native-responsive-screen';
// import { configurePushNotification, showLocalNotification } from './src/components/notification/NotificationServices';

// const App = () => {
//   useEffect(() => {
//     configurePushNotification();
    
//     setTimeout(() => {
//       showLocalNotification('Test', 'Push Notification Configured!');
//     }, 3000);
//   }, []);
  
//   return (
//     <SafeAreaView style={{height: hp(100), width: wp(100)}}>
//       <NavigationContainer>
//         <Routes />
//       </NavigationContainer>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({});

// export default App;


// // 07EKNLXJJK7Dy688
// // 5UKQS0FU9E2Uck7f   main device

import {NavigationContainer} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {StyleSheet, Platform} from 'react-native';
import Routes from './src/navigations/Routes';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { 
  configurePushNotification, 
  showLocalNotification,
  scheduleNotification,
  scheduleDailyNotification
} from './src/components/notification/NotificationServices';

const App = () => {
  useEffect(() => {
    const setupNotifications = async () => {
      await configurePushNotification();
      
      // Show immediate notification after 3 seconds
      setTimeout(() => {
        showLocalNotification('Test', 'Push Notification Configured!');
      }, 3000);
      
      // Schedule a one-time notification for 10 seconds from now
      const tenSecondsLater = new Date(Date.now() + 10000);
      scheduleNotification('One-Time', 'This was scheduled 10 seconds later', tenSecondsLater);
      
      // Schedule daily notification at 9:00 AM
      scheduleDailyNotification('Daily Reminder', 'Good morning! Have a great day!', 9, 0);
    };

    setupNotifications();
  }, []);
  
  return (
    <SafeAreaView style={{height: hp(100), width: wp(100)}}>
      <NavigationContainer>
        <Routes />
      </NavigationContainer>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({});

export default App;