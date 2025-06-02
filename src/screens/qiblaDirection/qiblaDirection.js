import React, {useState, useEffect} from 'react';
import {
  View,
  Image,
  ImageBackground,
  StyleSheet,
  PermissionsAndroid,
  Platform,
  Alert,
  Text,
  ActivityIndicator,
} from 'react-native';
import {request, PERMISSIONS} from 'react-native-permissions';
import Geolocation from '@react-native-community/geolocation';
import {Magnetometer} from 'react-native-sensors';
import {DeviceOrientation} from 'react-native-sensors';

const QIBLA_LAT = 21.4225;
const QIBLA_LONG = 39.8262;

const App = () => {
  const [heading, setHeading] = useState(0);
  const [qiblaDirection, setQiblaDirection] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check and request permissions
  const checkPermissions = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        const status = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
        return status === 'granted';
      }
    } catch (err) {
      console.error('Permission error:', err);
      return false;
    }
  };

  // Calculate Qibla direction
  const calculateQiblaDirection = (lat, lng) => {
    const phiK = QIBLA_LAT * (Math.PI / 180);
    const lambdaK = QIBLA_LONG * (Math.PI / 180);
    const phi = lat * (Math.PI / 180);
    const lambda = lng * (Math.PI / 180);

    const psi =
      (180 / Math.PI) *
      Math.atan2(
        Math.sin(lambdaK - lambda),
        Math.cos(phi) * Math.tan(phiK) -
          Math.sin(phi) * Math.cos(lambdaK - lambda),
      );

    return psi;
  };

  const startCompass = () => {
    if (!Magnetometer) {
      console.warn('Magnetometer not available');
      return () => {}; // No-op
    }

    const subscription = new Magnetometer({updateInterval: 100}).subscribe(
      ({x, y}) => {
        let angle = Math.atan2(y, x) * (180 / Math.PI);
        if (angle < 0) angle += 360;
        setHeading(angle);
      },
    );

    return () => subscription.unsubscribe();
  };

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        const qibla = calculateQiblaDirection(latitude, longitude);
        setQiblaDirection(qibla);
        setIsLoading(false);
      },
      error => {
        console.error('Location error:', error);
        setError('Unable to get location.');
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
        forceRequestLocation: true,
        showLocationDialog: true,
      },
    );
  };

  // Initialize everything
  const initializeApp = async () => {
    try {
      const hasPermission = await checkPermissions();
      if (!hasPermission) {
        setError('Location permission is required for this app to work.');
        setIsLoading(false);
        return;
      }

      getCurrentLocation();
      return startCompass();
    } catch (err) {
      console.error('Initialization error:', err);
      setError('Failed to initialize app. Please restart.');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let cleanupFn;

    const init = async () => {
      cleanupFn = await initializeApp(); // if this is a function, store it
    };

    init();

    return () => {
      if (typeof cleanupFn === 'function') {
        cleanupFn(); // ✅ now it's safe
      }
    };
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Finding Qibla direction...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <Text style={styles.retryText} onPress={initializeApp}>
          Tap to try again
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/kompas.png')}
        style={[
          styles.compass,
          {transform: [{rotate: `${360 - heading}deg`}]},
        ]}>
        <View
          style={[
            styles.qiblaIndicator,
            {transform: [{rotate: `${qiblaDirection}deg`}]},
          ]}>
          <Image
            source={require('../../assets/kakbah.png')}
            style={styles.qiblaImage}
          />
        </View>
      </ImageBackground>

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>Heading: {Math.round(heading)}°</Text>
        <Text style={styles.infoText}>
          Qibla: {qiblaDirection}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  compass: {
    width: 300,
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qiblaIndicator: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qiblaImage: {
    width: 90,
    height: 90,
    marginBottom: 120,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryText: {
    color: 'blue',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  infoContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  infoText: {
    fontSize: 16,
    marginVertical: 5,
  },
});

export default App;






// import React, { useEffect, useState } from 'react';
// import { View, Text, Image, StyleSheet } from 'react-native';
// import { useQiblaCompass } from 'react-native-qibla-compass';
// import Geolocation from 'react-native-geolocation-service';
// import { request, PERMISSIONS } from 'react-native-permissions';

// const QiblaScreen = () => {
//   const [location, setLocation] = useState(null);
//   const {
//     qiblad,
//     compassRotate,
//     kabaRotate,
//     isLoading,
//     error,
//   } = useQiblaCompass();

//   useEffect(() => {
//     const getLocation = async () => {
//       const permission = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
//       if (permission === 'granted') {
//         Geolocation.getCurrentPosition(
//           (position) => {
//             setLocation(position.coords);
//           },
//           (error) => console.log(error),
//           { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
//         );
//       }
//     };
//     getLocation();
//   }, []);

//   if (isLoading) return <Text>Loading...</Text>;
//   if (error) return <Text>Error: {error}</Text>;

//   return (
//     <View style={styles.container}>
//       <Text style={styles.heading}>Qibla Direction</Text>
//       <Image
//         source={require('../../assets/qibla.png')}
//         style={[styles.image, { transform: [{ rotate: `${kabaRotate}deg` }] }]}
//       />
//       <Text style={styles.angle}>Qibla Angle: {qiblad.toFixed(2)}°</Text>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   heading: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//   },
//   image: {
//     width: 250,
//     height: 250,
//   },
//   angle: {
//     marginTop: 20,
//     fontSize: 16,
//   },
// });

// export default QiblaScreen;

