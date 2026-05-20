import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  Dimensions,
  Platform,
  StatusBar,
} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {logoutUser} from '../../services/authService';
import PrayerTimes from '../../components/dashboard/PrayersTime';
import RandomAyahOfTheDay from '../../components/dashboard/RandomAyahOfTheDay';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
// Note: You'll need to install these dependencies:
// @react-navigation/native, @react-navigation/stack, react-native-svg, react-native-vector-icons
import DhikrCounter from '../../components/dashboard/DhikrCounter';
import {DashboardHeader} from '../../components/dashboard/DashboardHeader';
import {LocationModal} from '../../components/dashboard/LocationModal';
import CharityCampaign from '../../components/dashboard/CharityCampaign';
import HadithOfTheDay from '../../components/dashboard/HadithOfTheDaym';
import SupportGuidance from '../../components/dashboard/SupportGuidance';
import RootNavigator, {
  useBottomTabBarInset,
} from '../../components/dashboard/BottomNavigation';
import {Button} from 'react-native';
import Charity from '../../components/dashboard/Charity';
import NotificationTester from '../../components/notification_fix/NotificationTester';
import {APP_BACKGROUND} from '../../styles/screenStyles';
import {DASHBOARD_HEADER_BACKGROUND} from '../../constants/colors';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {getDailyNotificationCount} from '../../services/notificationHistory';

// Get today's Islamic date
// const todayHijri = new HijriDate();

// // Array of month names in Arabic
// const months = [
//   'Muharram',
//   'Safar',
//   'Rabi’ al-Awwal',
//   'Rabi’ al-Thani',
//   'Jumada al-Awwal',
//   'Jumada al-Thani',
//   'Rajab',
//   'Sha’ban',
//   'Ramadan',
//   'Shawwal',
//   'Dhul-Qi’dah',
//   'Dhul-Hijjah',
// ];

// const hijriDateString = `${todayHijri.getDate()} ${
//   months[todayHijri.getMonth()]
// } ${todayHijri.getFullYear()} AH`;

// Mock data (same as your original)
const user = {
  id: 1,
  name: 'John Doe',
  location: 'Dublin, Ireland',
  hijriDate: 'Shawwal 17, 1446 AH',
  profileImage:
    'https://img.freepik.com/free-vector/user-circles-set_78370-4704.jpg?ga=GA1.1.171349825.1725884392&semt=ais_hybrid&w=740',
  streakDays: 3,
  dhikrCount: 0,
};

const dailyGoals = [
  {id: 1, title: 'Prayed Fajr', completed: true},
  {id: 2, title: 'Read Quran (1 Pages)', completed: true},
  {
    id: 3,
    title: 'Do Dhikr (Subhan Allah)',
    completed: false,
    progress: {current: 0, total: 33},
  },
  {id: 4, title: 'Recite Duas', completed: false},
];

const dhikrTypes = [
  {
    id: 1,
    name: 'Subhan Allah',
    arabic: 'سبحان الله',
    targetCount: 33,
  },
  {
    id: 2,
    name: 'Alhamdulillah',
    arabic: 'الحمد لله',
    targetCount: 33,
  },
  {
    id: 3,
    name: 'Allahu Akbar',
    arabic: 'الله أكبر',
    targetCount: 34,
  },
  {
    id: 4,
    name: 'La ilaha illallah',
    arabic: 'لا إله إلا الله',
    targetCount: 33,
  },
];

const charityCampaigns = [
  {
    id: 1,
    title: 'Feed 10 families',
    fundedPercentage: 56,
    image:
      'https://icons.iconarchive.com/icons/pictogrammers/material/256/charity-icon.png',
  },
  {
    id: 2,
    title: 'Feed 10 families',
    fundedPercentage: 75,
    image:
      'https://icons.iconarchive.com/icons/pictogrammers/material/256/charity-icon.png',
  },
  {
    id: 3,
    title: 'Feed 10 families',
    fundedPercentage: 43,
    image:
      'https://icons.iconarchive.com/icons/pictogrammers/material/256/charity-icon.png',
  },
];

const questionItems = [
  {
    id: 'question-1',
    title: 'How to perform Wudu',
    icon: 'prayer',
  },
  {
    id: 'question-2',
    title: 'How to perform Tayammum',
    icon: 'prayer',
  },
  {
    id: 'question-3',
    title: 'How to recite Surah Al-Fatiha',
    icon: 'quran',
  },
  {
    id: 'question-4',
    title: 'How to make Dua for protection',
    icon: 'dua',
  },
];

const hadiths = [
  {
    hadithText:
      'Whoever guides someone to virtue will be rewarded equivalent to him who practices that good action.',
    narrator: "Abu Mas'ud",
    source: 'Sahih Muslim',
  },
  {
    hadithText:
      'The best among you are those who have the best manners and character.',
    narrator: 'Aisha (RA)',
    source: 'Sahih Bukhari',
  },
  {
    hadithText:
      'Make things easy and do not make them difficult, cheer the people up by conveying glad tidings to them and do not repulse (them).',
    narrator: 'Anas bin Malik',
    source: 'Sahih Bukhari',
  },
  {
    hadithText:
      'None of you truly believes until he loves for his brother what he loves for himself.',
    narrator: 'Anas',
    source: 'Sahih Muslim',
  },
  {
    hadithText: 'He who does not thank people, does not thank Allah.',
    narrator: 'Abu Huraira',
    source: 'Tirmidhi',
  },
  {
    hadithText:
      'The strong is not the one who overcomes the people by his strength, but the strong is the one who controls himself while in anger.',
    narrator: 'Abu Huraira',
    source: 'Sahih Bukhari',
  },
  {
    hadithText:
      'Whoever believes in Allah and the Last Day should speak good or remain silent.',
    narrator: 'Abu Huraira',
    source: 'Sahih Bukhari & Muslim',
  },
  {
    hadithText:
      'Part of someone being a good Muslim is leaving alone that which does not concern him.',
    narrator: 'Abu Huraira',
    source: 'Tirmidhi',
  },
  {
    hadithText:
      'A Muslim is the one from whose tongue and hand the Muslims are safe.',
    narrator: 'Abdullah bin Amr',
    source: 'Sahih Bukhari',
  },
  {
    hadithText: 'Pay the worker his wages before his sweat has dried.',
    narrator: 'Abdullah ibn Umar',
    source: 'Ibn Majah',
  },
  {
    hadithText: 'Feed the hungry, visit the sick, and free the captives.',
    narrator: "Abu Musa Al-Ash'ari",
    source: 'Sahih Bukhari',
  },
  {
    hadithText:
      'Beware! There is a piece of flesh in the body, and if it becomes good, the whole body becomes good; but if it becomes corrupt, the whole body becomes corrupt. That piece is the heart.',
    narrator: "Nu'man bin Bashir",
    source: 'Sahih Bukhari',
  },
  {
    hadithText:
      'Do not be people without minds of your own, saying that if others treat you well, you will treat them well, and that if they do wrong, you will do wrong. Instead, accustom yourselves to do good if people do good and not to do wrong if they do evil.',
    narrator: 'Hudhaifah',
    source: 'Tirmidhi',
  },
  {
    hadithText:
      'The most beloved of people to Allah are those who are most beneficial to people.',
    narrator: 'Abdullah ibn Umar',
    source: 'Daraqutni',
  },
  {
    hadithText: 'The one who severs ties of kinship will not enter Paradise.',
    narrator: "Jubair bin Mut'im",
    source: 'Sahih Bukhari & Muslim',
  },
  {
    hadithText: 'There is reward for kindness to every living thing.',
    narrator: 'Abu Huraira',
    source: 'Sahih Bukhari',
  },
  {
    hadithText:
      'None of you should wish for death because of a calamity befalling him, but if he has to wish for death, he should say: O Allah! Keep me alive as long as life is better for me, and let me die if death is better for me.',
    narrator: 'Anas bin Malik',
    source: 'Sahih Bukhari',
  },
  {
    hadithText: 'A believer is not stung twice from the same hole.',
    narrator: 'Abu Huraira',
    source: 'Sahih Bukhari',
  },
  {
    hadithText: 'Give gifts and you will love one another.',
    narrator: 'Abu Huraira',
    source: 'Bukhari in Al-Adab Al-Mufrad',
  },
  {
    hadithText:
      'Allah does not look at your appearance or your possessions but He looks at your heart and your deeds.',
    narrator: 'Abu Huraira',
    source: 'Sahih Muslim',
  },
];

const Dashboard = () => {
  const navigation = useNavigation();
  const [completedGoals, setCompletedGoals] = useState(
    dailyGoals.filter(goal => goal.completed).length,
  );

  const [token, setToken] = useState(null);
  const [userlocal, setUserlocal] = useState(null);
  const [dhikrCount, setDhikrCount] = useState(0);
  const [currentDhikrIndex, setCurrentDhikrIndex] = useState(0);
  const [completedDhikrs, setCompletedDhikrs] = useState([]);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [userLocation, setUserLocation] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const [city, setCity] = useState(null);
  const [country, setCountry] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  // const token = ''; // Get from your auth system

  console.log('profile', profile);

  const currentDhikr = dhikrTypes[currentDhikrIndex];
  const {width} = Dimensions.get('window');
  const isTablet = width >= 768;
  const tabBarInset = useBottomTabBarInset();
  const insets = useSafeAreaInsets();
  const [showCharity, setShowCharity] = useState(false);
  const [profileTrigger, setProfileTrigger] = useState(true);
  const [notificationCount, setNotificationCount] = useState(0);

  const refreshNotificationCount = useCallback(async () => {
    const count = await getDailyNotificationCount();
    setNotificationCount(count);
  }, []);

  const fetchProfile = useCallback(async () => {
    try {
      const currentUser = auth().currentUser;

      if (!currentUser?.uid) {
        console.log('No authenticated user yet');
        return;
      }

      const userDoc = await firestore()
        .collection('users')
        .doc(currentUser.uid)
        .get();

      if (userDoc.exists) {
        setProfile(userDoc.data());
      } else {
        setError('Profile not found in Firestore');
      }
    } catch (err) {
      console.log('Profile Error:', err);
      setError('Failed to load profile');
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [profileTrigger, fetchProfile]);

  useFocusEffect(
    useCallback(() => {
      fetchProfile();
      refreshNotificationCount();
      const interval = setInterval(refreshNotificationCount, 15000);
      return () => clearInterval(interval);
    }, [fetchProfile, refreshNotificationCount]),
  );

  useEffect(() => {
    const fetchAuthData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        const storedUser = await AsyncStorage.getItem('user');

        setToken(storedToken);
        setUserlocal(storedUser ? JSON.parse(storedUser) : null);
      } catch (error) {
        console.error('Error fetching token/user from AsyncStorage:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAuthData();
  }, []);
  const handleDhikrCountChange = count => {
    setDhikrCount(count);

    let newCompletedDhikrs = completedDhikrs;

    const dhikrCompleted =
      count >= currentDhikr.targetCount &&
      !completedDhikrs.includes(currentDhikr.id);

    if (dhikrCompleted) {
      newCompletedDhikrs = [...completedDhikrs, currentDhikr.id];
      setCompletedDhikrs(newCompletedDhikrs);

      if (currentDhikrIndex < dhikrTypes.length - 1) {
        setCurrentDhikrIndex(currentDhikrIndex + 1);
        setDhikrCount(0);
      }
    }

    const updatedGoals = dailyGoals.map(goal => {
      if (goal.title.toLowerCase().includes('dhikr')) {
        if (dhikrCompleted || newCompletedDhikrs.includes(currentDhikr.id)) {
          goal.completed = true;
        }
        goal.progress = {
          current: count,
          total: currentDhikr.targetCount,
        };
      }
      return goal;
    });

    setCompletedGoals(updatedGoals.filter(goal => goal.completed).length);
  };

  const toggleGoalCompletion = id => {
    const updatedGoals = dailyGoals.map(goal => {
      if (goal.id === id) {
        goal.completed = !goal.completed;
      }
      return goal;
    });
    setCompletedGoals(updatedGoals.filter(goal => goal.completed).length);
  };

  // const handleLogout = () => {
  //   // Implement logout logic
  //   navigation.navigate('Login');
  //   setIsSidebarOpen(false);
  // };

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigation.reset({
        index: 0,
        routes: [{name: 'Login'}],
      });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % hadiths.length);
  };

  function extractCity(fullLocation) {
    if (!fullLocation) return '';
    const parts = fullLocation.split(',').map(p => p.trim());
    if (parts.length < 2) return fullLocation;

    // The second part is usually the city but might have extra words
    let city = parts[1];

    // Remove common suffixes like City Taluka, District, Division, City
    city = city
      .replace(/\b(City Taluka|Taluka|District|Division|City)\b/gi, '')
      .trim();

    return city;
  }

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.headerWrap,
          {
            marginTop: -insets.top,
            paddingTop: insets.top,
          },
        ]}>
        <StatusBar
          barStyle="light-content"
          backgroundColor={DASHBOARD_HEADER_BACKGROUND}
          translucent={Platform.OS === 'android'}
        />
        <DashboardHeader
          profile={profile}
          isTablet={isTablet}
          setProfileTrigger={setProfileTrigger}
          onOpenLocationModal={() => setShowLocationModal(true)}
          profileImageUri={user.profileImage}
          notificationCount={notificationCount}
        />
      </View>

      <ScrollView
        style={{flex: 1}}
        contentContainerStyle={[
          styles.content,
          isTablet && styles.contentTablet,
          {paddingBottom: tabBarInset},
        ]}>
        {/* <NotificationTester /> */}
        {/* Prayer Times - Implement as separate component */}
        {/* <PrayerTimes
          // city={profile?.city}
          city={extractCity(profile?.city)}
          country={profile?.country}
          variant="compact"
        /> */}

        {profile?.city && profile?.country && (
          <PrayerTimes
            key={`${profile.city}|${profile.country}`}
            city={profile.city}
            country={profile.country}
            variant="compact"
          />
        )}

        {/* Feature Icons */}
        <View style={[styles.section, isTablet && styles.sectionTablet]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your Features</Text>
            {/* <TouchableOpacity onPress={() => navigation.navigate('Features')}>
              <Text style={styles.viewAll}>View All →</Text>
            </TouchableOpacity> */}
          </View>

          <View
            style={[
              styles.featuresGrid,
              isTablet && styles.featuresGridTablet,
            ]}>
            {['Qibla', 'Duas', 'Tasbih', 'Zakat', 'Ummah'].map(
              (feature, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.featureItem,
                    isTablet && styles.featureItemTablet,
                  ]}
                  onPress={() => {
                    if (feature === 'Qibla') {
                      navigation.navigate('QiblaDirection');
                    } else if (feature === 'Duas') {
                      navigation.navigate('Duas');
                    } else if (feature === 'Tasbih') {
                      navigation.navigate('Tasbih');
                    } else if (feature === 'Zakat') {
                      navigation.navigate('Zakat');
                    } else if (feature === 'Ummah') {
                      navigation.navigate('UmmahApp');
                    }
                  }}>
                  <View style={styles.featureIcon}>
                    <Text style={styles.featureIconText}>
                      {['🕋', '🙏', '📿', '💰', '👥'][index]}
                    </Text>
                  </View>
                  <Text style={styles.featureText}>{feature}</Text>
                </TouchableOpacity>
              ),
            )}
          </View>
        </View>

        {/* Ayah of the Day - Implement as separate component */}
        <RandomAyahOfTheDay variant="dark" />

        {/* Daily Goals */}
        <View style={[styles.section, isTablet && styles.sectionTablet]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Daily Goals</Text>
            <View style={styles.goalsStatus}>
              <View style={styles.statusIndicator} />
              <Text style={styles.completedText}>
                {completedGoals}/{dailyGoals.length} completed
              </Text>
            </View>
          </View>

          <View style={[styles.goalsGrid, isTablet && styles.goalsGridTablet]}>
            {dailyGoals.map(goal => (
              <TouchableOpacity
                key={goal.id}
                style={[
                  styles.goalCard,
                  goal.completed && styles.goalCardCompleted,
                ]}
                onPress={() => toggleGoalCompletion(goal.id)}>
                <Text style={styles.goalText}>{goal.title}</Text>
                {goal.completed ? (
                  <Text style={styles.checkmark}>✓</Text>
                ) : (
                  <Text style={styles.unchecked}>○</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Dhikr of the Day */}
        <View style={[styles.section, isTablet && styles.sectionTablet]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Dhikr of the Day</Text>
            <Text style={styles.subtitle}>
              {completedDhikrs.length > 0
                ? `${completedDhikrs.length} of ${dhikrTypes.length} completed`
                : 'Complete your daily Dhikr'}
            </Text>
          </View>

          <View
            style={[
              styles.dhikrContainer,
              isTablet && styles.dhikrContainerTablet,
            ]}>
            <View
              style={[styles.streakCard, isTablet && styles.streakCardTablet]}>
              <View style={styles.streakHeader}>
                <Text>🔥</Text>
                <Text style={styles.streakTitle}>Streaks</Text>
              </View>
              <Text style={styles.streakDays}>{user.streakDays} days</Text>
              <Text style={styles.currentDhikr}>Current Dhikr:</Text>
              <Text style={styles.dhikrName}>{currentDhikr.name}</Text>
              <Text style={styles.completedCount}>
                Completed: {completedDhikrs.length}/{dhikrTypes.length}
              </Text>
            </View>

            {/* Implement DhikrCounter component */}
            <View style={styles.dhikrCounterWrapper}>
              <DhikrCounter
                dhikrType={currentDhikr.name}
                arabicText={currentDhikr.arabic}
                initialCount={dhikrCount}
                targetCount={currentDhikr.targetCount}
                onCountChange={handleDhikrCountChange}
              />
            </View>
          </View>
        </View>

        {/* Charity Section */}
        <View style={[styles.section, isTablet && styles.sectionTablet]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Charity</Text>
            <TouchableOpacity onPress={() => setShowCharity(true)}>
              <Text style={styles.viewAll}>View All →</Text>
            </TouchableOpacity>
          </View>
          {/* <Charity
            visible={showCharity}
            onClose={() => setShowCharity(false)}
          /> */}
          <Charity
            visible={showCharity}
            onClose={() => setShowCharity(false)}
            hadithText={hadiths[currentIndex].hadithText}
            narrator={hadiths[currentIndex].narrator}
            source={hadiths[currentIndex].source}
            variant="dark"
            onShare={() => console.log('Hadith shared')}
          />

          {/* Implement CharityCampaign component */}
          <CharityCampaign
            title={charityCampaigns[0].title}
            fundedPercentage={charityCampaigns[0].fundedPercentage}
            imagePath={charityCampaigns[0].image}
            variant="full"
            onDonate={() => console.log('Donate clicked')}
          />

          <View
            style={[styles.charityGrid, isTablet && styles.charityGridTablet]}>
            {/* Implement CharityCampaign components for the smaller cards */}
            {charityCampaigns.slice(1).map((campaign, index) => (
              <CharityCampaign
                key={index}
                title={campaign.title}
                fundedPercentage={campaign.fundedPercentage}
                imagePath={campaign.image}
                variant="compact"
              />
            ))}
          </View>
        </View>

        {/* Hadith of the Day - Implement as separate component */}
        {/* <HadithOfTheDay
          hadithText="Whoever guides someone to virtue will be rewarded equivalent to him who practices that good action."
          narrator="Abu Mas'ud"
          source="Sahih Muslim"
          variant="dark"
          onShare={() => console.log("Hadith shared")}
        /> */}

        <ScrollView>
          <HadithOfTheDay
            hadithText={hadiths[currentIndex].hadithText}
            narrator={hadiths[currentIndex].narrator}
            source={hadiths[currentIndex].source}
            variant="dark"
            onShare={() => console.log('Hadith shared')}
          />
          <View style={{margin: 20}}>
            {/* <Button title="Next Hadith" onPress={handleNext} /> */}
            <TouchableOpacity style={{width: '100%'}} onPress={handleNext}>
              <Text
                style={{
                  color: '#f59e0b', // amber-500 equivalent
                  fontSize: 14,
                  fontWeight: '500',
                  textAlign: 'right',
                }}>
                Next Hadith
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Support & Guidance - Implement as separate component */}
        <SupportGuidance questionItems={questionItems} variant="dark" />
      </ScrollView>

      {/* Sidebar Modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={isSidebarOpen}
        onRequestClose={() => setIsSidebarOpen(false)}>
        <View style={[styles.sidebar, isTablet && styles.sidebarTablet]}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setIsSidebarOpen(false)}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>

          <ScrollView contentContainerStyle={styles.sidebarContent}>
            <View style={styles.profileSection}>
              <Image
                source={{uri: user.profileImage}}
                style={styles.sidebarProfileImage}
              />
              {profile && (
                <>
                  <Text style={styles.sidebarProfileName}>{profile.name}</Text>
                  <Text style={styles.sidebarProfileDate}>
                    Member Since:{' '}
                    {new Date(profile.createdAt).toLocaleDateString()}
                  </Text>
                  <Text style={styles.sidebarProfileLocation}>
                    {profile.city}, {profile.country}
                  </Text>
                </>
              )}
            </View>

            <TouchableOpacity
              style={styles.editProfileButton}
              onPress={() => {
                // setIsEditing(!isEditing);
                navigation.navigate('EditProfileScreen', {
                  profile: profile, // the profile data that was fetched
                  setProfileTrigger: setProfileTrigger, // passing the trigger state function
                });
              }}>
              <Text style={styles.editProfileButtonText}>Edit Profile</Text>
            </TouchableOpacity>

            {/* Edit Profile Form would go here */}

            <View style={styles.sidebarSection}>
              <Text style={styles.sidebarSectionTitle}>Quests</Text>
              {/* Quests content would go here */}
            </View>

            <View style={styles.sidebarSection}>
              <Text style={styles.sidebarSectionTitle}>Journey</Text>
              {/* Journey content would go here */}
            </View>
          </ScrollView>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <LocationModal
        visible={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        profile={profile}
        setProfileTrigger={setProfileTrigger}
        onLocationSelect={({city: newCity, country: newCountry}) => {
          setUserLocation(`${newCity}, ${newCountry}`);
          setShowLocationModal(false);
        }}
      />

      {/* Bottom Navigation - Implement as separate component */}
      <RootNavigator />
    </View>
  );
};

const styles = StyleSheet.create({
  headerWrap: {
    backgroundColor: DASHBOARD_HEADER_BACKGROUND,
    zIndex: 10,
    ...Platform.select({
      android: {
        elevation: 8,
      },
    }),
  },
  container: {
    flex: 1,
    backgroundColor: APP_BACKGROUND,
  },
  content: {
    padding: 16,
    paddingBottom: 16,
  },
  contentTablet: {
    paddingHorizontal: 32,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 24,
    // borderWidth: 1,
  },
  sectionTablet: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '500',
    color: 'white',
  },
  viewAll: {
    color: '#f59e0b', // amber-500 equivalent
    fontSize: 14,
  },
  featuresGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  featuresGridTablet: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  featureItem: {
    alignItems: 'center',
    width: '19%',
  },
  featureItemTablet: {
    width: '18%',
    marginRight: '2%',
  },
  featureIcon: {
    width: 64,
    height: 64,
    borderRadius: 50,
    backgroundColor: '#0d4236', // slate-100/10 equivalent
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  featureIconText: {
    fontSize: 24,
  },
  featureText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  goalsStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b', // slate-800 equivalent
    borderWidth: 1,
    borderColor: '#334155', // slate-700 equivalent
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10b981', // green-500 equivalent
    marginRight: 4,
  },
  completedText: {
    color: '#f59e0b', // amber-500 equivalent
    fontSize: 12,
  },
  goalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  goalsGridTablet: {
    gap: 16,
  },
  goalCard: {
    width: '48%',
    backgroundColor: '#0d4236', // slate-800 equivalent
    borderWidth: 1,
    borderColor: '#334155', // slate-700 equivalent
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  goalCardCompleted: {
    borderColor: '#10b981', // green-500 equivalent
  },
  goalText: {
    color: 'white',
    fontSize: 14,
    flex: 1,
  },
  checkmark: {
    color: '#10b981', // green-500 equivalent
    fontSize: 18,
  },
  unchecked: {
    color: '#64748b', // slate-500 equivalent
    fontSize: 18,
  },
  subtitle: {
    color: '#cbd5e1', // slate-300 equivalent
    fontSize: 12,
  },
  dhikrContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
  },
  dhikrCounterWrapper: {
    width: '47%',
    alignSelf: 'stretch',
  },
  dhikrContainerTablet: {
    gap: 24,
  },
  streakCard: {
    backgroundColor: '#0d4236', // slate-800 equivalent
    borderWidth: 1,
    borderColor: '#334155', // slate-700 equivalent
    borderRadius: 12,
    padding: 16,
    width: '47%',
    minHeight: 200,
    justifyContent: 'space-between',
  },
  streakCardTablet: {
    padding: 20,
  },
  streakHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  streakTitle: {
    color: 'white',
    fontWeight: '500',
    marginLeft: 8,
  },
  streakDays: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 12,
  },
  currentDhikr: {
    color: '#cbd5e1', // slate-300 equivalent
    fontSize: 12,
  },
  dhikrName: {
    color: '#f59e0b', // amber-500 equivalent
    fontSize: 14,
    marginBottom: 8,
  },
  completedCount: {
    color: '#cbd5e1', // slate-300 equivalent
    fontSize: 12,
  },
  charityGrid: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 12,
    marginTop: 12,
    width: '100%',
  },
  charityGridTablet: {
    gap: 16,
  },
  sidebar: {
    flex: 1,
    backgroundColor: '#0d4236', // slate-800 equivalent
    padding: 16,
  },
  sidebarTablet: {
    width: '100%',
    marginLeft: 'auto',
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 8,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 20,
  },
  sidebarContent: {
    paddingBottom: 20,
  },
  profileSection: {
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 24,
  },
  sidebarProfileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#cbd5e1', // slate-300 equivalent
    marginBottom: 12,
  },
  sidebarProfileName: {
    color: 'white',
    fontWeight: '600',
    fontSize: 18,
    marginBottom: 4,
  },
  sidebarProfileDate: {
    color: '#94a3b8', // slate-400 equivalent
    fontSize: 12,
    marginBottom: 4,
  },
  sidebarProfileLocation: {
    color: 'white',
    fontWeight: '600',
  },
  editProfileButton: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    marginBottom: 24,
    alignItems: 'center',
  },
  editProfileButtonText: {
    color: '#4f46e5', // indigo-600 equivalent
    fontWeight: '500',
  },
  sidebarSection: {
    backgroundColor: '#f8fafc', // slate-50 equivalent
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  sidebarSectionTitle: {
    color: '#1e40af', // indigo-800 equivalent
    fontWeight: '500',
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#f87171', // red-400 equivalent
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 32,
  },
  logoutButtonText: {
    color: '#f87171', // red-400 equivalent
    fontWeight: '500',
    marginLeft: 8,
  },
});

export default Dashboard;
