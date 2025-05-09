import Geolocation from 'react-native-geolocation-service';
import { PermissionsAndroid, Platform } from 'react-native';
import { GOOGLE_MAPS_API_KEY } from '../../services/api/api';

// Location permission (Android only)
const requestLocationPermission = async () => {
  if (Platform.OS !== 'android') return true;

  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch (error) {
    console.error('Permission error:', error);
    return false;
  }
};

// Get current coordinates
export const getCurrentPosition = async () => {
  const hasPermission = await requestLocationPermission();
  if (!hasPermission) {
    throw new Error('Location permission denied');
  }

  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => reject(error),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  });
};

// Reverse geocode coordinates to address
export const reverseGeocode = async (coordinates) => {
  try {
    const { latitude, longitude } = coordinates;

    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== 'OK') {
      throw new Error(`Geocoding error: ${data.status}`);
    }

    let formattedAddress = 'Unknown location';
    let city = '';
    let country = '';

    if (data.results && data.results.length > 0) {
      const result = data.results[0];
      formattedAddress = result.formatted_address;

      result.address_components.forEach((component) => {
        if (component.types.includes('locality')) {
          city = component.long_name;
        } else if (component.types.includes('country')) {
          country = component.long_name;
        }
      });
    }

    return {
      coordinates,
      formattedAddress,
      city,
      country,
    };
  } catch (error) {
    console.error('Reverse geocode error:', error);
    return {
      coordinates,
      formattedAddress: `${coordinates.latitude}, ${coordinates.longitude}`,
    };
  }
};

// Search for places
export const searchPlaces = async (query) => {
  try {
    if (!query || query.length < 2) return [];

    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
      query
    )}&key=${GOOGLE_MAPS_API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      throw new Error(`Places API error: ${data.status}`);
    }

    return data.predictions || [];
  } catch (error) {
    console.error('Place search error:', error);
    return [];
  }
};

// Get place details by place_id
export const getPlaceDetails = async (placeId) => {
  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${GOOGLE_MAPS_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== 'OK') {
      throw new Error(`Place details error: ${data.status}`);
    }

    const result = data.result;
    const coords = {
      latitude: result.geometry.location.lat,
      longitude: result.geometry.location.lng,
    };

    let city = '';
    let country = '';

    result.address_components.forEach((component) => {
      if (component.types.includes('locality')) {
        city = component.long_name;
      } else if (component.types.includes('country')) {
        country = component.long_name;
      }
    });

    return {
      coordinates: coords,
      formattedAddress: result.formatted_address || 'Unknown location',
      city,
      country,
    };
  } catch (error) {
    console.error('Get place details error:', error);
    return null;
  }
};

export const getGoogleMapsApiKey = () => {
  return GOOGLE_MAPS_API_KEY || '';
};

export default {
  getCurrentPosition,
  reverseGeocode,
  searchPlaces,
  getPlaceDetails,
  getGoogleMapsApiKey,
};
