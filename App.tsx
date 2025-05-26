import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import Routes from './src/navigations/Routes';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { initializeNotificationService } from './src/components/notification_fix/NotificationService';

const App = () => {
  useEffect(() => {
    let unsubscribe: () => void;

    const init = async () => {
      unsubscribe = await initializeNotificationService();
    };

    init();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  return (
    <SafeAreaView style={{ height: hp(100), width: wp(100) }}>
      <NavigationContainer>
        <Routes />
      </NavigationContainer>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({});

export default App;
