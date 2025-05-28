import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RootNavigator from '../../components/dashboard/BottomNavigation';
import quranData from '../../components/quran/quran.json';  // import your local JSON file

const QuranScreen = () => {
  const navigation = useNavigation();

  const [surahs, setSurahs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedSurah, setExpandedSurah] = useState(null);
  const [readAyahs, setReadAyahs] = useState({});

  useEffect(() => {
    loadSurahs();
    loadReadAyahs();
  }, []);

  const loadSurahs = () => {
    setSurahs(quranData);  // Directly set the data from your local JSON file
    setLoading(false);
  };

  const loadReadAyahs = async () => {
    try {
      const stored = await AsyncStorage.getItem('readAyahs');
      if (stored) setReadAyahs(JSON.parse(stored));
    } catch (error) {
      console.error('Error loading read ayahs:', error);
    }
  };

  const toggleRead = async (surahNum, ayahNum) => {
    const key = `${surahNum}-${ayahNum}`;
    const newReadAyahs = { ...readAyahs, [key]: !readAyahs[key] };
    setReadAyahs(newReadAyahs);
    await AsyncStorage.setItem('readAyahs', JSON.stringify(newReadAyahs));
  };

  const onSurahPress = (surahNumber) => {
    if (expandedSurah === surahNumber) {
      setExpandedSurah(null);
    } else {
      setExpandedSurah(surahNumber);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ fontSize: 24 }}>❌</Text>
        </TouchableOpacity>
        <Text style={styles.title}>القرآن الكريم</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {surahs.map((surah) => (
          <View key={surah.id} style={styles.surahContainer}>
            <TouchableOpacity onPress={() => onSurahPress(surah.id)}>
              <Text style={styles.surahName}>
                {surah.id}. {surah.name} - {surah.transliteration}
              </Text>
            </TouchableOpacity>
            <Text style={styles.surahInfo}>
              {surah.total_verses} آية |{' '}
              {surah.type === 'meccan' ? 'مكية' : 'مدنية'}
            </Text>

            {expandedSurah === surah.id && surah.verses && (
              <View style={styles.versesContainer}>
                {surah.verses.map((ayah) => {
                  const key = `${surah.id}-${ayah.id}`;
                  const isRead = readAyahs[key] || false;
                  return (
                    <View key={key} style={{ marginBottom: 12 }}>
                      <TouchableOpacity onPress={() => toggleRead(surah.id, ayah.id)}>
                        <Text style={[styles.ayahText, isRead && styles.readAyah]}>
                          {ayah.id}. {ayah.text}
                        </Text>
                        <Text style={[styles.translationText]}>
                          {ayah.translation}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      <RootNavigator />
    </View>
  );
};

export default QuranScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e293b',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#1e293b',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 20,
    textAlign: 'right',
    color: '#fff',
  },
  scrollContainer: {
    padding: 16,
  },
  surahContainer: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    elevation: 2,
  },
  surahName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'right',
  },
  surahInfo: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 4,
    textAlign: 'right',
  },
  versesContainer: {
    marginTop: 12,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  ayahText: {
    fontSize: 16,
    color: '#34495e',
    textAlign: 'right',
  },
  translationText: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'right',
    marginTop: 4,
  },
  readAyah: {
    color: '#34d399',
  },
});
