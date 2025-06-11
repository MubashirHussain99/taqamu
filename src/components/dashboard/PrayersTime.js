// // import React, { useState, useEffect, useRef } from 'react';
// // import {
// //   View,
// //   Text,
// //   StyleSheet,
// //   TouchableOpacity,
// //   ActivityIndicator,
// // } from 'react-native';
// // import { Coordinates, Madhab, PrayerTimes, CalculationMethod, HighLatitudeRule } from 'adhan';
// // import axios from 'axios';
// // import { format, differenceInMinutes } from 'date-fns';
// // import { toZonedTime } from 'date-fns-tz';  // <-- updated import here
// // import AsyncStorage from '@react-native-async-storage/async-storage';
// // import { useNavigation } from '@react-navigation/native';
// // import {
// //   initializeNotificationService,
// //   configureNotifications,
// //   schedulePrayerNotification,
// // } from '../notification_fix/NotificationService'; // Your notification service

// // const PRAYER_ARABIC_NAMES = {
// //   fajr: 'الفجر',
// //   sunrise: 'الشروق',
// //   dhuhr: 'الظهر',
// //   asr: 'العصر',
// //   maghrib: 'المغرب',
// //   isha: 'العشاء',
// // };

// // const PrayerTime = ({
// //   variant = 'compact',
// //   onTogglePrayed,
// //   prayerCompletionState = {},
// //   selectedDate = new Date(),
// //   city,
// //   country,
// // }) => {
// //   const navigation = useNavigation();
// //   const [currentPrayer, setCurrentPrayer] = useState(null);
// //   const [allPrayers, setAllPrayers] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);
// //   const calculationInterval = useRef(null);
// //   const [timeZone, setTimeZone] = useState('UTC');

// //   useEffect(() => {
// //     let unsubscribe = null;
// //     const setupNotifications = async () => {
// //       const result = await initializeNotificationService();
// //       if (typeof result === 'function') {
// //         unsubscribe = result;
// //       }
// //     };
// //     setupNotifications();
// //     return () => {
// //       if (typeof unsubscribe === 'function') {
// //         unsubscribe();
// //       }
// //     };
// //   }, []);

// //   useEffect(() => {
// //     configureNotifications();

// //     return () => {
// //       if (calculationInterval.current) {
// //         clearInterval(calculationInterval.current);
// //       }
// //     };
// //   }, []);

// //   const getLocationCoordinates = async () => {
// //     if (!city || !country) throw new Error('City or country not provided');

// //     const url = `https://nominatim.openstreetmap.org/search?city=${city}&country=${country}&format=json`;
// //     const response = await axios.get(url, {
// //       headers: {
// //         'Accept-Language': 'en',
// //         'User-Agent': 'Taqamu/1.0 nexomosmubashir@gmail.com',
// //       },
// //     });

// //     if (!response.data.length) throw new Error('No coordinates found');

// //     const data = response.data[0];
// //     return {
// //       latitude: parseFloat(data.lat),
// //       longitude: parseFloat(data.lon),
// //     };
// //   };

// //   const getTimeZone = async (lat, lon) => {
// //     const API_KEY = 'H03LL6PJW0Y5'; // Your TimezoneDB API key
// //     const url = `http://api.timezonedb.com/v2.1/get-time-zone?key=${API_KEY}&format=json&by=position&lat=${lat}&lng=${lon}`;

// //     const response = await axios.get(url);

// //     if (response.data.status === 'OK') {
// //       return response.data.zoneName; // example: "Asia/Karachi"
// //     } else {
// //       throw new Error('Failed to fetch timezone');
// //     }
// //   };

// const getCalculationParams = (methodKey) => {
//   let params;

//   switch (methodKey) {
//     case 'ICCI':
//       params = CalculationMethod.Other();
//       params.fajrAngle = 12;
//       params.ishaAngle = 12;
//       params.madhab = Madhab.Shafi;
//       params.highLatitudeRule = HighLatitudeRule.MiddleOfTheNight;
//       break;
//     case 'MWL':
//       params = CalculationMethod.MuslimWorldLeague();
//       break;
//     case 'ISNA':
//       params = CalculationMethod.NorthAmerica();
//       break;
//     case 'UmmAlQura':
//       params = CalculationMethod.UmmAlQura();
//       break;
//     case 'Egyptian':
//       params = CalculationMethod.Egyptian();
//       break;
//     case 'Tehran':
//       params = CalculationMethod.Tehran();
//       break;
//     case 'Karachi':
//       params = CalculationMethod.Karachi();
//       break;
//     case 'France12':
//       params = CalculationMethod.Other();
//       params.fajrAngle = 12;
//       params.ishaAngle = 12;
//       break;
//     case 'France15':
//       params = CalculationMethod.Other();
//       params.fajrAngle = 15;
//       params.ishaAngle = 15;
//       break;
//     case 'France18':
//       params = CalculationMethod.Other();
//       params.fajrAngle = 18;
//       params.ishaAngle = 18;
//       break;
//     case 'Jafari':
//       params = CalculationMethod.Other();
//       params.fajrAngle = 16;
//       params.ishaAngle = 14;
//       break;
//     default:
//       params = CalculationMethod.MuslimWorldLeague();
//   }

//   params.madhab = Madhab.Shafi;
//   params.adjustments = { fajr: -2, isha: 5 };

//   return params;
// };

// const getFormattedRemainingTime = (prayerTime) => {
//   const now = new Date();
//   const diffMinutes = differenceInMinutes(prayerTime, now);

//   if (diffMinutes <= 0) {
//     return 'Time has passed';
//   } else if (diffMinutes < 60) {
//     return `${diffMinutes} min remaining`;
//   } else {
//     const hours = Math.floor(diffMinutes / 60);
//     const minutes = diffMinutes % 60;
//     return `${hours} hr ${minutes} min remaining`;
//   }
// };

// const calculatePrayerTimes = async (selectedMethodKey = 'MWL') => {
//   try {
//     setLoading(true);
//     setError(null);

//     const { latitude, longitude } = await getLocationCoordinates();
//     const tz = await getTimeZone(latitude, longitude);
//     setTimeZone(tz);

//     const now = new Date();
//     // use toZonedTime instead of utcToZonedTime
//     const zonedDate = toZonedTime(now, tz);

//     const coordinates = new Coordinates(latitude, longitude);
//     const params = getCalculationParams(selectedMethodKey);

//     const prayerTimes = new PrayerTimes(coordinates, zonedDate, params);

//     // Format function to use date-fns-tz
//     const formatPrayerTime = (date) => {
//       const zoned = toZonedTime(date, tz);
//       return format(zoned, 'h:mm a', { timeZone: tz });
//     };

//     const prayers = [
//       {
//         name: 'Fajr',
//         arabicName: PRAYER_ARABIC_NAMES.fajr,
//         time: formatPrayerTime(prayerTimes.fajr),
//         exactTime: prayerTimes.fajr,
//         isCurrentPrayer: false,
//       },
//       {
//         name: 'Sunrise',
//         arabicName: PRAYER_ARABIC_NAMES.sunrise,
//         time: formatPrayerTime(prayerTimes.sunrise),
//         exactTime: prayerTimes.sunrise,
//         isCurrentPrayer: false,
//       },
//       {
//         name: 'Dhuhr',
//         arabicName: PRAYER_ARABIC_NAMES.dhuhr,
//         time: formatPrayerTime(prayerTimes.dhuhr),
//         exactTime: prayerTimes.dhuhr,
//         isCurrentPrayer: false,
//       },
//       {
//         name: 'Asr',
//         arabicName: PRAYER_ARABIC_NAMES.asr,
//         time: formatPrayerTime(prayerTimes.asr),
//         exactTime: prayerTimes.asr,
//         isCurrentPrayer: false,
//       },
//       {
//         name: 'Maghrib',
//         arabicName: PRAYER_ARABIC_NAMES.maghrib,
//         time: formatPrayerTime(prayerTimes.maghrib),
//         exactTime: prayerTimes.maghrib,
//         isCurrentPrayer: false,
//       },
//       {
//         name: 'Isha',
//         arabicName: PRAYER_ARABIC_NAMES.isha,
//         time: formatPrayerTime(prayerTimes.isha),
//         exactTime: prayerTimes.isha,
//         isCurrentPrayer: false,
//       },
//     ];

// //       const nextPrayerName = prayerTimes.nextPrayer();
// //       let nextPrayer = null;

// //       prayers.forEach((prayer) => {
// //         if (prayer.name.toLowerCase() === nextPrayerName) {
// //           prayer.isCurrentPrayer = true;
// //           prayer.remainingTime = getFormattedRemainingTime(prayer.exactTime);
// //           nextPrayer = { ...prayer };
// //         }

// //         if (prayer.exactTime > new Date()) {
// //           schedulePrayerNotification(prayer.name, prayer.exactTime);
// //         }
// //       });

// //       setAllPrayers(prayers);
// //       setCurrentPrayer(nextPrayer);
// //       setLoading(false);

// //       if (nextPrayer) {
// //         await AsyncStorage.setItem('nextPrayer', JSON.stringify(nextPrayer));
// //       }
// //     } catch (err) {
// //       console.error('Prayer time calculation error:', err);
// //       setError(err.message);
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     calculatePrayerTimes();

// //     calculationInterval.current = setInterval(() => {
// //       calculatePrayerTimes();
// //     }, 60000);

// //     return () => {
// //       if (calculationInterval.current) clearInterval(calculationInterval.current);
// //     };
// //   }, [city, country]);

// //   if (loading) {
// //     return (
// //       <View style={styles.loadingContainer}>
// //         <ActivityIndicator size="small" color="#f59e0b" />
// //         <Text style={styles.loadingText}>Calculating prayer times...</Text>
// //       </View>
// //     );
// //   }

// //   if (error) {
// //     return (
// //       <View style={styles.errorContainer}>
// //         <Text style={styles.errorText}>Error: {error}</Text>
// //       </View>
// //     );
// //   }
// //   return (
// //     <View style={styles.compactContainer}>
// //       <View style={styles.compactGrid}>
// //         {/* Next Prayer Card */}
// //         <View style={styles.compactCard}>
// //           <Text style={styles.compactLabel}>Next</Text>
// //           <View style={styles.compactContent}>
// //             <View style={styles.compactHeader}>
// //               <Text style={styles.compactPrayerName}>{currentPrayer.name}</Text>
// //               {currentPrayer.name.toLowerCase() === 'maghrib' && (
// //                 <Text style={styles.compactIcon}>🌙</Text>
// //               )}
// //               {currentPrayer.name.toLowerCase() === 'isha' && (
// //                 <Text style={styles.compactIcon}>🌟</Text>
// //               )}
// //             </View>
// //             <Text style={styles.compactArabicName}>
// //               {currentPrayer.arabicName}
// //             </Text>
// //             <View style={styles.compactFooter}>
// //               <Text style={styles.compactTime}>{currentPrayer.time}</Text>
// //               <TouchableOpacity
// //                 style={styles.compactLink}
// //                 onPress={() => {
// //                   navigation.navigate('PrayerTimesScreen', {
// //                     prayers: allPrayers,
// //                     selectedDate: selectedDate,
// //                     prayerCompletionState: prayerCompletionState,
// //                     onTogglePrayed: onTogglePrayed,
// //                   });
// //                 }}>
// //                 <Text style={styles.compactLinkText}>View times</Text>
// //               </TouchableOpacity>
// //             </View>
// //           </View>
// //         </View>

// //         {/* Upcoming Prayer Card */}
// //         <View style={styles.compactCard}>
// //           <Text style={styles.compactLabel}>Upcoming</Text>
// //           <View style={styles.compactContent}>
// //             {upcomingPrayer && (
// //               <>
// //                 <View style={styles.compactHeader}>
// //                   <Text style={styles.compactPrayerName}>
// //                     {upcomingPrayer.name}
// //                   </Text>
// //                   {upcomingPrayer.name.toLowerCase() === 'isha' && (
// //                     <Text style={styles.compactIcon}>🌟</Text>
// //                   )}
// //                 </View>
// //                 <Text style={styles.compactArabicName}>
// //                   {upcomingPrayer.arabicName}
// //                 </Text>
// //                 <View style={styles.compactFooter}>
// //                   <Text style={styles.compactTime}>{upcomingPrayer.time}</Text>
// //                   <TouchableOpacity
// //                     style={styles.compactLink}
// //                     onPress={() => {
// //                       navigation.navigate('PrayerTimesScreen', {
// //                         prayers: allPrayers,
// //                         selectedDate: selectedDate,
// //                         prayerCompletionState: prayerCompletionState,
// //                         onTogglePrayed: onTogglePrayed,
// //                       });
// //                     }}>
// //                     <Text style={styles.compactLinkText}>View times</Text>
// //                   </TouchableOpacity>
// //                 </View>
// //               </>
// //             )}
// //           </View>
// //         </View>
// //       </View>
// //     </View>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   loadingContainer: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     padding: 16,
// //     backgroundColor: '#1e293b',
// //     borderRadius: 12,
// //     borderWidth: 1,
// //     borderColor: '#334155',
// //   },
// //   loadingText: {
// //     color: 'white',
// //     marginLeft: 8,
// //   },
// //   errorContainer: {
// //     padding: 16,
// //     backgroundColor: '#1e293b',
// //     borderRadius: 12,
// //     borderWidth: 1,
// //     borderColor: '#334155',
// //   },
// //   errorText: {
// //     color: '#f87171',
// //   },
// //   compactContainer: {
// //     flexDirection: 'column',
// //     gap: 12,
// //   },
// //   compactGrid: {
// //     flexDirection: 'row',
// //     gap: 12,
// //   },
// //   compactCard: {
// //     flex: 1,
// //     backgroundColor: '#1e293b',
// //     borderWidth: 1,
// //     borderColor: '#334155',
// //     borderRadius: 12,
// //     padding: 16,
// //   },
// //   compactLabel: {
// //     fontSize: 14,
// //     color: '#9ca3af',
// //     marginBottom: 4,
// //   },
// //   compactContent: {
// //     flexDirection: 'column',
// //   },
// //   compactHeader: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //   },
// //   compactPrayerName: {
// //     fontSize: 20,
// //     fontWeight: '500',
// //     color: 'white',
// //   },
// //   compactIcon: {
// //     marginLeft: 8,
// //     fontSize: 18,
// //   },
// //   compactArabicName: {
// //     fontSize: 14,
// //     color: '#f59e0b',
// //     marginBottom: 8,
// //   },
// //   compactFooter: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //   },
// //   compactTime: {
// //     fontWeight: '500',
// //     color: 'white',
// //   },
// //   compactLink: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //   },
// //   compactLinkText: {
// //     fontSize: 14,
// //     color: '#f59e0b',
// //   },
// //   compactLinkIcon: {
// //     marginLeft: 4,
// //     color: '#f59e0b',
// //   },
// // });

// // export default PrayerTime;
// // // import React, {useState, useEffect, useRef} from 'react';
// // // import {
// // //   View,
// // //   Text,
// // //   StyleSheet,
// // //   TouchableOpacity,
// // //   ActivityIndicator,
// // //   Platform,
// // // } from 'react-native';
// // // import {Coordinates, CalculationMethod, Madhab, PrayerTimes} from 'adhan';
// // // import * as adhan from 'adhan';
// // // import {format, differenceInMinutes} from 'date-fns';
// // // import axios from 'axios';
// // // import {useNavigation} from '@react-navigation/native';
// // // import AsyncStorage from '@react-native-async-storage/async-storage';
// // // import {
// // //   configureNotifications,
// // //   initializeNotificationService,
// // //   schedulePrayerNotification,
// // // } from '../notification_fix/NotificationService';

// // // const PRAYER_ARABIC_NAMES = {
// // //   fajr: 'الفجر',
// // //   sunrise: 'الشروق',
// // //   dhuhr: 'الظهر',
// // //   asr: 'العصر',
// // //   maghrib: 'المغرب',
// // //   isha: 'العشاء',
// // // };

// // // const PrayerTime = ({
// // //   variant = 'compact',
// // //   onTogglePrayed,
// // //   prayerCompletionState = {},
// // //   selectedDate = new Date(),
// // //   city,
// // //   country,
// // // }) => {
// // //   const navigation = useNavigation();
// // //   const [currentPrayer, setCurrentPrayer] = useState(null);
// // //   const [allPrayers, setAllPrayers] = useState([]);
// // //   const [loading, setLoading] = useState(true);
// // //   const [error, setError] = useState(null);
// // //   const calculationInterval = useRef(null);

// // //   useEffect(() => {
// // //     let unsubscribe = null;

// // //     const setupNotifications = async () => {
// // //       const result = await initializeNotificationService();
// // //       if (typeof result === 'function') {
// // //         unsubscribe = result;
// // //       }
// // //     };

// // //     setupNotifications();

// // //     return () => {
// // //       if (typeof unsubscribe === 'function') {
// // //         unsubscribe();
// // //       }
// // //     };
// // //   }, []);

// // //   useEffect(() => {
// // //     configureNotifications();

// // //     return () => {
// // //       if (calculationInterval.current) {
// // //         clearInterval(calculationInterval.current);
// // //       }
// // //     };
// // //   }, []);

// // //   const getLocationCoordinates = async () => {
// // //     if (!city || !country) {
// // //       throw new Error('City or country not provided');
// // //     }

// // //     const url = `https://nominatim.openstreetmap.org/search?city=${city}&country=${country}&format=json`;

// // //     // const response = await axios.get(url, {
// // //     //   headers: {'Accept-Language': 'en'},
// // //     // });
// // //     const response = await axios.get(url, {
// // //       headers: {
// // //         'Accept-Language': 'en',
// // //         'User-Agent': 'Taqamu/1.0 nexomosmubashir@gmail.com',
// // //       },
// // //     });

// // //     const results = response.data;

// // //     if (!Array.isArray(results) || results.length === 0) {
// // //       throw new Error('No coordinates found');
// // //     }

// // //     const data = results[0];

// // //     return {
// // //       latitude: parseFloat(data.lat),
// // //       longitude: parseFloat(data.lon),
// // //     };
// // //   };

// // //   const getFormattedRemainingTime = prayerTime => {
// // //     const now = new Date();
// // //     const diffMinutes = differenceInMinutes(prayerTime, now);

// // //     if (diffMinutes <= 0) {
// // //       return 'Time has passed';
// // //     } else if (diffMinutes < 60) {
// // //       return `${diffMinutes} min remaining`;
// // //     } else {
// // //       const hours = Math.floor(diffMinutes / 60);
// // //       const minutes = diffMinutes % 60;
// // //       return `${hours} hr ${minutes} min remaining`;
// // //     }
// // //   };

// // //   const getCalculationParams = methodKey => {
// // //     let params;

// // //     switch (methodKey) {
// // //       case 'ICCI':
// // //         const paramsICCI = CalculationMethod.Other();
// // //         paramsICCI.fajrAngle = 12;
// // //         paramsICCI.ishaAngle = 12;
// // //         paramsICCI.madhab = Madhab.Shafi;
// // //         paramsICCI.highLatitudeRule = HighLatitudeRule.MiddleOfTheNight;
// // //         break;

// // //       case 'MWL':
// // //         params = CalculationMethod.MuslimWorldLeague();
// // //         break;
// // //       case 'ISNA':
// // //         params = CalculationMethod.NorthAmerica();
// // //         break;
// // //       case 'UmmAlQura':
// // //         params = CalculationMethod.UmmAlQura();
// // //         break;
// // //       case 'Egyptian':
// // //         params = CalculationMethod.Egyptian();
// // //         break;
// // //       case 'Tehran':
// // //         params = CalculationMethod.Tehran();
// // //         break;
// // //       case 'Karachi':
// // //         params = CalculationMethod.Karachi();
// // //         break;
// // //       case 'France12':
// // //         params = CalculationMethod.Other();
// // //         params.fajrAngle = 12;
// // //         params.ishaAngle = 12;
// // //         break;
// // //       case 'France15':
// // //         params = CalculationMethod.Other();
// // //         params.fajrAngle = 15;
// // //         params.ishaAngle = 15;
// // //         break;
// // //       case 'France18':
// // //         params = CalculationMethod.Other();
// // //         params.fajrAngle = 18;
// // //         params.ishaAngle = 18;
// // //         break;
// // //       case 'Jafari':
// // //         params = CalculationMethod.Other();
// // //         params.fajrAngle = 16;
// // //         params.ishaAngle = 14;
// // //         break;
// // //       default:
// // //         params = CalculationMethod.MuslimWorldLeague();
// // //         break;
// // //     }

// // //     // Set madhab and optional manual adjustments
// // //     params.madhab = Madhab.Shafi;
// // //     params.adjustments = {fajr: -2, isha: 5};

// // //     return params;
// // //   };

// // //   const calculatePrayerTimes = async selectedMethodKey => {
// // //     try {
// // //       setLoading(true);
// // //       setError(null);

// // //       const {latitude, longitude} = await getLocationCoordinates();
// // //       const date = new Date();
// // //       const coordinates = new Coordinates(latitude, longitude);
// // //       const params = getCalculationParams(selectedMethodKey);

// // //       const prayerTimes = new PrayerTimes(coordinates, date, params);

// // //       const prayers = [
// // //         {
// // //           name: 'Fajr',
// // //           arabicName: PRAYER_ARABIC_NAMES.fajr,
// // //           time: format(prayerTimes.fajr, 'h:mm a'),
// // //           exactTime: new Date(prayerTimes.fajr),
// // //           isCurrentPrayer: false,
// // //         },
// // //         {
// // //           name: 'Sunrise',
// // //           arabicName: PRAYER_ARABIC_NAMES.sunrise,
// // //           time: format(prayerTimes.sunrise, 'h:mm a'),
// // //           exactTime: new Date(prayerTimes.sunrise),
// // //           isCurrentPrayer: false,
// // //         },
// // //         {
// // //           name: 'Dhuhr',
// // //           arabicName: PRAYER_ARABIC_NAMES.dhuhr,
// // //           time: format(prayerTimes.dhuhr, 'h:mm a'),
// // //           exactTime: new Date(prayerTimes.dhuhr),
// // //           isCurrentPrayer: false,
// // //         },
// // //         {
// // //           name: 'Asr',
// // //           arabicName: PRAYER_ARABIC_NAMES.asr,
// // //           time: format(prayerTimes.asr, 'h:mm a'),
// // //           exactTime: new Date(prayerTimes.asr),
// // //           isCurrentPrayer: false,
// // //         },
// // //         {
// // //           name: 'Maghrib',
// // //           arabicName: PRAYER_ARABIC_NAMES.maghrib,
// // //           time: format(prayerTimes.maghrib, 'h:mm a'),
// // //           exactTime: new Date(prayerTimes.maghrib),
// // //           isCurrentPrayer: false,
// // //         },
// // //         {
// // //           name: 'Isha',
// // //           arabicName: PRAYER_ARABIC_NAMES.isha,
// // //           time: format(prayerTimes.isha, 'h:mm a'),
// // //           exactTime: new Date(prayerTimes.isha),
// // //           isCurrentPrayer: false,
// // //         },
// // //       ];

// // //       const nextPrayerName = prayerTimes.nextPrayer();
// // //       let nextPrayer = null;

// // //       prayers.forEach(prayer => {
// // //         const lowerName = prayer.name.toLowerCase();
// // //         if (nextPrayerName === lowerName) {
// // //           prayer.isCurrentPrayer = true;
// // //           prayer.remainingTime = getFormattedRemainingTime(prayer.exactTime);
// // //           nextPrayer = {...prayer};
// // //         }

// // //         if (prayer.exactTime > new Date()) {
// // //           schedulePrayerNotification(prayer.name, prayer.exactTime);
// // //         }
// // //       });

// // //       setAllPrayers(prayers);
// // //       setCurrentPrayer(nextPrayer);
// // //       setLoading(false);

// // //       if (nextPrayer) {
// // //         await AsyncStorage.setItem('nextPrayer', JSON.stringify(nextPrayer));
// // //       }
// // //     } catch (err) {
// // //       console.error('Prayer time calculation error:', err);
// // //       setError(err.message);
// // //       setLoading(false);
// // //     }
// // //   };

// // //   useEffect(() => {
// // //     calculatePrayerTimes();

// // //     // Update every minute instead of 15 seconds to reduce load
// // //     calculationInterval.current = setInterval(() => {
// // //       calculatePrayerTimes();
// // //     }, 60000);

// // //     return () => {
// // //       if (calculationInterval.current) {
// // //         clearInterval(calculationInterval.current);
// // //       }
// // //     };
// // //   }, [city, country]);

// // //   if (loading) {
// // //     return (
// // //       <View style={styles.loadingContainer}>
// // //         <ActivityIndicator size="small" color="#f59e0b" />
// // //         <Text style={styles.loadingText}>Calculating prayer times...</Text>
// // //       </View>
// // //     );
// // //   }

// // //   if (error) {
// // //     return (
// // //       <View style={styles.errorContainer}>
// // //         <Text style={styles.errorText}>{error}</Text>
// // //       </View>
// // //     );
// // //   }

// // //   if (!currentPrayer) {
// // //     return null;
// // //   }

// // //   const currentPrayerIndex = allPrayers.findIndex(
// // //     p => p.name.toLowerCase() === currentPrayer.name.toLowerCase(),
// // //   );

// // //   let upcomingPrayer = null;
// // //   for (let i = currentPrayerIndex + 1; i < allPrayers.length; i++) {
// // //     if (allPrayers[i]) {
// // //       upcomingPrayer = allPrayers[i];
// // //       break;
// // //     }
// // //   }

// // //   if (!upcomingPrayer && currentPrayerIndex === allPrayers.length - 1) {
// // //     upcomingPrayer = allPrayers[0];
// // //   }

// // //   if (upcomingPrayer) {
// // //     AsyncStorage.setItem('upcomingPrayer', JSON.stringify(upcomingPrayer))
// // //       .then()
// // //       .catch(error => console.error('Failed to store upcomingPrayer', error));
// // //   }

// //   return (
// //     <View style={styles.compactContainer}>
// //       <View style={styles.compactGrid}>
// //         {/* Next Prayer Card */}
// //         <View style={styles.compactCard}>
// //           <Text style={styles.compactLabel}>Next</Text>
// //           <View style={styles.compactContent}>
// //             <View style={styles.compactHeader}>
// //               <Text style={styles.compactPrayerName}>{currentPrayer.name}</Text>
// //               {currentPrayer.name.toLowerCase() === 'maghrib' && (
// //                 <Text style={styles.compactIcon}>🌙</Text>
// //               )}
// //               {currentPrayer.name.toLowerCase() === 'isha' && (
// //                 <Text style={styles.compactIcon}>🌟</Text>
// //               )}
// //             </View>
// //             <Text style={styles.compactArabicName}>
// //               {currentPrayer.arabicName}
// //             </Text>
// //             <View style={styles.compactFooter}>
// //               <Text style={styles.compactTime}>{currentPrayer.time}</Text>
// //               <TouchableOpacity
// //                 style={styles.compactLink}
// //                 onPress={() => {
// //                   navigation.navigate('PrayerTimesScreen', {
// //                     prayers: allPrayers,
// //                     selectedDate: selectedDate,
// //                     prayerCompletionState: prayerCompletionState,
// //                     onTogglePrayed: onTogglePrayed,
// //                   });
// //                 }}>
// //                 <Text style={styles.compactLinkText}>View times</Text>
// //               </TouchableOpacity>
// //             </View>
// //           </View>
// //         </View>

// //         {/* Upcoming Prayer Card */}
// //         <View style={styles.compactCard}>
// //           <Text style={styles.compactLabel}>Upcoming</Text>
// //           <View style={styles.compactContent}>
// //             {upcomingPrayer && (
// //               <>
// //                 <View style={styles.compactHeader}>
// //                   <Text style={styles.compactPrayerName}>
// //                     {upcomingPrayer.name}
// //                   </Text>
// //                   {upcomingPrayer.name.toLowerCase() === 'isha' && (
// //                     <Text style={styles.compactIcon}>🌟</Text>
// //                   )}
// //                 </View>
// //                 <Text style={styles.compactArabicName}>
// //                   {upcomingPrayer.arabicName}
// //                 </Text>
// //                 <View style={styles.compactFooter}>
// //                   <Text style={styles.compactTime}>{upcomingPrayer.time}</Text>
// //                   <TouchableOpacity
// //                     style={styles.compactLink}
// //                     onPress={() => {
// //                       navigation.navigate('PrayerTimesScreen', {
// //                         prayers: allPrayers,
// //                         selectedDate: selectedDate,
// //                         prayerCompletionState: prayerCompletionState,
// //                         onTogglePrayed: onTogglePrayed,
// //                       });
// //                     }}>
// //                     <Text style={styles.compactLinkText}>View times</Text>
// //                   </TouchableOpacity>
// //                 </View>
// //               </>
// //             )}
// //           </View>
// //         </View>
// //       </View>
// //     </View>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   loadingContainer: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     padding: 16,
// //     backgroundColor: '#1e293b',
// //     borderRadius: 12,
// //     borderWidth: 1,
// //     borderColor: '#334155',
// //   },
// //   loadingText: {
// //     color: 'white',
// //     marginLeft: 8,
// //   },
// //   errorContainer: {
// //     padding: 16,
// //     backgroundColor: '#1e293b',
// //     borderRadius: 12,
// //     borderWidth: 1,
// //     borderColor: '#334155',
// //   },
// //   errorText: {
// //     color: '#f87171',
// //   },
// //   compactContainer: {
// //     flexDirection: 'column',
// //     gap: 12,
// //   },
// //   compactGrid: {
// //     flexDirection: 'row',
// //     gap: 12,
// //   },
// //   compactCard: {
// //     flex: 1,
// //     backgroundColor: '#1e293b',
// //     borderWidth: 1,
// //     borderColor: '#334155',
// //     borderRadius: 12,
// //     padding: 16,
// //   },
// //   compactLabel: {
// //     fontSize: 14,
// //     color: '#9ca3af',
// //     marginBottom: 4,
// //   },
// //   compactContent: {
// //     flexDirection: 'column',
// //   },
// //   compactHeader: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //   },
// //   compactPrayerName: {
// //     fontSize: 20,
// //     fontWeight: '500',
// //     color: 'white',
// //   },
// //   compactIcon: {
// //     marginLeft: 8,
// //     fontSize: 18,
// //   },
// //   compactArabicName: {
// //     fontSize: 14,
// //     color: '#f59e0b',
// //     marginBottom: 8,
// //   },
// //   compactFooter: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //   },
// //   compactTime: {
// //     fontWeight: '500',
// //     color: 'white',
// //   },
// //   compactLink: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //   },
// //   compactLinkText: {
// //     fontSize: 14,
// //     color: '#f59e0b',
// //   },
// //   compactLinkIcon: {
// //     marginLeft: 4,
// //     color: '#f59e0b',
// //   },
// // });

// // export default PrayerTime;

// import React, {useState, useEffect, useRef} from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   ActivityIndicator,
// } from 'react-native';
// import {
//   Coordinates,
//   Madhab,
//   PrayerTimes,
//   CalculationMethod,
//   HighLatitudeRule,
// } from 'adhan';
// import axios from 'axios';
// import {format, differenceInMinutes, differenceInSeconds} from 'date-fns';
// import {toZonedTime} from 'date-fns-tz';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import {useNavigation} from '@react-navigation/native';
// import {
//   initializeNotificationService,
//   configureNotifications,
//   schedulePrayerNotification,
// } from '../notification_fix/NotificationService';

// const PRAYER_ARABIC_NAMES = {
//   fajr: 'الفجر',
//   sunrise: 'الشروق',
//   dhuhr: 'الظهر',
//   asr: 'العصر',
//   maghrib: 'المغرب',
//   isha: 'العشاء',
// };

// const PrayerTime = ({
//   variant = 'compact',
//   onTogglePrayed,
//   prayerCompletionState = {},
//   selectedDate = new Date(),
//   city,
//   country,
// }) => {
//   const navigation = useNavigation();
//   const [currentPrayer, setCurrentPrayer] = useState(null);
//   const [allPrayers, setAllPrayers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const calculationInterval = useRef(null);
//   const [timeZone, setTimeZone] = useState('UTC');

//   useEffect(() => {
//     let unsubscribe = null;
//     const setupNotifications = async () => {
//       const result = await initializeNotificationService();
//       if (typeof result === 'function') {
//         unsubscribe = result;
//       }
//     };
//     setupNotifications();
//     return () => {
//       if (typeof unsubscribe === 'function') {
//         unsubscribe();
//       }
//     };
//   }, []);

//   useEffect(() => {
//     configureNotifications();

//     return () => {
//       if (calculationInterval.current) {
//         clearInterval(calculationInterval.current);
//       }
//     };
//   }, []);

//   const getLocationCoordinates = async () => {
//     if (!city || !country) throw new Error('City or country not provided');

//     const url = `https://nominatim.openstreetmap.org/search?city=${city}&country=${country}&format=json`;
//     const response = await axios.get(url, {
//       headers: {
//         'Accept-Language': 'en',
//         'User-Agent': 'Taqamu/1.0 nexomosmubashir@gmail.com',
//       },
//     });

//     if (!response.data.length) throw new Error('No coordinates found');

//     const data = response.data[0];
//     return {
//       latitude: parseFloat(data.lat),
//       longitude: parseFloat(data.lon),
//     };
//   };

//   const getTimeZone = async (lat, lon) => {
//     const API_KEY = 'H03LL6PJW0Y5'; // Your TimezoneDB API key
//     const url = `http://api.timezonedb.com/v2.1/get-time-zone?key=${API_KEY}&format=json&by=position&lat=${lat}&lng=${lon}`;

//     const response = await axios.get(url);

//     if (response.data.status === 'OK') {
//       return response.data.zoneName;
//     } else {
//       throw new Error('Failed to fetch timezone');
//     }
//   };

//   const getCalculationParams = methodKey => {
//     let params;
//     switch (methodKey) {
//       case 'ICCI':
//         params = CalculationMethod.Other();
//         params.fajrAngle = 12;
//         params.ishaAngle = 12;
//         params.madhab = Madhab.Shafi;
//         params.highLatitudeRule = HighLatitudeRule.MiddleOfTheNight;
//         break;
//       case 'MWL':
//         params = CalculationMethod.MuslimWorldLeague();
//         break;
//       default:
//         params = CalculationMethod.MuslimWorldLeague();
//     }
//     params.madhab = Madhab.Shafi;
//     params.adjustments = {fajr: -2, isha: 5};
//     return params;
//   };

//   // New helper: format remaining time in "X hr Y min" or "Z min"
//   const formatRemainingTime = targetDate => {
//     const now = new Date();
//     let diffSec = Math.floor((targetDate - now) / 1000);

//     if (diffSec <= 0) return 'Time passed';

//     const hours = Math.floor(diffSec / 3600);
//     const minutes = Math.floor((diffSec % 3600) / 60);

//     if (hours > 0) {
//       return `${hours} hr${hours > 1 ? 's' : ''} ${minutes} min`;
//     }
//     return `${minutes} min`;
//   };

//   const calculatePrayerTimes = async (selectedMethodKey = 'MWL') => {
//     try {
//       setLoading(true);
//       setError(null);

//       const {latitude, longitude} = await getLocationCoordinates();
//       const tz = await getTimeZone(latitude, longitude);
//       setTimeZone(tz);

//       const now = new Date();
//       const zonedDate = toZonedTime(now, tz);

//       const coordinates = new Coordinates(latitude, longitude);
//       const params = getCalculationParams(selectedMethodKey);

//       const prayerTimes = new PrayerTimes(coordinates, zonedDate, params);

//       const formatPrayerTime = date => {
//         const zoned = toZonedTime(date, tz);
//         return format(zoned, 'h:mm a', {timeZone: tz});
//       };

//       const prayers = [
//         {
//           name: 'Fajr',
//           arabicName: PRAYER_ARABIC_NAMES.fajr,
//           time: formatPrayerTime(prayerTimes.fajr),
//           exactTime: prayerTimes.fajr,
//           isCurrentPrayer: false,
//         },
//         {
//           name: 'Sunrise',
//           arabicName: PRAYER_ARABIC_NAMES.sunrise,
//           time: formatPrayerTime(prayerTimes.sunrise),
//           exactTime: prayerTimes.sunrise,
//           isCurrentPrayer: false,
//         },
//         {
//           name: 'Dhuhr',
//           arabicName: PRAYER_ARABIC_NAMES.dhuhr,
//           time: formatPrayerTime(prayerTimes.dhuhr),
//           exactTime: prayerTimes.dhuhr,
//           isCurrentPrayer: false,
//         },
//         {
//           name: 'Asr',
//           arabicName: PRAYER_ARABIC_NAMES.asr,
//           time: formatPrayerTime(prayerTimes.asr),
//           exactTime: prayerTimes.asr,
//           isCurrentPrayer: false,
//         },
//         {
//           name: 'Maghrib',
//           arabicName: PRAYER_ARABIC_NAMES.maghrib,
//           time: formatPrayerTime(prayerTimes.maghrib),
//           exactTime: prayerTimes.maghrib,
//           isCurrentPrayer: false,
//         },
//         {
//           name: 'Isha',
//           arabicName: PRAYER_ARABIC_NAMES.isha,
//           time: formatPrayerTime(prayerTimes.isha),
//           exactTime: prayerTimes.isha,
//           isCurrentPrayer: false,
//         },
//       ];

//       // Find next prayer name using library method
//       const nextPrayerName = prayerTimes.nextPrayer();
//       let nextPrayer = null;

//       prayers.forEach(prayer => {
//         if (prayer.name.toLowerCase() === nextPrayerName) {
//           prayer.isCurrentPrayer = true;
//           prayer.remainingTime = formatRemainingTime(prayer.exactTime);
//           nextPrayer = {...prayer};
//         }

//         // Schedule notification only if in future
//         if (prayer.exactTime > new Date()) {
//           schedulePrayerNotification(prayer.name, prayer.exactTime);
//         }
//       });

//       setAllPrayers(prayers);
//       setCurrentPrayer(nextPrayer);
//       setLoading(false);

//       if (nextPrayer) {
//         await AsyncStorage.setItem('nextPrayer', JSON.stringify(nextPrayer));
//       }
//     } catch (err) {
//       console.error('Prayer time calculation error:', err);
//       setError(err.message);
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     calculatePrayerTimes();

//     calculationInterval.current = setInterval(() => {
//       calculatePrayerTimes();
//     }, 60000);

//     return () => {
//       if (calculationInterval.current)
//         clearInterval(calculationInterval.current);
//     };
//   }, [city, country]);

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="small" color="#f59e0b" />
//         <Text style={styles.loadingText}>Calculating prayer times...</Text>
//       </View>
//     );
//   }

//   if (error) {
//     return (
//       <View style={styles.errorContainer}>
//         <Text style={styles.errorText}>{error}</Text>
//       </View>
//     );
//   }

//   if (!currentPrayer) {
//     return null;
//   }

//   const currentPrayerIndex = allPrayers.findIndex(
//     p => p.name.toLowerCase() === currentPrayer.name.toLowerCase(),
//   );

//   let upcomingPrayer = null;
//   for (let i = currentPrayerIndex + 1; i < allPrayers.length; i++) {
//     if (allPrayers[i]) {
//       upcomingPrayer = allPrayers[i];
//       break;
//     }
//   }

//   if (!upcomingPrayer && currentPrayerIndex === allPrayers.length - 1) {
//     upcomingPrayer = allPrayers[0];
//   }

//   if (upcomingPrayer) {
//     AsyncStorage.setItem('upcomingPrayer', JSON.stringify(upcomingPrayer))
//       .then()
//       .catch(error => console.error('Failed to store upcomingPrayer', error));
//   }

//   return (
//     <View style={styles.compactContainer}>
//       <View style={styles.compactGrid}>
//         {/* Next Prayer Card */}
//         <View style={styles.compactCard}>
//           <Text style={styles.compactLabel}>Next</Text>
//           <View style={styles.compactContent}>
//             <View style={styles.compactHeader}>
//               <Text style={styles.compactPrayerName}>{currentPrayer.name}</Text>
//               {currentPrayer.name.toLowerCase() === 'maghrib' && (
//                 <Text style={styles.compactIcon}>🌙</Text>
//               )}
//               {currentPrayer.name.toLowerCase() === 'isha' && (
//                 <Text style={styles.compactIcon}>🌟</Text>
//               )}
//             </View>
//             <Text style={styles.compactArabicName}>
//               {currentPrayer.arabicName}
//             </Text>
//             <View style={styles.compactFooter}>
//               <Text style={styles.compactTime}>{currentPrayer.time}</Text>
//               <TouchableOpacity
//                 style={styles.compactLink}
//                 onPress={() => {
//                   navigation.navigate('PrayerTimesScreen', {
//                     prayers: allPrayers,
//                     selectedDate: selectedDate,
//                     prayerCompletionState: prayerCompletionState,
//                     onTogglePrayed: onTogglePrayed,
//                   });
//                 }}>
//                 <Text style={styles.compactLinkText}>View times</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>

//         {/* Upcoming Prayer Card */}
//         <View style={styles.compactCard}>
//           <Text style={styles.compactLabel}>Upcoming</Text>
//           <View style={styles.compactContent}>
//             {upcomingPrayer && (
//               <>
//                 <View style={styles.compactHeader}>
//                   <Text style={styles.compactPrayerName}>
//                     {upcomingPrayer.name}
//                   </Text>
//                   {upcomingPrayer.name.toLowerCase() === 'isha' && (
//                     <Text style={styles.compactIcon}>🌟</Text>
//                   )}
//                 </View>
//                 <Text style={styles.compactArabicName}>
//                   {upcomingPrayer.arabicName}
//                 </Text>
//                 <View style={styles.compactFooter}>
//                   <Text style={styles.compactTime}>{upcomingPrayer.time}</Text>
//                   <TouchableOpacity
//                     style={styles.compactLink}
//                     onPress={() => {
//                       navigation.navigate('PrayerTimesScreen', {
//                         prayers: allPrayers,
//                         selectedDate: selectedDate,
//                         prayerCompletionState: prayerCompletionState,
//                         onTogglePrayed: onTogglePrayed,
//                       });
//                     }}>
//                     <Text style={styles.compactLinkText}>View times</Text>
//                   </TouchableOpacity>
//                 </View>
//               </>
//             )}
//           </View>
//         </View>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   loadingContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: 16,
//     backgroundColor: '#1e293b',
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: '#334155',
//   },
//   loadingText: {
//     color: 'white',
//     marginLeft: 8,
//   },
//   errorContainer: {
//     padding: 16,
//     backgroundColor: '#1e293b',
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: '#334155',
//   },
//   errorText: {
//     color: '#f87171',
//   },
//   compactContainer: {
//     flexDirection: 'column',
//     gap: 12,
//   },
//   compactGrid: {
//     flexDirection: 'row',
//     gap: 12,
//   },
//   compactCard: {
//     flex: 1,
//     backgroundColor: '#1e293b',
//     borderWidth: 1,
//     borderColor: '#334155',
//     borderRadius: 12,
//     padding: 16,
//   },
//   compactLabel: {
//     fontSize: 14,
//     color: '#9ca3af',
//     marginBottom: 4,
//   },
//   compactContent: {
//     flexDirection: 'column',
//   },
//   compactHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   compactPrayerName: {
//     fontSize: 20,
//     fontWeight: '500',
//     color: 'white',
//   },
//   compactIcon: {
//     marginLeft: 8,
//     fontSize: 18,
//   },
//   compactArabicName: {
//     fontSize: 14,
//     color: '#f59e0b',
//     marginBottom: 8,
//   },
//   compactFooter: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   compactTime: {
//     fontWeight: '500',
//     color: 'white',
//   },
//   compactLink: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   compactLinkText: {
//     fontSize: 14,
//     color: '#f59e0b',
//   },
//   compactLinkIcon: {
//     marginLeft: 4,
//     color: '#f59e0b',
//   },
// });

// export default PrayerTime;

import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {
  Coordinates,
  Madhab,
  PrayerTimes,
  CalculationMethod,
  HighLatitudeRule,
} from 'adhan';
import axios from 'axios';
import {format} from 'date-fns';
import {toZonedTime} from 'date-fns-tz';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {
  initializeNotificationService,
  configureNotifications,
  schedulePrayerNotification,
} from '../notification_fix/NotificationService';

const PRAYER_ARABIC_NAMES = {
  fajr: 'الفجر',
  sunrise: 'الشروق',
  dhuhr: 'الظهر',
  asr: 'العصر',
  maghrib: 'المغرب',
  isha: 'العشاء',
};

const PrayerTime = ({
  variant = 'compact',
  onTogglePrayed,
  prayerCompletionState = {},
  selectedDate = new Date(),
  city,
  country,
  localTime,
}) => {
  const navigation = useNavigation();
  const [currentPrayer, setCurrentPrayer] = useState(null);
  const [allPrayers, setAllPrayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const calculationInterval = useRef(null);
  const [timeZone, setTimeZone] = useState('UTC');

  useEffect(() => {
    let unsubscribe = null;
    const setupNotifications = async () => {
      const result = await initializeNotificationService();
      if (typeof result === 'function') {
        unsubscribe = result;
      }
    };
    setupNotifications();
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  useEffect(() => {
    configureNotifications();

    return () => {
      if (calculationInterval.current) {
        clearInterval(calculationInterval.current);
      }
    };
  }, []);

  const getLocationCoordinates = async () => {
    if (!city || !country) throw new Error('City or country not provided');

    const url = `https://nominatim.openstreetmap.org/search?city=${city}&country=${country}&format=json`;
    const response = await axios.get(url, {
      headers: {
        'Accept-Language': 'en',
        'User-Agent': 'Taqamu/1.0 nexomosmubashir@gmail.com',
      },
    });

    if (!response.data.length) throw new Error('No coordinates found');

    const data = response.data[0];
    return {
      latitude: parseFloat(data.lat),
      longitude: parseFloat(data.lon),
    };
  };

  const getTimeZone = async (lat, lon) => {
    try {
      const API_KEY = 'H03LL6PJW0Y5';
      const url = `http://api.timezonedb.com/v2.1/get-time-zone?key=${API_KEY}&format=json&by=position&lat=${lat}&lng=${lon}`;
      const response = await axios.get(url);

      if (response.data.status === 'OK') {
        return response.data.zoneName;
      } else {
        throw new Error('Failed to fetch timezone');
      }
    } catch (e) {
      console.warn('Timezone API failed, falling back to Europe/Dublin');
      return 'Europe/Dublin';
    }
  };

  // ✅ Safe date parser
  const getSafeLocalDate = () => {
    if (!localTime) return new Date();

    try {
      const isoString = localTime.includes('T')
        ? localTime
        : localTime.replace(' ', 'T');

      const date = new Date(isoString);

      if (isNaN(date.getTime())) {
        console.warn('Invalid localTime:', localTime);
        return new Date();
      }

      return date;
    } catch (e) {
      console.error('Date parsing failed:', e);
      return new Date();
    }
  };

  const formatRemainingTime = targetDate => {
    const now = getSafeLocalDate();
    let diffSec = Math.floor((targetDate - now) / 1000);

    if (diffSec <= 0) return 'Time passed';

    const hours = Math.floor(diffSec / 3600);
    const minutes = Math.floor((diffSec % 3600) / 60);

    if (hours > 0) {
      return `${hours} hr${hours > 1 ? 's' : ''} ${minutes} min`;
    }
    return `${minutes} min`;
  };
  const getCalculationParams = () => {
    const params = CalculationMethod.MuslimWorldLeague();
    params.highLatitudeRule = HighLatitudeRule.TwilightAngle; // ✅
    params.madhab = Madhab.Shafi; // ✅
    params.adjustments = {fajr: 8, isha: -40};
    return params;
  };

  const calculatePrayerTimes = async () => {
    try {
      setLoading(true);
      setError(null);

      const {latitude, longitude} = await getLocationCoordinates();
      const tz = await getTimeZone(latitude, longitude);
      setTimeZone(tz);

      const now = getSafeLocalDate();
      const zonedDate = toZonedTime(now, tz);

      const coordinates = new Coordinates(latitude, longitude);
      const params = await getCalculationParams();
      console.log('params.madhab', params.madhab);

      // 🔁 No method switching now
      const prayerTimes = new PrayerTimes(coordinates, zonedDate, params);

      const formatPrayerTime = date => {
        const zoned = toZonedTime(date, tz);
        return format(zoned, 'h:mm a', {timeZone: tz});
      };

      console.log('Fajr Angle:', params.fajrAngle);
      console.log('Isha Angle:', params.ishaAngle);
      console.log('High Latitude Rule:', params.highLatitudeRule);

      const prayers = [
        {
          name: 'Fajr',
          arabicName: PRAYER_ARABIC_NAMES.fajr,
          time: formatPrayerTime(prayerTimes.fajr),
          exactTime: prayerTimes.fajr,
          isCurrentPrayer: false,
        },
        {
          name: 'Sunrise',
          arabicName: PRAYER_ARABIC_NAMES.sunrise,
          time: formatPrayerTime(prayerTimes.sunrise),
          exactTime: prayerTimes.sunrise,
          isCurrentPrayer: false,
        },
        {
          name: 'Dhuhr',
          arabicName: PRAYER_ARABIC_NAMES.dhuhr,
          time: formatPrayerTime(prayerTimes.dhuhr),
          exactTime: prayerTimes.dhuhr,
          isCurrentPrayer: false,
        },
        {
          name: 'Asr',
          arabicName: PRAYER_ARABIC_NAMES.asr,
          time: formatPrayerTime(prayerTimes.asr),
          exactTime: prayerTimes.asr,
          isCurrentPrayer: false,
        },
        {
          name: 'Maghrib',
          arabicName: PRAYER_ARABIC_NAMES.maghrib,
          time: formatPrayerTime(prayerTimes.maghrib),
          exactTime: prayerTimes.maghrib,
          isCurrentPrayer: false,
        },
        {
          name: 'Isha',
          arabicName: PRAYER_ARABIC_NAMES.isha,
          time: formatPrayerTime(prayerTimes.isha),
          exactTime: prayerTimes.isha,
          isCurrentPrayer: false,
        },
      ];

      const nextPrayerName = prayerTimes.nextPrayer();
      let nextPrayer = null;

      prayers.forEach(prayer => {
        if (prayer.name.toLowerCase() === nextPrayerName) {
          prayer.isCurrentPrayer = true;
          prayer.remainingTime = formatRemainingTime(prayer.exactTime);
          nextPrayer = {...prayer};
        }

        if (prayer.exactTime > new Date()) {
          schedulePrayerNotification(prayer.name, prayer.exactTime);
        }
      });

      setAllPrayers(prayers);
      setCurrentPrayer(nextPrayer);
      setLoading(false);

      if (nextPrayer) {
        await AsyncStorage.setItem('nextPrayer', JSON.stringify(nextPrayer));
      }
    } catch (err) {
      console.error(err);
      setError('Prayer time calculation failed. Please try again.');
      setLoading(false);
    }
  };
  // const getCalculationParams = (city = '', country = '') => {
  //   const isIreland =
  //     city.toLowerCase().includes('dublin') ||
  //     country.toLowerCase().includes('ireland');

  //   if (isIreland) {
  //     // ✅ ICCI method for Ireland
  //     // const params = CalculationMethod.Other();
  //     // params.fajrAngle = 12;
  //     // params.ishaAngle = 12;
  //     // params.highLatitudeRule = HighLatitudeRule.TwilightAngle;

  //     // params.madhab = Madhab.Shafi; // Ya Hanafi agar aap prefer karte hain
  //     // params.adjustments = {fajr: -2, isha: 5}; // Optional minor tweaks
  //     const params = CalculationMethod.Other();
  //     params.fajrAngle = 15;
  //     params.ishaAngle = 15;
  //     params.highLatitudeRule = HighLatitudeRule.AngleBased; // Or 'Midnight' to match tighter Isha times
  //     params.madhab = Madhab.Shafi;
  //     params.adjustments = {fajr: 0, isha: 0};
  //     return params;
  //   } else {
  //     // 🌍 MWL for the rest of the world
  //     const params = CalculationMethod.Other();
  //     params.fajrAngle = 15;
  //     params.ishaAngle = 15;
  //     params.highLatitudeRule = HighLatitudeRule.AngleBased; // Or 'Midnight' to match tighter Isha times
  //     params.madhab = Madhab.Shafi;
  //     params.adjustments = {fajr: 0, isha: 0};
  //     return params;
  //   }
  // };

  // const calculatePrayerTimes = async () => {
  //   try {
  //     setLoading(true);
  //     setError(null);

  //     const {latitude, longitude} = await getLocationCoordinates();
  //     const tz = await getTimeZone(latitude, longitude);
  //     setTimeZone(tz);

  //     const now = getSafeLocalDate();
  //     const zonedDate = toZonedTime(now, tz);

  //     const coordinates = new Coordinates(latitude, longitude);
  //     const params = getCalculationParams(); // 🔁 No method switching now
  //     const prayerTimes = new PrayerTimes(coordinates, zonedDate, params);

  //     const formatPrayerTime = date => {
  //       const zoned = toZonedTime(date, tz);
  //       return format(zoned, 'h:mm a', {timeZone: tz});
  //     };

  //     console.log('Fajr Angle:', params.fajrAngle);
  //     console.log('Isha Angle:', params.ishaAngle);
  //     console.log('High Latitude Rule:', params.highLatitudeRule);

  //     const prayers = [
  //       {
  //         name: 'Fajr',
  //         arabicName: PRAYER_ARABIC_NAMES.fajr,
  //         time: formatPrayerTime(prayerTimes.fajr),
  //         exactTime: prayerTimes.fajr,
  //         isCurrentPrayer: false,
  //       },
  //       {
  //         name: 'Sunrise',
  //         arabicName: PRAYER_ARABIC_NAMES.sunrise,
  //         time: formatPrayerTime(prayerTimes.sunrise),
  //         exactTime: prayerTimes.sunrise,
  //         isCurrentPrayer: false,
  //       },
  //       {
  //         name: 'Dhuhr',
  //         arabicName: PRAYER_ARABIC_NAMES.dhuhr,
  //         time: formatPrayerTime(prayerTimes.dhuhr),
  //         exactTime: prayerTimes.dhuhr,
  //         isCurrentPrayer: false,
  //       },
  //       {
  //         name: 'Asr',
  //         arabicName: PRAYER_ARABIC_NAMES.asr,
  //         time: formatPrayerTime(prayerTimes.asr),
  //         exactTime: prayerTimes.asr,
  //         isCurrentPrayer: false,
  //       },
  //       {
  //         name: 'Maghrib',
  //         arabicName: PRAYER_ARABIC_NAMES.maghrib,
  //         time: formatPrayerTime(prayerTimes.maghrib),
  //         exactTime: prayerTimes.maghrib,
  //         isCurrentPrayer: false,
  //       },
  //       {
  //         name: 'Isha',
  //         arabicName: PRAYER_ARABIC_NAMES.isha,
  //         time: formatPrayerTime(prayerTimes.isha),
  //         exactTime: prayerTimes.isha,
  //         isCurrentPrayer: false,
  //       },
  //     ];

  //     const nextPrayerName = prayerTimes.nextPrayer();
  //     let nextPrayer = null;

  //     prayers.forEach(prayer => {
  //       if (prayer.name.toLowerCase() === nextPrayerName) {
  //         prayer.isCurrentPrayer = true;
  //         prayer.remainingTime = formatRemainingTime(prayer.exactTime);
  //         nextPrayer = {...prayer};
  //       }

  //       if (prayer.exactTime > new Date()) {
  //         schedulePrayerNotification(prayer.name, prayer.exactTime);
  //       }
  //     });

  //     setAllPrayers(prayers);
  //     setCurrentPrayer(nextPrayer);
  //     setLoading(false);

  //     if (nextPrayer) {
  //       await AsyncStorage.setItem('nextPrayer', JSON.stringify(nextPrayer));
  //     }
  //   } catch (err) {
  //     console.error(err);
  //     setError('Prayer time calculation failed. Please try again.');
  //     setLoading(false);
  //   }
  // };

  useEffect(() => {
    calculatePrayerTimes();
    calculationInterval.current = setInterval(() => {
      calculatePrayerTimes();
    }, 60000);

    return () => {
      if (calculationInterval.current) {
        clearInterval(calculationInterval.current);
      }
    };
  }, [city, country]);

  useEffect(() => {
    const storeData = async () => {
      try {
        await AsyncStorage.setItem('allPrayers', JSON.stringify(allPrayers));
        await AsyncStorage.setItem(
          'selectedDate',
          JSON.stringify(selectedDate),
        );
        await AsyncStorage.setItem(
          'prayerCompletionState',
          JSON.stringify(prayerCompletionState),
        );
        // onTogglePrayed function nahi store karenge
        await AsyncStorage.setItem('localTime', JSON.stringify(localTime));
      } catch (e) {
        console.error('Failed to save data to AsyncStorage', e);
      }
    };

    storeData();
  }, [allPrayers, selectedDate, prayerCompletionState, localTime]);

  useEffect(() => {
    const savePrayers = async () => {
      try {
        const jsonValue = JSON.stringify(allPrayers);
        await AsyncStorage.setItem('@all_prayers', jsonValue);
        console.log('Prayers saved to AsyncStorage');
      } catch (e) {
        console.error('Error saving prayers:', e);
      }
    };

    if (allPrayers.length > 0) {
      savePrayers();
    }
  }, [allPrayers]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#f59e0b" />
        <Text style={styles.loadingText}>Calculating prayer times...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!currentPrayer) return null;

  const currentPrayerIndex = allPrayers.findIndex(
    p => p.name.toLowerCase() === currentPrayer.name.toLowerCase(),
  );
  let upcomingPrayer = null;

  for (let i = currentPrayerIndex + 1; i < allPrayers.length; i++) {
    if (allPrayers[i]) {
      upcomingPrayer = allPrayers[i];
      break;
    }
  }

  if (!upcomingPrayer && currentPrayerIndex === allPrayers.length - 1) {
    upcomingPrayer = allPrayers[0];
  }

  if (upcomingPrayer) {
    AsyncStorage.setItem(
      'upcomingPrayer',
      JSON.stringify(upcomingPrayer),
    ).catch(error => console.error('Failed to store upcomingPrayer', error));
  }

  return (
    <View style={styles.compactContainer}>
      <View style={styles.compactGrid}>
        {/* Current Prayer Card */}
        <View style={styles.compactCard}>
          <Text style={styles.compactLabel}>Next</Text>
          <View style={styles.compactContent}>
            <View style={styles.compactHeader}>
              <Text style={styles.compactPrayerName}>{currentPrayer.name}</Text>
              {currentPrayer.name.toLowerCase() === 'maghrib' && (
                <Text style={styles.compactIcon}>🌙</Text>
              )}
              {currentPrayer.name.toLowerCase() === 'isha' && (
                <Text style={styles.compactIcon}>🌟</Text>
              )}
            </View>
            <Text style={styles.compactArabicName}>
              {currentPrayer.arabicName}
            </Text>
            <View style={styles.compactFooter}>
              <Text style={styles.compactTime}>{currentPrayer.time}</Text>
              <TouchableOpacity
                style={styles.compactLink}
                onPress={() => {
                  navigation.navigate('PrayerTimesScreen', {
                    prayers: allPrayers,
                    selectedDate: selectedDate,
                    prayerCompletionState: prayerCompletionState,
                    onTogglePrayed: onTogglePrayed,
                  });
                }}>
                <Text style={styles.compactLinkText}>View times</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Upcoming Prayer Card */}
        <View style={styles.compactCard}>
          <Text style={styles.compactLabel}>Upcoming</Text>
          <View style={styles.compactContent}>
            {upcomingPrayer && (
              <>
                <View style={styles.compactHeader}>
                  <Text style={styles.compactPrayerName}>
                    {upcomingPrayer.name}
                  </Text>
                  {upcomingPrayer.name.toLowerCase() === 'isha' && (
                    <Text style={styles.compactIcon}>🌟</Text>
                  )}
                </View>
                <Text style={styles.compactArabicName}>
                  {upcomingPrayer.arabicName}
                </Text>
                <View style={styles.compactFooter}>
                  <Text style={styles.compactTime}>{upcomingPrayer.time}</Text>
                  <TouchableOpacity
                    style={styles.compactLink}
                    onPress={() => {
                      navigation.navigate('PrayerTimesScreen', {
                        prayers: allPrayers,
                        selectedDate: selectedDate,
                        prayerCompletionState: prayerCompletionState,
                        onTogglePrayed: onTogglePrayed,
                        localTime: localTime,
                      });
                    }}>
                    <Text style={styles.compactLinkText}>View times</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  loadingText: {
    color: 'white',
    marginLeft: 8,
  },
  errorContainer: {
    padding: 16,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  errorText: {
    color: '#f87171',
  },
  compactContainer: {
    // flexDirection: 'column-reverse',
    gap: 12,
  },
  compactGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  compactCard: {
    flex: 1,
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 12,
    padding: 16,
  },
  compactLabel: {
    fontSize: 14,
    color: '#9ca3af',
    marginBottom: 4,
  },
  compactContent: {
    flexDirection: 'column',
  },
  compactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  compactPrayerName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  compactArabicName: {
    fontSize: 16,
    color: '#a1a1aa',
    marginVertical: 4,
  },
  compactFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 6,
  },
  compactTime: {
    fontSize: 18,
    color: 'white',
  },
  compactLink: {
    // backgroundColor: '#f59e0b',
    // paddingHorizontal: 8,
    // paddingVertical: 4,
    // borderRadius: 8,
  },
  compactLinkText: {
    color: '#f59e0b',
    fontWeight: 'bold',
    fontSize: 12,
  },
  compactIcon: {
    marginLeft: 4,
    fontSize: 22,
  },
});

export default PrayerTime;
