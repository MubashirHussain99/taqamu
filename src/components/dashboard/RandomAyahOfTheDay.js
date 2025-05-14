// // // import React, { useState } from 'react';
// // // import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
// // // import AyahOfTheDay from './AyahOfTheDay';
// // // import { getRandomVerse, getSurahReference } from './verseData';
// // // // import { getRandomVerse, getSurahReference } from '@/data/mockQuranData';

// // // const RandomAyahOfTheDay = ({ variant = 'light', onlyShowUnread = false }) => {
// // //   const [isRead, setIsRead] = useState(false);
// // //   const [mockVerse, setMockVerse] = useState(getRandomVerse());
// // //   const [isLoading, setIsLoading] = useState(false);

// // //   const handleMarkAsRead = () => {
// // //     setIsRead(true);
// // //   };

// // //   const getNextVerse = () => {
// // //     setIsLoading(true);
// // //     setTimeout(() => {
// // //       setMockVerse(getRandomVerse());
// // //       setIsLoading(false);
// // //       setIsRead(false);
// // //     }, 500);
// // //   };

// // //   const surahReference = getSurahReference(mockVerse);

// // //   if (isLoading) {
// // //     return (
// // //       <View style={[styles.card, variant === 'dark' ? styles.darkCard : styles.lightCard]}>
// // //         <View style={styles.header}>
// // //           <Text style={[styles.title, variant === 'dark' ? styles.darkText : styles.lightText]}>
// // //             Daily Verse
// // //           </Text>
// // //         </View>
// // //         <View style={styles.loader}>
// // //           <ActivityIndicator size="large" color={variant === 'dark' ? '#34d399' : '#10b981'} />
// // //         </View>
// // //       </View>
// // //     );
// // //   }

// // //   return (
// // //     <View style={styles.wrapper}>
// // //       <AyahOfTheDay
// // //         ayahArabic={mockVerse.arabicText}
// // //         ayahTranslation={mockVerse.translationEn}
// // //         surahReference={surahReference}
// // //         surahNumber={mockVerse.surahNumber}
// // //         ayahNumber={mockVerse.ayahNumber}
// // //         isRead={isRead}
// // //         variant={variant}
// // //         onMarkAsRead={handleMarkAsRead}
// // //       />

// // //       <View style={styles.buttonContainer}>
// // //         <TouchableOpacity
// // //           onPress={getNextVerse}
// // //           style={[
// // //             styles.button,
// // //             variant === 'dark' ? styles.darkButton : styles.lightButton
// // //           ]}
// // //         >
// // //           <Text style={[
// // //             styles.buttonText,
// // //             variant === 'dark' ? styles.darkText : styles.lightText
// // //           ]}>
// // //             New Verse
// // //           </Text>
// // //         </TouchableOpacity>
// // //       </View>
// // //     </View>
// // //   );
// // // };

// // // const styles = StyleSheet.create({
// // //   wrapper: {
// // //     // gap: 5,
// // //   },
// // //   card: {
// // //     borderRadius: 12,
// // //     overflow: 'hidden',
// // //     shadowColor: '#000',
// // //     shadowOpacity: 0.1,
// // //     elevation: 3,
// // //   },
// // //   darkCard: {
// // //     backgroundColor: '#1e1b4b',
// // //   },
// // //   lightCard: {
// // //     backgroundColor: '#f4f1ff',
// // //   },
// // //   header: {
// // //     padding: 12,
// // //     borderBottomWidth: 1,
// // //     borderColor: 'rgba(255,255,255,0.1)',
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //   },
// // //   title: {
// // //     fontSize: 16,
// // //     fontWeight: '600',
// // //   },
// // //   loader: {
// // //     padding: 20,
// // //     alignItems: 'center',
// // //     justifyContent: 'center',
// // //   },
// // //   buttonContainer: {
// // //     alignItems: 'flex-end',
// // //     // marginTop: 6,
// // //     marginBottom: 10,
// // //   },
// // //   button: {
// // //     paddingVertical: 8,
// // //     paddingHorizontal: 16,
// // //     borderRadius: 999,
// // //   },
// // //   darkButton: {
// // //     backgroundColor: 'rgba(52, 211, 153, 0.2)',
// // //   },
// // //   lightButton: {
// // //     backgroundColor: '#d1fae5',
// // //   },
// // //   buttonText: {
// // //     fontSize: 14,
// // //     fontWeight: '500',
// // //   },
// // //   darkText: {
// // //     color: '#34d399',
// // //   },
// // //   lightText: {
// // //     color: '#059669',
// // //   },
// // // });

// // // export default RandomAyahOfTheDay;


// // import React, { useState, useEffect } from 'react';
// // import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
// // import AsyncStorage from '@react-native-async-storage/async-storage';
// // import AyahOfTheDay from './AyahOfTheDay';  // Assuming you have this component
// // import { getRandomVerse, getSurahReference } from './verseData';

// // const RandomAyahOfTheDay = ({ variant = 'light' }) => {
// //   const [isRead, setIsRead] = useState(false);
// //   const [mockVerse, setMockVerse] = useState(getRandomVerse());
// //   const [isLoading, setIsLoading] = useState(false);

// //   useEffect(() => {
// //     const checkReadStatus = async () => {
// //       const storedReadAyahs = await AsyncStorage.getItem('readAyahs');
// //       const readAyahs = storedReadAyahs ? JSON.parse(storedReadAyahs) : {};
// //       const ayahKey = `${mockVerse.surahNumber}-${mockVerse.ayahNumber}`;
// //       setIsRead(!!readAyahs[ayahKey]);
// //     };
// //     checkReadStatus();
// //   }, [mockVerse]);

// //   const handleMarkAsRead = async () => {
// //     setIsRead(true);
// //     const ayahKey = `${mockVerse.surahNumber}-${mockVerse.ayahNumber}`;
// //     const storedReadAyahs = await AsyncStorage.getItem('readAyahs');
// //     const readAyahs = storedReadAyahs ? JSON.parse(storedReadAyahs) : {};
// //     readAyahs[ayahKey] = true;
// //     await AsyncStorage.setItem('readAyahs', JSON.stringify(readAyahs));
// //   };

// //   const getNextVerse = () => {
// //     setIsLoading(true);
// //     setTimeout(() => {
// //       setMockVerse(getRandomVerse());
// //       setIsLoading(false);
// //       setIsRead(false);  // Reset the read status when fetching a new verse
// //     }, 500);
// //   };

// //   const surahReference = getSurahReference(mockVerse);

// //   if (isLoading) {
// //     return (
// //       <View style={[styles.card, variant === 'dark' ? styles.darkCard : styles.lightCard]}>
// //         <View style={styles.header}>
// //           <Text style={[styles.title, variant === 'dark' ? styles.darkText : styles.lightText]}>
// //             Daily Verse
// //           </Text>
// //         </View>
// //         <View style={styles.loader}>
// //           <ActivityIndicator size="large" color={variant === 'dark' ? '#34d399' : '#10b981'} />
// //         </View>
// //       </View>
// //     );
// //   }

// //   return (
// //     <View style={styles.wrapper}>
// //       <AyahOfTheDay
// //         ayahArabic={mockVerse.arabicText}
// //         ayahTranslation={mockVerse.translationEn}
// //         surahReference={surahReference}
// //         surahNumber={mockVerse.surahNumber}
// //         ayahNumber={mockVerse.ayahNumber}
// //         isRead={isRead}
// //         variant={variant}
// //         onMarkAsRead={handleMarkAsRead}
// //       />

// //       <View style={styles.buttonContainer}>
// //         <TouchableOpacity
// //           onPress={getNextVerse}
// //           style={[
// //             styles.button,
// //             variant === 'dark' ? styles.darkButton : styles.lightButton
// //           ]}
// //         >
// //           <Text style={[
// //             styles.buttonText,
// //             variant === 'dark' ? styles.darkText : styles.lightText
// //           ]}>
// //             New Verse
// //           </Text>
// //         </TouchableOpacity>
// //       </View>
// //     </View>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   wrapper: {
// //     // gap: 5,
// //   },
// //   card: {
// //     borderRadius: 12,
// //     overflow: 'hidden',
// //     shadowColor: '#000',
// //     shadowOpacity: 0.1,
// //     elevation: 3,
// //   },
// //   darkCard: {
// //     backgroundColor: '#1e1b4b',
// //   },
// //   lightCard: {
// //     backgroundColor: '#f4f1ff',
// //   },
// //   header: {
// //     padding: 12,
// //     borderBottomWidth: 1,
// //     borderColor: 'rgba(255,255,255,0.1)',
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //   },
// //   title: {
// //     fontSize: 16,
// //     fontWeight: '600',
// //   },
// //   loader: {
// //     padding: 20,
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //   },
// //   buttonContainer: {
// //     alignItems: 'flex-end',
// //     marginBottom: 10,
// //   },
// //   button: {
// //     paddingVertical: 8,
// //     paddingHorizontal: 16,
// //     borderRadius: 999,
// //   },
// //   darkButton: {
// //     backgroundColor: 'rgba(52, 211, 153, 0.2)',
// //   },
// //   lightButton: {
// //     backgroundColor: '#d1fae5',
// //   },
// //   buttonText: {
// //     fontSize: 14,
// //     fontWeight: '500',
// //   },
// //   darkText: {
// //     color: '#34d399',
// //   },
// //   lightText: {
// //     color: '#059669',
// //   },
// // });

// // export default RandomAyahOfTheDay;



// import React, { useState, useEffect } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import AyahOfTheDay from './AyahOfTheDay';  // Assuming you have this component

// const RandomAyahOfTheDay = ({ variant = 'light' }) => {
//   const [isRead, setIsRead] = useState(false);
//   const [mockVerse, setMockVerse] = useState(null);  // Initially null, will fetch from API
//   const [isLoading, setIsLoading] = useState(false);

//   // Fetch a random verse from the API
//   const fetchRandomVerse = async () => {
//     setIsLoading(true);
//     try {
//       const response = await fetch('https://api.alquran.cloud/v1/quran/ar.alafasy');
//       const data = await response.json();
//       const surahNumber = Math.floor(Math.random() * data.data.surahs.length) + 1;
//       const ayahNumber = Math.floor(Math.random() * 30) + 1; // Random ayah number (1 to 30 for example)
//       const verse = data.data.surahs.find(surah => surah.number === surahNumber).ayahs[ayahNumber - 1];

//       setMockVerse({
//         surahNumber,
//         ayahNumber,
//         arabicText: verse.text,
//         translationEn: verse.translation,
//       });
//     } catch (error) {
//       console.error('Error fetching verse:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchRandomVerse();  // Fetch the verse when the component mounts
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
//     fetchRandomVerse(); // Fetch a new random verse
//     setIsRead(false);  // Reset the read status when fetching a new verse
//   };

//   if (isLoading || !mockVerse) {
//     return (
//       <View style={[styles.card, variant === 'dark' ? styles.darkCard : styles.lightCard]}>
//         <View style={styles.header}>
//           <Text style={[styles.title, variant === 'dark' ? styles.darkText : styles.lightText]}>
//             Daily Verse
//           </Text>
//         </View>
//         <View style={styles.loader}>
//           <ActivityIndicator size="large" color={variant === 'dark' ? '#34d399' : '#10b981'} />
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
//           onPress={getNextVerse}
//           style={[styles.button, variant === 'dark' ? styles.darkButton : styles.lightButton]}
//         >
//           <Text style={[styles.buttonText, variant === 'dark' ? styles.darkText : styles.lightText]}>
//             New Verse
//           </Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   wrapper: {
//     // gap: 5,
//   },
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

















// import React, { useState, useEffect } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import AyahOfTheDay from './AyahOfTheDay';  // Assuming you have this component

// // You can define a simple mapping for translation or fetch it from another source
// const translationMap = {
//   "1:1": "In the name of Allah, the Most Gracious, the Most Merciful",
//   "1:2": "Praise be to Allah, the Lord of all the worlds",
//   "2:255": "Allah! There is no deity except Him, the Ever-Living, the Sustainer of existence.",
//   // Add more mappings or fetch from another API if needed
// };

// const RandomAyahOfTheDay = ({ variant = 'light' }) => {
//   const [isRead, setIsRead] = useState(false);
//   const [mockVerse, setMockVerse] = useState(null);  // Initially null, will fetch from API
//   const [isLoading, setIsLoading] = useState(false);

//   // Fetch a random verse from the API
//   const fetchRandomVerse = async () => {
//     setIsLoading(true);
//     try {
//       const response = await fetch('https://api.alquran.cloud/v1/quran/ar.alafasy');
//       const data = await response.json();
//       const surahNumber = Math.floor(Math.random() * data.data.surahs.length) + 1;
//       const ayahNumber = Math.floor(Math.random() * 30) + 1; // Random ayah number (1 to 30 for example)
//       const verse = data.data.surahs.find(surah => surah.number === surahNumber).ayahs[ayahNumber - 1];

//       // Attempt to retrieve the translation
//       const translation = translationMap[`${surahNumber}:${ayahNumber}`] || "Translation not available"; // Fallback to default message if no translation is found.

//       setMockVerse({
//         surahNumber,
//         ayahNumber,
//         arabicText: verse.text,
//         translationEn: translation,
//       });
//     } catch (error) {
//       console.error('Error fetching verse:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchRandomVerse();  // Fetch the verse when the component mounts
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
//     fetchRandomVerse(); // Fetch a new random verse
//     setIsRead(false);  // Reset the read status when fetching a new verse
//   };

//   if (isLoading || !mockVerse) {
//     return (
//       <View style={[styles.card, variant === 'dark' ? styles.darkCard : styles.lightCard]}>
//         <View style={styles.header}>
//           <Text style={[styles.title, variant === 'dark' ? styles.darkText : styles.lightText]}>
//             Daily Verse
//           </Text>
//         </View>
//         <View style={styles.loader}>
//           <ActivityIndicator size="large" color={variant === 'dark' ? '#34d399' : '#10b981'} />
//         </View>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.wrapper}>
//       <AyahOfTheDay
//         ayahArabic={mockVerse.arabicText}
//         ayahTranslation={mockVerse.translationEn}  // Display the English translation
//         surahReference={`Surah ${mockVerse.surahNumber}:${mockVerse.ayahNumber}`}
//         surahNumber={mockVerse.surahNumber}
//         ayahNumber={mockVerse.ayahNumber}
//         isRead={isRead}
//         variant={variant}
//         onMarkAsRead={handleMarkAsRead}
//       />

//       <View style={styles.buttonContainer}>
//         <TouchableOpacity
//           onPress={getNextVerse}
//           style={[styles.button, variant === 'dark' ? styles.darkButton : styles.lightButton]}
//         >
//           <Text style={[styles.buttonText, variant === 'dark' ? styles.darkText : styles.lightText]}>
//             New Verse
//           </Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   wrapper: {
//     // gap: 5,
//   },
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
        36: 83, 55: 78, 56: 96, 67: 30, 78: 40, 112: 4, 114: 6, // common examples
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
