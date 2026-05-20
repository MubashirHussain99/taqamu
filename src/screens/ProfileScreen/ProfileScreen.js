import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import {APP_BACKGROUND} from '../../styles/screenStyles';
import {DASHBOARD_HEADER_BACKGROUND} from '../../constants/colors';

const DEFAULT_AVATAR =
  'https://img.freepik.com/free-vector/user-circles-set_78370-4704.jpg?ga=GA1.1.171349825.1725884392&semt=ais_hybrid&w=740';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const passedProfile = route.params?.profile || null;
  const setProfileTrigger = route.params?.setProfileTrigger;

  const [profile, setProfile] = useState(passedProfile);
  const [loading, setLoading] = useState(false);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);

      const uid = auth().currentUser?.uid;

      if (!uid) {
        return;
      }

      const doc = await firestore().collection('users').doc(uid).get();

      if (doc.exists) {
        setProfile(doc.data());
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!profile) {
      fetchProfile();
    }
  }, [profile, fetchProfile]);

  const openEdit = () => {
    navigation.navigate('EditProfileModal', {
      profile,
      setProfileTrigger,
    });
  };

  const handleLogout = async () => {
    try {
      await auth().signOut();

      navigation.reset({
        index: 0,
        routes: [{name: 'Login'}],
      });
    } catch (error) {
      Alert.alert('Error', 'Logout failed');
    }
  };

  const avatarUri =
    profile?.photoURL || profile?.profileImage || DEFAULT_AVATAR;

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#10b981" />
      </View>
    );
  }

  const renderRow = (icon, label, value) => {
    return (
      <View style={styles.row}>
        <View style={styles.rowLeft}>
          <Ionicons name={icon} size={20} color="#10b981" />
          <Text style={styles.rowLabel}>{label}</Text>
        </View>

        <Text style={styles.rowValue}>{value || '—'}</Text>
      </View>
    );
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.heading}>My Profile</Text>

        <View style={{width: 40}} />
      </View>

      {/* Profile Card */}
      <View style={styles.profileCard}>
        <View style={styles.avatarContainer}>
          <Image source={{uri: avatarUri}} style={styles.avatar} />
        </View>

        <Text style={styles.name}>{profile?.name || 'User'}</Text>

        <Text style={styles.email}>
          {profile?.email || auth().currentUser?.email}
        </Text>

        {/* Edit Profile Button */}
        <TouchableOpacity style={styles.editButton} onPress={openEdit}>
          <Ionicons name="create-outline" size={18} color="#042f2e" />

          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Info Section */}
      <View style={styles.infoContainer}>
        {renderRow(
          'mail-outline',
          'Email',
          profile?.email || auth().currentUser?.email,
        )}

        {renderRow('call-outline', 'Phone', profile?.phone)}

        {renderRow(
          'location-outline',
          'Location',
          profile?.city
            ? `${profile?.city}, ${profile?.country || ''}`
            : 'Not Set',
        )}

        {renderRow('document-text-outline', 'Bio', profile?.bio)}
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color="#fff" />

        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: APP_BACKGROUND,
    padding: 20,
    paddingBottom: 40,
  },

  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: APP_BACKGROUND,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: DASHBOARD_HEADER_BACKGROUND,
    justifyContent: 'center',
    alignItems: 'center',
  },

  heading: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
  },

  profileCard: {
    backgroundColor: DASHBOARD_HEADER_BACKGROUND,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
  },

  avatarContainer: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: '#10b981',
    padding: 4,
    marginBottom: 14,
  },

  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 55,
  },

  name: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
    marginTop: 6,
  },

  email: {
    color: '#94a3b8',
    marginTop: 4,
    fontSize: 14,
  },

  editButton: {
    marginTop: 18,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#34d399',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 12,
  },

  editButtonText: {
    color: '#042f2e',
    fontWeight: '700',
    marginLeft: 8,
    fontSize: 15,
  },

  infoContainer: {
    backgroundColor: DASHBOARD_HEADER_BACKGROUND,
    borderRadius: 18,
    padding: 16,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },

  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  rowLabel: {
    color: '#cbd5e1',
    marginLeft: 10,
    fontSize: 15,
    fontWeight: '600',
  },

  rowValue: {
    color: '#fff',
    fontSize: 14,
    maxWidth: '55%',
    textAlign: 'right',
  },

  logoutButton: {
    marginTop: 28,
    backgroundColor: '#ef4444',
    borderRadius: 14,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
});
