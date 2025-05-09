// import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
// import React, { useEffect, useState } from 'react';
// import { useNavigation } from '@react-navigation/native';
// import Icon from 'react-native-vector-icons/MaterialIcons';

// const QuranScreen = () => {
//   const navigation = useNavigation();
//   const [quranData, setQuranData] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // جلب بيانات القرآن من API عام
//   useEffect(() => {
//     const fetchQuran = async () => {
//       try {
//         const response = await fetch('https://api.alquran.cloud/v1/quran/ar.alafasy');
//         const data = await response.json();
//         setQuranData(data.data.surahs);
//         setLoading(false);
//       } catch (error) {
//         console.error('خطأ في جلب بيانات القرآن:', error);
//         setLoading(false);
//       }
//     };

//     fetchQuran();
//   }, []);

//   return (
//     <View style={styles.container}>
//       {/* رأس الصفحة مع زر العودة */}
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Icon name="arrow-back" size={24} color="#000" />
//         </TouchableOpacity>
//         <Text style={styles.title}>القرآن الكريم</Text>
//       </View>

//       {loading ? (
//         <Text style={styles.loadingText}>Loading...</Text>
//       ) : (
//         <ScrollView contentContainerStyle={styles.scrollContainer}>
//           {quranData.map((surah) => (
//             <View key={surah.number} style={styles.surahContainer}>
//               <Text style={styles.surahName}>
//                 {surah.number}. {surah.name} - {surah.englishName}
//               </Text>
//               <Text style={styles.surahInfo}>
//                 {surah.ayahs.length} آية | {surah.revelationType === 'Meccan' ? 'مكية' : 'مدنية'}
//               </Text>
//             </View>
//           ))}
//         </ScrollView>
//       )}
//     </View>
//   );
// };

// export default QuranScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 16,
//     backgroundColor: '#fff',
//     borderBottomWidth: 1,
//     borderBottomColor: '#ddd',
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginRight: 20,
//     textAlign: 'right',
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
//   loadingText: {
//     fontSize: 16,
//     textAlign: 'center',
//     marginTop: 20,
//   },
// });


import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const QuranScreen = () => {
  const navigation = useNavigation();
  const [quranData, setQuranData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedSurah, setExpandedSurah] = useState(null); // Track the expanded surah

  // Fetch Quran data
  useEffect(() => {
    const fetchQuran = async () => {
      try {
        const response = await fetch('https://api.alquran.cloud/v1/quran/ar.alafasy');
        const data = await response.json();
        setQuranData(data.data.surahs);
        setLoading(false);
      } catch (error) {
        console.error('خطأ في جلب بيانات القرآن:', error);
        setLoading(false);
      }
    };

    fetchQuran();
  }, []);

  const toggleSurah = (surahNumber) => {
    setExpandedSurah(expandedSurah === surahNumber ? null : surahNumber);
  };

  return (
    <View style={styles.container}>
      {/* Header with back button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          {/* <Icon name="arrow-back" size={24} color="#000" /> */}
          <Text style={{fontSize:24,}}>❌</Text>
        </TouchableOpacity>
        <Text style={styles.title}>القرآن الكريم</Text>
      </View>

      {loading ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {quranData.map((surah) => (
            <View key={surah.number} style={styles.surahContainer}>
              <TouchableOpacity onPress={() => toggleSurah(surah.number)}>
                <Text style={styles.surahName}>
                  {surah.number}. {surah.name} - {surah.englishName}
                </Text>
              </TouchableOpacity>

              <Text style={styles.surahInfo}>
                {surah.ayahs.length} آية | {surah.revelationType === 'Meccan' ? 'مكية' : 'مدنية'}
              </Text>

              {/* Show the verses if the surah is expanded */}
              {expandedSurah === surah.number && (
                <View style={styles.versesContainer}>
                  {surah.ayahs.map((ayah, index) => (
                    <Text key={index} style={styles.ayahText}>
                      {index + 1}. {ayah.text}
                    </Text>
                  ))}
                </View>
              )}
            </View>
          ))}
        </ScrollView>
      )}
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
    marginBottom: 8,
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    color: '#fff',
  },
});
