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
  const {profile, setProfileTrigger, setIsUpdated} = route.params;

  // const [name, setName] = useState(profile?.name || '');
  // const [email, setEmail] = useState(profile?.email || '');
  const [city, setCity] = useState(profile?.city || '');
  const [country, setCountry] = useState(profile?.country || '');
  const [password, setPassword] = useState('');
  const [locationStatus, setLocationStatus] = useState('');
  const [recentLocations, setRecentLocations] = useState([]);
  const [page, setPage] = useState(1);
  const [loadingLocation, setLoadingLocation] = useState(false);

  const [fullAddress, setFullAddress] = useState('');
  const [street, setStreet] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');

  const parseFullAddress = full => {
    const parts = full.split(',').map(p => p.trim());

    return {
      street: parts[0] || '',
      city: parts[2] || '',
      state: parts[4] || '',
      zip_code: '', // Optional, can be filled later
      country: parts[parts.length - 1] || '',
    };
  };

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
  const API_URL = 'https://taqamu-backend.vercel.app/api';

  const handleUpdate = async () => {
    try {
      const data = {
        street,
        city,
        state,
        zip_code: zipCode,
        country,
        ...(password ? {password} : {}),
      };

      console.log('Sending update data:', data);

      const response = await fetch(`${API_URL}/address`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const responseText = await response.text();
      console.log('Response:', responseText);
      setIsUpdated(true);
      if (!response.ok) {
        throw new Error(responseText || 'Update failed');
      }
      // ✅ Save updated flag to local storage
      await AsyncStorage.setItem('isUpdated', 'true');

      if (city) {
        await saveLocationToStorage(city);
        loadRecentLocations(1);
      }

      setProfileTrigger(true);

      // ✅ Navigate to Dashboard on success
      navigation.navigate('Dashboard'); // <-- Make sure Dashboard is in your navigator
    } catch (err) {
      console.error('Update error:', err.message);
      Alert.alert('Error', err.message);
    }
  };

  console.log(city);
  console.log('city-country');
  console.log(country);

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
      {/* <LocationSearch
        // city={city}
        // country={country}
        onSelect={({full, city: selCity, country: selCountry}) => {
          setCity(full);
          setCountry(selCountry);
        }}
      /> */}

      <LocationSearch
        onSelect={({full, city: selCity, country: selCountry}) => {
          setFullAddress(full);
          setCity(selCity);
          setCountry(selCountry);

          const parsed = parseFullAddress(full);
          setStreet(parsed.street);
          setState(parsed.state);
          setZipCode(parsed.zip_code);
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
