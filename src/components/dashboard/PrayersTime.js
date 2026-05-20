import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  ScrollView,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import {format} from 'date-fns';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  configureNotifications,
  initializeNotificationService,
  schedulePrayerNotification,
} from '../notification_fix/NotificationService';
import {
  syncPrayerNotifications,
  recordPrayerTransition,
} from '../../services/notificationHistory';
import {
  buildPrayerSchedule,
  persistPrayerStatus,
} from '../../services/prayerSchedule';

const COORDS_CACHE_PREFIX = 'prayerCoords:';
const COORDS_CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000;

const getCoordsCacheKey = (cityName, countryName) =>
  `${COORDS_CACHE_PREFIX}${cityName}|${countryName}`.toLowerCase();

const PrayerTime = ({
  variant = 'compact',
  onTogglePrayed,
  prayerCompletionState = {},
  selectedDate = new Date(),
  city,
  country,
  bottomInset = 0,
}) => {
  const navigation = useNavigation();
  const [currentPrayer, setCurrentPrayer] = useState(null);
  const [nextPrayer, setNextPrayer] = useState(null);
  const [allPrayers, setAllPrayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const calculationInterval = useRef(null);
  const coordsRef = useRef(null);
  const locationRequestIdRef = useRef(0);
  const previousPrayerNameRef = useRef(null);

  const isStaleRequest = requestId =>
    requestId !== locationRequestIdRef.current;

  useEffect(() => {
    let unsubscribe = null;

    const setupNotifications = async () => {
      const result = await initializeNotificationService();
      if (typeof result === 'function') {
        unsubscribe = result;
      }
    };

    setupNotifications();

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  useEffect(() => {
    configureNotifications();

    return () => {
      if (calculationInterval.current) {
        clearInterval(calculationInterval.current);
      }
    };
  }, []);

  const readCachedCoordinates = async (allowExpired = false) => {
    try {
      const raw = await AsyncStorage.getItem(getCoordsCacheKey(city, country));
      if (!raw) {
        return null;
      }

      const cached = JSON.parse(raw);
      if (!allowExpired && Date.now() - cached.cachedAt > COORDS_CACHE_TTL_MS) {
        return null;
      }

      const coords = {
        latitude: cached.latitude,
        longitude: cached.longitude,
      };

      return isValidCoordinates(coords) ? coords : null;
    } catch {
      return null;
    }
  };

  const writeCachedCoordinates = async coords => {
    await AsyncStorage.setItem(
      getCoordsCacheKey(city, country),
      JSON.stringify({
        latitude: coords.latitude,
        longitude: coords.longitude,
        cachedAt: Date.now(),
      }),
    );
  };

  const buildGeocodeQuery = () => {
    const cityName = city?.trim() || '';
    const countryName = country?.trim() || '';

    if (!cityName && !countryName) {
      return null;
    }

    if (
      countryName &&
      cityName.toLowerCase().includes(countryName.toLowerCase())
    ) {
      return cityName;
    }

    if (cityName && countryName) {
      return `${cityName}, ${countryName}`;
    }

    return cityName || countryName;
  };

  const isValidCoordinates = coords =>
    Number.isFinite(coords?.latitude) && Number.isFinite(coords?.longitude);

  const getDeviceCoordinates = () =>
    new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        position =>
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }),
        reject,
        {enableHighAccuracy: false, timeout: 15000, maximumAge: 600000},
      );
    });

  const fetchCoordinatesFromApi = async () => {
    const query = buildGeocodeQuery();
    if (!query) {
      throw new Error('Location not available');
    }

    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      query,
    )}&format=json&limit=1`;

    const response = await axios.get(url, {
      headers: {
        'Accept-Language': 'en',
        'User-Agent': 'Taqamu/1.0 nexomosmubashir@gmail.com',
      },
      timeout: 15000,
    });

    const results = response.data;

    if (!Array.isArray(results) || results.length === 0) {
      throw new Error('No coordinates found for this location');
    }

    const data = results[0];
    const coords = {
      latitude: parseFloat(data.lat),
      longitude: parseFloat(data.lon),
    };

    if (!isValidCoordinates(coords)) {
      throw new Error('Invalid coordinates returned for this location');
    }

    return coords;
  };

  const getLocationCoordinates = async () => {
    if (!city?.trim() || !country?.trim()) {
      setLoading(false);
      setError('Location not available');
      return;
    }

    if (
      coordsRef.current?.city === city &&
      coordsRef.current?.country === country
    ) {
      return coordsRef.current.coords;
    }

    const freshCache = await readCachedCoordinates();
    if (freshCache && isValidCoordinates(freshCache)) {
      coordsRef.current = {city, country, coords: freshCache};
      return freshCache;
    }

    try {
      const coords = await fetchCoordinatesFromApi();
      await writeCachedCoordinates(coords);
      coordsRef.current = {city, country, coords};
      return coords;
    } catch (err) {
      const staleCache = await readCachedCoordinates(true);
      if (staleCache && isValidCoordinates(staleCache)) {
        coordsRef.current = {city, country, coords: staleCache};
        return staleCache;
      }

      try {
        const deviceCoords = await getDeviceCoordinates();
        if (isValidCoordinates(deviceCoords)) {
          await writeCachedCoordinates(deviceCoords);
          coordsRef.current = {city, country, coords: deviceCoords};
          return deviceCoords;
        }
      } catch (deviceErr) {
        console.warn('Device location fallback failed:', deviceErr?.message);
      }

      throw err;
    }
  };

  const calculatePrayerTimes = async (
    selectedMethodKey,
    {showLoading = true, scheduleNotifications = false, requestId} = {},
  ) => {
    try {
      if (showLoading) {
        setLoading(true);
        setError(null);
      }

      const location = await getLocationCoordinates();
      if (isStaleRequest(requestId)) {
        return;
      }

      if (!location) {
        throw new Error('Location is required to calculate prayer times');
      }

      const {latitude, longitude} = location;
      const {
        prayers,
        currentPrayer: activePrayer,
        nextPrayer: upcomingPrayer,
        scheduleNotifications: toSchedule,
      } = buildPrayerSchedule(latitude, longitude, selectedMethodKey);

      if (isStaleRequest(requestId)) {
        return;
      }

      if (scheduleNotifications) {
        toSchedule.forEach(prayer => {
          schedulePrayerNotification(prayer.name, prayer.exactTime);
        });
      }

      setAllPrayers(prayers);
      setCurrentPrayer(activePrayer);
      setNextPrayer(upcomingPrayer);
      setError(null);

      const locationLabel = [city, country].filter(Boolean).join(', ');
      const prayerStatus = {
        currentPrayer: activePrayer,
        nextPrayer: upcomingPrayer,
        locationLabel: locationLabel || undefined,
        updatedAt: new Date().toISOString(),
      };
      await persistPrayerStatus(prayerStatus);

      await syncPrayerNotifications({
        currentPrayer: activePrayer,
        nextPrayer: upcomingPrayer,
        locationLabel: locationLabel || undefined,
      });

      if (
        activePrayer?.name &&
        previousPrayerNameRef.current &&
        previousPrayerNameRef.current !== activePrayer.name
      ) {
        await recordPrayerTransition(
          previousPrayerNameRef.current,
          activePrayer,
        );
      }
      if (activePrayer?.name) {
        previousPrayerNameRef.current = activePrayer.name;
      }
    } catch (err) {
      if (isStaleRequest(requestId)) {
        return;
      }

      console.error('Prayer time calculation error:', err);
      const message =
        err?.response?.status === 429
          ? 'Location lookup is temporarily limited. Please try again in a moment.'
          : err?.message || 'Failed to calculate prayer times';
      setError(message);
    } finally {
      if (!isStaleRequest(requestId) && showLoading) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (!city?.trim() || !country?.trim()) {
      setLoading(false);
      setError(null);
      return;
    }

    const requestId = ++locationRequestIdRef.current;
    coordsRef.current = null;
    setError(null);
    setLoading(true);
    setCurrentPrayer(null);
    setNextPrayer(null);
    setAllPrayers([]);

    calculatePrayerTimes(undefined, {
      showLoading: true,
      scheduleNotifications: true,
      requestId,
    });

    calculationInterval.current = setInterval(() => {
      calculatePrayerTimes(undefined, {
        showLoading: false,
        scheduleNotifications: false,
        requestId: locationRequestIdRef.current,
      });
    }, 60000);

    return () => {
      locationRequestIdRef.current += 1;
      if (calculationInterval.current) {
        clearInterval(calculationInterval.current);
        calculationInterval.current = null;
      }
    };
  }, [city, country]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#f59e0b" />
        <Text style={styles.loadingText}>Calculating prayer times...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => {
            const requestId = ++locationRequestIdRef.current;
            coordsRef.current = null;
            calculatePrayerTimes(undefined, {
              showLoading: true,
              scheduleNotifications: true,
              requestId,
            });
          }}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!currentPrayer && !nextPrayer && variant !== 'full') {
    return null;
  }

  if (variant === 'full') {
    if (!allPrayers.length) {
      return null;
    }

    return (
      <ScrollView
        style={styles.fullListScroll}
        contentContainerStyle={[
          styles.fullListContent,
          {paddingBottom: 16 + bottomInset},
        ]}>
        <View style={styles.prayerList}>
          {allPrayers.map((prayer, index) => {
            if (prayer.name.toLowerCase() === 'sunrise') {
              return null;
            }

            const validDate = selectedDate
              ? new Date(selectedDate)
              : new Date();
            const prayerId = `${prayer.name.toLowerCase()}-${format(
              validDate,
              'yyyy-MM-dd',
            )}`;
            const isPrayerCompleted = prayerCompletionState[prayerId] || false;

            return (
              <View
                key={prayerId}
                style={[
                  styles.fullPrayerCard,
                  prayer.isCurrentPrayer && styles.fullCurrentPrayerCard,
                ]}>
                <View style={styles.fullPrayerCardContent}>
                  <View style={styles.fullPrayerInfo}>
                    <View
                      style={[
                        styles.fullPrayerIconContainer,
                        prayer.isCurrentPrayer &&
                          styles.fullCurrentPrayerIconContainer,
                      ]}>
                      <Text style={styles.fullPrayerIcon}>
                        {prayer.name.toLowerCase() === 'fajr' ||
                        prayer.name.toLowerCase() === 'isha'
                          ? '🌟'
                          : prayer.name.toLowerCase() === 'maghrib'
                          ? '🌙'
                          : '🕒'}
                      </Text>
                    </View>
                    <View style={styles.fullPrayerDetails}>
                      <View style={styles.fullPrayerNameRow}>
                        <Text style={styles.fullPrayerName}>{prayer.name}</Text>
                        <Text style={styles.fullPrayerArabicName}>
                          {prayer.arabicName}
                        </Text>
                      </View>
                      {prayer.remainingTime && prayer.isCurrentPrayer && (
                        <Text style={styles.fullRemainingTime}>
                          {prayer.remainingTime}
                        </Text>
                      )}
                    </View>
                  </View>

                  <View style={styles.fullPrayerActions}>
                    <View style={styles.fullPrayerTimeContainer}>
                      <Text style={styles.fullPrayerTime}>{prayer.time}</Text>
                      {isPrayerCompleted && (
                        <Text style={styles.fullCompletedText}>Completed</Text>
                      )}
                    </View>

                    {onTogglePrayed && (
                      <TouchableOpacity
                        onPress={() => onTogglePrayed(prayerId)}
                        style={[
                          styles.fullTrackButton,
                          isPrayerCompleted && styles.fullTrackButtonCompleted,
                        ]}>
                        <Text style={styles.fullTrackButtonIcon}>
                          {isPrayerCompleted ? '✓' : '○'}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    );
  }

  return (
    <View style={styles.compactContainer}>
      <View style={styles.compactGrid}>
        {/* Current Prayer Card */}
        <View style={styles.compactCard}>
          <Text style={styles.compactLabel}>Current</Text>
          <View style={styles.compactContent}>
            {currentPrayer ? (
              <>
                <View style={styles.compactHeader}>
                  <Text style={styles.compactPrayerName}>
                    {currentPrayer.name}
                  </Text>
                  {currentPrayer.name.toLowerCase() === 'maghrib' && (
                    <Text style={styles.compactIcon}>🌙</Text>
                  )}
                  {currentPrayer.name.toLowerCase() === 'isha' && (
                    <Text style={styles.compactIcon}>🌟</Text>
                  )}
                </View>
                <Text style={styles.compactArabicName}>
                  {currentPrayer.arabicName}
                </Text>
                <View style={styles.compactFooter}>
                  <Text style={styles.compactTime}>{currentPrayer.time}</Text>
                  <TouchableOpacity
                    style={styles.compactLink}
                    onPress={() => {
                      navigation.navigate('PrayerTimesScreen', {
                        prayers: allPrayers,
                        selectedDate: selectedDate,
                        prayerCompletionState: prayerCompletionState,
                        onTogglePrayed: onTogglePrayed,
                      });
                    }}>
                    <Text style={styles.compactLinkText}>View times</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <Text style={styles.compactArabicName}>Between prayers</Text>
            )}
          </View>
        </View>

        {/* Next Prayer Card */}
        <View style={styles.compactCard}>
          <Text style={styles.compactLabel}>Next</Text>
          <View style={styles.compactContent}>
            {nextPrayer && (
              <>
                <View style={styles.compactHeader}>
                  <Text style={styles.compactPrayerName}>
                    {nextPrayer.name}
                  </Text>
                  {nextPrayer.name.toLowerCase() === 'isha' && (
                    <Text style={styles.compactIcon}>🌟</Text>
                  )}
                </View>
                <Text style={styles.compactArabicName}>
                  {nextPrayer.arabicName}
                </Text>
                <View style={styles.compactFooter}>
                  <Text style={styles.compactTime}>{nextPrayer.time}</Text>
                  {/* {nextPrayer.remainingTime ? (
                    <Text style={styles.compactRemaining}>
                      {nextPrayer.remainingTime}
                    </Text>
                  ) : null} */}
                  <TouchableOpacity
                    style={styles.compactLink}
                    onPress={() => {
                      navigation.navigate('PrayerTimesScreen', {
                        prayers: allPrayers,
                        selectedDate: selectedDate,
                        prayerCompletionState: prayerCompletionState,
                        onTogglePrayed: onTogglePrayed,
                      });
                    }}>
                    <Text style={styles.compactLinkText}>View times</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  loadingText: {
    color: 'white',
    marginLeft: 8,
  },
  errorContainer: {
    padding: 16,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  errorText: {
    color: '#f87171',
    marginBottom: 12,
  },
  retryButton: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: '#334155',
  },
  retryButtonText: {
    color: '#f59e0b',
    fontWeight: '500',
  },
  compactContainer: {
    flexDirection: 'column',
    gap: 12,
  },
  compactGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  compactCard: {
    flex: 1,
    backgroundColor: '#0d4236',
    // opacity: 0.4,
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 12,
    padding: 16,
  },
  compactLabel: {
    fontSize: 14,
    color: '#9ca3af',
    marginBottom: 4,
  },
  compactContent: {
    flexDirection: 'column',
  },
  compactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  compactPrayerName: {
    fontSize: 20,
    fontWeight: '500',
    color: 'white',
  },
  compactIcon: {
    marginLeft: 8,
    fontSize: 18,
  },
  compactArabicName: {
    fontSize: 14,
    color: '#f59e0b',
    marginBottom: 8,
  },
  compactFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  compactTime: {
    fontWeight: '500',
    color: 'white',
  },
  compactRemaining: {
    fontSize: 12,
    color: '#6ee7b7',
    marginTop: 2,
  },
  compactLink: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  compactLinkText: {
    fontSize: 14,
    color: '#f59e0b',
  },
  compactLinkIcon: {
    marginLeft: 4,
    color: '#f59e0b',
  },
  fullListScroll: {
    flex: 1,
  },
  fullListContent: {
    paddingHorizontal: 10,
    paddingBottom: 16,
  },
  prayerList: {
    gap: 12,
  },
  fullPrayerCard: {
    backgroundColor: '#0d4236',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 12,
  },
  fullCurrentPrayerCard: {
    backgroundColor: '#374151',
    borderColor: '#10b981',
  },
  fullPrayerCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  fullPrayerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  fullPrayerIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#334155',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  fullCurrentPrayerIconContainer: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
  },
  fullPrayerIcon: {
    fontSize: 20,
  },
  fullPrayerDetails: {
    flex: 1,
  },
  fullPrayerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  fullPrayerName: {
    fontWeight: '500',
    color: 'white',
    fontSize: 16,
  },
  fullPrayerArabicName: {
    fontSize: 14,
    color: '#9ca3af',
    marginLeft: 8,
  },
  fullRemainingTime: {
    fontSize: 14,
    color: '#10b981',
    marginTop: 4,
  },
  fullPrayerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  fullPrayerTimeContainer: {
    alignItems: 'flex-end',
  },
  fullPrayerTime: {
    fontWeight: '500',
    color: 'white',
    fontSize: 16,
  },
  fullCompletedText: {
    fontSize: 12,
    color: '#10b981',
  },
  fullTrackButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#4b5563',
    backgroundColor: '#334155',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullTrackButtonCompleted: {
    backgroundColor: '#10b981',
    borderColor: '#059669',
  },
  fullTrackButtonIcon: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default PrayerTime;
