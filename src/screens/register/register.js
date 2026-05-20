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
  Image,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {APP_BACKGROUND} from '../../styles/screenStyles';

const RegisterScreen = () => {
  const navigation = useNavigation();
  const [profilePhoto, setProfilePhoto] = useState(null);
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

  const handleSelectPhoto = () => {
    Alert.alert(
      'Add profile photo',
      'Photo upload is not enabled in this version yet. You can add it later from your profile.',
    );
  };

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

  console.log(auth().app.name);

  const handleChange = (key, value) => {
    setForm({...form, [key]: value});
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
      // 1. CREATE AUTH USER
      const response = await auth().createUserWithEmailAndPassword(
        form.email.trim(),
        form.password,
      );

      const uid = response.user.uid;

      // 2. UPDATE AUTH PROFILE
      await response.user.updateProfile({
        displayName: form.name,
        photoURL: profilePhoto || null,
      });

      // 3. CREATE FIRESTORE PROFILE (🔥 THIS WAS MISSING)
      await firestore()
        .collection('users')
        .doc(uid)
        .set({
          uid: uid,
          name: form.name,
          email: form.email.trim(),
          country: form.country,
          city: form.city,
          photoURL: profilePhoto || null,
          createdAt: firestore.FieldValue.serverTimestamp(),
        });

      console.log('✅ User + Profile created');

      navigation.navigate('Login');
    } catch (err) {
      console.log('Firebase Error:', err);

      let message = 'Registration failed. Please try again.';

      if (err.code === 'auth/email-already-in-use') {
        message = 'Email already exists';
      }

      if (err.code === 'auth/invalid-email') {
        message = 'Invalid email address';
      }

      if (err.code === 'auth/weak-password') {
        message = 'Password should be at least 6 characters';
      }

      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled">
      <View style={styles.formWrapper}>
        <Text style={styles.title}>Taqamu</Text>
        <Text style={styles.subtitle}>Create an account</Text>

        <View style={styles.photoSection}>
          <TouchableOpacity
            style={styles.photoButton}
            onPress={handleSelectPhoto}
            activeOpacity={0.8}>
            {profilePhoto ? (
              <Image source={{uri: profilePhoto}} style={styles.photoImage} />
            ) : (
              <View style={styles.photoPlaceholder}>
                <Text style={styles.photoPlus}>+</Text>
              </View>
            )}
            <Text style={styles.photoLabel}>Profile photo</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <TextInput
            placeholder="Name"
            placeholderTextColor="#aaa"
            value={form.name}
            onChangeText={text => handleChange('name', text)}
            style={[styles.input, styles.inputHalf, styles.inputLeft]}
          />
          <TextInput
            placeholder="Email"
            placeholderTextColor="#aaa"
            keyboardType="email-address"
            autoCapitalize="none"
            value={form.email}
            onChangeText={text => handleChange('email', text)}
            style={[styles.input, styles.inputHalf, styles.inputRight]}
          />
        </View>

        <View style={styles.row}>
          <TextInput
            placeholder="Country"
            placeholderTextColor="#aaa"
            value={form.country}
            onChangeText={text => handleChange('country', text)}
            style={[styles.input, styles.inputHalf, styles.inputLeft]}
          />
          <TextInput
            placeholder="City"
            placeholderTextColor="#aaa"
            value={form.city}
            onChangeText={text => handleChange('city', text)}
            style={[styles.input, styles.inputHalf, styles.inputRight]}
          />
        </View>

        <TextInput
          placeholder="Password"
          placeholderTextColor="#aaa"
          secureTextEntry
          value={form.password}
          onChangeText={text => handleChange('password', text)}
          style={styles.input}
        />

        <TextInput
          placeholder="Confirm Password"
          placeholderTextColor="#aaa"
          secureTextEntry
          value={form.confirmPassword}
          onChangeText={text => handleChange('confirmPassword', text)}
          style={styles.input}
        />

        {error && <Text style={styles.error}>{error}</Text>}

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={onSubmit}
          disabled={isLoading}>
          <Text style={styles.buttonText}>
            {isLoading ? 'Creating Account...' : 'Register'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.loginText}>
          Already have an account?{' '}
          <Text
            style={styles.link}
            onPress={() => navigation.navigate('Login')}>
            Login
          </Text>
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: APP_BACKGROUND,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100%',
  },
  formWrapper: {
    width: '100%',
    maxWidth: 560,
  },
  title: {
    fontSize: 36,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20,
    color: 'white',
    marginBottom: 24,
    textAlign: 'center',
  },
  photoSection: {
    marginBottom: 24,
    alignItems: 'center',
    width: '100%',
  },
  photoButton: {
    alignItems: 'center',
  },
  photoPlaceholder: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#0d4236',
    borderWidth: 2,
    borderColor: '#34d399',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  photoPlus: {
    color: '#34d399',
    fontSize: 34,
    lineHeight: 36,
  },
  photoImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 10,
  },
  photoLabel: {
    color: '#cbd5e1',
    fontSize: 14,
  },
  row: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  input: {
    backgroundColor: '#333',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 14 : 12,
    color: 'white',
    marginBottom: 14,
    minHeight: 50,
    borderWidth: 1,
    borderColor: '#34d399',
  },
  inputHalf: {
    // flexBasis: '45%',
    minWidth: '47.5%',
    borderWidth: 1,
    borderColor: '#34d399',
  },
  inputLeft: {
    marginRight: 8,
  },
  inputRight: {
    marginLeft: 8,
  },
  button: {
    backgroundColor: '#fff',
    paddingVertical: 14,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.7,
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
    textAlign: 'center',
  },
  link: {
    color: 'yellow',
    textDecorationLine: 'underline',
  },
});

export default RegisterScreen;
