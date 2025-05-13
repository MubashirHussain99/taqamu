import React, {useEffect, useState} from 'react';
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
} from 'react-native';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {api} from '../../services/api/api';
import PrayerTimes from '../../components/dashboard/PrayersTime';
import RandomAyahOfTheDay from '../../components/dashboard/RandomAyahOfTheDay';
// Note: You'll need to install these dependencies:
// @react-navigation/native, @react-navigation/stack, react-native-svg, react-native-vector-icons
import HijriDate from 'hijri-date/lib/safe';
import DhikrCounter from '../../components/dashboard/DhikrCounter';
import CharityCampaign from '../../components/dashboard/CharityCampaign';
import HadithOfTheDay from '../../components/dashboard/HadithOfTheDaym';
import SupportGuidance from '../../components/dashboard/SupportGuidance';
import RootNavigator from '../../components/dashboard/BottomNavigation';
import {Button} from 'react-native';
import Charity from '../../components/dashboard/Charity';

// const todayHijri = new HijriDate(); // This gives you the current Islamic date
// const hijriDateString = `${todayHijri.getDate()}-${
//   todayHijri.getMonth() + 1
// }-${todayHijri.getFullYear()}`;

// Get today's Islamic date
const todayHijri = new HijriDate();

// Array of month names in Arabic
const months = [
  'Muharram',
  'Safar',
  'Rabi’ al-Awwal',
  'Rabi’ al-Thani',
  'Jumada al-Awwal',
  'Jumada al-Thani',
  'Rajab',
  'Sha’ban',
  'Ramadan',
  'Shawwal',
  'Dhul-Qi’dah',
  'Dhul-Hijjah',
];

const hijriDateString = `${todayHijri.getDate()} ${
  months[todayHijri.getMonth()]
} ${todayHijri.getFullYear()} AH`;

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

  const currentDhikr = dhikrTypes[currentDhikrIndex];
  const {width} = Dimensions.get('window');
  const isTablet = width >= 768;
  const [showCharity, setShowCharity] = useState(false);

  // Note: Implement these components as separate files
  // const RandomAyahOfTheDay = require('./components/RandomAyahOfTheDay');
  // const HadithOfTheDay = require('./components/HadithOfTheDay');
  // const SupportGuidance = require('./components/SupportGuidance');
  // const CharityCampaign = require('./components/CharityCampaign');
  // const PrayerTimes = require('./components/PrayerTimes');
  // const DailyGoalCard = require('./components/DailyGoalCard');
  // const DhikrCounter = require('./components/DhikrCounter');
  // const LocationModal = require('./components/LocationModal');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await AsyncStorage.getItem('token');

        if (!token) {
          setError('No token found. Please log in again.');
          return;
        }
        const API_URL = Platform.select({
          android: 'http://10.0.2.2:5000/api', // For Android emulator
          ios: 'http://localhost:5000/api', // For iOS simulator
          default: 'http://localhost:5000/api', // For other environments
        });

        const response = await fetch(`${API_URL}/user/profile`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const responseText = await response.text();

        if (responseText.startsWith('<')) {
          throw new Error('Server returned HTML instead of JSON.');
        }

        const data = JSON.parse(responseText);
        setProfile(data);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to fetch user profile.');
      }
    };

    fetchProfile();
  }, []);
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
  // const handleDhikrCountChange = count => {
  //   setDhikrCount(count);

  //   if (count >= currentDhikr.targetCount) {
  //     if (!completedDhikrs.includes(currentDhikr.id)) {
  //       const newCompletedDhikrs = [...completedDhikrs, currentDhikr.id];
  //       setCompletedDhikrs(newCompletedDhikrs);

  //       if (currentDhikrIndex < dhikrTypes.length - 1) {
  //         setCurrentDhikrIndex(currentDhikrIndex + 1);
  //         setDhikrCount(0);
  //       }
  //     }
  //   }

  //   const updatedGoals = dailyGoals.map(goal => {
  //     if (goal.title.toLowerCase().includes('dhikr')) {
  //       if (completedDhikrs.length > 0 || count >= currentDhikr.targetCount) {
  //         goal.completed = true;
  //       }
  //       goal.progress = {
  //         current: count,
  //         total: currentDhikr.targetCount,
  //       };
  //     }
  //     return goal;
  //   });

  //   setCompletedGoals(updatedGoals.filter(goal => goal.completed).length);
  // };
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

  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % hadiths.length);
  };
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, isTablet && styles.headerTablet]}>
        <TouchableOpacity
          onPress={() => setIsSidebarOpen(true)}
          style={styles.profileImageContainer}>
          <Image
            source={{uri: user.profileImage}}
            style={styles.profileImage}
          />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.appName}>
            {profile?.name.charAt(0).toUpperCase() + profile?.name.slice(1)}
          </Text>

          <View style={styles.locationContainer}>
            <Text style={styles.locationText}>
              {profile?.city.charAt(0).toUpperCase() + profile?.city.slice(1)},{' '}
              {profile?.country.charAt(0).toUpperCase() +
                profile?.country.slice(1)}
            </Text>
            <TouchableOpacity onPress={() => setShowLocationModal(true)}>
              <Text style={styles.editIcon}>✏️</Text>
            </TouchableOpacity>
          </View>

          {/* Islamic Date */}
          <Text style={styles.islamicDate}>
            🕌 Today: {hijriDateString} (Hijri)
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate('Notifications')}
          style={styles.notificationIcon}>
          <Text style={styles.notificationBadge}>2</Text>
          <Text>🔔</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          isTablet && styles.contentTablet,
        ]}>
        {/* Prayer Times - Implement as separate component */}
        <PrayerTimes
          city={profile?.city}
          country={profile?.country}
          variant="compact"
        />

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
            <View style={{width: '50%'}}>
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
              // onPress={() => setIsEditing(!isEditing)}
            >
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

      {/* Location Modal - Implement as separate component */}
      {/* <LocationModal
        isOpen={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        currentLocation={userLocation}
        onLocationSelect={(location) => {
          setUserLocation(location);
          setShowLocationModal(false);
        }}
      /> */}

      {/* Bottom Navigation - Implement as separate component */}
      <RootNavigator />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a', // slate-950 equivalent
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#1e293b', // slate-900/50 equivalent
    borderBottomWidth: 1,
    borderBottomColor: '#334155', // slate-700 equivalent
  },
  headerTablet: {
    paddingHorizontal: 32,
    paddingVertical: 24,
  },
  profileImageContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1e293b', // slate-800 equivalent
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  headerCenter: {
    alignItems: 'center',
  },
  islamicDate: {
    marginTop: 4,
    fontSize: 14,
    color: '#fff',
  },

  appName: {
    fontSize: 18,
    fontWeight: '500',
    color: 'white',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  locationText: {
    color: 'white',
    fontSize: 12,
  },
  editIcon: {
    marginLeft: 4,
    color: '#10b981', // emerald-500 equivalent
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1e293b', // slate-800 equivalent
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#ef4444', // red-500 equivalent
    color: 'white',
    borderRadius: 10,
    width: 20,
    height: 20,
    textAlign: 'center',
    lineHeight: 20,
    fontSize: 12,
  },
  content: {
    padding: 16,
    paddingBottom: 80,
  },
  contentTablet: {
    paddingHorizontal: 32,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 24,
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
    borderRadius: 32,
    backgroundColor: 'rgba(241, 245, 249, 0.1)', // slate-100/10 equivalent
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
    backgroundColor: '#1e293b', // slate-800 equivalent
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
    gap: 16,
  },
  dhikrContainerTablet: {
    gap: 24,
  },
  streakCard: {
    flex: 1,
    backgroundColor: '#1e293b', // slate-800 equivalent
    borderWidth: 1,
    borderColor: '#334155', // slate-700 equivalent
    borderRadius: 12,
    padding: 16,
    width: '50%',
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
    gap: 12,
    marginTop: 12,
    width: '100%',
  },
  charityGridTablet: {
    gap: 16,
  },
  sidebar: {
    flex: 1,
    backgroundColor: '#1e293b', // slate-800 equivalent
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
