import React, {useState} from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  Image,
  ActivityIndicator,
  PermissionsAndroid,
  Platform,
  Alert,
  TouchableOpacity,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import {useNavigation} from '@react-navigation/native';

const KAABA_LAT = 21.4225;
const KAABA_LON = 39.8262;

const calculateBearing = (lat1, lon1, lat2, lon2) => {
  const toRad = deg => (deg * Math.PI) / 180;
  const toDeg = rad => (rad * 180) / Math.PI;

  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);
  const Δλ = toRad(lon2 - lon1);

  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x =
    Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  const θ = Math.atan2(y, x);

  return (toDeg(θ) + 360) % 360;
};

const QiblaByGPS = () => {
  const navigation = useNavigation();
  const [qiblaDirection, setQiblaDirection] = useState(null);
  const [loading, setLoading] = useState(false);

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message:
            'This app needs access to your location to find Qibla direction',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true; // iOS auto handles via Info.plist
  };

  const getCurrentLocation = async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      Alert.alert('Permission Denied', 'Location permission is required');
      return;
    }

    setLoading(true);
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        const direction = calculateBearing(
          latitude,
          longitude,
          KAABA_LAT,
          KAABA_LON,
        );
        setQiblaDirection(direction);
        setLoading(false);
      },
      error => {
        Alert.alert('Error', error.message);
        setLoading(false);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}>
        <Text>❌</Text>
      </TouchableOpacity>
      <Text style={styles.heading}>Find Qibla by GPS</Text>

      <Button title="Find My Qibla Direction" onPress={getCurrentLocation} />
      <Text></Text>

      {loading && (
        <ActivityIndicator
          size="large"
          color="#0000ff"
          style={{marginTop: 20}}
        />
      )}

      {qiblaDirection !== null && !loading && (
        <View style={styles.result}>
          <Text style={styles.resultText}>
            Qibla Direction: {qiblaDirection.toFixed(2)}°
          </Text>

          <View style={styles.compassContainer}>
            {/* <Image
              source={require('../../assets/kompas.png')}
              // style={styles.compassBackground}
              style={[
                styles.compassBackground,
                {transform: [{rotate: `${qiblaDirection}deg`}]},
              ]}
            /> */}
            <Image
              source={require('../../assets/kakbah.png')}
              style={[
                styles.kaabaNeedle,
                {transform: [{rotate: `${qiblaDirection}deg`}]},
              ]}
            />
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eef',
    padding: 20,
    justifyContent: 'center',
  },
    backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 20,
    textAlign: 'center',
  },
  result: {
    marginTop: 30,
    alignItems: 'center',
  },
  resultText: {
    fontSize: 20,
    marginBottom: 10,
    color: '#333',
  },
  compassContainer: {
    width: 250,
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  compassBackground: {
    position: 'absolute',
    width: 250,
    height: 250,
    resizeMode: 'contain',
  },
  kaabaNeedle: {
    width: 60,
    height: 100,
    resizeMode: 'contain',
    right: 40,
  },
});

export default QiblaByGPS;
