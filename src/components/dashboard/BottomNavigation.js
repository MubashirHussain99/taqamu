import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import Dashboard from '../../screens/dashboard';
import PrayersScreen from '../../screens/PrayersScreen';
import QuranScreen from '../../screens/QuranScreen';
import UmmahScreen from '../../screens/UmmahScreen';

const RootNavigator = ({city, country}) => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Dashboard')}>
        <Image
          source={require('../../assets/images/dashboard.png')}
          style={styles.icon}
        />
        <Text style={styles.buttonText}>Dashboard</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('PrayersScreen')}>
        <Image
          source={require('../../assets/images/prayers.png')}
          style={styles.icon}
        />
        <Text style={styles.buttonText}>Prayers</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('QuranScreen')}>
        <Image
          source={require('../../assets/images/quran.png')}
          style={styles.icon}
        />
        <Text style={styles.buttonText}>Quran</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('UmmahScreen')}>
        <Image
          source={require('../../assets/images/ummah.png')}
          style={styles.icon}
        />
        <Text style={styles.buttonText}>Ummah</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#1e293b', // Slate background
  },
  button: {
    // backgroundColor: '#0f172a', // Slate color
    // paddingVertical: 10,
    paddingHorizontal: 10,
    marginVertical: 20,
    borderRadius: 5,
    flexDirection: 'column', // Align icon and text horizontally
    alignItems: 'center', // Center align items
    justifyContent: 'center',
    gap: 5, // Space between icon and text
  },
  icon: {
    width: 20, // Set the width for the image
    height: 20, // Set the height for the image
    marginRight: 8, // Space between icon and text
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'semibold',
  },
});

export default RootNavigator;
