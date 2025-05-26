import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { 
  configureNotifications, 
  initializeNotificationService,
  showTestNotification
} from './NotificationService';

const NotificationTester = () => {
  useEffect(() => {
    // Initialize notification service when component mounts
    const unsubscribe = initializeNotificationService();
    
    // Clean up when component unmounts
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const testNotification = () => {
    showTestNotification();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notification Test Component</Text>
      <Text style={styles.description}>
        This component initializes the improved notification service that:
        {'\n'}- Ensures notifications work when device is locked
        {'\n'}- Plays the adhan sound correctly
        {'\n'}- Uses high priority settings for reliable delivery
      </Text>
      <Text style={styles.button} onPress={testNotification}>
        Test Notification
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    margin: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 15,
    color: '#555',
  },
  button: {
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: 10,
    borderRadius: 5,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default NotificationTester;
