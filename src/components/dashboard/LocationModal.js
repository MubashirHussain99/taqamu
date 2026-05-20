import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
  PermissionsAndroid,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from 'react-native-geolocation-service';
import Ionicons from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import LocationSearch from '../layout/LocationSearch';
import {DASHBOARD_HEADER_BACKGROUND} from '../../constants/colors';

const RECENT_LOCATIONS_KEY = 'RECENT_LOCATIONS';
const ITEMS_PER_PAGE = 5;

const saveLocationToStorage = async location => {
  try {
    const storedLocations = await AsyncStorage.getItem(RECENT_LOCATIONS_KEY);
    let locations = storedLocations ? JSON.parse(storedLocations) : [];
    locations = locations.filter(loc => loc !== location);
    locations.unshift(location);
    if (locations.length > 50) {
      locations = locations.slice(0, 50);
    }
    await AsyncStorage.setItem(RECENT_LOCATIONS_KEY, JSON.stringify(locations));
  } catch (err) {
    console.warn('Error saving location:', err);
  }
};

const getAddressFromCoords = async (latitude, longitude) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=en`,
      {
        headers: {
          'User-Agent': 'TaqamuApp/1.0 (contact: your-email@example.com)',
          Accept: 'application/json',
        },
      },
    );
    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return null;
    }
    return data?.address || null;
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

export const LocationModal = ({
  visible = false,
  onClose,
  profile,
  setProfileTrigger,
  onLocationSelect,
}) => {
  const locationSearchRef = useRef(null);
  const [city, setCity] = useState(profile?.city || '');
  const [country, setCountry] = useState(profile?.country || '');
  const [recentLocations, setRecentLocations] = useState([]);
  const [page, setPage] = useState(1);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (visible) {
      setCity(profile?.city || '');
      setCountry(profile?.country || '');
      loadRecentLocations(1);
    }
  }, [visible, profile?.city, profile?.country]);

  const loadRecentLocations = async (pageNum = 1) => {
    try {
      const storedLocations = await AsyncStorage.getItem(RECENT_LOCATIONS_KEY);
      const locations = storedLocations ? JSON.parse(storedLocations) : [];
      setRecentLocations(locations.slice(0, pageNum * ITEMS_PER_PAGE));
      setPage(pageNum);
    } catch (err) {
      console.warn('Error loading recent locations:', err);
    }
  };

  const getLocation = () => {
    setLoadingLocation(true);
    Geolocation.getCurrentPosition(
      async position => {
        const {latitude, longitude} = position.coords;
        const addr = await getAddressFromCoords(latitude, longitude);
        setLoadingLocation(false);
        if (addr) {
          const formattedLocation = formatLocationName(addr);
          setCity(formattedLocation);
          setCountry(addr.country || '');
          await saveLocationToStorage(formattedLocation);
          loadRecentLocations(1);
        } else {
          Alert.alert(
            'Location lookup failed',
            'Could not resolve your coordinates to a city. Try searching manually.',
          );
        }
      },
      error => {
        setLoadingLocation(false);
        Alert.alert('Location error', error.message);
      },
      {enableHighAccuracy: false, timeout: 30000, maximumAge: 1000},
    );
  };

  const requestLocation = async () => {
    if (Platform.OS === 'ios') {
      getLocation();
      return;
    }
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Access Required',
          message: 'This app needs access to your location',
          buttonPositive: 'OK',
          buttonNegative: 'Cancel',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        getLocation();
      } else {
        Alert.alert('Permission Denied', 'Location permission is required.');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const handleUpdate = async () => {
    const latest = locationSearchRef.current?.getLocationValues?.();
    const cityToSave = (latest?.full || city || '').trim();
    const countryToSave = (latest?.country || country || '').trim();

    if (!cityToSave || !countryToSave) {
      Alert.alert(
        'Location required',
        'Please search for a city, pick a result, or use "Use My Location".',
      );
      return;
    }

    setSaving(true);
    try {
      const uid = auth().currentUser?.uid;
      if (!uid) {
        throw new Error('You must be signed in to update your location.');
      }

      await firestore().collection('users').doc(uid).update({
        city: cityToSave,
        country: countryToSave,
      });

      await saveLocationToStorage(cityToSave);

      if (typeof setProfileTrigger === 'function') {
        setProfileTrigger(prev => !prev);
      }
      if (typeof onLocationSelect === 'function') {
        onLocationSelect({city: cityToSave, country: countryToSave});
      }
      onClose?.();
    } catch (error) {
      Alert.alert('Error', error.message || 'Could not update location.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>Update Location</Text>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeButton}
              accessibilityRole="button"
              accessibilityLabel="Close location modal">
              <Ionicons name="close" size={24} color="#e2e8f0" />
            </TouchableOpacity>
          </View>

          <ScrollView
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled
            contentContainerStyle={styles.content}>
            <Text style={styles.label}>Search location</Text>
            <LocationSearch
              ref={locationSearchRef}
              city={city}
              country={country}
              onSelect={({full, country: selCountry}) => {
                setCity(full);
                setCountry(selCountry);
              }}
            />

            <View style={styles.actions}>
              {loadingLocation ? (
                <ActivityIndicator size="small" color="#34d399" />
              ) : (
                <TouchableOpacity
                  onPress={requestLocation}
                  style={styles.locationButton}
                  activeOpacity={0.85}>
                  <Ionicons name="locate-outline" size={18} color="#fff" />
                  <Text style={styles.locationButtonText}>Use My Location</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                onPress={handleUpdate}
                style={[styles.saveButton, saving && styles.saveButtonDisabled]}
                disabled={saving}
                activeOpacity={0.85}>
                {saving ? (
                  <ActivityIndicator size="small" color="#0d4236" />
                ) : (
                  <Text style={styles.saveButtonText}>Save Location</Text>
                )}
              </TouchableOpacity>
            </View>

            <Text style={styles.recentTitle}>Recent Locations</Text>
            {recentLocations.length === 0 ? (
              <Text style={styles.noRecent}>No recent locations found.</Text>
            ) : (
              recentLocations.map((loc, idx) => (
                <TouchableOpacity
                  key={`${loc}-${idx}`}
                  onPress={() => {
                    const parts = loc.split(',').map(part => part.trim());
                    const locCountry =
                      parts.length > 1 ? parts[parts.length - 1] : country;
                    setCity(loc);
                    setCountry(locCountry);
                  }}
                  style={styles.recentItem}>
                  <Ionicons
                    name="time-outline"
                    size={16}
                    color="#94a3b8"
                    style={styles.recentIcon}
                  />
                  <Text style={styles.recentText}>{loc}</Text>
                </TouchableOpacity>
              ))
            )}

            {recentLocations.length >= page * ITEMS_PER_PAGE && (
              <TouchableOpacity
                onPress={() => loadRecentLocations(page + 1)}
                style={styles.moreButton}>
                <Text style={styles.moreButtonText}>Load more</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: DASHBOARD_HEADER_BACKGROUND,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '88%',
    borderWidth: 1,
    borderColor: '#334155',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#f8fafc',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(51, 65, 85, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 20,
    paddingBottom: 32,
  },
  label: {
    fontWeight: '600',
    color: '#cbd5e1',
    marginBottom: 8,
  },
  actions: {
    marginTop: 16,
    gap: 10,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#334155',
    padding: 14,
    borderRadius: 10,
  },
  locationButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#10b981',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    color: '#0d4236',
    fontWeight: '700',
    fontSize: 16,
  },
  recentTitle: {
    color: '#f8fafc',
    fontWeight: '700',
    marginTop: 24,
    marginBottom: 10,
  },
  noRecent: {
    color: '#94a3b8',
    fontStyle: 'italic',
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  recentIcon: {
    marginRight: 8,
  },
  recentText: {
    color: '#cbd5e1',
    flex: 1,
  },
  moreButton: {
    marginTop: 12,
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#334155',
  },
  moreButtonText: {
    color: '#34d399',
    fontWeight: '600',
  },
});
