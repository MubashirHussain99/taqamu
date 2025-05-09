import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { QueryClientProvider } from '@tanstack/react-query';

// Screens
import SplashScreen from "../screens/splashScreen";
import Login from "../screens/login";
import Register from "../screens/register";
import Dashboard from "../screens/dashboard";
import QiblaDirection from "../screens/qiblaDirection";
import PrayersScreen from "../screens/PrayersScreen";
import QuranScreen from "../screens/QuranScreen";
import UmmahScreen from "../screens/UmmahScreen";
import DuaScreen from "../screens/DuaScreen";
import Tasbih from "../screens/Tasbih";
import QuestionDetailScreen from "../screens/QuestionDetailScreen";
import ZakatScreen from "../screens/ZakatScreen";
import UmmahDonationScreen from "../screens/UmmahDonationScreen";
import PrayerTimesScreen from "../components/dashboard/PrayerTimesScreen";
import { queryClient } from "../services/api/queryClient";

const Stack = createNativeStackNavigator();

export default function AppRoutes() {
  console.log("app is running");
  return (
    <QueryClientProvider client={queryClient}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
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
        <Stack.Screen name="QuestionDetailScreen" component={QuestionDetailScreen} />
        <Stack.Screen name="Ummah" component={UmmahDonationScreen} />
        <Stack.Screen name="PrayerTimesScreen" component={PrayerTimesScreen} />

      </Stack.Navigator>
    </QueryClientProvider>
  );
}
