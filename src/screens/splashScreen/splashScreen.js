// screens/SplashScreen.js

import React, {useEffect} from 'react';
import {View} from 'react-native';
import {waitForInitialAuth} from '../../services/authService';
import {screenStyles} from '../../styles/screenStyles';
import MainLogo from '../../assets/svg/MainLogo';

const SplashScreen = ({navigation}) => {
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const [authState] = await Promise.all([
          waitForInitialAuth(),
          new Promise(resolve => setTimeout(resolve, 1500)),
        ]);

        navigation.replace(authState.isLoggedIn ? 'Dashboard' : 'Login');
      } catch (error) {
        console.error('Error checking auth:', error);
        navigation.replace('Login');
      }
    };

    checkAuth();
  }, [navigation]);

  return (
    <View
      style={[
        screenStyles.container,
        {
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#000', // optional
        },
      ]}>
      <MainLogo width={220} height={80} />
    </View>
  );
};

export default SplashScreen;
