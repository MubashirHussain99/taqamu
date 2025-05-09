import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Platform} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useWindowDimensions} from 'react-native';
import {Share} from 'react-native';
// Optional: import Svg, Path from 'react-native-svg';

const HadithOfTheDay = ({
  hadithText,
  narrator,
  source,
  variant = 'dark',
  onShare,
  id,
  className,
}) => {
  const navigation = useNavigation();
  const isDark = variant === 'dark';
  const {width} = useWindowDimensions();
  const isMobile = width < 768;

  const handleCardClick = () => {
    if (id) {
      navigation.navigate('HadithDetail', {id});
    }
  };
  const handleShareClick = async e => {
    try {
      await Share.share({
        message: `📜 Hadith of the Day 📜\n\n"${hadithText}"\n\n— ${narrator}\n📚 Source: ${source}`,
      });
    } catch (error) {
      console.error(error.message);
    }
  };

  const styles = createStyles(isDark, isMobile);

  return (
    <TouchableOpacity
      style={[styles.card]}
      onPress={handleCardClick}
      activeOpacity={0.95}>
      <View style={styles.header}>
        <View style={styles.titleArea}>
          <Text style={styles.title}>Daily Hadith</Text>
          <Text style={styles.subtitle}>Abu Dawud</Text>
        </View>
        <TouchableOpacity style={styles.shareButton} onPress={handleShareClick}>
          <Text style={styles.accentText}>🔗</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.hadithText}>"{hadithText}"</Text>
        <View style={styles.meta}>
          <Text style={styles.metaText}>Narrator: {narrator}</Text>
          <Text style={styles.metaText}>Source: {source}</Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.commentText}>💬 28</Text>
          <TouchableOpacity
            style={styles.duaButton}
            onPress={e => e.stopPropagation?.()}>
            <Text style={styles.duaText}>{isMobile ? 'Dua' : 'Make Dua'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const createStyles = (isDark, isMobile) =>
  StyleSheet.create({
    card: {
      backgroundColor: isDark ? '#1e1b4b' : '#f4f1ff',
      borderRadius: 12,
      overflow: 'hidden',
      margin: 10,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 4,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 12,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#333' : '#ccc',
      backgroundColor: isDark ? '#292655' : '#eee',
    },
    titleArea: {
      flex: 1,
    },
    title: {
      color: isDark ? '#fff' : '#1e1e1e',
      fontWeight: '600',
      fontSize: 16,
    },
    subtitle: {
      fontSize: 12,
      color: isDark ? '#aaa' : '#666',
    },
    shareButton: {
      padding: 8,
      borderRadius: 20,
      backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : '#e0d4ff',
    },
    accentText: {
      color: isDark ? '#c084fc' : '#7c3aed',
      fontSize: 16,
    },
    content: {
      padding: isMobile ? 12 : 16,
    },
    hadithText: {
      color: isDark ? '#fff' : '#111',
      fontStyle: 'italic',
      fontSize: isMobile ? 14 : 16,
      marginBottom: 12,
    },
    meta: {
      marginBottom: 10,
    },
    metaText: {
      color: isDark ? '#ccc' : '#555',
      fontSize: 13,
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    commentText: {
      color: isDark ? '#aaa' : '#666',
      fontSize: 12,
    },
    duaButton: {
      backgroundColor: isDark ? 'rgba(192, 132, 252, 0.2)' : '#e9d5ff',
      paddingVertical: 6,
      paddingHorizontal: 14,
      borderRadius: 999,
    },
    duaText: {
      color: isDark ? '#c084fc' : '#7c3aed',
      fontWeight: '500',
      fontSize: 13,
    },
  });

export default HadithOfTheDay;
