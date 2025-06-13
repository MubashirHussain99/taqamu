import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import countries from 'i18n-iso-countries';

countries.registerLocale(require('i18n-iso-countries/langs/en.json'));
import RootNavigator from '../../components/dashboard/BottomNavigation';

const PrayerTimesScreen = () => {
  const navigation = useNavigation();

  const handleBack = () => {
    navigation.goBack();
  };

  const [storedPrayers, setStoredPrayers] = useState([]);

  useEffect(() => {
    const loadPrayers = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('@all_prayers');
        if (jsonValue != null) {
          const prayers = JSON.parse(jsonValue);
          setStoredPrayers(prayers);
          console.log('Prayers loaded from AsyncStorage:', prayers);
        } else {
          console.log('No prayers found in AsyncStorage');
        }
      } catch (e) {
        console.error('Error loading prayers:', e);
      }
    };

    loadPrayers();
  }, []);

  console.log(storedPrayers, 'storedPrayers');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <Text style={styles.backButton}>❌</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Prayer Times for Today</Text>
      </View>

      <ScrollView style={styles.container1}>
        <Text style={styles.title}>Prayer Times</Text>

        <View style={styles.prayerList}>
          {storedPrayers.map((prayer, index) => {
            return (
              <View
                key={index}
                style={[
                  styles.prayerCard,
                  prayer.isCurrentPrayer && styles.currentPrayerCard,
                ]}>
                <View style={styles.prayerCardContent}>
                  <View style={styles.prayerInfo}>
                    <View
                      style={[
                        styles.prayerIconContainer,
                        prayer.isCurrentPrayer &&
                          styles.currentPrayerIconContainer,
                      ]}>
                      <Text style={styles.prayerIcon}>
                        {prayer.name.toLowerCase() === 'fajr' ||
                        prayer.name.toLowerCase() === 'isha'
                          ? '🌟'
                          : prayer.name.toLowerCase() === 'maghrib'
                          ? '🌙'
                          : '🕒'}
                      </Text>
                    </View>
                    <View style={styles.prayerDetails}>
                      <View style={styles.prayerNameContainer}>
                        <Text style={styles.prayerName}>{prayer.name}</Text>
                        <Text style={styles.prayerArabicName}>
                          {prayer.arabicName}
                        </Text>
                      </View>
                      {prayer.remainingTime && prayer.isCurrentPrayer && (
                        <View style={styles.remainingTimeContainer}>
                          <Text style={styles.remainingTime}>
                            {prayer.remainingTime}
                          </Text>
                          {prayer.name.toLowerCase() === 'maghrib' && (
                            <Text style={styles.currentLabel}>Current</Text>
                          )}
                        </View>
                      )}
                    </View>
                  </View>

                  <View style={styles.prayerActions}>
                    <View style={styles.prayerTimeContainer}>
                      <Text style={styles.prayerTime}>{prayer.time}</Text>
                    </View>

                    {/* <View style={styles.actionButtons}>
                      <TouchableOpacity
                        onPress={() => {}}
                        style={styles.audioButton}>
                        <Text style={styles.audioButtonIcon}>🔊</Text>
                      </TouchableOpacity>
                    </View> */}
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
      <RootNavigator />
    </View>
  );
};

export default PrayerTimesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1b4b',
    // paddingTop: 40,
    // paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 20,
    padding: 10,
  },
  backButton: {
    fontSize: 18,
    color: '#007BFF',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 20,
    flex: 1,
    textAlign: 'center',
    color: '#fff',
  },
  prayerListContainer: {
    flex: 1,
    marginBottom: 20,
  },
  prayerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  highlightedPrayer: {
    backgroundColor: '#000',
    borderLeftWidth: 4,
    borderLeftColor: '#007BFF',
  },
  prayerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  prayerTime: {
    fontSize: 18,
    color: '#fff',
  },
  calendarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    // backgroundColor: '#f7f7f7',
    borderRadius: 8,
    marginTop: 20,
  },
  calendarLabel: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#fff',
  },
  calendarDate: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },

  container1: {
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    color: '#d1d5db',
    marginBottom: 16,
  },
  prayerList: {
    gap: 12,
  },
  prayerCard: {
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 12,
  },
  currentPrayerCard: {
    backgroundColor: '#374151',
    borderColor: '#10b981',
  },
  prayerCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  prayerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  prayerIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#334155',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  currentPrayerIconContainer: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
  },
  prayerIcon: {
    fontSize: 20,
  },
  prayerDetails: {
    flexDirection: 'column',
  },
  prayerNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  prayerName: {
    fontWeight: '500',
    color: 'white',
  },
  prayerArabicName: {
    fontSize: 14,
    color: '#9ca3af',
    marginLeft: 8,
  },
  remainingTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  remainingTime: {
    fontSize: 14,
    color: '#10b981',
  },
  currentLabel: {
    fontSize: 12,
    color: '#6ee7b7',
    marginLeft: 8,
  },
  prayerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  prayerTimeContainer: {
    alignItems: 'flex-end',
  },
  prayerTime: {
    fontWeight: '500',
    color: 'white',
  },
  completedText: {
    fontSize: 12,
    color: '#10b981',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  audioButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#4b5563',
    backgroundColor: '#334155',
    justifyContent: 'center',
    alignItems: 'center',
  },
  audioButtonIcon: {
    fontSize: 18,
    color: '#a7f3d0',
  },
  trackButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#4b5563',
    backgroundColor: '#334155',
    justifyContent: 'center',
    alignItems: 'center',
  },
  trackButtonCompleted: {
    backgroundColor: '#10b981',
    borderColor: '#059669',
  },
  trackButtonIcon: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
  maghribCountdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'rgba(5, 150, 105, 0.2)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(5, 150, 105, 0.3)',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  countdownText: {
    fontSize: 14,
    color: '#a7f3d0',
  },
  countdownIcon: {
    marginRight: 8,
  },
  countdownTime: {
    fontWeight: 'bold',
  },
  soundIcon: {
    fontSize: 16,
    color: '#a7f3d0',
  },
});
