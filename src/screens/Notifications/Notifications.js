import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';

const Notifications = () => {
  const [currentPrayer, setCurrentPrayer] = useState(null);
  const [upcomingPrayer, setUpcomingPrayer] = useState(null);
  const navigation = useNavigation();

  const fetchStoredPrayer = async () => {
    try {
      const next = await AsyncStorage.getItem('nextPrayer');
      const upcoming = await AsyncStorage.getItem('upcomingPrayer');

      if (next) setCurrentPrayer(JSON.parse(next));
      if (upcoming) setUpcomingPrayer(JSON.parse(upcoming));
    } catch (error) {
      console.error('Error fetching stored prayers', error);
    }
  };

  useEffect(() => {
    fetchStoredPrayer(); // initial fetch

    const interval = setInterval(() => {
      fetchStoredPrayer();
    }, 10000); // every 10 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{padding: 8}}>
          <Text style={{fontSize: 24}}>❌</Text>
        </TouchableOpacity>
        <Text style={styles.headerText}>Prayer Timings</Text>
        <View style={{width: 24}} /> {/* Placeholder to balance back icon */}
      </View>

      {/* Current Prayer */}
      <View style={styles.card}>
        <Text style={styles.label}>Current Prayer</Text>
        <Text style={styles.value}>{currentPrayer?.name || 'Loading...'}</Text>
        {currentPrayer?.remainingTime && (
          <Text style={styles.subText}>
            Remaining: {currentPrayer.remainingTime}
          </Text>
        )}
      </View>

      {/* Upcoming Prayer */}
      <View style={styles.card}>
        <Text style={styles.label}>Upcoming Prayer</Text>
        <Text style={styles.value}>{upcomingPrayer?.name || 'Loading...'}</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#1e293b',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: {width: 0, height: 3},
  },
  label: {
    color: '#94a3b8',
    fontSize: 14,
    marginBottom: 5,
  },
  value: {
    color: '#f1f5f9',
    fontSize: 22,
    fontWeight: '600',
  },
  subText: {
    color: '#cbd5e1',
    fontSize: 14,
    marginTop: 8,
  },
});

export default Notifications;
