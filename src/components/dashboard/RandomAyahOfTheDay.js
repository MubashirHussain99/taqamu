// import React, {useState, useEffect} from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   ActivityIndicator,
// } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import AyahOfTheDay from './AyahOfTheDay'; // This is your custom component

// const RandomAyahOfTheDay = ({variant = 'light'}) => {
//   const [isRead, setIsRead] = useState(false);
//   const [mockVerse, setMockVerse] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);

//   const getRandomInt = max => {
//     return (
//       (Math.floor((Math.random() + (Date.now() % 1000) / 1000) * max) % max) + 1
//     );
//   };

//   // const fetchRandomVerse = async (previousKey = '') => {
//   //   setIsLoading(true);
//   //   try {
//   //     let ayahKey = previousKey;
//   //     let randomSurah, randomAyah;

//   //     while (ayahKey === previousKey) {
//   //       randomSurah = getRandomInt(114);
//   //       const maxAyahs = {
//   //         2: 286,
//   //         3: 200,
//   //         4: 176,
//   //         5: 120,
//   //         6: 165,
//   //         7: 206,
//   //         9: 129,
//   //         10: 109,
//   //         12: 111,
//   //         18: 110,
//   //       };
//   //       const totalAyahs = maxAyahs[randomSurah] || 30;
//   //       randomAyah = getRandomInt(totalAyahs);
//   //       ayahKey = `${randomSurah}-${randomAyah}`;
//   //     }

//   //     const response = await fetch(
//   //       `https://api.alquran.cloud/v1/ayah/${randomSurah}:${randomAyah}/editions/ar.alafasy,en.sahih`,
//   //     );
//   //     const result = await response.json();

//   //     const arabic = result.data.find(
//   //       d => d.edition.identifier === 'ar.alafasy',
//   //     );
//   //     const english = result.data.find(
//   //       d => d.edition.identifier === 'en.sahih',
//   //     );

//   //     setMockVerse({
//   //       surahNumber: randomSurah,
//   //       ayahNumber: randomAyah,
//   //       arabicText: arabic?.text,
//   //       translationEn: english?.text,
//   //     });
//   //   } catch (error) {
//   //     console.error('Error fetching verse:', error);
//   //   } finally {
//   //     setIsLoading(false);
//   //   }
//   // };
//   const fetchRandomVerse = async (previousKey = '') => {
//     setIsLoading(true);
//     try {
//       let ayahKey = previousKey;
//       let randomSurah, randomAyah;

//       while (ayahKey === previousKey) {
//         randomSurah = getRandomInt(114);
//         const maxAyahs = {
//           2: 286,
//           3: 200,
//           4: 176,
//           5: 120,
//           6: 165,
//           7: 206,
//           9: 129,
//           10: 109,
//           12: 111,
//           18: 110,
//         };
//         const totalAyahs = maxAyahs[randomSurah] || 30;
//         randomAyah = getRandomInt(totalAyahs);
//         ayahKey = `${randomSurah}-${randomAyah}`;
//       }

//       // Fetch Arabic Ayah
//       const arabicResponse = await fetch(
//         `https://api.quran.com/api/v4/verses/by_key/${randomSurah}:${randomAyah}?language=ar`,
//       );
//       const arabicResult = await arabicResponse.json();

//       // Fetch English Translation (Pick edition_id for translation, e.g., 20 for Sahih International)
//       const translationResponse = await fetch(
//         `https://api.quran.com/api/v4/verses/by_key/${randomSurah}:${randomAyah}?language=en&translation=20`,
//       );
//       const translationResult = await translationResponse.json();

//       setMockVerse({
//         surahNumber: randomSurah,
//         ayahNumber: randomAyah,
//         arabicText: arabicResult.verse.text_uthmani,
//         translationEn: translationResult.verse.translation.text,
//       });
//     } catch (error) {
//       console.error('Error fetching verse:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchRandomVerse();
//   }, []);

//   useEffect(() => {
//     const checkReadStatus = async () => {
//       const storedReadAyahs = await AsyncStorage.getItem('readAyahs');
//       const readAyahs = storedReadAyahs ? JSON.parse(storedReadAyahs) : {};
//       if (mockVerse) {
//         const ayahKey = `${mockVerse.surahNumber}-${mockVerse.ayahNumber}`;
//         setIsRead(!!readAyahs[ayahKey]);
//       }
//     };
//     checkReadStatus();
//   }, [mockVerse]);

//   const handleMarkAsRead = async () => {
//     if (mockVerse) {
//       setIsRead(true);
//       const ayahKey = `${mockVerse.surahNumber}-${mockVerse.ayahNumber}`;
//       const storedReadAyahs = await AsyncStorage.getItem('readAyahs');
//       const readAyahs = storedReadAyahs ? JSON.parse(storedReadAyahs) : {};
//       readAyahs[ayahKey] = true;
//       await AsyncStorage.setItem('readAyahs', JSON.stringify(readAyahs));
//     }
//   };

//   const getNextVerse = () => {
//     const prevKey = mockVerse
//       ? `${mockVerse.surahNumber}-${mockVerse.ayahNumber}`
//       : '';
//     setIsRead(false); // Reset read status first
//     fetchRandomVerse(prevKey); // Pass previous key to avoid repetition
//   };

//   if (isLoading || !mockVerse) {
//     return (
//       <View
//         style={[
//           styles.card,
//           variant === 'dark' ? styles.darkCard : styles.lightCard,
//         ]}>
//         <View style={styles.header}>
//           <Text
//             style={[
//               styles.title,
//               variant === 'dark' ? styles.darkText : styles.lightText,
//             ]}>
//             Daily Verse
//           </Text>
//         </View>
//         <View style={styles.loader}>
//           <ActivityIndicator
//             size="large"
//             color={variant === 'dark' ? '#34d399' : '#10b981'}
//           />
//         </View>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.wrapper}>
//       <AyahOfTheDay
//         ayahArabic={mockVerse.arabicText}
//         ayahTranslation={mockVerse.translationEn}
//         surahReference={`Surah ${mockVerse.surahNumber}:${mockVerse.ayahNumber}`}
//         surahNumber={mockVerse.surahNumber}
//         ayahNumber={mockVerse.ayahNumber}
//         isRead={isRead}
//         variant={variant}
//         onMarkAsRead={handleMarkAsRead}
//       />

//       <View style={styles.buttonContainer}>
//         <TouchableOpacity
//           onPress={isLoading ? null : getNextVerse} // Disable if loading
//           style={[
//             styles.button,
//             variant === 'dark' ? styles.darkButton : styles.lightButton,
//             isLoading && {opacity: 0.5},
//           ]}
//           disabled={isLoading}>
//           <Text
//             style={[
//               styles.buttonText,
//               variant === 'dark' ? styles.darkText : styles.lightText,
//             ]}>
//             {isLoading ? 'Loading...' : 'New Verse'}
//           </Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   wrapper: {},
//   card: {
//     borderRadius: 12,
//     overflow: 'hidden',
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     elevation: 3,
//   },
//   darkCard: {
//     backgroundColor: '#1e1b4b',
//   },
//   lightCard: {
//     backgroundColor: '#f4f1ff',
//   },
//   header: {
//     padding: 12,
//     borderBottomWidth: 1,
//     borderColor: 'rgba(255,255,255,0.1)',
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   title: {
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   loader: {
//     padding: 20,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   buttonContainer: {
//     alignItems: 'flex-end',
//     marginBottom: 10,
//   },
//   button: {
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//     borderRadius: 999,
//   },
//   darkButton: {
//     backgroundColor: 'rgba(52, 211, 153, 0.2)',
//   },
//   lightButton: {
//     backgroundColor: '#d1fae5',
//   },
//   buttonText: {
//     fontSize: 14,
//     fontWeight: '500',
//   },
//   darkText: {
//     color: '#34d399',
//   },
//   lightText: {
//     color: '#059669',
//   },
// });

// export default RandomAyahOfTheDay;


import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import quranData from '../quran/quran.json'; // Import your quran.json file here

const RandomAyahOfTheDay = ({ variant = 'light' }) => {
  const [isRead, setIsRead] = useState(false);
  const [mockVerse, setMockVerse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const getRandomInt = (max) => {
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
    const prevKey = mockVerse ? `${mockVerse.surahName}-${mockVerse.arabicText}` : '';
    setIsRead(false); // Reset read status first
    fetchRandomVerse(prevKey); // Pass previous key to avoid repetition
  };

  if (isLoading || !mockVerse) {
    return (
      <View
        style={[
          styles.card,
          variant === 'dark' ? styles.darkCard : styles.lightCard,
        ]}
      >
        <View style={styles.header}>
          <Text
            style={[
              styles.title,
              variant === 'dark' ? styles.darkText : styles.lightText,
            ]}
          >
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
      <Text style={[styles.mainHeading, variant === 'dark' ? styles.darkText : styles.lightText]}>
        Ayah of the Day
      </Text>

      {/* Display Arabic Text and Translation */}
      <View style={styles.ayahContainer}>
        <Text
          style={[styles.arabicText, variant === 'dark' ? styles.darkText : styles.lightText]}
        >
          {mockVerse.arabicText}
        </Text>
        <Text
          style={[styles.translationText, variant === 'dark' ? styles.darkText : styles.lightText]}
        >
          {mockVerse.translationEn}
        </Text>
      </View>

      {/* Surah Info */}
      <Text style={[styles.surahInfo, variant === 'dark' ? styles.darkText : styles.lightText]}>
        {`Surah ${mockVerse.surahName} (${mockVerse.surahTransliteration})`}
      </Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={isLoading ? null : getNextVerse} // Disable if loading
          style={[
            styles.button,
            variant === 'dark' ? styles.darkButton : styles.lightButton,
            isLoading && { opacity: 0.5 },
          ]}
          disabled={isLoading}
        >
          <Text
            style={[
              styles.buttonText,
              variant === 'dark' ? styles.darkText : styles.lightText,
            ]}
          >
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
    fontSize: 22, // Reduced size
    marginBottom: 10,
    textAlign: 'center',
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
