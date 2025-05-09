// screens/SplashScreen.js
import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SplashScreen = ({ navigation }) => {
  console.log("app is running-1");
  // useEffect(() => {
  //   const checkAuth = async () => {
  //     try {
  //       const token = await AsyncStorage.getItem('token');
  //       if (token) {
  //         navigation.replace('Dashboard'); // Authenticated route
  //       } else {
  //         navigation.replace('Login'); // Unauthenticated route
  //       }
  //     } catch (error) {
  //       console.error('Error checking token:', error);
  //       navigation.replace('Login');
  //     }
  //   };

  //   checkAuth();
  // }, []);
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        console.log('Token from storage:', token);
        setTimeout(() => {
          if (token) {
            navigation.replace('Dashboard');
          } else {
            navigation.replace('Login');
          }
        }, 2000); // 2-second splash delay
      } catch (error) {
        console.error('Error checking token:', error);
        navigation.replace('Login');
      }
    };
  
    checkAuth();
  }, []);
  console.log("app is running-2");  

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
};

export default SplashScreen;
