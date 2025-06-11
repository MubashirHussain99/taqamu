import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import quranData from '../quran/quran.json'; // Import your quran.json file here

const RandomAyahOfTheDay = ({variant = 'light'}) => {
  const [isRead, setIsRead] = useState(false);
  const [mockVerse, setMockVerse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const getRandomInt = max => {
    return Math.floor(Math.random() * max);
  };

  const fetchRandomVerse = async (previousKey = '') => {
    setIsLoading(true);
    try {
      let ayahKey = previousKey;
      let randomSurahIndex, randomVerseIndex;

      // Loop until we get a new random Ayah (avoid repeats)
      while (ayahKey === previousKey) {
        randomSurahIndex = getRandomInt(Object.keys(quranData).length); // Get random Surah
        const randomSurahKey = Object.keys(quranData)[randomSurahIndex];
        const randomSurah = quranData[randomSurahKey];

        randomVerseIndex = getRandomInt(randomSurah.verses.length); // Get random verse from surah
        const randomVerse = randomSurah.verses[randomVerseIndex];

        ayahKey = `${randomVerse.id}`;
      }

      const randomSurahKey = Object.keys(quranData)[randomSurahIndex];
      const randomSurah = quranData[randomSurahKey];
      const randomVerse = randomSurah.verses[randomVerseIndex];

      setMockVerse({
        surahName: randomSurah.name,
        surahTransliteration: randomSurah.transliteration,
        surahTranslation: randomSurah.translation,
        arabicText: randomVerse.text,
        translationEn: randomVerse.translation, // English Translation
      });
    } catch (error) {
      console.error('Error fetching verse:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRandomVerse();
  }, []);

  useEffect(() => {
    const checkReadStatus = async () => {
      const storedReadAyahs = await AsyncStorage.getItem('readAyahs');
      const readAyahs = storedReadAyahs ? JSON.parse(storedReadAyahs) : {};
      if (mockVerse) {
        const ayahKey = `${mockVerse.surahName}-${mockVerse.arabicText}`;
        setIsRead(!!readAyahs[ayahKey]);
      }
    };
    checkReadStatus();
  }, [mockVerse]);

  const handleMarkAsRead = async () => {
    if (mockVerse) {
      setIsRead(true);
      const ayahKey = `${mockVerse.surahName}-${mockVerse.arabicText}`;
      const storedReadAyahs = await AsyncStorage.getItem('readAyahs');
      const readAyahs = storedReadAyahs ? JSON.parse(storedReadAyahs) : {};
      readAyahs[ayahKey] = true;
      await AsyncStorage.setItem('readAyahs', JSON.stringify(readAyahs));
    }
  };

  const getNextVerse = () => {
    const prevKey = mockVerse
      ? `${mockVerse.surahName}-${mockVerse.arabicText}`
      : '';
    setIsRead(false); // Reset read status first
    fetchRandomVerse(prevKey); // Pass previous key to avoid repetition
  };

  if (isLoading || !mockVerse) {
    return (
      <View
        style={[
          styles.card,
          variant === 'dark' ? styles.darkCard : styles.lightCard,
        ]}>
        <View style={styles.header}>
          <Text
            style={[
              styles.title,
              variant === 'dark' ? styles.darkText : styles.lightText,
            ]}>
            Daily Verse
          </Text>
        </View>
        <View style={styles.loader}>
          <ActivityIndicator
            size="large"
            color={variant === 'dark' ? '#34d399' : '#10b981'}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      {/* Heading */}
      <Text
        style={[
          styles.mainHeading,
          variant === 'dark' ? styles.darkText : styles.lightText,
        ]}>
        Ayah of the Day
      </Text>

      {/* Display Arabic Text and Translation */}
      <View style={styles.ayahContainer}>
        <Text
          style={[
            styles.arabicText,
            variant === 'dark' ? styles.darkText : styles.lightText,
          ]}>
          {mockVerse.arabicText}
        </Text>
        <Text
          style={[
            styles.translationText,
            variant === 'dark' ? styles.darkText : styles.lightText,
          ]}>
          {mockVerse.translationEn}
        </Text>
      </View>

      {/* Surah Info */}
      <Text
        style={[
          styles.surahInfo,
          variant === 'dark' ? styles.darkText : styles.lightText,
        ]}>
        {`Surah ${mockVerse.surahName} (${mockVerse.surahTransliteration})`}
      </Text>

      {!isRead ? (
        <TouchableOpacity
          onPress={handleMarkAsRead}
          style={[
            styles.button,
            {marginTop: 10},
            variant === 'dark' ? styles.darkButton : styles.lightButton,
          ]}>
          <Text
            style={[
              styles.buttonText,
              variant === 'dark' ? styles.darkText : styles.lightText,
            ]}>
            Mark as Read
          </Text>
        </TouchableOpacity>
      ) : (
        <Text
          style={{
            marginTop: 10,
            fontStyle: 'italic',
            color: variant === 'dark' ? '#a7f3d0' : '#065f46',
          }}>
          ✅ Marked as Read
        </Text>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={isLoading ? null : getNextVerse} // Disable if loading
          style={[
            styles.button,
            variant === 'dark' ? styles.darkButton : styles.lightButton,
            isLoading && {opacity: 0.5},
          ]}
          disabled={isLoading}>
          <Text
            style={[
              styles.buttonText,
              variant === 'dark' ? styles.darkText : styles.lightText,
            ]}>
            {isLoading ? 'Loading...' : 'New Verse'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    padding: 15,
    alignItems: 'center',
  },
  card: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    elevation: 3,
  },
  darkCard: {
    backgroundColor: '#1e1b4b',
  },
  lightCard: {
    backgroundColor: '#f4f1ff',
  },
  header: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  mainHeading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  loader: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ayahContainer: {
    marginBottom: 20,
    textAlign: 'center',
  },
  arabicText: {
    fontSize: 28, // Reduced size
    marginBottom: 10,
    textAlign: 'center',
    fontFamily: 'Al Majeed Quranic Font_shiped',
  },
  translationText: {
    fontSize: 16, // Reduced size
    textAlign: 'center',
    fontStyle: 'italic',
  },
  surahInfo: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: 20,
  },
  button: {
    backgroundColor: '#34d399',
    padding: 10,
    borderRadius: 8,
    width: 200,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  darkButton: {
    backgroundColor: '#10b981',
  },
  lightButton: {
    backgroundColor: '#34d399',
  },
  darkText: {
    color: '#fff',
  },
  lightText: {
    color: '#000',
  },
});

export default RandomAyahOfTheDay;
