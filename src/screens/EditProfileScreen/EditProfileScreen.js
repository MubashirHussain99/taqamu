import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  ActivityIndicator,
  Platform,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {APP_BACKGROUND} from '../../styles/screenStyles';
import {DASHBOARD_HEADER_BACKGROUND} from '../../constants/colors';

const DEFAULT_AVATAR =
  'https://img.freepik.com/free-vector/user-circles-set_78370-4704.jpg?ga=GA1.1.171349825.1725884392&semt=ais_hybrid&w=740';

const EditProfileScreen = ({route}) => {
  const navigation = useNavigation();
  const {profile, setProfileTrigger} = route.params || {};

  const [name, setName] = useState(profile?.name || '');
  const [email, setEmail] = useState(profile?.email || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setName(profile.name || '');
      setEmail(profile.email || auth().currentUser?.email || '');
      setPhone(profile.phone || '');
      setBio(profile.bio || '');
    }
  }, [profile]);

  const avatarUri =
    profile?.photoURL || profile?.profileImage || DEFAULT_AVATAR;

  const locationDisplay =
    profile?.city && profile?.country
      ? `${profile.city}, ${profile.country}`
      : 'Not set — use the location icon on the home screen';

  const handleUpdate = async () => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      Alert.alert('Name required', 'Please enter your name.');
      return;
    }

    if (!trimmedEmail) {
      Alert.alert('Email required', 'Please enter your email.');
      return;
    }

    setSaving(true);
    try {
      const uid = auth().currentUser?.uid;
      if (!uid) {
        throw new Error('You must be signed in to update your profile.');
      }

      await firestore().collection('users').doc(uid).update({
        name: trimmedName,
        email: trimmedEmail,
        phone: phone.trim(),
        bio: bio.trim(),
      });

      const currentUser = auth().currentUser;
      if (currentUser && currentUser.displayName !== trimmedName) {
        await currentUser.updateProfile({displayName: trimmedName});
      }

      if (typeof setProfileTrigger === 'function') {
        setProfileTrigger(prev => !prev);
      }

      navigation.goBack();
    } catch (error) {
      console.log(error);
      Alert.alert('Error', error.message || 'Could not update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled">
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Go back">
          <Ionicons name="arrow-back" size={22} color="#e2e8f0" />
        </TouchableOpacity>
        <Text style={styles.heading}>Edit Profile</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.avatarSection}>
        <View style={styles.avatarRing}>
          <Image source={{uri: avatarUri}} style={styles.avatar} />
        </View>
        <Text style={styles.avatarHint}>Profile photo updates coming soon</Text>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Your name"
          placeholderTextColor="#64748b"
          autoCapitalize="words"
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="your@email.com"
          placeholderTextColor="#64748b"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Phone (optional)</Text>
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          placeholder="Phone number"
          placeholderTextColor="#64748b"
          keyboardType="phone-pad"
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Bio (optional)</Text>
        <TextInput
          style={[styles.input, styles.bioInput]}
          value={bio}
          onChangeText={setBio}
          placeholder="A short note about you"
          placeholderTextColor="#64748b"
          multiline
          numberOfLines={3}
          textAlignVertical="top"
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Location</Text>
        <View style={styles.locationReadOnly}>
          <Ionicons name="location-outline" size={18} color="#34d399" />
          <Text style={styles.locationText}>{locationDisplay}</Text>
        </View>
        <Text style={styles.locationHint}>
          Tap the edit icon next to your location on the dashboard to change it.
        </Text>
      </View>

      {profile?.createdAt && (
        <View style={styles.metaRow}>
          <Ionicons name="calendar-outline" size={16} color="#94a3b8" />
          <Text style={styles.metaText}>
            Member since{' '}
            {new Date(profile.createdAt?.toDate?.() || profile.createdAt).toLocaleDateString()}
          </Text>
        </View>
      )}

      <TouchableOpacity
        onPress={handleUpdate}
        style={[styles.saveButton, saving && styles.saveButtonDisabled]}
        disabled={saving}
        activeOpacity={0.85}>
        {saving ? (
          <ActivityIndicator size="small" color={DASHBOARD_HEADER_BACKGROUND} />
        ) : (
          <Text style={styles.saveButtonText}>Save Profile</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: APP_BACKGROUND,
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: DASHBOARD_HEADER_BACKGROUND,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    fontSize: 22,
    fontWeight: '700',
    color: '#f8fafc',
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 28,
  },
  avatarRing: {
    width: 96,
    height: 96,
    borderRadius: 48,
    padding: 3,
    backgroundColor: '#10b981',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: DASHBOARD_HEADER_BACKGROUND,
  },
  avatarHint: {
    marginTop: 10,
    fontSize: 12,
    color: '#94a3b8',
  },
  field: {
    marginBottom: 18,
  },
  label: {
    fontWeight: '600',
    color: '#e2e8f0',
    marginBottom: 8,
    fontSize: 14,
  },
  input: {
    backgroundColor: DASHBOARD_HEADER_BACKGROUND,
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 14 : 12,
    color: '#f8fafc',
    fontSize: 16,
  },
  bioInput: {
    minHeight: 88,
    paddingTop: 12,
  },
  locationReadOnly: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: DASHBOARD_HEADER_BACKGROUND,
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 10,
    padding: 14,
  },
  locationText: {
    flex: 1,
    color: '#cbd5e1',
    fontSize: 14,
  },
  locationHint: {
    marginTop: 8,
    fontSize: 12,
    color: '#94a3b8',
    lineHeight: 18,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 24,
  },
  metaText: {
    color: '#94a3b8',
    fontSize: 13,
  },
  saveButton: {
    backgroundColor: '#10b981',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    color: DASHBOARD_HEADER_BACKGROUND,
    fontWeight: '700',
    fontSize: 16,
  },
});

export default EditProfileScreen;
