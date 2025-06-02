import React, {use, useState} from 'react';
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Platform,
  Text,
  ScrollView,
  TouchableOpacity,
  PermissionsAndroid,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import LocationSearch from '../../components/layout/LocationSearch';
import Geolocation from '@react-native-community/geolocation';

const EditProfileScreen = ({route}) => {
  const navigation = useNavigation();
  const {profile, setProfileTrigger} = route.params;

  const [name, setName] = useState(profile?.name || '');
  const [email, setEmail] = useState(profile?.email || '');
  const [city, setCity] = useState(profile?.city || '');
  const [country, setCountry] = useState(profile?.country || '');
  const [password, setPassword] = useState('');

  // const getLocationByIP = async () => {
  //   try {
  //     const response = await fetch('https://ipwhois.app/json/');
  //     if (!response.ok) throw new Error(`Status: ${response.status}`);

  //     const data = await response.json();
  //     setCity(data.city || '');
  //     setCountry(data.country || '');
  //   } catch (error) {
  //     Alert.alert('Error', 'Failed to get location by IP: ' + error.message);
  //     console.error('IP location error:', error);
  //   }
  // };

  // const requestLocationPermission = async () => {
  //   if (Platform.OS === 'android') {
  //     try {
  //       const granted = await PermissionsAndroid.request(
  //         PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  //         {
  //           title: 'Location Permission',
  //           message: 'This app needs access to your location.',
  //           buttonNeutral: 'Ask Me Later',
  //           buttonNegative: 'Cancel',
  //           buttonPositive: 'OK',
  //         },
  //       );
  //       return granted === PermissionsAndroid.RESULTS.GRANTED;
  //     } catch (err) {
  //       console.warn(err);
  //       return false;
  //     }
  //   } else {
  //     return true; // iOS handled separately
  //   }
  // };

  // const getCurrentLocation = async () => {
  //   const hasPermission = await requestLocationPermission();
  //   if (!hasPermission) {
  //     Alert.alert('Permission Denied', 'Location permission is required.');
  //     return;
  //   }

  //   Geolocation.requestAuthorization(); // iOS ke liye permission request
  //   Geolocation.getCurrentPosition(
  //     async position => {
  //       const {latitude, longitude} = position.coords;
  //       console.log('Lat:', latitude, 'Lng:', longitude);

  //       // Reverse geocoding OpenStreetMap se
  //       try {
  //         const response = await fetch(
  //           `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`,
  //         );
  //         if (!response.ok) throw new Error('Reverse geocoding failed');

  //         const data = await response.json();
  //         console.log('Reverse geocode data:', data);

  //         const address = data.address || {};
  //         const cityName =
  //           address.city ||
  //           address.town ||
  //           address.village ||
  //           address.suburb ||
  //           '';
  //         const countryName = address.country || '';

  //         // Set state
  //         setCity(cityName);
  //         setCountry(countryName);
  //       } catch (err) {
  //         Alert.alert('Error', 'Failed to get address: ' + err.message);
  //       }
  //     },
  //     error => {
  //       Alert.alert('Error', 'Failed to get location: ' + error.message);
  //       console.log(error.message,"error.message")
  //       console.log(error,"error")
  //     },
  //     {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
  //   );
  // };

  const API_URL = Platform.select({
    android: 'https://taqamu-app-backend.vercel.app/api',
    ios: 'https://taqamu-app-backend.vercel.app/api',
    default: 'https://taqamu-app-backend.vercel.app/api',
  });

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
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Dashboard');
          }}>
          <Text>❌</Text>
        </TouchableOpacity>
        <Text style={styles.heading}>Update Location</Text>
      </View>
      <Text style={styles.label}>Location</Text>
      <LocationSearch
        onSelect={({full, city, country}) => {
          setCity(full); // full is like "Rathmines, Dublin"
          setCountry(country);
        }}
      />
      {/* <TouchableOpacity
        onPress={getCurrentLocation}
        style={{
          marginVertical: 10,
          backgroundColor: '#555',
          padding: 10,
          borderRadius: 5,
        }}>
        <Text style={{color: '#fff', textAlign: 'center'}}>
          📍 Use My Location
        </Text>
      </TouchableOpacity> */}

      <View style={{marginTop: 8}}>
        <Button title="Update Location" onPress={handleUpdate} color="green" />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#1E1E1E',
    height: '100%',
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  heading: {
    flex: 1,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  label: {
    marginBottom: 5,
    fontWeight: 'bold',
    color: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 15,
    padding: 10,
    borderRadius: 5,
    color: '#fff',
    backgroundColor: '#333',
  },
});

export default EditProfileScreen;
