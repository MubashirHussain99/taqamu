import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import Routes from './src/navigations/Routes';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { APP_BACKGROUND } from './src/constants/colors';
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

  const navTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: APP_BACKGROUND,
    },
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={{ height: hp(100), width: wp(100), backgroundColor: APP_BACKGROUND }}
        edges={['top', 'left', 'right']}>
        <NavigationContainer theme={navTheme}>
          <Routes />
        </NavigationContainer>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({});

export default App;
