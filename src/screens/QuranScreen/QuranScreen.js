// // File: src/screens/QuranScreen/QuranScreen.js
// import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
// import React, { useEffect, useState } from 'react';
// import { useNavigation } from '@react-navigation/native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import RootNavigator from '../../components/dashboard/BottomNavigation';

// const QuranScreen = () => {
//   const navigation = useNavigation();
//   const [quranData, setQuranData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [expandedSurah, setExpandedSurah] = useState(null);
//   const [readAyahs, setReadAyahs] = useState({}); // Track read Ayahs

//   useEffect(() => {
//     const fetchQuran = async () => {
//       try {
//         const response = await fetch('https://api.alquran.cloud/v1/quran/ar.alafasy');
//         const data = await response.json();
//         setQuranData(data.data.surahs);
//         setLoading(false);
//         loadReadAyahs(); // Load read Ayahs from AsyncStorage
//       } catch (error) {
//         console.error('خطأ في جلب بيانات القرآن:', error);
//         setLoading(false);
//       }
//     };

//     fetchQuran();
//   }, []);

//   // Load read Ayahs from AsyncStorage
//   const loadReadAyahs = async () => {
//     try {
//       const storedReadAyahs = await AsyncStorage.getItem('readAyahs');
//       if (storedReadAyahs) {
//         setReadAyahs(JSON.parse(storedReadAyahs));
//       }
//     } catch (error) {
//       console.error('Error loading read Ayahs:', error);
//     }
//   };

//   // Toggle the read state of an Ayah and store it in AsyncStorage
//   const toggleSurah = async (surahNumber, ayahNumber) => {
//     const ayahKey = `${surahNumber}-${ayahNumber}`;
//     const newReadAyahs = { ...readAyahs, [ayahKey]: !readAyahs[ayahKey] };
//     setReadAyahs(newReadAyahs);
//     await AsyncStorage.setItem('readAyahs', JSON.stringify(newReadAyahs));
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Text style={{fontSize: 24}}>❌</Text>
//         </TouchableOpacity>
//         <Text style={styles.title}>القرآن الكريم</Text>
//       </View>

//       {loading ? (
//         <Text style={styles.loadingText}>Loading...</Text>
//       ) : (
//         <ScrollView contentContainerStyle={styles.scrollContainer}>
//           {quranData.map((surah) => (
//             <View key={surah.number} style={styles.surahContainer}>
//               <TouchableOpacity onPress={() => setExpandedSurah(expandedSurah === surah.number ? null : surah.number)}>
//                 <Text style={styles.surahName}>
//                   {surah.number}. {surah.name} - {surah.englishName}
//                 </Text>
//               </TouchableOpacity>

//               <Text style={styles.surahInfo}>
//                 {surah.ayahs.length} آية | {surah.revelationType === 'Meccan' ? 'مكية' : 'مدنية'}
//               </Text>

//               {expandedSurah === surah.number && (
//                 <View style={styles.versesContainer}>
//                   {surah.ayahs.map((ayah, index) => {
//                     const ayahKey = `${surah.number}-${ayah.number}`;
//                     const isRead = readAyahs[ayahKey] || false; // Check if this Ayah is read
//                     return (
//                       <TouchableOpacity key={index} onPress={() => toggleSurah(surah.number, ayah.number)}>
//                         <Text
//                           style={[styles.ayahText, isRead && styles.readAyah]} // Apply green color if read
//                         >
//                           {index + 1}. {ayah.text}
//                         </Text>
//                       </TouchableOpacity>
//                     );
//                   })}
//                 </View>
//               )}
//             </View>
//           ))}
//         </ScrollView>
//       )}
//       <RootNavigator/>
//     </View>
//   );
// };

// export default QuranScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#1e293b',
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     padding: 16,
//     backgroundColor: '#1e293b',
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginRight: 20,
//     textAlign: 'right',
//     color: '#fff',
//   },
//   scrollContainer: {
//     padding: 16,
//   },
//   surahContainer: {
//     backgroundColor: '#fff',
//     padding: 16,
//     marginBottom: 12,
//     borderRadius: 8,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   surahName: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#2c3e50',
//     textAlign: 'right',
//   },
//   surahInfo: {
//     fontSize: 14,
//     color: '#7f8c8d',
//     marginTop: 4,
//     textAlign: 'right',
//   },
//   versesContainer: {
//     marginTop: 12,
//     padding: 10,
//     backgroundColor: '#f9f9f9',
//     borderRadius: 8,
//   },
//   ayahText: {
//     fontSize: 16,
//     color: '#34495e',
//     textAlign: 'right',
//     marginBottom: 8,
//   },
//   readAyah: {
//     color: '#34d399', // Green color for read Ayah
//   },
//   loadingText: {
//     fontSize: 16,
//     textAlign: 'center',
//     marginTop: 20,
//     color: '#fff',
//     height: '77%',
//   },
// });

// File: src/screens/QuranScreen/QuranScreen.js
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RootNavigator from '../../components/dashboard/BottomNavigation';

const QuranScreen = () => {
  const navigation = useNavigation();
  const [quranData, setQuranData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedSurah, setExpandedSurah] = useState(null);
  const [readAyahs, setReadAyahs] = useState({});

  useEffect(() => {
    fetchAllSurahs();
  }, []);

  const fetchAllSurahs = async () => {
    try {
      let allSurahs = [];

      for (let i = 1; i <= 114; i++) {
        const response = await fetch(`https://api.alquran.cloud/v1/surah/${i}/editions/ar.alafasy,en.sahih`);
        const data = await response.json();

        const arabicAyahs = data.data[0].ayahs;
        const englishAyahs = data.data[1].ayahs;

        const mergedAyahs = arabicAyahs.map((ayah, index) => ({
          number: ayah.numberInSurah,
          arabic: ayah.text,
          english: englishAyahs[index]?.text || '',
        }));

        allSurahs.push({
          number: data.data[0].number,
          name: data.data[0].name,
          englishName: data.data[0].englishName,
          revelationType: data.data[0].revelationType,
          ayahs: mergedAyahs,
        });
      }

      setQuranData(allSurahs);
      await loadReadAyahs();
    } catch (error) {
      console.error('Error fetching Quran:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadReadAyahs = async () => {
    try {
      const storedReadAyahs = await AsyncStorage.getItem('readAyahs');
      if (storedReadAyahs) {
        setReadAyahs(JSON.parse(storedReadAyahs));
      }
    } catch (error) {
      console.error('Error loading read Ayahs:', error);
    }
  };

  const toggleSurah = async (surahNumber, ayahNumber) => {
    const ayahKey = `${surahNumber}-${ayahNumber}`;
    const newReadAyahs = { ...readAyahs, [ayahKey]: !readAyahs[ayahKey] };
    setReadAyahs(newReadAyahs);
    await AsyncStorage.setItem('readAyahs', JSON.stringify(newReadAyahs));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ fontSize: 24 }}>❌</Text>
        </TouchableOpacity>
        <Text style={styles.title}>القرآن الكريم</Text>
      </View>

      {loading ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {quranData.map((surah) => (
            <View key={surah.number} style={styles.surahContainer}>
              <TouchableOpacity
                onPress={() =>
                  setExpandedSurah(expandedSurah === surah.number ? null : surah.number)
                }
              >
                <Text style={styles.surahName}>
                  {surah.number}. {surah.name} - {surah.englishName}
                </Text>
              </TouchableOpacity>
              <Text style={styles.surahInfo}>
                {surah.ayahs.length} آية |{' '}
                {surah.revelationType === 'Meccan' ? 'مكية' : 'مدنية'}
              </Text>

              {expandedSurah === surah.number && (
                <View style={styles.versesContainer}>
                  {surah.ayahs.map((ayah, index) => {
                    const ayahKey = `${surah.number}-${ayah.number}`;
                    const isRead = readAyahs[ayahKey] || false;
                    return (
                      <TouchableOpacity
                        key={index}
                        onPress={() => toggleSurah(surah.number, ayah.number)}
                      >
                        <Text style={[styles.ayahText, isRead && styles.readAyah]}>
                          {ayah.number}. {ayah.arabic}
                        </Text>
                        <Text style={styles.translationText}>{ayah.english}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </View>
          ))}
        </ScrollView>
      )}
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
    marginBottom: 4,
  },
  translationText: {
    fontSize: 14,
    color: '#555',
    textAlign: 'left',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  readAyah: {
    color: '#34d399',
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    color: '#fff',
    height: '77%',
  },
});
