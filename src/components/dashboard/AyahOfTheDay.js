import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Share } from 'react-native';
import { useIsMobile } from './useIsMobile';
// import { useIsMobile } from '@/hooks/use-mobile'; // If you're using a custom hook for mobile detection

const AyahOfTheDay = ({
  ayahText,
  ayahTranslation,
  surahReference,
  ayahArabic,
  isRead = false,
  variant = 'light',
  onMarkAsRead,
  surahNumber,
  ayahNumber,
  className = '',
}) => {
  const isMobile = useIsMobile();
  const isDark = variant === 'dark';

  const handleCardClick = () => {
    if (surahNumber && ayahNumber) {
      // Navigate to the specific Ayah screen (add your navigation logic here)
    }
  };

  const handleShareClick = async () => {
    try {
      await Share.share({
        message: `${ayahText} - ${surahReference}`,
      });
    } catch (error) {
      console.error(error.message);
    }
  };

  const bgColor = isDark ? '#1e1b4b' : '#f4f1ff';
  const textColor = isDark ? '#ffffff' : '#2f2f2f';
  const subtextColor = isDark ? '#b0b0b0' : '#808080';
  const accentColor = isDark ? '#34d399' : '#10b981';
  const btnBgColor = isDark ? 'rgba(255, 255, 255, 0.1)' : '#a7f3d0';
  const readBtnClass = isDark
    ? { backgroundColor: 'rgba(56, 189, 94, 0.1)', borderRadius: 20 }
    : { backgroundColor: '#d1fae5', borderRadius: 20 };

  return (
    <View
      style={[styles.card, { backgroundColor: bgColor }, className]}
      onTouchEnd={handleCardClick}
    >
      <View style={[styles.header, { backgroundColor: 'rgba(255, 255, 255, 0.1)' }]}>
        <View style={styles.headerLeft}>
          <Text style={[styles.accent, { color: accentColor }]}>
            <Image
              source={require('../../assets/images/book-icon.png')} // Replace with your own icon
              style={{ width: isMobile ? 20 : 24, height: isMobile ? 20 : 24 }}
            />
          </Text>
          <View style={styles.headerText}>
            <Text style={[styles.surahReference, { color: textColor }]}>
              {surahReference || 'Daily Verse'}
            </Text>
            {surahNumber && ayahNumber && (
              <Text style={[styles.continueReading, { color: subtextColor }]}>
                Continue Reading
              </Text>
            )}
          </View>
        </View>
        <TouchableOpacity
          // style={[styles.shareButton, { backgroundColor: btnBgColor }]}
          onPress={handleShareClick}
        >
          <Image
            source={require('../../assets/images/share-icon.png')} // Replace with your own share icon
            style={{ width: 30, height: 30 }}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.body}>
        {ayahArabic && (
          <Text style={[styles.ayahArabic, { color: textColor }]}>
            {ayahArabic}
          </Text>
        )}
        <Text style={[styles.ayahTranslation, { color: textColor }]}>
          {ayahTranslation}
        </Text>

        <View style={styles.footer}>
          <View style={styles.footerLeft}>
            <Text style={[styles.footnote, { color: subtextColor }]}>20</Text>
          </View>

          {onMarkAsRead && (
            <TouchableOpacity
              style={[styles.readButton, readBtnClass]}
              onPress={(e) => {
                e.stopPropagation();
                onMarkAsRead();
              }}
            >
              <Text style={{ color: isRead ? '#34d399' : '#10b981' }}>
                {isRead ? 'Read' : 'Read →'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  accent: {
    marginRight: 8,
    flexShrink: 0,
  },
  headerText: {
    minWidth: 0,
    flex: 1,
  },
  surahReference: {
    fontSize: 16,
    fontWeight: '500',
  },
  continueReading: {
    fontSize: 12,
    marginTop: 2,
  },
  shareButton: {
    padding: 8,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  body: {
    padding: 16,
  },
  ayahArabic: {
    fontSize: 24,
    fontFamily: 'ArabicFont', // Adjust based on your font
    textAlign: 'right',
    marginBottom: 16,
  },
  ayahTranslation: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footnote: {
    fontSize: 12,
    marginLeft: 4,
  },
  readButton: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
});

export default AyahOfTheDay;
