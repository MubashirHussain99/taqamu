// // import React, {use, useEffect, useRef, useState} from 'react';
// // import {
// //   View,
// //   TextInput,
// //   Button,
// //   StyleSheet,
// //   Alert,
// //   Platform,
// //   Text,
// //   ScrollView,
// //   TouchableOpacity,
// //   PermissionsAndroid,
// // } from 'react-native';
// // import AsyncStorage from '@react-native-async-storage/async-storage';
// // import {useNavigation} from '@react-navigation/native';
// // import LocationSearch from '../../components/layout/LocationSearch';
// // import Geolocation from '@react-native-community/geolocation';
// // import axios from 'axios';

// // const EditProfileScreen = ({route}) => {
// //   const navigation = useNavigation();
// //   const {profile, setProfileTrigger} = route.params;

// //   const [name, setName] = useState(profile?.name || '');
// //   const [email, setEmail] = useState(profile?.email || '');
// //   const [city, setCity] = useState(profile?.city || '');
// //   const [country, setCountry] = useState(profile?.country || '');
// //   const [password, setPassword] = useState('');
// //   const [address, setAddress] = useState(null);

// //   const watchID = useRef(null);

// //   const getAddressFromCoords = async (latitude, longitude) => {
// //     try {
// //       const response = await fetch(
// //         `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=en`,
// //       );
// //       const data = await response.json();

// //       if (data && data.address) {
// //         return data.address;
// //       } else {
// //         return null;
// //       }
// //     } catch (error) {
// //       console.error('Error fetching address:', error);
// //       return null;
// //     }
// //   };

// //   const requestLocation = async () => {
// //     if (Platform.OS === 'ios') {
// //       getLocation();
// //     } else {
// //       try {
// //         const granted = await PermissionsAndroid.request(
// //           PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
// //           {
// //             title: 'Location Access Required',
// //             message: 'This App needs to Access your location',
// //           },
// //         );
// //         if (granted === PermissionsAndroid.RESULTS.GRANTED) {
// //           getLocation();
// //         } else {
// //           setLocationStatus('Permission Denied');
// //         }
// //       } catch (err) {
// //         console.warn(err);
// //       }
// //     }
// //   };
// //   const formatLocationName = addr => {
// //     if (!addr) return '';
// //     const localParts = [];
// //     if (addr.town) localParts.push(addr.town);
// //     else if (addr.village) localParts.push(addr.village);
// //     else if (addr.neighbourhood) localParts.push(addr.neighbourhood);
// //     else if (addr.road) localParts.push(addr.road);
// //     else if (addr.suburb) localParts.push(addr.suburb);

// //     const areaParts = [];
// //     if (addr.city) areaParts.push(addr.city);
// //     else if (addr.county) areaParts.push(addr.county);
// //     else if (addr.state_district) areaParts.push(addr.state_district);
// //     else if (addr.state) areaParts.push(addr.state);
// //     else if (addr.region) areaParts.push(addr.region);

// //     const countryPart = addr.country ? [addr.country] : [];

// //     const combined = [...localParts, ...areaParts, ...countryPart];

// //     const uniqueParts = [...new Set(combined)].filter(Boolean);

// //     return uniqueParts.join(', ');
// //   };

// //   const getLocation = () => {
// //     setLocationStatus('Getting Location ...');
// //     Geolocation.getCurrentPosition(
// //       async position => {
// //         setLocationStatus('You are Here');
// //         const longitude = position.coords.longitude;
// //         const latitude = position.coords.latitude;
// //         setCurrentLongitude(longitude.toString());
// //         setCurrentLatitude(latitude.toString());

// //         const addr = await getAddressFromCoords(latitude, longitude);
// //         setAddress(addr);
// //         if (addr) {
// //           const formattedLocation = formatLocationName(addr);
// //           console.log(formattedLocation);
// //           setCity(formattedLocation);
// //         }
// //       },
// //       error => {
// //         setLocationStatus(error.message);
// //       },
// //       {enableHighAccuracy: false, timeout: 30000, maximumAge: 1000},
// //     );
// //   };

// //   const requestLocationPermission = async () => {
// //     if (Platform.OS === 'android') {
// //       try {
// //         const granted = await PermissionsAndroid.request(
// //           PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
// //           {
// //             title: 'Location Permission',
// //             message: 'This app needs access to your location.',
// //             buttonNeutral: 'Ask Me Later',
// //             buttonNegative: 'Cancel',
// //             buttonPositive: 'OK',
// //           },
// //         );
// //         return granted === PermissionsAndroid.RESULTS.GRANTED;
// //       } catch (err) {
// //         console.warn(err);
// //         return false;
// //       }
// //     } else {
// //       return true; // iOS handled separately
// //     }
// //   };

// //   useEffect(() => {
// //     requestLocationPermission();
// //   }, []);

// //   const API_URL = Platform.select({
// //     android: 'https://taqamu-app-backend.vercel.app/api',
// //     ios: 'https://taqamu-app-backend.vercel.app/api',
// //     default: 'https://taqamu-app-backend.vercel.app/api',
// //   });

// //   const handleUpdate = async () => {
// //     try {
// //       const token = await AsyncStorage.getItem('token');

// //       if (!token) {
// //         Alert.alert('Error', 'Token not found');
// //         return;
// //       }

// //       const updateData = {
// //         name,
// //         email,
// //         city,
// //         country,
// //         ...(password ? {password} : {}), // include password only if not empty
// //       };

// //       console.log('Sending update data:', updateData);

// //       const response = await fetch(
// //         `${API_URL}/auth/update-user/${profile?.id}`,
// //         {
// //           method: 'PUT',
// //           headers: {
// //             'Content-Type': 'application/json',
// //             Authorization: `Bearer ${token}`,
// //           },
// //           body: JSON.stringify(updateData),
// //         },
// //       );

// //       const responseText = await response.text();
// //       console.log('Response:', responseText);

// //       if (!response.ok) {
// //         throw new Error(responseText || 'Update failed');
// //       }

// //       // Trigger a re-fetch of the profile data
// //       setProfileTrigger(true);

// //       Alert.alert('Success', 'Profile updated successfully', [
// //         {text: 'OK', onPress: () => navigation.navigate('Dashboard')},
// //       ]);
// //     } catch (err) {
// //       console.error('Update error:', err.message);
// //       Alert.alert('Error', err.message);
// //     }
// //   };

// //   return (
// //     <ScrollView
// //       contentContainerStyle={styles.container}
// //       keyboardShouldPersistTaps="handled"
// //       nestedScrollEnabled={true}>
// //       <View style={styles.header}>
// //         <TouchableOpacity
// //           onPress={() => {
// //             navigation.navigate('Dashboard');
// //           }}>
// //           <Text>❌</Text>
// //         </TouchableOpacity>
// //         <Text style={styles.heading}>Update Location</Text>
// //       </View>
// //       <Text style={styles.label}>Location</Text>
//       // <LocationSearch
//       //   city={city}
//       //   country={country}
//       //   onSelect={({full, city, country}) => {
//       //     setCity(full); // full is like "Rathmines, Dublin"
//       //     setCountry(country);
//       //   }}
//       // />
// //       <TouchableOpacity
// //         onPress={requestLocation}
// //         style={{
// //           marginVertical: 10,
// //           backgroundColor: '#555',
// //           padding: 10,
// //           borderRadius: 5,
// //         }}>
// //         <Text style={{color: '#fff', textAlign: 'center'}}>📍 My Location</Text>
// //       </TouchableOpacity>

// //       <View style={{marginTop: 8}}>
// //         <Button title="Update Location" onPress={handleUpdate} color="green" />
// //       </View>
// //     </ScrollView>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: {
// //     padding: 20,
// //     backgroundColor: '#1E1E1E',
// //     height: '100%',
// //     width: '100%',
// //   },
// //   header: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     marginBottom: 20,
// //   },
// //   heading: {
// //     flex: 1,
// //     fontSize: 24,
// //     fontWeight: 'bold',
// //     color: '#fff',
// //     textAlign: 'center',
// //   },
// //   label: {
// //     marginBottom: 5,
// //     fontWeight: 'bold',
// //     color: '#fff',
// //   },
// //   input: {
// //     borderWidth: 1,
// //     borderColor: '#ccc',
// //     marginBottom: 15,
// //     padding: 10,
// //     borderRadius: 5,
// //     color: '#fff',
// //     backgroundColor: '#333',
// //   },
// // });

// // export default EditProfileScreen;

// import React, {useEffect, useRef, useState} from 'react';
// import {
//   View,
//   Text,
//   Button,
//   StyleSheet,
//   Alert,
//   Platform,
//   ScrollView,
//   TouchableOpacity,
//   PermissionsAndroid,
// } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import {useNavigation} from '@react-navigation/native';
// import LocationSearch from '../../components/layout/LocationSearch'; // aapka custom component
// import Geolocation from '@react-native-community/geolocation';

// const RECENT_LOCATIONS_KEY = 'RECENT_LOCATIONS';
// const ITEMS_PER_PAGE = 5;

// const EditProfileScreen = ({route}) => {
//   const navigation = useNavigation();
//   const {profile, setProfileTrigger} = route.params;

//   const [name, setName] = useState(profile?.name || '');
//   const [email, setEmail] = useState(profile?.email || '');
//   const [city, setCity] = useState(profile?.city || '');
//   const [country, setCountry] = useState(profile?.country || '');
//   const [password, setPassword] = useState('');
//   const [locationStatus, setLocationStatus] = useState('');
//   const [address, setAddress] = useState(null);
//   const [recentLocations, setRecentLocations] = useState([]);
//   const [page, setPage] = useState(1);

//   const watchID = useRef(null);

//   // Fetch address from coords (OpenStreetMap Nominatim)
//   const getAddressFromCoords = async (latitude, longitude) => {
//     try {
//       const response = await fetch(
//         `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=en`,
//       );
//       const data = await response.json();

//       if (data && data.address) {
//         return data.address;
//       } else {
//         return null;
//       }
//     } catch (error) {
//       console.error('Error fetching address:', error);
//       return null;
//     }
//   };

//   // Format address object into readable string (city, area, country)
//   const formatLocationName = addr => {
//     if (!addr) return '';
//     const localParts = [];
//     if (addr.town) localParts.push(addr.town);
//     else if (addr.village) localParts.push(addr.village);
//     else if (addr.neighbourhood) localParts.push(addr.neighbourhood);
//     else if (addr.road) localParts.push(addr.road);
//     else if (addr.suburb) localParts.push(addr.suburb);

//     const areaParts = [];
//     if (addr.city) areaParts.push(addr.city);
//     else if (addr.county) areaParts.push(addr.county);
//     else if (addr.state_district) areaParts.push(addr.state_district);
//     else if (addr.state) areaParts.push(addr.state);
//     else if (addr.region) areaParts.push(addr.region);

//     const countryPart = addr.country ? [addr.country] : [];

//     const combined = [...localParts, ...areaParts, ...countryPart];

//     // Remove duplicates and empty
//     const uniqueParts = [...new Set(combined)].filter(Boolean);

//     return uniqueParts.join(', ');
//   };

//   // Save location string to AsyncStorage recent list
//   const saveLocationToStorage = async location => {
//     try {
//       const storedLocations = await AsyncStorage.getItem(RECENT_LOCATIONS_KEY);
//       let locations = storedLocations ? JSON.parse(storedLocations) : [];

//       // Remove duplicate of the same location string if exists
//       locations = locations.filter(loc => loc !== location);
//       locations.unshift(location); // newest on top

//       // Keep max 50 locations only (optional)
//       if (locations.length > 50) locations = locations.slice(0, 50);

//       await AsyncStorage.setItem(
//         RECENT_LOCATIONS_KEY,
//         JSON.stringify(locations),
//       );
//     } catch (err) {
//       console.warn('Error saving location:', err);
//     }
//   };

//   // Load recent locations from AsyncStorage with pagination
//   const loadRecentLocations = async (pageNum = 1) => {
//     try {
//       const storedLocations = await AsyncStorage.getItem(RECENT_LOCATIONS_KEY);
//       let locations = storedLocations ? JSON.parse(storedLocations) : [];
//       // Slice according to page and items per page
//       const pagedLocations = locations.slice(0, pageNum * ITEMS_PER_PAGE);

//       setRecentLocations(pagedLocations);
//       setPage(pageNum);
//     } catch (err) {
//       console.warn('Error loading recent locations:', err);
//     }
//   };

//   // Request location permission & get location
//   const requestLocation = async () => {
//     if (Platform.OS === 'ios') {
//       getLocation();
//     } else {
//       try {
//         const granted = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//           {
//             title: 'Location Access Required',
//             message: 'This App needs to Access your location',
//           },
//         );
//         if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//           getLocation();
//         } else {
//           setLocationStatus('Permission Denied');
//         }
//       } catch (err) {
//         console.warn(err);
//       }
//     }
//   };

//   // Get current device location & update city, country, save recent locations
// const getLocation = () => {
//   setLocationStatus('Getting Location ...');
//   Geolocation.getCurrentPosition(
//     async position => {
//       setLocationStatus('You are Here');
//       const longitude = position.coords.longitude;
//       const latitude = position.coords.latitude;

//       const addr = await getAddressFromCoords(latitude, longitude);
//       setAddress(addr);

//       if (addr) {
//         const formattedLocation = formatLocationName(addr);
//         console.log('Formatted Location:', formattedLocation);
//         setCity(formattedLocation);
//         setCountry(addr.country || '');

//         // Save to AsyncStorage recent locations
//         await saveLocationToStorage(formattedLocation);

//         // Reload recent locations (first page)
//         loadRecentLocations(1);
//       }
//     },
//     error => {
//       setLocationStatus(error.message);
//     },
//     {enableHighAccuracy: false, timeout: 30000, maximumAge: 1000},
//   );
// };

//   const requestLocationPermission = async () => {
//     if (Platform.OS === 'android') {
//       try {
//         const granted = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//           {
//             title: 'Location Permission',
//             message: 'This app needs access to your location.',
//             buttonNeutral: 'Ask Me Later',
//             buttonNegative: 'Cancel',
//             buttonPositive: 'OK',
//           },
//         );
//         return granted === PermissionsAndroid.RESULTS.GRANTED;
//       } catch (err) {
//         console.warn(err);
//         return false;
//       }
//     } else {
//       return true; // iOS handled separately
//     }
//   };

//   useEffect(() => {
//     requestLocationPermission();
//     loadRecentLocations(1); // Load recent locations on mount
//   }, []);

//   const API_URL = Platform.select({
//     android: 'https://taqamu-app-backend.vercel.app/api',
//     ios: 'https://taqamu-app-backend.vercel.app/api',
//     default: 'https://taqamu-app-backend.vercel.app/api',
//   });

//   // On update button press, send updated data to backend and refresh profile
//   const handleUpdate = async () => {
//     try {
//       const token = await AsyncStorage.getItem('token');

//       if (!token) {
//         Alert.alert('Error', 'Token not found');
//         return;
//       }

//       const updateData = {
//         name,
//         email,
//         city,
//         country,
//         ...(password ? {password} : {}), // include password only if not empty
//       };

//       console.log('Sending update data:', updateData);

//       const response = await fetch(
//         `${API_URL}/auth/update-user/${profile?.id}`,
//         {
//           method: 'PUT',
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify(updateData),
//         },
//       );

//       const responseText = await response.text();
//       console.log('Response:', responseText);

//       if (!response.ok) {
//         throw new Error(responseText || 'Update failed');
//       }

//       // Save updated location also to recent locations
// if (city) {
//   await saveLocationToStorage(city);
//   loadRecentLocations(1);
// }

//       // Trigger a re-fetch of the profile data
//       setProfileTrigger(true);

//       Alert.alert('Success', 'Profile updated successfully', [
//         {text: 'OK', onPress: () => navigation.navigate('Dashboard')},
//       ]);
//     } catch (err) {
//       console.error('Update error:', err.message);
//       Alert.alert('Error', err.message);
//     }
//   };

//   return (
//     <ScrollView
//       contentContainerStyle={styles.container}
//       keyboardShouldPersistTaps="handled"
//       nestedScrollEnabled={true}>
//       <View style={styles.header}>
//         <TouchableOpacity
//           onPress={() => {
//             navigation.navigate('Dashboard');
//           }}>
//           <Text>❌</Text> {/* Looks fine */}
//         </TouchableOpacity>
//         <Text style={styles.heading}>Update Location</Text> {/* Fine */}
//       </View>

//       <Text style={styles.label}>Location</Text>
//       <Text
//         style={{
//           backgroundColor: '#333',
//           padding: 10,
//           borderRadius: 5,
//           color: '#fff',
//           marginBottom: 10,
//         }}>
//         {city || 'No location selected'}
//       </Text>

//       <TouchableOpacity
//         onPress={requestLocation}
//         style={{
//           marginVertical: 10,
//           backgroundColor: '#555',
//           padding: 10,
//           borderRadius: 5,
//         }}>
//         <Text style={{color: '#fff', textAlign: 'center'}}>
//           📍 Use My Location
//         </Text>
//       </TouchableOpacity>

//       <View style={{marginTop: 8, marginBottom: 20}}>
//         <Button title="Update Location" onPress={handleUpdate} color="green" />
//       </View>

//       {/* Recent Locations List */}
//       <View style={{marginTop: 20}}>
//         <Text style={{color: '#fff', fontWeight: 'bold', marginBottom: 8}}>
//           Recent Locations:
//         </Text>
//         {recentLocations.length === 0 && (
//           <Text style={{color: '#aaa'}}>No recent locations found.</Text>
//         )}
//         {recentLocations.map((loc, idx) => (
//           <Text key={idx} style={{color: '#ccc', paddingVertical: 3}}>
//             {loc}
//           </Text>
//         ))}
//         {/* More button for pagination */}
//         {recentLocations.length >= page * ITEMS_PER_PAGE && (
//           <TouchableOpacity
//             onPress={() => loadRecentLocations(page + 1)}
//             style={{
//               marginTop: 10,
//               padding: 10,
//               backgroundColor: '#444',
//               borderRadius: 5,
//               alignSelf: 'flex-start',
//             }}>
//             <Text style={{color: '#fff'}}>More</Text>
//           </TouchableOpacity>
//         )}
//       </View>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     padding: 20,
//     backgroundColor: '#1E1E1E',
//     height: '100%',
//     width: '100%',
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 20,
//     justifyContent: 'space-between',
//   },
//   heading: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#fff',
//     textAlign: 'center',
//     flex: 1,
//   },
//   label: {
//     marginBottom: 5,
//     fontWeight: 'bold',
//     color: '#fff',
//   },
// });

// export default EditProfileScreen;

import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  Alert,
  Platform,
  ScrollView,
  TouchableOpacity,
  PermissionsAndroid,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import Geolocation from '@react-native-community/geolocation';
import LocationSearch from '../../components/layout/LocationSearch'; // Tumhara custom component

const RECENT_LOCATIONS_KEY = 'RECENT_LOCATIONS';
const ITEMS_PER_PAGE = 5;

const EditProfileScreen = ({route}) => {
  const navigation = useNavigation();
  const {profile, setProfileTrigger} = route.params;

  // States
  const [name, setName] = useState(profile?.name || '');
  const [email, setEmail] = useState(profile?.email || '');
  const [city, setCity] = useState(profile?.city || '');
  const [country, setCountry] = useState(profile?.country || '');
  const [password, setPassword] = useState('');
  const [locationStatus, setLocationStatus] = useState('');
  const [recentLocations, setRecentLocations] = useState([]);
  const [page, setPage] = useState(1);
  const [loadingLocation, setLoadingLocation] = useState(false);

  // Utility: Save recent location in AsyncStorage
  const saveLocationToStorage = async location => {
    try {
      const storedLocations = await AsyncStorage.getItem(RECENT_LOCATIONS_KEY);
      let locations = storedLocations ? JSON.parse(storedLocations) : [];

      // Remove duplicates and add new on top
      locations = locations.filter(loc => loc !== location);
      locations.unshift(location);

      if (locations.length > 50) locations = locations.slice(0, 50);

      await AsyncStorage.setItem(
        RECENT_LOCATIONS_KEY,
        JSON.stringify(locations),
      );
    } catch (err) {
      console.warn('Error saving location:', err);
    }
  };

  // Load recent locations with pagination
  const loadRecentLocations = async (pageNum = 1) => {
    try {
      const storedLocations = await AsyncStorage.getItem(RECENT_LOCATIONS_KEY);
      let locations = storedLocations ? JSON.parse(storedLocations) : [];

      const pagedLocations = locations.slice(0, pageNum * ITEMS_PER_PAGE);
      setRecentLocations(pagedLocations);
      setPage(pageNum);
    } catch (err) {
      console.warn('Error loading recent locations:', err);
    }
  };

  // Request location permission & get device location
  const requestLocation = async () => {
    if (Platform.OS === 'ios') {
      getLocation();
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Access Required',
            message: 'This App needs to Access your location',
            buttonPositive: 'OK',
            buttonNegative: 'Cancel',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          getLocation();
        } else {
          Alert.alert('Permission Denied', 'Location permission is required.');
          setLocationStatus('Permission Denied');
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };

  // Reverse Geocode coords to address via Nominatim
  const getAddressFromCoords = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=en`,
        {
          headers: {
            'User-Agent': 'taqamu/1.0 mubashir@nexomos.com',
            'Accept-Language': 'en',
          },
        },
      );

      const data = await response.json();
      if (data && data.address) {
        console.log(data.address, 'data.address');
        return data.address;
      }
      return null;
    } catch (error) {
      console.error('Error fetching address:', error);
      return null;
    }
  };
  const formatLocationName = addr => {
    if (!addr) return '';
    const parts = [];

    if (addr.city) parts.push(addr.city);
    else if (addr.town) parts.push(addr.town);
    else if (addr.village) parts.push(addr.village);
    else if (addr.neighbourhood) parts.push(addr.neighbourhood);

    if (addr.state) parts.push(addr.state);

    if (addr.country) parts.push(addr.country);

    return parts.join(', ');
  };

  // const getLocation = () => {
  //   setLocationStatus('Getting Location ...');
  //   Geolocation.getCurrentPosition(
  //     async position => {
  //       setLocationStatus('You are Here');
  //       const longitude = position.coords.longitude;
  //       const latitude = position.coords.latitude;

  //       const addr = await getAddressFromCoords(latitude, longitude);
  //       console.log('Address returned from getAddressFromCoords:', addr);

  //       setAddress(addr);

  //       if (addr) {
  //         const formattedLocation = formatLocationName(addr);
  //         console.log('Formatted Location:', formattedLocation);
  //         setCity(formattedLocation);
  //         setCountry(addr.country || '');

  //         // Save to AsyncStorage recent locations
  //         await saveLocationToStorage(formattedLocation);

  //         // Reload recent locations (first page)
  //         loadRecentLocations(1);
  //       } else {
  //         console.log('No address found from coordinates');
  //       }
  //     },
  //     error => {
  //       setLocationStatus(error.message);
  //     },
  //     {enableHighAccuracy: false, timeout: 30000, maximumAge: 1000},
  //   );
  // };
  // Format address into readable string
  const getLocation = () => {
    setLoadingLocation(true);
    setLocationStatus('Getting Location ...');

    Geolocation.getCurrentPosition(
      async position => {
        setLocationStatus('You are Here');
        const longitude = position.coords.longitude;
        const latitude = position.coords.latitude;

        const addr = await getAddressFromCoords(latitude, longitude);
        console.log('Address returned from getAddressFromCoords:', addr);

        setLoadingLocation(false);

        if (addr) {
          const formattedLocation = formatLocationName(addr);
          setCity(formattedLocation); // <-- Set city input here
          setCountry(addr.country || '');
          await saveLocationToStorage(formattedLocation);
          loadRecentLocations(1);
        } else {
          console.log('No address found from coordinates');
        }
      },
      error => {
        setLocationStatus(error.message);
        setLoadingLocation(false);
        console.log('Location error:', error.message);
      },
      {enableHighAccuracy: false, timeout: 30000, maximumAge: 1000},
    );
  };

  // Load recent locations on mount
  useEffect(() => {
    loadRecentLocations(1);
  }, []);

  // API URL (backend)
  const API_URL = 'https://taqamu-app-backend.vercel.app/api';

  const handleUpdate = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      if (!token) {
        Alert.alert('Error', 'Token not found');
        return;
      }

      const updateData = {
        name,
        email,
        city,
        country,
        ...(password ? {password} : {}), // include password only if not empty
      };

      console.log('Sending update data:', updateData);

      const response = await fetch(
        `${API_URL}/auth/update-user/${profile?.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updateData),
        },
      );

      const responseText = await response.text();
      console.log('Response:', responseText);

      if (city) {
        await saveLocationToStorage(city);
        loadRecentLocations(1);
      }

      if (!response.ok) {
        throw new Error(responseText || 'Update failed');
      }

      // Trigger a re-fetch of the profile data
      setProfileTrigger(true);

      Alert.alert('Success', 'Profile updated successfully', [
        {text: 'OK', onPress: () => navigation.navigate('Dashboard')},
      ]);
    } catch (err) {
      console.error('Update error:', err.message);
      Alert.alert('Error', err.message);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
      nestedScrollEnabled={true}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Dashboard')}>
          <Text style={{fontSize: 20}}>❌</Text>
        </TouchableOpacity>
        <Text style={styles.heading}>Update Location</Text>
        <View style={{width: 20}} /> {/* for spacing */}
      </View>

      <Text style={styles.label}>Location</Text>

      {/* LocationSearch component for city input and autocomplete */}
      <LocationSearch
        city={city}
        country={country}
        onSelect={({full, city: selCity, country: selCountry}) => {
          setCity(full);
          setCountry(selCountry);
        }}
      />

      <View style={{marginTop: 10}}>
        {loadingLocation ? (
          <ActivityIndicator size="small" color="#00ff00" />
        ) : (
          <TouchableOpacity
            onPress={requestLocation}
            style={styles.locationButton}>
            <Text style={{color: '#fff', textAlign: 'center'}}>
              📍 Use My Location
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={{marginTop: 15}}>
        <Button title="Update Location" onPress={handleUpdate} color="green" />
      </View>

      {/* Recent Locations */}
      <View style={{marginTop: 30}}>
        <Text style={styles.recentTitle}>Recent Locations:</Text>
        {recentLocations.length === 0 && (
          <Text style={styles.noRecent}>No recent locations found.</Text>
        )}
        {recentLocations.map((loc, idx) => (
          <Text key={idx} style={styles.recentItem}>
            {loc}
          </Text>
        ))}

        {recentLocations.length >= page * ITEMS_PER_PAGE && (
          <TouchableOpacity
            onPress={() => loadRecentLocations(page + 1)}
            style={styles.moreButton}>
            <Text style={{color: '#fff'}}>More</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#1E1E1E',
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
    textAlign: 'center',
  },
  label: {
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  locationButton: {
    backgroundColor: '#555',
    padding: 12,
    borderRadius: 6,
  },
  recentTitle: {
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  noRecent: {
    color: '#aaa',
    fontStyle: 'italic',
  },
  recentItem: {
    color: '#ccc',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  moreButton: {
    marginTop: 10,
    backgroundColor: '#444',
    padding: 10,
    borderRadius: 5,
    alignSelf: 'flex-start',
  },
});

export default EditProfileScreen;
