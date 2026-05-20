import React, {useState} from 'react';
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
import auth from '@react-native-firebase/auth';
import {saveUserSession} from '../../services/authService';
import {APP_BACKGROUND} from '../../styles/screenStyles';

const {width} = Dimensions.get('window');
const isTablet = width >= 768;

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  const validateForm = () => {
    if (!email || !password) {
      return 'Please fill all required fields.';
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
      const userCredential = await auth().signInWithEmailAndPassword(
        email.trim(),
        password,
      );

      await saveUserSession(userCredential.user);

      console.log('Login Success:', userCredential.user.email);

      navigation.replace('Dashboard');

      setEmail('');
      setPassword('');
    } catch (err) {
      console.log('Firebase Login Error:', err);

      let message = 'Login failed. Please try again.';

      if (err.code === 'auth/user-not-found') {
        message = 'No user found with this email';
      } else if (
        err.code === 'auth/wrong-password' ||
        err.code === 'auth/invalid-credential'
      ) {
        message = 'Incorrect email or password';
      } else if (err.code === 'auth/invalid-email') {
        message = 'Invalid email address';
      } else if (err.code === 'auth/too-many-requests') {
        message = 'Too many attempts. Please try again later.';
      }

      setError(message);
    } finally {
      setIsLoading(false);
    }
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
    backgroundColor: APP_BACKGROUND,
  },
  container: {
    backgroundColor: APP_BACKGROUND,
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
