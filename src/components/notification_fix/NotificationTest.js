// Test script for validating notification fixes
// This script will help verify that notifications work when device is locked
// and that the adhan sound plays correctly

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { showTestNotification, configureNotifications } from './NotificationService';

class NotificationTest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      testResults: [],
      testing: false
    };
  }

  componentDidMount() {
    // Initialize notification channels
    this.initializeNotifications();
  }

  initializeNotifications = async () => {
    try {
      await configureNotifications();
      this.addTestResult('Notification channels configured successfully');
    } catch (error) {
      this.addTestResult(`Error configuring notifications: ${error.message}`, false);
    }
  }

  addTestResult = (message, success = true) => {
    const timestamp = new Date().toLocaleTimeString();
    this.setState(prevState => ({
      testResults: [
        { message, success, timestamp },
        ...prevState.testResults
      ]
    }));
  }

  runTest = async () => {
    this.setState({ testing: true });
    this.addTestResult('Starting notification test...');
    
    try {
      // Test notification with adhan sound
      await showTestNotification();
      this.addTestResult('Test notification sent - check if it appears when device is locked');
      this.addTestResult('Check if adhan sound plays correctly');
    } catch (error) {
      this.addTestResult(`Error during test: ${error.message}`, false);
    }
    
    this.setState({ testing: false });
  }

  render() {
    const { testResults, testing } = this.state;
    
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.header}>Notification Test Tool</Text>
        
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsTitle}>Testing Instructions:</Text>
          <Text style={styles.instructionsText}>
            1. Press "Run Test" button below{'\n'}
            2. Lock your device immediately{'\n'}
            3. Wait for notification (should appear within 5 seconds){'\n'}
            4. Verify adhan sound plays correctly{'\n'}
            5. Unlock device and check results
          </Text>
        </View>
        
        <TouchableOpacity 
          style={[styles.testButton, testing && styles.testButtonDisabled]} 
          onPress={this.runTest}
          disabled={testing}>
          <Text style={styles.testButtonText}>
            {testing ? 'Testing...' : 'Run Test'}
          </Text>
        </TouchableOpacity>
        
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsTitle}>Test Results:</Text>
          <ScrollView style={styles.resultsList}>
            {testResults.map((result, index) => (
              <View key={index} style={[
                styles.resultItem, 
                result.success ? styles.successResult : styles.errorResult
              ]}>
                <Text style={styles.resultTimestamp}>{result.timestamp}</Text>
                <Text style={styles.resultText}>{result.message}</Text>
              </View>
            ))}
            {testResults.length === 0 && (
              <Text style={styles.noResults}>No tests run yet</Text>
            )}
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
  },
  instructionsContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  instructionsText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#555',
  },
  testButton: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
    elevation: 2,
  },
  testButtonDisabled: {
    backgroundColor: '#A5D6A7',
  },
  testButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  resultsContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    elevation: 2,
  },
  resultsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  resultsList: {
    flex: 1,
  },
  resultItem: {
    padding: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
  successResult: {
    backgroundColor: '#E8F5E9',
  },
  errorResult: {
    backgroundColor: '#FFEBEE',
  },
  resultTimestamp: {
    fontSize: 12,
    color: '#757575',
    marginBottom: 4,
  },
  resultText: {
    fontSize: 14,
    color: '#333',
  },
  noResults: {
    fontSize: 14,
    color: '#757575',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default NotificationTest;
