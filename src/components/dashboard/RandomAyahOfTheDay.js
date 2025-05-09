import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import AyahOfTheDay from './AyahOfTheDay';
import { getRandomVerse, getSurahReference } from './verseData';
// import { getRandomVerse, getSurahReference } from '@/data/mockQuranData';

const RandomAyahOfTheDay = ({ variant = 'light', onlyShowUnread = false }) => {
  const [isRead, setIsRead] = useState(false);
  const [mockVerse, setMockVerse] = useState(getRandomVerse());
  const [isLoading, setIsLoading] = useState(false);

  const handleMarkAsRead = () => {
    setIsRead(true);
  };

  const getNextVerse = () => {
    setIsLoading(true);
    setTimeout(() => {
      setMockVerse(getRandomVerse());
      setIsLoading(false);
      setIsRead(false);
    }, 500);
  };

  const surahReference = getSurahReference(mockVerse);

  if (isLoading) {
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
        surahReference={surahReference}
        surahNumber={mockVerse.surahNumber}
        ayahNumber={mockVerse.ayahNumber}
        isRead={isRead}
        variant={variant}
        onMarkAsRead={handleMarkAsRead}
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={getNextVerse}
          style={[
            styles.button,
            variant === 'dark' ? styles.darkButton : styles.lightButton
          ]}
        >
          <Text style={[
            styles.buttonText,
            variant === 'dark' ? styles.darkText : styles.lightText
          ]}>
            New Verse
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    // gap: 5,
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
  loader: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    alignItems: 'flex-end',
    // marginTop: 6,
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
