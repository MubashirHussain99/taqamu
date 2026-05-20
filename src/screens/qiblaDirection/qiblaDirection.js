import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  PermissionsAndroid,
  Platform,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import {request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import Geolocation from '@react-native-community/geolocation';
import CompassHeading from 'react-native-compass-heading';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import axios from 'axios';
import {APP_BACKGROUND} from '../../styles/screenStyles';

const KAABA_LAT = 21.4225;
const KAABA_LON = 39.8262;
const COMPASS_SIZE = 280;
const ALIGN_THRESHOLD = 8;

const normalizeAngle = degrees => ((degrees % 360) + 360) % 360;

/** Bearing from user position to Kaaba (degrees from true north, clockwise). */
const getQiblaBearing = (latitude, longitude) => {
  const latK = (KAABA_LAT * Math.PI) / 180;
  const lonK = (KAABA_LON * Math.PI) / 180;
  const lat = (latitude * Math.PI) / 180;
  const lon = (longitude * Math.PI) / 180;

  const y = Math.sin(lonK - lon);
  const x =
    Math.cos(lat) * Math.tan(latK) - Math.sin(lat) * Math.cos(lonK - lon);

  return normalizeAngle((Math.atan2(y, x) * 180) / Math.PI);
};

const geocodeCityCountry = async (city, country) => {
  const query = [city, country].filter(Boolean).join(', ');
  if (!query) {
    return null;
  }

  const response = await axios.get(
    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      query,
    )}&format=json&limit=1`,
    {
      headers: {
        'Accept-Language': 'en',
        'User-Agent': 'Taqamu/1.0',
      },
      timeout: 15000,
    },
  );

  const hit = response.data?.[0];
  if (!hit) {
    return null;
  }

  return {
    latitude: parseFloat(hit.lat),
    longitude: parseFloat(hit.lon),
  };
};

const requestLocationPermission = async () => {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }

  const status = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
  return status === RESULTS.GRANTED;
};

const QiblaDirection = () => {
  const navigation = useNavigation();
  const watchIdRef = useRef(null);
  const hasCoordsRef = useRef(false);

  const [heading, setHeading] = useState(0);
  const [qiblaBearing, setQiblaBearing] = useState(null);
  const [locationLabel, setLocationLabel] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const applyCoordinates = useCallback((latitude, longitude, label) => {
    hasCoordsRef.current = true;
    setQiblaBearing(getQiblaBearing(latitude, longitude));
    setLocationLabel(label);
    setError(null);
    setIsLoading(false);
  }, []);

  const resolveFallbackCoordinates = useCallback(async () => {
    const uid = auth().currentUser?.uid;
    if (!uid) {
      return null;
    }

    const userDoc = await firestore().collection('users').doc(uid).get();
    if (!userDoc.exists) {
      return null;
    }

    const {city, country} = userDoc.data() || {};
    const coords = await geocodeCityCountry(city, country);
    if (!coords) {
      return null;
    }

    return {
      ...coords,
      label: [city, country].filter(Boolean).join(', '),
    };
  }, []);

  const startLocationWatch = useCallback(() => {
    if (watchIdRef.current != null) {
      Geolocation.clearWatch(watchIdRef.current);
    }

    watchIdRef.current = Geolocation.watchPosition(
      position => {
        const {latitude, longitude} = position.coords;
        applyCoordinates(latitude, longitude, 'GPS location');
      },
      async locationError => {
        console.warn('GPS watch error:', locationError);
        const fallback = await resolveFallbackCoordinates();
        if (fallback) {
          applyCoordinates(
            fallback.latitude,
            fallback.longitude,
            fallback.label || 'Saved profile location',
          );
        } else if (!hasCoordsRef.current) {
          setError(
            'Unable to get GPS. Enable location or set your city in profile.',
          );
          setIsLoading(false);
        }
      },
      {
        enableHighAccuracy: true,
        distanceFilter: 25,
        interval: 5000,
        fastestInterval: 2000,
      },
    );
  }, [applyCoordinates, resolveFallbackCoordinates]);

  const initialize = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    hasCoordsRef.current = false;

    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      const fallback = await resolveFallbackCoordinates();
      if (fallback) {
        applyCoordinates(
          fallback.latitude,
          fallback.longitude,
          fallback.label || 'Saved profile location',
        );
      } else {
        setError('Location permission is required to find Qibla direction.');
        setIsLoading(false);
      }
      return;
    }

    startLocationWatch();
  }, [applyCoordinates, resolveFallbackCoordinates, startLocationWatch]);

  useEffect(() => {
    initialize();

    const degreeUpdateRate = 3;
    CompassHeading.start(degreeUpdateRate, ({heading: nextHeading}) => {
      setHeading(normalizeAngle(nextHeading));
    });

    return () => {
      CompassHeading.stop();
      if (watchIdRef.current != null) {
        Geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const relativeAngle =
    qiblaBearing == null ? 0 : normalizeAngle(qiblaBearing - heading);
  const isAligned =
    qiblaBearing != null &&
    (relativeAngle <= ALIGN_THRESHOLD ||
      relativeAngle >= 360 - ALIGN_THRESHOLD);

  if (isLoading && qiblaBearing == null) {
    return (
      <SafeAreaView style={[styles.screen, styles.centered]}>
        <ActivityIndicator size="large" color="#f59e0b" />
        <Text style={styles.loadingText}>Finding Qibla direction...</Text>
      </SafeAreaView>
    );
  }

  if (error && qiblaBearing == null) {
    return (
      <SafeAreaView style={[styles.screen, styles.centered]}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={initialize}>
          <Text style={styles.retryButtonText}>Try again</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.backLink}
          onPress={() => navigation.goBack()}>
          <Text style={styles.backLinkText}>Go back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Qibla Direction</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.compassWrapper}>
        <View
          style={[
            styles.compassRing,
            isAligned && styles.compassRingAligned,
          ]}>
          <View
            style={[
              styles.compassDial,
              {transform: [{rotate: `${-heading}deg`}]},
            ]}>
            {['N', 'E', 'S', 'W'].map((label, index) => (
              <Text
                key={label}
                style={[
                  styles.cardinal,
                  index === 0 && styles.cardinalNorth,
                  index === 1 && styles.cardinalEast,
                  index === 2 && styles.cardinalSouth,
                  index === 3 && styles.cardinalWest,
                ]}>
                {label}
              </Text>
            ))}

            <View
              style={[
                styles.qiblaArm,
                {transform: [{rotate: `${qiblaBearing}deg`}]},
              ]}>
              <View style={styles.qiblaArrow} />
              <Text style={styles.kaabaLabel}>🕋</Text>
            </View>
          </View>

          <View style={styles.topMarker} />
        </View>

        <Text style={styles.hintText}>
          {isAligned
            ? 'You are facing the Qibla'
            : 'Rotate your device until the Kaaba points to the top marker'}
        </Text>
      </View>

      <View style={styles.statsCard}>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Device heading</Text>
          <Text style={styles.statValue}>{Math.round(heading)}°</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Qibla bearing</Text>
          <Text style={styles.statValue}>
            {qiblaBearing != null ? Math.round(qiblaBearing) : '—'}°
          </Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Turn to align</Text>
          <Text style={styles.statValue}>{Math.round(relativeAngle)}°</Text>
        </View>
        {locationLabel ? (
          <Text style={styles.locationText}>Based on: {locationLabel}</Text>
        ) : null}
        {error ? <Text style={styles.warningText}>{error}</Text> : null}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: APP_BACKGROUND,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  backButton: {
    width: 40,
    padding: 8,
  },
  backButtonText: {
    fontSize: 28,
    color: '#fff',
    lineHeight: 28,
  },
  title: {
    flex: 1,
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  compassWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  compassRing: {
    width: COMPASS_SIZE,
    height: COMPASS_SIZE,
    borderRadius: COMPASS_SIZE / 2,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(13, 66, 54, 0.6)',
  },
  compassRingAligned: {
    borderColor: '#34d399',
    backgroundColor: 'rgba(16, 185, 129, 0.25)',
  },
  compassDial: {
    width: COMPASS_SIZE - 24,
    height: COMPASS_SIZE - 24,
    borderRadius: (COMPASS_SIZE - 24) / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardinal: {
    position: 'absolute',
    color: '#d1fae5',
    fontWeight: '700',
    fontSize: 16,
  },
  cardinalNorth: {
    top: 0,
  },
  cardinalEast: {
    right: 0,
  },
  cardinalSouth: {
    bottom: 0,
  },
  cardinalWest: {
    left: 0,
  },
  qiblaArm: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
  },
  qiblaArrow: {
    width: 4,
    height: COMPASS_SIZE / 2 - 50,
    backgroundColor: '#f59e0b',
    borderRadius: 2,
    marginTop: 8,
  },
  kaabaLabel: {
    fontSize: 28,
    marginTop: 4,
  },
  topMarker: {
    position: 'absolute',
    top: 6,
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 14,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#fff',
  },
  hintText: {
    marginTop: 24,
    fontSize: 15,
    color: '#d1fae5',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 12,
  },
  statsCard: {
    marginHorizontal: 16,
    marginBottom: 24,
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(13, 66, 54, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statLabel: {
    color: '#a7f3d0',
    fontSize: 14,
  },
  statValue: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  locationText: {
    marginTop: 8,
    color: '#86efac',
    fontSize: 12,
  },
  warningText: {
    marginTop: 8,
    color: '#fecaca',
    fontSize: 12,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#d1fae5',
  },
  errorText: {
    color: '#fecaca',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#10b981',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  backLink: {
    padding: 8,
  },
  backLinkText: {
    color: '#a7f3d0',
    fontSize: 14,
  },
});

export default QiblaDirection;
