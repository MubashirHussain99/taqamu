import React, {useEffect, useState} from 'react';
import {
  Platform,
  PermissionsAndroid,
  Alert,
  ActivityIndicator,
  View,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';

const AutoLocation = ({onLocationFound}) => {
  const [loading, setLoading] = useState(true);
  const [locationFetched, setLocationFetched] = useState(false);

  useEffect(() => {
    let gpsAlertShown = false; // 👈 Alert flag (only once per app session)
    let alertTimeout = null;

    const requestPermissionAndFetchLocation = async () => {
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Location Access Required',
              message: 'App needs access to your location',
              buttonPositive: 'OK',
              buttonNegative: 'Cancel',
            },
          );

          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            Alert.alert(
              'Permission Denied',
              'Location permission is required.',
            );
            setLoading(false);
            return;
          }
        } catch (err) {
          console.warn('Permission error:', err);
          setLoading(false);
          return;
        }
      }

      getLocation();

      // alertTimeout = setTimeout(() => {
      //   if (!locationFetched && !gpsAlertShown) {
      //     Alert.alert(
      //       'Location not enabled?',
      //       'Please make sure your device location (GPS) is turned ON.',
      //     );
      //     gpsAlertShown = true;
      //   }
      // }, 6000);
    };

    const getLocation = () => {
      Geolocation.getCurrentPosition(
        async position => {
          setLocationFetched(true); // ✅ Success case
          const {latitude, longitude} = position.coords;

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
            if (data?.address) {
              const addr = data.address;
              const formattedCity =
                addr.city ||
                addr.town ||
                addr.village ||
                addr.neighbourhood ||
                '';
              const country = addr.country || '';

              onLocationFound({
                city: formattedCity,
                country: country,
                full: [formattedCity, addr.state, country]
                  .filter(Boolean)
                  .join(', '),
              });
            }
          } catch (err) {
            console.error('Geocode error:', err);
          }

          setLoading(false);
        },
        error => {
          console.log('Location error:', error.message);
          setLocationFetched(false); // ✅ Failure case: ensure flag is false
          setLoading(false);
        },
        {enableHighAccuracy: false, timeout: 30000, maximumAge: 1000},
      );
    };

    requestPermissionAndFetchLocation();

    return () => {
      if (alertTimeout) {
        clearTimeout(alertTimeout);
      }
    };
  }, []);

  if (loading) {
    return (
      <View style={{padding: 10}}>
        <ActivityIndicator size="small" color="#00ff00" />
      </View>
    );
  }

  return null;
};

export default AutoLocation;
