import React, {use, useState} from 'react';
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Platform,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const EditProfileScreen = ({route}) => {
    const navigation = useNavigation();
  const {profile, setProfileTrigger} = route.params;

  const [name, setName] = useState(profile?.name || '');
  const [email, setEmail] = useState(profile?.email || '');
  const [city, setCity] = useState(profile?.city || '');
  const [country, setCountry] = useState(profile?.country || '');
  const [password, setPassword] = useState('');

  const API_URL = Platform.select({
    android: 'https://taqamu-backend.vercel.app/api',
    ios: 'https://taqamu-backend.vercel.app/api',
    default: 'https://taqamu-backend.vercel.app/api',
  });

  const handleUpdate = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      if (!token) {
        Alert.alert('Error', 'Token not found');
        return;
      }

      const updateData = {
        name,
        email,
        city,
        country,
        ...(password ? {password} : {}), // include password only if not empty
      };

      console.log('Sending update data:', updateData);

      const response = await fetch(`${API_URL}/auth/update-user/${profile?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      const responseText = await response.text();
      console.log('Response:', responseText);

      if (!response.ok) {
        throw new Error(responseText || 'Update failed');
      }

      // Trigger a re-fetch of the profile data
      setProfileTrigger(true);

      Alert.alert('Success', 'Profile updated successfully', [
        {text: 'OK', onPress: () => navigation.navigate("Dashboard")},
      ]);
    } catch (err) {
      console.error('Update error:', err.message);
      Alert.alert('Error', err.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Dashboard");
          }}>
          <Text>❌</Text>
        </TouchableOpacity>
        <Text style={styles.heading}>Update Profile</Text>
      </View>

      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Name"
        placeholderTextColor="#bbb"
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        placeholderTextColor="#bbb"
      />

      <Text style={styles.label}>City</Text>
      <TextInput
        style={styles.input}
        value={city}
        onChangeText={setCity}
        placeholder="City"
        placeholderTextColor="#bbb"
      />

      <Text style={styles.label}>Country</Text>
      <TextInput
        style={styles.input}
        value={country}
        onChangeText={setCountry}
        placeholder="Country"
        placeholderTextColor="#bbb"
      />

      <Text style={styles.label}>Password (optional)</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
        placeholderTextColor="#bbb"
      />

      <Button title="Update Profile" onPress={handleUpdate} color="#1E90FF" />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#1E1E1E',
    height: '100%',
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  heading: {
    flex: 1,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  label: {
    marginBottom: 5,
    fontWeight: 'bold',
    color: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 15,
    padding: 10,
    borderRadius: 5,
    color: '#fff',
    backgroundColor: '#333',
  },
});

export default EditProfileScreen;
