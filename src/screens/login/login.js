import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Dimensions,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const {width} = Dimensions.get('window');
const isTablet = width >= 768;

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  const validateForm = () => {
    if (!email || !email.includes('@')) {
      return 'Please enter a valid email address';
    }
    if (!password || password.length < 6) {
      return 'Password must be at least 6 characters';
    }
    return null;
  };

  const onSubmit = async () => {
    const errorMsg = validateForm();
    if (errorMsg) {
      setError(errorMsg);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Use the correct API URL for your environment
      const API_URL = Platform.select({
        android: 'https://taqamu-app-backend.vercel.app/api',

        ios: 'https://taqamu-app-backend.vercel.app/api',
        default: 'https://taqamu-app-backend.vercel.app/api',
      });

      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // Fixed: Added proper body formatting
          email: email,
          password: password,
        }),
      });

      // First check if response is HTML (starts with '<')
      // const responseText = await response.text();
      // if (responseText.startsWith('<')) {
      //   throw new Error(
      //     'Server returned HTML instead of JSON. Check API endpoint.',
      //   );
      // }
      // const data = JSON.parse(responseText);
      // console.log(data.user, '------data-----');

      // Properly await AsyncStorage operations
      // await AsyncStorage.setItem('token', data.token);
      // await AsyncStorage.setItem('user', JSON.stringify(data.user));
      // // Now parse as JSON
      // navigation.navigate('Dashboard');
      const responseText = await response.text();
      console.log('Raw API Response:', responseText); // Log the raw response text

      // Check if the response starts with '<', which may indicate HTML instead of JSON
      if (responseText.startsWith('<')) {
        throw new Error(
          'Server returned HTML instead of JSON. Check API endpoint.',
        );
      }

      const data = JSON.parse(responseText);
      console.log('Parsed API Data:', data); // Log the parsed response data

      if (data.token && data.user) {
        await AsyncStorage.setItem('token', data.token);
        await AsyncStorage.setItem('user', JSON.stringify(data.user));
        navigation.navigate('Dashboard');
      } else {
        throw new Error('Invalid response from server');
      }

      setEmail('');
      setPassword('');
    } catch (err) {
      console.error('Login failed:', err);
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  const removeUserData = async () => {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      console.log('User data removed successfully.');
    } catch (error) {
      console.error('Error removing user data:', error);
    }
  };
  const handleLogout = async () => {
    await removeUserData();
    // Navigate to Login screen or handle the logout process
    navigation.navigate('Login');
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Taqamu</Text>
        <Text style={styles.subtitle}>Log in</Text>

        <TextInput
          style={styles.input}
          placeholder="user@taqamu.com"
          placeholderTextColor="#aaa"
          keyboardType="email-address"
          autoCapitalize="none"
          onChangeText={setEmail}
          value={email}
        />

        <TextInput
          style={styles.input}
          placeholder="*******"
          placeholderTextColor="#aaa"
          secureTextEntry
          onChangeText={setPassword}
          value={password}
        />

        {error && <Text style={styles.errorText}>{error}</Text>}

        <TouchableOpacity
          style={styles.button}
          onPress={onSubmit}
          disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => Alert.alert('Reset password link')}>
          <Text style={styles.link}>Forget your password?</Text>
        </TouchableOpacity>

        <View style={styles.separator}>
          <View style={styles.line} />
          <Text style={styles.separatorText}>Don't have an account?</Text>
          <View style={styles.line} />
        </View>

        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.registerButton}
          onPress={() => navigation.navigate('Register')}>
          <Text style={styles.registerText}>Register Now</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: '#0f172a',
  },
  container: {
    backgroundColor: '#0f172a',
    padding: isTablet ? 40 : 20,
    marginHorizontal: isTablet ? '25%' : '5%',
    borderRadius: 12,
  },
  title: {
    fontSize: isTablet ? 42 : 32,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: isTablet ? 22 : 18,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    height: 56,
    backgroundColor: '#333',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 12,
    color: '#fff',
    fontSize: isTablet ? 18 : 16,
  },
  button: {
    height: 56,
    backgroundColor: '#fff',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    color: '#121212',
    fontSize: isTablet ? 20 : 18,
    fontWeight: '600',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
    fontSize: isTablet ? 16 : 14,
  },
  link: {
    color: '#FFD700',
    textAlign: 'center',
    marginTop: 12,
    fontSize: isTablet ? 16 : 14,
  },
  separator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    justifyContent: 'center',
  },
  line: {
    height: 1,
    backgroundColor: '#666',
    width: 50,
  },
  separatorText: {
    color: '#fff',
    marginHorizontal: 10,
    fontSize: isTablet ? 16 : 14,
  },
  registerButton: {
    height: 56,
    borderWidth: 1,
    borderColor: '#FFD700',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  registerText: {
    color: '#FFD700',
    fontSize: isTablet ? 18 : 16,
    fontWeight: '500',
  },
});

export default LoginScreen;
