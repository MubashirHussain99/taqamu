import React, {useEffect, useState} from 'react';
import {View, Image, StyleSheet, Animated} from 'react-native';
import {
  magnetometer,
  SensorTypes,
  setUpdateIntervalForType,
} from 'react-native-sensors';

const CompassWithKaaba = () => {
  const [angle, setAngle] = useState(new Animated.Value(0));

  useEffect(() => {
    setUpdateIntervalForType(SensorTypes.magnetometer, 100); // 100ms update

    const subscription = magnetometer.subscribe(
      ({x, y}) => {
        let heading = Math.atan2(y, x) * (180 / Math.PI);
        if (heading < 0) heading += 360;

        Animated.timing(angle, {
          toValue: heading,
          duration: 100,
          useNativeDriver: true,
        }).start();
      },
      error => console.log('Magnetometer error:', error),
    );

    return () => subscription.unsubscribe();
  }, []);

  const rotation = angle.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      {/* Rotating Compass */}
      <Animated.Image
        source={require('../../assets/qibla.png')}
        style={[styles.compass, {transform: [{rotate: rotation}]}]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  compass: {
    width: 300,
    height: 300,
    position: 'relative',
  },
});

export default CompassWithKaaba;
