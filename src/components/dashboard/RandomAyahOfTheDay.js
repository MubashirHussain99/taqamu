import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AyahOfTheDay from './AyahOfTheDay'; // This is your custom component

const RandomAyahOfTheDay = ({ variant = 'light' }) => {
  const [isRead, setIsRead] = useState(false);
  const [mockVerse, setMockVerse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchRandomVerse = async () => {
    setIsLoading(true);
    try {
      const randomSurah = Math.floor(Math.random() * 114) + 1;

      // Ayah count varies per Surah; for simplicity, fetch a safe random number
      const maxAyahs = {
        2: 286, 3: 200, 4: 176, 5: 120, 6: 165, 7: 206, 9: 129, 10: 109, 12: 111, 18: 110,
      };
      const totalAyahs = maxAyahs[randomSurah] || 30;
      const randomAyah = Math.floor(Math.random() * totalAyahs) + 1;

      const response = await fetch(
        `https://api.alquran.cloud/v1/ayah/${randomSurah}:${randomAyah}/editions/ar.alafasy,en.sahih`
      );
      const result = await response.json();

      const arabic = result.data.find(d => d.edition.identifier === 'ar.alafasy');
      const english = result.data.find(d => d.edition.identifier === 'en.sahih');

      setMockVerse({
        surahNumber: randomSurah,
        ayahNumber: randomAyah,
        arabicText: arabic?.text,
        translationEn: english?.text,
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
        const ayahKey = `${mockVerse.surahNumber}-${mockVerse.ayahNumber}`;
        setIsRead(!!readAyahs[ayahKey]);
      }
    };
    checkReadStatus();
  }, [mockVerse]);

  const handleMarkAsRead = async () => {
    if (mockVerse) {
      setIsRead(true);
      const ayahKey = `${mockVerse.surahNumber}-${mockVerse.ayahNumber}`;
      const storedReadAyahs = await AsyncStorage.getItem('readAyahs');
      const readAyahs = storedReadAyahs ? JSON.parse(storedReadAyahs) : {};
      readAyahs[ayahKey] = true;
      await AsyncStorage.setItem('readAyahs', JSON.stringify(readAyahs));
    }
  };

  const getNextVerse = () => {
    fetchRandomVerse();
    setIsRead(false);
  };

  if (isLoading || !mockVerse) {
    return (
      <View style={[styles.card, variant === 'dark' ? styles.darkCard : styles.lightCard]}>
        <View style={styles.header}>
          <Text style={[styles.title, variant === 'dark' ? styles.darkText : styles.lightText]}>
            Daily Verse
          </Text>
        </View>
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={variant === 'dark' ? '#34d399' : '#10b981'} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <AyahOfTheDay
        ayahArabic={mockVerse.arabicText}
        ayahTranslation={mockVerse.translationEn}
        surahReference={`Surah ${mockVerse.surahNumber}:${mockVerse.ayahNumber}`}
        surahNumber={mockVerse.surahNumber}
        ayahNumber={mockVerse.ayahNumber}
        isRead={isRead}
        variant={variant}
        onMarkAsRead={handleMarkAsRead}
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={getNextVerse}
          style={[styles.button, variant === 'dark' ? styles.darkButton : styles.lightButton]}
        >
          <Text style={[styles.buttonText, variant === 'dark' ? styles.darkText : styles.lightText]}>
            New Verse
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {},
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
  loader: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 999,
  },
  darkButton: {
    backgroundColor: 'rgba(52, 211, 153, 0.2)',
  },
  lightButton: {
    backgroundColor: '#d1fae5',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  darkText: {
    color: '#34d399',
  },
  lightText: {
    color: '#059669',
  },
});

export default RandomAyahOfTheDay;
