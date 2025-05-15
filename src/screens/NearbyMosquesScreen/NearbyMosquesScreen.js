// import React, {useEffect, useState} from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   ActivityIndicator,
//   StyleSheet,
//   TouchableOpacity,
//   PermissionsAndroid,
//   Platform,
//   Alert,
// } from 'react-native';
// import Geolocation from '@react-native-community/geolocation';

// const NearbyMosquesScreen = () => {
//   const [location, setLocation] = useState(null);
//   const [mosques, setMosques] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // Android permissions request
// //   const requestLocationPermission = async () => {
// //     if (Platform.OS === 'android') {
// //       try {
// //         const granted = await PermissionsAndroid.request(
// //           PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
// //           {
// //             title: 'Location Permission',
// //             message:
// //               'This app needs access to your location to find nearby mosques.',
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
// //       return true;
// //     }
// //   };

// //   useEffect(() => {
// //     const getLocationAndFetch = async () => {
// //       const hasPermission = await requestLocationPermission();
// //       if (!hasPermission) {
// //         Alert.alert('Permission denied', 'Cannot access location');
// //         return;
// //       }

// //       setLoading(true);
// //       Geolocation.getCurrentPosition(
// //         position => {
// //           const {latitude, longitude} = position.coords;
// //           setLocation({latitude, longitude});
// //           fetchNearbyMosques(latitude, longitude);
// //         },
// //         error => {
// //           Alert.alert('Error', error.message);
// //           setLoading(false);
// //         },
// //         {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
// //       );
// //     };

// //     getLocationAndFetch();
// //   }, []);

// // //   Placeholder: Replace this function to call your actual API
// //     const fetchNearbyMosques = async (lat, lng) => {
// //       console.log(lat, lng, 'lat lng');
// //       try {
// //         // Example API call (Google Places)
// //         const apiKey = 'AIzaSyB7bAb4OYY5NdyMoOdYO3sUB0p83kCUYLo';
// //         const radius = 5000;
// //         const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=mosque&key=${apiKey}`;

// //         const response = await fetch(url);
// //         const json = await response.json();
// //         console.log('Full API Response:', json);
// //         setMosques(json.results);
// //       } catch (error) {
// //         Alert.alert('Error fetching mosques', error.message);
// //       } finally {
// //         setLoading(false);
// //       }
//     // };
//   const fetchMosquesFromOSM = async () => {
//     const url = `https://overpass-api.de/api/interpreter?data=[out:json];node["amenity"="place_of_worship"]["religion"="muslim"](24.8607,67.0011,24.9107,67.0511);out;`;

//     try {
//       const response = await fetch(url);
//       const json = await response.json();
//       console.log(json.elements); // Array of mosque nodes
//       setMosques(json.elements);
//     } catch (err) {
//       Alert.alert('Overpass API error', err.message);
//     }
//   };
//   useEffect(() => {
//     fetchMosquesFromOSM()
//   }, [])

//   const renderMosque = ({item}) => (
//     <View style={styles.mosqueCard}>
//       <Text style={styles.mosqueName}>{item.name}</Text>
//       <Text style={styles.mosqueAddress}>{item.address}</Text>
//       <TouchableOpacity style={styles.directionsBtn}>
//         <Text style={{color: '#fff'}}>Get Directions</Text>
//       </TouchableOpacity>
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Nearby Mosques</Text>

//       {loading && <ActivityIndicator size="large" color="#4B7BEC" />}

//       {!loading && mosques.length === 0 && (
//         <Text style={styles.noDataText}>No mosques found nearby.</Text>
//       )}

//       <FlatList
//         data={mosques}
//         keyExtractor={item => item.id}
//         renderItem={renderMosque}
//         contentContainerStyle={{paddingBottom: 20}}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#f7f9fc',
//   },
//   title: {
//     fontSize: 26,
//     fontWeight: 'bold',
//     marginBottom: 15,
//     color: '#333',
//   },
//   mosqueCard: {
//     backgroundColor: '#fff',
//     padding: 15,
//     marginBottom: 12,
//     borderRadius: 8,
//     elevation: 2, // Android shadow
//     shadowColor: '#000', // iOS shadow
//     shadowOffset: {width: 0, height: 2},
//     shadowOpacity: 0.15,
//     shadowRadius: 3,
//   },
//   mosqueName: {
//     fontSize: 20,
//     fontWeight: '600',
//     marginBottom: 6,
//     color: '#2d4059',
//   },
//   mosqueAddress: {
//     fontSize: 14,
//     color: '#666',
//     marginBottom: 12,
//   },
//   directionsBtn: {
//     backgroundColor: '#4B7BEC',
//     paddingVertical: 8,
//     paddingHorizontal: 14,
//     borderRadius: 5,
//     alignSelf: 'flex-start',
//   },
//   noDataText: {
//     fontSize: 16,
//     color: '#999',
//     marginTop: 20,
//     textAlign: 'center',
//   },
// });

// export default NearbyMosquesScreen;

// import React, {useEffect, useState} from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   ActivityIndicator,
//   StyleSheet,
//   TouchableOpacity,
//   Alert,
// } from 'react-native';

// const NearbyMosquesScreen = () => {
//   const [location, setLocation] = useState(null);
//   const [mosques, setMosques] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const fetchMosquesFromOSM = async () => {
//     const url = `https://overpass-api.de/api/interpreter?data=[out:json];node["amenity"="place_of_worship"]["religion"="muslim"](24.8607,67.0011,24.9107,67.0511);out;`;

//     try {
//       const response = await fetch(url);
//       const json = await response.json();
//       console.log(json.elements); // Array of mosque nodes
//       setMosques(json.elements);
//     } catch (err) {
//       Alert.alert('Overpass API error', err.message);
//     }
//   };
//   useEffect(() => {
//     fetchMosquesFromOSM()
//   }, [])

//   const renderMosque = ({item}) => (
//     <View style={styles.mosqueCard}>
//       <Text style={styles.mosqueName}>{item.name}</Text>
//       <Text style={styles.mosqueAddress}>{item.address}</Text>
//       <TouchableOpacity style={styles.directionsBtn}>
//         <Text style={{color: '#fff'}}>Get Directions</Text>
//       </TouchableOpacity>
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Nearby Mosques</Text>

//       {loading && <ActivityIndicator size="large" color="#4B7BEC" />}

//       {!loading && mosques.length === 0 && (
//         <Text style={styles.noDataText}>No mosques found nearby.</Text>
//       )}

//       <FlatList
//         data={mosques}
//         keyExtractor={item => item.id}
//         renderItem={renderMosque}
//         contentContainerStyle={{paddingBottom: 20}}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#f7f9fc',
//   },
//   title: {
//     fontSize: 26,
//     fontWeight: 'bold',
//     marginBottom: 15,
//     color: '#333',
//   },
//   mosqueCard: {
//     backgroundColor: '#fff',
//     padding: 15,
//     marginBottom: 12,
//     borderRadius: 8,
//     elevation: 2, // Android shadow
//     shadowColor: '#000', // iOS shadow
//     shadowOffset: {width: 0, height: 2},
//     shadowOpacity: 0.15,
//     shadowRadius: 3,
//   },
//   mosqueName: {
//     fontSize: 20,
//     fontWeight: '600',
//     marginBottom: 6,
//     color: '#2d4059',
//   },
//   mosqueAddress: {
//     fontSize: 14,
//     color: '#666',
//     marginBottom: 12,
//   },
//   directionsBtn: {
//     backgroundColor: '#4B7BEC',
//     paddingVertical: 8,
//     paddingHorizontal: 14,
//     borderRadius: 5,
//     alignSelf: 'flex-start',
//   },
//   noDataText: {
//     fontSize: 16,
//     color: '#999',
//     marginTop: 20,
//     textAlign: 'center',
//   },
// });

// export default NearbyMosquesScreen;

import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import RootNavigator from '../../components/dashboard/BottomNavigation';
import {useNavigation} from '@react-navigation/native';

const NearbyMosquesScreen = () => {
  const navigation = useNavigation();
  const [mosques, setMosques] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMosquesFromOSM = async () => {
    setLoading(true);
    const url =
      'https://overpass-api.de/api/interpreter?data=[out:json];node["amenity"="place_of_worship"]["religion"="muslim"](24.8607,67.0011,24.9107,67.0511);out;';

    try {
      const response = await fetch(url);
      const json = await response.json();
      setMosques(json.elements);
    } catch (err) {
      Alert.alert('Overpass API error', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMosquesFromOSM();
  }, []);

  const openInMaps = (lat, lon, name) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lon}(${encodeURIComponent(
      name || 'Mosque',
    )})`;
    Linking.openURL(url);
  };

  const renderMosque = ({item}) => {
    const name = item.tags?.name || 'Unnamed Mosque';
    const address =
      item.tags?.['addr:street'] ||
      item.tags?.['addr:full'] ||
      'No address available';

    return (
      <View style={styles.mosqueCard}>
        <Text style={styles.mosqueName}>{name}</Text>
        <Text style={styles.mosqueAddress}>{address}</Text>
        <TouchableOpacity
          style={styles.directionsBtn}
          onPress={() => openInMaps(item.lat, item.lon, name)}>
          <Text style={{color: '#fff'}}>Get Directions</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={{flex: 1, backgroundColor: '#1e293b'}}>
      <View style={styles.container}>
        {/* <Text style={styles.title}>Nearby Mosques</Text> */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text>❌</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Nearby Mosques</Text>
        </View>

        {loading && <ActivityIndicator size="large" color="#4B7BEC" />}

        {!loading && mosques.length === 0 && (
          <Text style={styles.noDataText}>No mosques found nearby.</Text>
        )}

        <FlatList
          data={mosques}
          keyExtractor={item => item.id.toString()}
          renderItem={renderMosque}
          contentContainerStyle={{paddingBottom: 20}}
        />
      </View>
      <RootNavigator />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#1e293b',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#1e293b',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#fff',
  },
  mosqueCard: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 12,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  mosqueName: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 6,
    color: '#2d4059',
  },
  mosqueAddress: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  directionsBtn: {
    backgroundColor: '#4B7BEC',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 5,
    alignSelf: 'flex-start',
  },
  noDataText: {
    fontSize: 16,
    color: '#999',
    marginTop: 20,
    textAlign: 'center',
  },
});

export default NearbyMosquesScreen;
