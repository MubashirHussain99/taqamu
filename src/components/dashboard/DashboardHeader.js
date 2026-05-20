import React, {useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HijriDate from 'hijri-date/lib/safe';
import {DASHBOARD_HEADER_BACKGROUND} from '../../constants/colors';

const DEFAULT_AVATAR =
  'https://img.freepik.com/free-vector/user-circles-set_78370-4704.jpg?ga=GA1.1.171349825.1725884392&semt=ais_hybrid&w=740';

const HIJRI_MONTHS = [
  'Muharram',
  'Safar',
  "Rabi' al-Awwal",
  "Rabi' al-Thani",
  'Jumada al-Awwal',
  'Jumada al-Thani',
  'Rajab',
  "Sha'ban",
  'Ramadan',
  'Shawwal',
  "Dhul-Qi'dah",
  'Dhul-Hijjah',
];

function formatCityArea(fullLocation) {
  if (!fullLocation) return '';

  const parts = fullLocation.split(',').map(p => p.trim());
  const cleanedParts = parts.filter(
    part =>
      !/\b(District|Division|County|Province|State|Taluka|City|Region|Ward)\b/i.test(
        part,
      ),
  );

  const area = cleanedParts[0] || '';
  const city = cleanedParts[1] || '';
  const country = cleanedParts[cleanedParts.length - 1] || '';
  const cityPart = area !== city && city ? `${area} ${city}` : area;

  return `${cityPart}, ${country}`;
}

function capitalize(value) {
  if (!value) return '';
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function getHijriDateString() {
  const today = new HijriDate();
  const monthName = HIJRI_MONTHS[today.getMonthIndex()];
  return `${today.getDate()} ${monthName} ${today.getFullYear()} AH`;
}

export const DashboardHeader = ({
  profile,
  isTablet = false,
  setProfileTrigger,
  onOpenLocationModal,
  profileImageUri = DEFAULT_AVATAR,
  notificationCount = 0,
}) => {
  const navigation = useNavigation();
  const hijriDateString = useMemo(() => getHijriDateString(), []);

  const locationLine = profile
    ? [formatCityArea(profile.city), capitalize(profile.country)]
        .filter(Boolean)
        .join(', ')
    : 'Set your location';

  const avatarUri =
    profile?.photoURL || profile?.profileImage || profileImageUri;

  const handleOpenProfile = () => {
    navigation.navigate('ProfileScreen', {
      profile,
      setProfileTrigger,
    });
  };

  const handleOpenLocation = () => {
    if (typeof onOpenLocationModal === 'function') {
      onOpenLocationModal();
    }
  };

  return (
    <View style={[styles.wrapper, isTablet && styles.wrapperTablet]}>
      <View style={styles.accentLine} />

      <View style={[styles.row, isTablet && styles.rowTablet]}>
        <TouchableOpacity
          onPress={handleOpenProfile}
          activeOpacity={0.85}
          style={styles.avatarButton}
          accessibilityRole="button"
          accessibilityLabel="Edit profile">
          <View style={styles.avatarRing}>
            <Image source={{uri: avatarUri}} style={styles.avatar} />
          </View>
        </TouchableOpacity>

        <View style={styles.center}>
          {/* <Text style={styles.greeting}>As-salamu alaykum</Text>
          <Text style={styles.name} numberOfLines={1}>
            {displayName}
          </Text> */}

          <View style={styles.locationRow}>
            <Ionicons
              name="location-outline"
              size={14}
              color="#6ee7b7"
              style={styles.locationIcon}
            />
            <Text style={styles.locationText} numberOfLines={1}>
              {locationLine}
            </Text>
            <TouchableOpacity
              onPress={handleOpenLocation}
              hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}
              style={styles.editButton}
              accessibilityRole="button"
              accessibilityLabel="Edit location">
              <Ionicons name="create-outline" size={16} color="#34d399" />
            </TouchableOpacity>
          </View>

          <View style={styles.hijriPill}>
            <Ionicons name="moon-outline" size={12} color="#a7f3d0" />
            <Text style={styles.hijriText}>{hijriDateString}</Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate('Notifications')}
          activeOpacity={0.85}
          style={styles.notificationButton}
          accessibilityRole="button"
          accessibilityLabel="Notifications">
          <Ionicons name="notifications-outline" size={22} color="#e2e8f0" />
          {notificationCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {notificationCount > 9 ? '9+' : notificationCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: DASHBOARD_HEADER_BACKGROUND,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
    paddingTop: 12,
    paddingBottom: 14,
    paddingHorizontal: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  wrapperTablet: {
    paddingHorizontal: 32,
    paddingBottom: 20,
  },
  accentLine: {
    position: 'absolute',
    bottom: 0,
    left: 24,
    right: 24,
    height: 2,
    borderRadius: 2,
    backgroundColor: '#10b981',
    opacity: 0.55,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowTablet: {
    paddingVertical: 4,
  },
  avatarButton: {
    marginRight: 12,
  },
  avatarRing: {
    width: 48,
    height: 48,
    borderRadius: 24,
    padding: 2,
    backgroundColor: '#10b981',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: DASHBOARD_HEADER_BACKGROUND,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  greeting: {
    fontSize: 11,
    letterSpacing: 0.4,
    color: '#94a3b8',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: '#f8fafc',
    maxWidth: '100%',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    maxWidth: '100%',
  },
  locationIcon: {
    marginRight: 4,
  },
  locationText: {
    flexShrink: 1,
    color: '#cbd5e1',
    fontSize: 13,
    maxWidth: '78%',
  },
  editButton: {
    marginLeft: 6,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hijriPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    borderWidth: 1,
    borderColor: 'rgba(52, 211, 153, 0.25)',
  },
  hijriText: {
    fontSize: 12,
    color: '#d1fae5',
    fontWeight: '500',
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: DASHBOARD_HEADER_BACKGROUND,
    borderWidth: 1,
    borderColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#ef4444',
    borderWidth: 2,
    borderColor: '#1e293b',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
});
