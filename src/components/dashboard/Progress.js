import React from 'react';
import { View, StyleSheet } from 'react-native';

const Progress = ({ value = 0, height = 8, backgroundColor = '#E0E0E0', progressColor = '#3B82F6' }) => {
  return (
    <View style={[styles.container, { height, backgroundColor }]}>
      <View style={[styles.progress, { width: `${value}%`, backgroundColor: progressColor }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
    borderRadius: 4,
  },
});

export default Progress;
