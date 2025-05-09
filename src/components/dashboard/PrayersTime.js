import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {Coordinates, CalculationMethod} from 'adhan';
import * as adhan from 'adhan';
import {format, addMinutes, differenceInMinutes} from 'date-fns';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PRAYER_ARABIC_NAMES = {
  fajr: 'الفجر',
  sunrise: 'الشروق',
  dhuhr: 'الظهر',
  asr: 'العصر',
  maghrib: 'المغرب',
  isha: 'العشاء',
};

const PrayerTimes = ({
  variant = 'compact',
  onTogglePrayed,
  prayerCompletionState = {},
  selectedDate = new Date(),
  city,
  country,
  setDropdownVisible,
  setPrayerTimes,
  setNotificationCount,
}) => {
  const navigation = useNavigation();
  const [currentPrayer, setCurrentPrayer] = useState(null);
  const [allPrayers, setAllPrayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getLocationCoordinates = async () => {
    if (!city || !country) {
      throw new Error('City or country not provided');
    }

    const encodedCity = encodeURIComponent(city);
    const encodedCountry = encodeURIComponent(country);

    const url = `https://nominatim.openstreetmap.org/search?city=${encodedCity}&country=${encodedCountry}&format=json`;

    const response = await axios.get(url, {
      headers: {'Accept-Language': 'en'},
    });

    const results = response.data;

    if (!Array.isArray(results) || results.length === 0) {
      throw new Error('No coordinates found');
    }

    const data = results[0];

    return {
      latitude: parseFloat(data.lat),
      longitude: parseFloat(data.lon),
    };
  };

  const getFormattedRemainingTime = prayerTime => {
    const now = new Date();
    const diffMinutes = differenceInMinutes(prayerTime, now);

    if (diffMinutes < 60) {
      return `${diffMinutes} min remaining`;
    } else {
      const hours = Math.floor(diffMinutes / 60);
      const minutes = diffMinutes % 60;
      return `${hours} hr ${minutes} min remaining`;
    }
  };

  useEffect(() => {
    const calculatePrayerTimes = async () => {
      setLoading(true);
      const locationCoordinates = await getLocationCoordinates();
      const {latitude, longitude} = locationCoordinates;
      const adhanCoordinates = new Coordinates(latitude, longitude);
      const date = new Date();
      const calculationParams = CalculationMethod.MoonsightingCommittee();
      const prayerTimes = new adhan.PrayerTimes(
        adhanCoordinates,
        date,
        calculationParams,
      );

      const prayers = [
        {
          name: 'Fajr',
          arabicName: PRAYER_ARABIC_NAMES.fajr,
          time: format(prayerTimes.fajr, 'h:mm a'),
          isCurrentPrayer: false,
        },
        {
          name: 'Sunrise',
          arabicName: PRAYER_ARABIC_NAMES.sunrise,
          time: format(prayerTimes.sunrise, 'h:mm a'),
          isCurrentPrayer: false,
        },
        {
          name: 'Dhuhr',
          arabicName: PRAYER_ARABIC_NAMES.dhuhr,
          time: format(prayerTimes.dhuhr, 'h:mm a'),
          isCurrentPrayer: false,
        },
        {
          name: 'Asr',
          arabicName: PRAYER_ARABIC_NAMES.asr,
          time: format(prayerTimes.asr, 'h:mm a'),
          isCurrentPrayer: false,
        },
        {
          name: 'Maghrib',
          arabicName: PRAYER_ARABIC_NAMES.maghrib,
          time: format(prayerTimes.maghrib, 'h:mm a'),
          isCurrentPrayer: false,
        },
        {
          name: 'Isha',
          arabicName: PRAYER_ARABIC_NAMES.isha,
          time: format(prayerTimes.isha, 'h:mm a'),
          isCurrentPrayer: false,
        },
      ];

      const currentPrayerName = prayerTimes.currentPrayer();
      const nextPrayerName = prayerTimes.nextPrayer();

      let nextPrayer = null;

      prayers.forEach(prayer => {
        const lowerName = prayer.name.toLowerCase();

        if (nextPrayerName === lowerName) {
          prayer.isCurrentPrayer = true;

          const nextPrayerTime = prayerTimes[lowerName];
          if (nextPrayerTime) {
            prayer.remainingTime = getFormattedRemainingTime(nextPrayerTime);
            nextPrayer = {...prayer};
          }
        }
      });

      setAllPrayers(prayers);
      setCurrentPrayer(nextPrayer);
      setLoading(false);
    };

    calculatePrayerTimes();

    const intervalId = setInterval(() => {
      calculatePrayerTimes();
    }, 60000);

    return () => clearInterval(intervalId);
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
      </View>
    );
  }

  if (!currentPrayer) {
    return null;
  }

  const currentPrayerIndex = allPrayers.findIndex(
    p => p.name.toLowerCase() === currentPrayer.name.toLowerCase(),
  );

  let upcomingPrayer = null;
  for (let i = currentPrayerIndex + 1; i < allPrayers.length; i++) {
    if (allPrayers[i]) {
      upcomingPrayer = allPrayers[i];
      break;
    }
  }

  if (!upcomingPrayer && currentPrayerIndex === allPrayers.length - 1) {
    upcomingPrayer = allPrayers[0];
  }

  return (
    <View style={styles.compactContainer}>
      <View style={styles.compactGrid}>
        {/* Next Prayer Card */}
        <View style={styles.compactCard}>
          <Text style={styles.compactLabel}>Next</Text>
          <View style={styles.compactContent}>
            <View style={styles.compactHeader}>
              <Text style={styles.compactPrayerName}>{currentPrayer.name}</Text>
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
                <Text style={styles.compactLinkIcon}>→</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Upcoming Prayer Card */}
        <View style={styles.compactCard}>
          <Text style={styles.compactLabel}>Upcoming</Text>
          <View style={styles.compactContent}>
            {upcomingPrayer && (
              <>
                <View style={styles.compactHeader}>
                  <Text style={styles.compactPrayerName}>
                    {upcomingPrayer.name}
                  </Text>
                  {upcomingPrayer.name.toLowerCase() === 'isha' && (
                    <Text style={styles.compactIcon}>🌟</Text>
                  )}
                </View>
                <Text style={styles.compactArabicName}>
                  {upcomingPrayer.arabicName}
                </Text>
                <View style={styles.compactFooter}>
                  <Text style={styles.compactTime}>{upcomingPrayer.time}</Text>
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
                    <Text style={styles.compactLinkIcon}>→</Text>
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
    backgroundColor: '#1e293b',
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
});

export default PrayerTimes;
