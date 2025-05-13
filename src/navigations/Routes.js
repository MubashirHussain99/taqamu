import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SplashScreen from '../screens/splashScreen/splashScreen';
import Login from '../screens/login/login';
import Register from '../screens/register/register';
import Dashboard from '../screens/dashboard/dashboard';
import QiblaDirection from '../screens/qiblaDirection/qiblaDirection';
import PrayersScreen from '../screens/PrayersScreen/PrayersScreen';
import QuranScreen from '../screens/QuranScreen/QuranScreen';
import UmmahScreen from '../screens/UmmahScreen/UmmahScreen';
import DuaScreen from '../screens/DuaScreen/DuaScreen';
import Tasbih from '../screens/Tasbih/Tasbih';
import QuestionDetailScreen from '../screens/QuestionDetailScreen/QuestionDetailScreen';
import ZakatScreen from '../screens/ZakatScreen/ZakatScreen';
import UmmahDonationScreen from '../screens/UmmahDonationScreen/UmmahDonationScreen';
import PrayerTimesScreen from '../components/dashboard/PrayerTimesScreen';
import Notifications from '../screens/Notifications/Notifications';
import UmmahApp from '../screens/UmmahApp/UmmahApp';
import EditProfileScreen from '../screens/EditProfileScreen/EditProfileScreen';

const Stack = createNativeStackNavigator();

export default function AppRoutes() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="Dashboard" component={Dashboard} />
      <Stack.Screen name="QiblaDirection" component={QiblaDirection} />
      <Stack.Screen name="PrayersScreen" component={PrayersScreen} />
      <Stack.Screen name="QuranScreen" component={QuranScreen} />
      <Stack.Screen name="UmmahScreen" component={UmmahScreen} />
      <Stack.Screen name="Duas" component={DuaScreen} />
      <Stack.Screen name="Tasbih" component={Tasbih} />
      <Stack.Screen name="Zakat" component={ZakatScreen} />
      <Stack.Screen
        name="QuestionDetailScreen"
        component={QuestionDetailScreen}
      />
      <Stack.Screen name="Ummah" component={UmmahDonationScreen} />
      <Stack.Screen name="PrayerTimesScreen" component={PrayerTimesScreen} />
      <Stack.Screen name="Notifications" component={Notifications} />
      <Stack.Screen name="UmmahApp" component={UmmahApp} />
      <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
    </Stack.Navigator>
  );
}
