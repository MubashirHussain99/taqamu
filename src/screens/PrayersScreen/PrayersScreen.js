import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {format} from 'date-fns';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import PrayerTime from '../../components/dashboard/PrayersTime';
import RootNavigator, {
  useBottomTabBarInset,
} from '../../components/dashboard/BottomNavigation';
import {APP_BACKGROUND} from '../../styles/screenStyles';

const TRACKABLE_PRAYERS = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];

const buildCompletionState = (dateKey, logData = {}) => {
  const state = {};
  TRACKABLE_PRAYERS.forEach(prayer => {
    if (logData[prayer]) {
      state[`${prayer}-${dateKey}`] = true;
    }
  });
  return state;
};

const PrayersScreen = () => {
  const navigation = useNavigation();
  const tabBarInset = useBottomTabBarInset();
  const today = new Date();
  const dateKey = format(today, 'yyyy-MM-dd');

  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [profileError, setProfileError] = useState(null);
  const [prayerCompletionState, setPrayerCompletionState] = useState({});

  const fetchProfile = useCallback(async () => {
    try {
      setProfileError(null);
      const currentUser = auth().currentUser;

      if (!currentUser?.uid) {
        setProfile(null);
        setProfileError('Please sign in to view prayer times.');
        return;
      }

      const userDoc = await firestore()
        .collection('users')
        .doc(currentUser.uid)
        .get();

      if (userDoc.exists) {
        setProfile(userDoc.data());
      } else {
        setProfile(null);
        setProfileError('Profile not found. Please complete your profile.');
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setProfileError('Failed to load profile.');
    } finally {
      setLoadingProfile(false);
    }
  }, []);

  const fetchPrayerLog = useCallback(async () => {
    const uid = auth().currentUser?.uid;
    if (!uid) {
      return;
    }

    try {
      const logDoc = await firestore()
        .collection('users')
        .doc(uid)
        .collection('prayerLogs')
        .doc(dateKey)
        .get();

      setPrayerCompletionState(
        buildCompletionState(dateKey, logDoc.exists ? logDoc.data() : {}),
      );
    } catch (err) {
      console.error('Error fetching prayer log:', err);
    }
  }, [dateKey]);

  useFocusEffect(
    useCallback(() => {
      setLoadingProfile(true);
      fetchProfile();
    }, [fetchProfile]),
  );

  useEffect(() => {
    fetchPrayerLog();
  }, [fetchPrayerLog]);

  const handleTogglePrayed = async prayerId => {
    const uid = auth().currentUser?.uid;
    if (!uid) {
      return;
    }

    const [prayerName] = prayerId.split('-');
    if (!TRACKABLE_PRAYERS.includes(prayerName)) {
      return;
    }

    const isCompleted = prayerCompletionState[prayerId] || false;
    const nextCompleted = !isCompleted;

    setPrayerCompletionState(prev => ({
      ...prev,
      [prayerId]: nextCompleted,
    }));

    try {
      const logRef = firestore()
        .collection('users')
        .doc(uid)
        .collection('prayerLogs')
        .doc(dateKey);

      await logRef.set(
        {
          [prayerName]: nextCompleted,
          updatedAt: firestore.FieldValue.serverTimestamp(),
        },
        {merge: true},
      );
    } catch (err) {
      console.error('Error saving prayer log:', err);
      setPrayerCompletionState(prev => ({
        ...prev,
        [prayerId]: isCompleted,
      }));
    }
  };

  const locationLabel =
    profile?.city && profile?.country
      ? `${profile.city}, ${profile.country}`
      : null;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          accessibilityLabel="Go back">
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerText}>Prayer Times</Text>
          {locationLabel ? (
            <Text style={styles.locationText}>{locationLabel}</Text>
          ) : null}
        </View>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.dateRow}>
        <Text style={styles.dateLabel}>Today</Text>
        <Text style={styles.dateValue}>
          {format(today, 'eeee, MMM d, yyyy')}
        </Text>
      </View>

      <View style={styles.main}>
        {loadingProfile ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color="#f59e0b" />
            <Text style={styles.statusText}>Loading profile...</Text>
          </View>
        ) : profileError ? (
          <View style={styles.centered}>
            <Text style={styles.errorText}>{profileError}</Text>
          </View>
        ) : !profile?.city || !profile?.country ? (
          <View style={styles.centered}>
            <Text style={styles.errorText}>
              Set your city and country in Edit Profile to see prayer times.
            </Text>
            <TouchableOpacity
              style={styles.editProfileButton}
              onPress={() =>
                navigation.navigate('EditProfileScreen', {
                  profile,
                  setProfileTrigger: fetchProfile,
                })
              }>
              <Text style={styles.editProfileButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <PrayerTime
            key={`${profile.city}|${profile.country}`}
            variant="full"
            city={profile.city}
            country={profile.country}
            selectedDate={today}
            prayerCompletionState={prayerCompletionState}
            onTogglePrayed={handleTogglePrayed}
            bottomInset={tabBarInset}
          />
        )}
      </View>

      <RootNavigator />
    </SafeAreaView>
  );
};

export default PrayersScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: APP_BACKGROUND,
  },
  main: {
    flex: 1,
    minHeight: 0,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 8,
  },
  backButton: {
    padding: 8,
    width: 40,
  },
  backButtonText: {
    fontSize: 28,
    color: '#fff',
    lineHeight: 28,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  locationText: {
    fontSize: 14,
    color: '#a7f3d0',
    marginTop: 4,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  dateLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  dateValue: {
    fontSize: 14,
    color: '#d1fae5',
    fontWeight: '500',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  statusText: {
    color: '#d1fae5',
    marginTop: 12,
    fontSize: 14,
  },
  errorText: {
    color: '#fecaca',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  editProfileButton: {
    marginTop: 16,
    backgroundColor: '#10b981',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  editProfileButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
