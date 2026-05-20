import React, {useEffect, useMemo, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RootNavigator, {
  useBottomTabBarInset,
} from '../../components/dashboard/BottomNavigation';
import quranData from '../../components/quran/quran.json';
import {APP_BACKGROUND} from '../../styles/screenStyles';

const QuranScreen = () => {
  const navigation = useNavigation();
  const tabBarInset = useBottomTabBarInset();

  const [surahs, setSurahs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedSurah, setExpandedSurah] = useState(null);
  const [readAyahs, setReadAyahs] = useState({});

  useEffect(() => {
    loadSurahs();
    loadReadAyahs();
  }, []);

  const loadSurahs = () => {
    setSurahs(quranData);
    setLoading(false);
  };

  const loadReadAyahs = async () => {
    try {
      const stored = await AsyncStorage.getItem('readAyahs');
      if (stored) {
        setReadAyahs(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading read ayahs:', error);
    }
  };

  const toggleRead = async (surahNum, ayahNum) => {
    const key = `${surahNum}-${ayahNum}`;
    const newReadAyahs = {...readAyahs, [key]: !readAyahs[key]};
    setReadAyahs(newReadAyahs);
    await AsyncStorage.setItem('readAyahs', JSON.stringify(newReadAyahs));
  };

  const onSurahPress = surahNumber => {
    setExpandedSurah(prev => (prev === surahNumber ? null : surahNumber));
  };

  const readCount = useMemo(
    () => Object.values(readAyahs).filter(Boolean).length,
    [readAyahs],
  );

  const getSurahReadCount = surah =>
    surah.verses?.filter(v => readAyahs[`${surah.id}-${v.id}`]).length ?? 0;

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#f59e0b" />
        <Text style={styles.statusText}>Loading Quran...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          accessibilityLabel="Go back">
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerText}>Quran</Text>
          <Text style={styles.headerSubtitle}>
            {surahs.length} Surahs · {readCount} ayahs marked read
          </Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContainer,
          {paddingBottom: tabBarInset},
        ]}
        showsVerticalScrollIndicator={false}>
        {surahs.map(surah => {
          const isExpanded = expandedSurah === surah.id;
          const surahReadCount = getSurahReadCount(surah);
          const totalVerses = surah.total_verses ?? surah.verses?.length ?? 0;

          return (
            <View key={surah.id} style={styles.surahCard}>
              <TouchableOpacity
                style={styles.surahHeader}
                onPress={() => onSurahPress(surah.id)}
                activeOpacity={0.7}>
                <View style={styles.surahNumberBadge}>
                  <Text style={styles.surahNumberText}>{surah.id}</Text>
                </View>

                <View style={styles.surahTitleBlock}>
                  <Text style={styles.surahName}>{surah.name}</Text>
                  <Text style={styles.surahTransliteration}>
                    {surah.transliteration}
                    {surah.translation ? ` · ${surah.translation}` : ''}
                  </Text>
                  <View style={styles.surahMetaRow}>
                    <Text style={styles.surahMeta}>{totalVerses} verses</Text>
                    <View
                      style={[
                        styles.typeBadge,
                        surah.type === 'meccan'
                          ? styles.meccanBadge
                          : styles.medinanBadge,
                      ]}>
                      <Text style={styles.typeBadgeText}>
                        {surah.type === 'meccan' ? 'Meccan' : 'Medinan'}
                      </Text>
                    </View>
                    {surahReadCount > 0 ? (
                      <Text style={styles.readProgress}>
                        {surahReadCount}/{totalVerses} read
                      </Text>
                    ) : null}
                  </View>
                </View>

                <Text style={styles.chevron}>{isExpanded ? '▲' : '▼'}</Text>
              </TouchableOpacity>

              {isExpanded && surah.verses ? (
                <View style={styles.versesContainer}>
                  {surah.verses.map(ayah => {
                    const key = `${surah.id}-${ayah.id}`;
                    const isRead = !!readAyahs[key];

                    return (
                      <TouchableOpacity
                        key={key}
                        style={[styles.ayahCard, isRead && styles.ayahCardRead]}
                        onPress={() => toggleRead(surah.id, ayah.id)}
                        activeOpacity={0.8}>
                        <View style={styles.ayahHeader}>
                          <View style={styles.ayahNumberBadge}>
                            <Text style={styles.ayahNumberText}>{ayah.id}</Text>
                          </View>
                          <Text
                            style={[
                              styles.readIndicator,
                              isRead && styles.readIndicatorActive,
                            ]}>
                            {isRead ? '✓ Read' : 'Tap to mark read'}
                          </Text>
                        </View>
                        <Text
                          style={[
                            styles.ayahText,
                            isRead && styles.ayahTextRead,
                          ]}>
                          {ayah.text}
                        </Text>
                        {ayah.translation ? (
                          <Text style={styles.translationText}>
                            {ayah.translation}
                          </Text>
                        ) : null}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ) : null}
            </View>
          );
        })}
      </ScrollView>

      <RootNavigator />
    </SafeAreaView>
  );
};

export default QuranScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: APP_BACKGROUND,
  },
  scrollView: {
    flex: 1,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusText: {
    color: '#d1fae5',
    marginTop: 12,
    fontSize: 14,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 8,
  },
  backButton: {
    padding: 8,
    width: 40,
  },
  backButtonText: {
    fontSize: 28,
    color: '#fff',
    lineHeight: 28,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#a7f3d0',
    marginTop: 4,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  surahCard: {
    backgroundColor: '#0d4236',
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 2},
  },
  surahHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
  },
  surahNumberBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: APP_BACKGROUND,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  surahNumberText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  surahTitleBlock: {
    flex: 1,
  },
  surahName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'right',
  },
  surahTransliteration: {
    fontSize: 13,
    color: '#fff',
    marginTop: 2,
    textAlign: 'right',
  },
  surahMetaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 6,
  },
  surahMeta: {
    fontSize: 12,
    color: '#94a3b8',
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  meccanBadge: {
    backgroundColor: '#dbeafe',
  },
  medinanBadge: {
    backgroundColor: '#fef3c7',
  },
  typeBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#334155',
  },
  readProgress: {
    fontSize: 11,
    color: '#10b981',
    fontWeight: '600',
  },
  chevron: {
    fontSize: 12,
    color: '#94a3b8',
    marginLeft: 8,
  },
  versesContainer: {
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    backgroundColor: '#f8fafc',
    padding: 12,
  },
  ayahCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  ayahCardRead: {
    borderColor: '#6ee7b7',
    backgroundColor: '#ecfdf5',
  },
  ayahHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  ayahNumberBadge: {
    minWidth: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: APP_BACKGROUND,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  ayahNumberText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  readIndicator: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '500',
  },
  readIndicatorActive: {
    color: '#059669',
    fontWeight: '600',
  },
  ayahText: {
    fontSize: 18,
    lineHeight: 32,
    color: '#1e293b',
    textAlign: 'right',
  },
  ayahTextRead: {
    color: '#047857',
  },
  translationText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#64748b',
    textAlign: 'left',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
});
