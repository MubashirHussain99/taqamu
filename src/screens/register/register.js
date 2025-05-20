import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ScrollView,
  Dimensions,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const RegisterScreen = () => {
  const navigation = useNavigation();
  const [form, setForm] = useState({
    name: '',
    email: '',
    country: '',
    city: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const validateForm = () => {
    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      return 'Please fill all required fields.';
    }
    if (form.password !== form.confirmPassword) {
      return 'Passwords do not match.';
    }
    // You can add more validations like email format here
    return null;
  };

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
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
      const API_URL = Platform.select({
        android: 'https://taqamu-backend.vercel.app/api',
        ios: 'https://taqamu-backend.vercel.app/api',
        default: 'https://taqamu-backend.vercel.app/api',
      });

      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          country: form.country,
          city: form.city,
          password: form.password,
        }),
      });

      const responseText = await response.text();
      console.log('Raw server response:', responseText);

      if (responseText.startsWith('<')) {
        throw new Error('Server returned HTML instead of JSON.');
      }

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (jsonError) {
        throw new Error('Invalid JSON from server.');
      }

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed.');
      }

      console.log('✅ Registration successful:', data);
      navigation.navigate('Login');
    } catch (err) {
      console.error('❌ Registration failed:', err);
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Taqamu</Text>
      <Text style={styles.subtitle}>Create an account</Text>

      {['name', 'email', 'country', 'city', 'password', 'confirmPassword'].map(
        field => (
          <TextInput
            key={field}
            placeholder={
              field === 'confirmPassword'
                ? 'Confirm Password'
                : field[0].toUpperCase() + field.slice(1)
            }
            placeholderTextColor="#aaa"
            secureTextEntry={field.includes('password', 'confirmPassword')}
            value={form[field]}
            onChangeText={text => handleChange(field, text)}
            style={styles.input}
          />
        ),
      )}

      {error && <Text style={styles.error}>{error}</Text>}

      <TouchableOpacity
        style={styles.button}
        onPress={onSubmit}
        disabled={isLoading}>
        <Text style={styles.buttonText}>
          {isLoading ? 'Creating Account...' : 'Register'}
        </Text>
      </TouchableOpacity>

      <Text style={styles.loginText}>
        Already have an account?{' '}
        <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
          Login
        </Text>
      </Text>
    </ScrollView>
  );
};

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#0f172a',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100%',
  },
  title: {
    fontSize: 36,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 20,
    color: 'white',
    marginBottom: 20,
  },
  input: {
    width: screenWidth > 768 ? 500 : '100%',
    height: 50,
    backgroundColor: '#333',
    borderRadius: 6,
    paddingHorizontal: 16,
    color: 'white',
    marginBottom: 14,
  },
  button: {
    backgroundColor: '#fff',
    paddingVertical: 14,
    borderRadius: 6,
    width: screenWidth > 768 ? 500 : '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#1e1e1e',
    fontSize: 16,
    fontWeight: '600',
  },
  error: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
  loginText: {
    color: '#fff',
    marginTop: 20,
    fontSize: 14,
  },
  link: {
    color: 'yellow',
    textDecorationLine: 'underline',
  },
});

export default RegisterScreen;
