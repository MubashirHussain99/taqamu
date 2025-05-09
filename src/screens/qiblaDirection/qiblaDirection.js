import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Image,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from 'react-native';

const KAABA_LAT = 21.4225;
const KAABA_LON = 39.8262;
const OPENCAGE_API_KEY = 'a3d970e33db7482e9f84405b805ff717'; // 🔑 Replace with your OpenCage API key

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

const QiblaByCityScreen = () => {
  const navigation = useNavigation();
  const [city, setCity] = useState('');
  const [qiblaDirection, setQiblaDirection] = useState(null);
  const [loading, setLoading] = useState(false);

  const getLatLngFromCity = async cityName => {
    try {
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${cityName}&key=${OPENCAGE_API_KEY}`,
      );
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry;
        return { latitude: lat, longitude: lng };
      } else {
        throw new Error('City not found');
      }
    } catch (err) {
      Alert.alert('Error', err.message);
      return null;
    }
  };

  const handleFindQibla = async () => {
    if (!city) {
      Alert.alert('Error', 'Please enter a city name');
      return;
    }

    setLoading(true);
    const coords = await getLatLngFromCity(city);

    if (coords) {
      const direction = calculateBearing(
        coords.latitude,
        coords.longitude,
        KAABA_LAT,
        KAABA_LON,
      );
      setQiblaDirection(direction);
    } else {
      setQiblaDirection(null);
    }

    setLoading(false);
  };

  // return (
  //   <View style={styles.container}>
  //   <Text style={styles.heading}>Find Qibla by City</Text>
  //   <TextInput
  //     placeholder="Enter your city (e.g. Karachi)"
  //     value={city}
  //     onChangeText={setCity}
  //     style={styles.input}
  //   />
  //   <Button title="Find Qibla Direction" onPress={handleFindQibla} />

  //   {loading && <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20 }} />}

  //   {qiblaDirection !== null && !loading && (
  //     <View style={styles.result}>
  //       <Text style={styles.resultText}>
  //         Qibla Direction: {qiblaDirection.toFixed(2)}°
  //       </Text>

  //       <View style={styles.compassContainer}>
  //         {/* Compass background */}
  //         <Image
  //           source={require('../../assets/kompas.png')} // 📌 Add this image to your assets
  //           style={styles.compassBackground}
  //         />
  //         {/* Rotating Kaaba */}
  //         <Image
  //           source={require('../../assets/kakbah.png')}
  //           style={[
  //             styles.kaabaNeedle,
  //             { transform: [{ rotate: `${qiblaDirection}deg` }] },
  //           ]}
  //         />
  //       </View>
  //     </View>
  //   )}
  // </View>
  // );
  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text>❌</Text>
      </TouchableOpacity>
  
      <Text style={styles.heading}>Find Qibla by City</Text>
  
      <TextInput
        placeholder="Enter your city (e.g. Karachi)"
        value={city}
        onChangeText={setCity}
        style={styles.input}
      />
  
      <TouchableOpacity style={styles.findButton} onPress={handleFindQibla}>
        <Text style={styles.findButtonText}>Find Qibla Direction</Text>
      </TouchableOpacity>
  
      {loading && <ActivityIndicator size="large" color="#0000ff" style={{marginTop: 20}} />}
  
      {qiblaDirection !== null && !loading && (
        <View style={styles.result}>
          <Text style={styles.resultText}>
            Qibla Direction: {qiblaDirection.toFixed(2)}°
          </Text>
  
          <View style={styles.compassContainer}>
            <Image
              source={require('../../assets/kompas.png')}
              style={styles.compassBackground}
            />
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
    marginTop: 80,
    marginBottom: 20,
    textAlign: 'center',
  },
  
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#fff',
    marginBottom: 15,
  },
  
  findButton: {
    backgroundColor: '#27ae60',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: 'center',
  },
  
  findButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
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
  kaaba: {
    width: 60,
    height: 120,
    resizeMode: 'contain',
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

export default QiblaByCityScreen;
