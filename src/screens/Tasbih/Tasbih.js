// // import {useNavigation} from '@react-navigation/native';
// // import React, {useState, useEffect} from 'react';
// // import {
// //   View,
// //   Text,
// //   TouchableOpacity,
// //   StyleSheet,
// //   ScrollView,
// //   BackHandler,
// //   Alert,
// //   TextInput,
// //   Dimensions,
// // } from 'react-native';

// // const Tasbih = () => {
// //   const navigation = useNavigation();
// //   const isTablet = Dimensions.get('window').width >= 768;
// //   // Sample tasbih data - in a real app, this would come from an API
// //   const [tasbihData, setTasbihData] = useState([
// //     {id: 1, text: 'سُبْحَانَ اللَّه', count: 0, limit: 33, read: false},
// //     {id: 2, text: 'الْحَمْدُ لِلَّه', count: 0, limit: 33, read: false},
// //     {id: 3, text: 'اللَّهُ أَكْبَر', count: 0, limit: 33, read: false},
// //     {id: 4, text: 'لَا إِلٰهَ إِلَّا اللَّه', count: 0, limit: 33, read: false},
// //     // Add more tasbih as needed
// //   ]);

// //   const [totalCount, setTotalCount] = useState(0);
// //   const [submitEnabled, setSubmitEnabled] = useState(false);
// //   const [newTasbih, setNewTasbih] = useState(''); // state for the new Tasbih input

// //   // Handle back button press
// //   useEffect(() => {
// //     const backAction = () => {
// //       if (navigation.canGoBack()) {
// //         navigation.goBack();
// //         return true;
// //       }
// //       return false;
// //     };

// //     const backHandler = BackHandler.addEventListener(
// //       'hardwareBackPress',
// //       backAction,
// //     );

// //     return () => backHandler.remove();
// //   }, [navigation]);

// //   // Update total count whenever counts change
// //   useEffect(() => {
// //     const newTotal = tasbihData.reduce((sum, item) => sum + item.count, 0);
// //     setTotalCount(newTotal);
// //     setSubmitEnabled(newTotal > 0);
// //   }, [tasbihData]);

// //   const incrementCount = id => {
// //     setTasbihData(prevData =>
// //       prevData.map(item =>
// //         item.id === id && item.count < item.limit
// //           ? {...item, count: item.count + 1}
// //           : item,
// //       ),
// //     );
// //   };

// //   const resetCount = id => {
// //     setTasbihData(prevData =>
// //       prevData.map(item => (item.id === id ? {...item, count: 0} : item)),
// //     );
// //   };

// //   const resetAllCounts = () => {
// //     setTasbihData(prevData => prevData.map(item => ({...item, count: 0})));
// //   };

// //   const handleSubmit = async () => {
// //     // Prepare data to send to API
// //     const completedTasbih = tasbihData.filter(item => item.count > 0);

// //     // In a real app, this would be an API call
// //     console.log('Submitting to API:', completedTasbih);

// //     // Mock API response handling
// //     try {
// //       // Here you would have your actual API call:
// //       // const response = await api.markTasbihAsRead(completedTasbih);

// //       // For now, we'll just simulate success
// //       Alert.alert('Success', 'Your tasbih have been marked as read!');

// //       // Reset counts after successful submission
// //       resetAllCounts();
// //     } catch (error) {
// //       Alert.alert('Error', 'Failed to submit tasbih. Please try again.');
// //       console.error('API Error:', error);
// //     }
// //   };

// //   const addCustomTasbih = () => {
// //     if (newTasbih.trim() !== '') {
// //       setTasbihData(prevData => [
// //         ...prevData,
// //         {id: Date.now(), text: newTasbih, count: 0, limit: 33, read: false},
// //       ]);
// //       setNewTasbih(''); // Clear the input field after adding
// //     } else {
// //       Alert.alert('Error', 'Please enter a valid tasbih word');
// //     }
// //   };

// //   return (
// //     <View style={styles.container}>
// //       {/* Header with Back Button */}
// //       {/* <View style={styles.header}>
// //         <TouchableOpacity
// //           onPress={() => navigation.goBack()}
// //           style={styles.backButton}>
// //           <Text style={{fontSize:16,fontWeight:"600",color:"#fff",paddingVertical:8,paddingHorizontal:5}}>❌</Text>
// //         </TouchableOpacity>
// //         <Text style={styles.headerTitle}>Tasbih</Text>
// //         <View style={styles.headerRightPlaceholder} />
// //       </View> */}
// //       <View style={styles.headerContainer}>
// //         <TouchableOpacity
// //           style={styles.backButton}
// //           onPress={() => navigation.goBack()}>
// //           <Text style={{fontSize: 16, fontWeight: '600', color: '#fff'}}>
// //             ❌
// //           </Text>
// //         </TouchableOpacity>
// //         <Text style={[styles.header, isTablet && styles.headerTablet]}>
// //           Tasbih
// //         </Text>
// //       </View>

// //       {/* Total Count Display */}
// //       <View style={styles.totalCountContainer}>
// //         <Text style={styles.totalCountText}>Total: {totalCount}</Text>
// //         {submitEnabled && (
// //           <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
// //             <Text style={styles.submitButtonText}>Submit</Text>
// //           </TouchableOpacity>
// //         )}
// //       </View>

// //       <View style={styles.inputContainer}>
// //         <TextInput
// //           style={styles.input}
// //           placeholder="Add your custom Tasbih"
// //           placeholderTextColor="#ccc"
// //           value={newTasbih}
// //           onChangeText={setNewTasbih}
// //         />
// //         <TouchableOpacity onPress={addCustomTasbih} style={styles.addButton}>
// //           <Text style={styles.buttonText}>Add</Text>
// //         </TouchableOpacity>
// //       </View>

// //       {/* Tasbih List */}
// //       <ScrollView contentContainerStyle={styles.tasbihList}>
// //         {tasbihData.map(item => (
// //           <View key={item.id} style={styles.tasbihItem}>
// //             <Text style={styles.tasbihText}>{item.text}</Text>
// //             <View style={styles.counterContainer}>
// //               <Text style={styles.counterText}>
// //                 {item.count}/{item.limit}
// //               </Text>
// //               <TouchableOpacity
// //                 onPress={() => incrementCount(item.id)}
// //                 style={[
// //                   styles.counterButton,
// //                   item.count >= item.limit && styles.disabledButton,
// //                 ]}
// //                 disabled={item.count >= item.limit}>
// //                 <Text style={styles.buttonText}>+</Text>
// //               </TouchableOpacity>
// //               <TouchableOpacity
// //                 onPress={() => resetCount(item.id)}
// //                 style={styles.resetButton}>
// //                 <Text style={styles.buttonText}>Reset</Text>
// //               </TouchableOpacity>
// //             </View>
// //           </View>
// //         ))}
// //       </ScrollView>

// //       {/* Global Reset Button */}
// //       <TouchableOpacity
// //         onPress={resetAllCounts}
// //         style={styles.globalResetButton}>
// //         <Text style={styles.globalResetButtonText}>Reset All</Text>
// //       </TouchableOpacity>
// //     </View>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     backgroundColor: APP_BACKGROUND,
// //   },
// //   headerContainer: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     paddingHorizontal: 15,
// //     marginBottom: 15,
// //   },
// //   backButton: {
// //     marginRight: 15,
// //   },
// //   scrollContainer: {
// //     paddingBottom: 30,
// //   },
// //   header: {
// //     fontSize: 24,
// //     fontWeight: 'bold',
// //     color: '#fff',
// //     flex: 1,
// //   },
// //   headerTablet: {
// //     fontSize: 32,
// //   },
// //   // header: {
// //   //   flexDirection: 'row',
// //   //   justifyContent: 'space-between',
// //   //   alignItems: 'center',
// //   //   // padding: 6,
// //   //   backgroundColor: '#155c4b',
// //   //   borderBottomWidth: 1,
// //   //   borderBottomColor: '#ddd',
// //   // },
// //   backButton: {
// //     padding: 5,
// //     flexDirection: 'row',
// //     justifyContent: 'flex-start',
// //   },
// //   backButtonText: {
// //     color: 'white',
// //     fontSize: 36,
// //     fontWeight: 'bold',
// //   },
// //   headerTitle: {
// //     color: 'white',
// //     fontSize: 20,
// //     fontWeight: 'bold',
// //   },
// //   headerRightPlaceholder: {
// //     width: 60, // To balance the header with the back button
// //   },
// //   totalCountContainer: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     padding: 15,
// //     backgroundColor: APP_BACKGROUND,
// //   },
// //   totalCountText: {
// //     fontSize: 18,
// //     fontWeight: 'bold',
// //     color: '#fff',
// //   },
// //   submitButton: {
// //     backgroundColor: '#2E7D32',
// //     paddingVertical: 8,
// //     paddingHorizontal: 15,
// //     borderRadius: 5,
// //   },
// //   submitButtonText: {
// //     color: 'white',
// //     fontWeight: 'bold',
// //   },
// //   tasbihList: {
// //     paddingBottom: 80, // Space for the global reset button
// //   },
// //   tasbihItem: {
// //     backgroundColor: 'white',
// //     margin: 10,
// //     padding: 15,
// //     borderRadius: 8,
// //     shadowColor: '#000',
// //     shadowOffset: {width: 0, height: 2},
// //     shadowOpacity: 0.1,
// //     shadowRadius: 4,
// //     elevation: 2,
// //   },
// //   tasbihText: {
// //     fontSize: 18,
// //     fontWeight: 'bold',
// //     marginBottom: 10,
// //     color: '#333',
// //     textAlign: 'center',
// //   },
// //   counterContainer: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //   },
// //   counterText: {
// //     fontSize: 16,
// //     color: '#666',
// //     flex: 1,
// //   },
// //   counterButton: {
// //     backgroundColor: '#4CAF50',
// //     width: 40,
// //     height: 40,
// //     borderRadius: 20,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     marginHorizontal: 5,
// //   },
// //   disabledButton: {
// //     backgroundColor: '#cccccc',
// //   },
// //   resetButton: {
// //     backgroundColor: '#f44336',
// //     paddingVertical: 8,
// //     paddingHorizontal: 12,
// //     borderRadius: 5,
// //     marginLeft: 5,
// //   },
// //   buttonText: {
// //     color: 'white',
// //     fontWeight: 'bold',
// //   },
// //   globalResetButton: {
// //     position: 'absolute',
// //     bottom: 30,
// //     left: 20,
// //     right: 20,
// //     backgroundColor: '#f44336',
// //     padding: 15,
// //     borderRadius: 8,
// //     alignItems: 'center',
// //   },
// //   globalResetButtonText: {
// //     color: 'white',
// //     fontWeight: 'bold',
// //     fontSize: 16,
// //   },
// //   inputContainer: {flexDirection: 'row', marginBottom: 16, padding: 10},
// //   input: {
// //     flex: 1,
// //     borderWidth: 1,
// //     borderColor: '#ccc',
// //     padding: 8,
// //     marginRight: 8,
// //   },
// //   addButton: {
// //     backgroundColor: '#2E7D32',
// //     padding: 8,
// //     borderRadius: 4,
// //     flexDirection: 'row',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
// //   buttonText: {color: '#fff'},
// // });

// // export default Tasbih;

// import {useNavigation} from '@react-navigation/native';
// import React, {useState, useEffect} from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   ScrollView,
//   BackHandler,
//   Alert,
//   TextInput,
//   Dimensions,
//   ActivityIndicator,
// } from 'react-native';

// const TOTAL_SURAH = 114; // Total surahs in Quran

// const surahAyahCount = {
//   // Key: Surah number, Value: Number of Ayahs in that Surah
//   // For demo, I'll put some data, you can expand this list fully
//   1: 7,
//   2: 286,
//   3: 200,
//   4: 176,
//   5: 120,
//   6: 165,
//   7: 206,
//   8: 75,
//   9: 129,
//   10: 109,
//   // You can add all surahs here if you want...
//   114: 6,
// };

// const Tasbih = () => {
//   const navigation = useNavigation();
//   const isTablet = Dimensions.get('window').width >= 768;

//   const [tasbihData, setTasbihData] = useState([
//     {id: 1, text: 'سُبْحَانَ اللَّه', count: 0, limit: 33, read: false},
//     {id: 2, text: 'الْحَمْدُ لِلَّه', count: 0, limit: 33, read: false},
//     {id: 3, text: 'اللَّهُ أَكْبَر', count: 0, limit: 33, read: false},
//     {id: 4, text: 'لَا إِلٰهَ إِلَّا اللَّه', count: 0, limit: 33, read: false},
//   ]);
//   const [totalCount, setTotalCount] = useState(0);
//   const [submitEnabled, setSubmitEnabled] = useState(false);
//   const [newTasbih, setNewTasbih] = useState('');
//   const [loading, setLoading] = useState(false);

//   // Back button handler
//   useEffect(() => {
//     const backAction = () => {
//       if (navigation.canGoBack()) {
//         navigation.goBack();
//         return true;
//       }
//       return false;
//     };
//     const backHandler = BackHandler.addEventListener(
//       'hardwareBackPress',
//       backAction,
//     );
//     return () => backHandler.remove();
//   }, [navigation]);

//   useEffect(() => {
//     const newTotal = tasbihData.reduce((sum, item) => sum + item.count, 0);
//     setTotalCount(newTotal);
//     setSubmitEnabled(newTotal > 0);
//   }, [tasbihData]);

//   const incrementCount = id => {
//     setTasbihData(prevData =>
//       prevData.map(item =>
//         item.id === id && item.count < item.limit
//           ? {...item, count: item.count + 1}
//           : item,
//       ),
//     );
//   };

//   const resetCount = id => {
//     setTasbihData(prevData =>
//       prevData.map(item => (item.id === id ? {...item, count: 0} : item)),
//     );
//   };

//   const resetAllCounts = () => {
//     setTasbihData(prevData => prevData.map(item => ({...item, count: 0})));
//   };

//   const handleSubmit = async () => {
//     const completedTasbih = tasbihData.filter(item => item.count > 0);
//     console.log('Submitting to API:', completedTasbih);
//     try {
//       Alert.alert('Success', 'Your tasbih have been marked as read!');
//       resetAllCounts();
//     } catch (error) {
//       Alert.alert('Error', 'Failed to submit tasbih. Please try again.');
//       console.error('API Error:', error);
//     }
//   };

//   const addCustomTasbih = () => {
//     if (newTasbih.trim() !== '') {
//       setTasbihData(prevData => [
//         ...prevData,
//         {id: Date.now(), text: newTasbih, count: 0, limit: 33, read: false},
//       ]);
//       setNewTasbih('');
//     } else {
//       Alert.alert('Error', 'Please enter a valid tasbih word');
//     }
//   };

//   // Helper function to get random Surah and Ayah
//   const getRandomSurahAndAyah = () => {
//     const randomSurah = Math.floor(Math.random() * TOTAL_SURAH) + 1;
//     const ayahCount = surahAyahCount[randomSurah] || 10; // Default 10 if not in object
//     const randomAyah = Math.floor(Math.random() * ayahCount) + 1;
//     return {randomSurah, randomAyah};
//   };

//   // Add Quran ayah as Tasbih
//   const addQuranTasbih = async () => {
//     setLoading(true);
//     try {
//       const {randomSurah, randomAyah} = getRandomSurahAndAyah();

//       const response = await fetch(
//         `https://api.alquran.cloud/v1/ayah/${randomSurah}:${randomAyah}/editions/ar.alafasy,en.sahih`,
//       );
//       const data = await response.json();

//       if (data.code === 200 && data.data && data.data.length > 0) {
//         // Arabic text is in data.data[0].text (ar.alafasy edition)
//         const arabicText = data.data[0].text;

//         // Check if this tasbih already exists to avoid duplicates
//         const exists = tasbihData.some(item => item.text === arabicText);
//         if (exists) {
//           Alert.alert('Info', 'This Tasbih already exists.');
//         } else {
//           setTasbihData(prevData => [
//             ...prevData,
//             {
//               id: Date.now(),
//               text: arabicText,
//               count: 0,
//               limit: 33,
//               read: false,
//             },
//           ]);
//         }
//       } else {
//         Alert.alert('Error', 'Failed to fetch Quran ayah.');
//       }
//     } catch (error) {
//       Alert.alert('Error', 'Something went wrong while fetching Quran ayah.');
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.headerContainer}>
//         <TouchableOpacity
//           style={styles.backButton}
//           onPress={() => navigation.goBack()}>
//           <Text style={{fontSize: 16, fontWeight: '600', color: '#fff'}}>
//             ❌
//           </Text>
//         </TouchableOpacity>
//         <Text style={[styles.header, isTablet && styles.headerTablet]}>
//           Tasbih
//         </Text>
//       </View>

//       <View style={styles.totalCountContainer}>
//         <Text style={styles.totalCountText}>Total: {totalCount}</Text>
//         {submitEnabled && (
//           <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
//             <Text style={styles.submitButtonText}>Submit</Text>
//           </TouchableOpacity>
//         )}
//       </View>

//       <View style={styles.inputContainer}>
//         <TextInput
//           style={styles.input}
//           placeholder="Add your custom Tasbih"
//           placeholderTextColor="#ccc"
//           value={newTasbih}
//           onChangeText={setNewTasbih}
//         />
//         <TouchableOpacity onPress={addCustomTasbih} style={styles.addButton}>
//           <Text style={styles.buttonText}>Add</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Add Quran Tasbih Button */}
//       <View style={{paddingHorizontal: 10, marginBottom: 10}}>
//         <TouchableOpacity
//           onPress={addQuranTasbih}
//           style={[styles.addButton, {backgroundColor: '#0057b7'}]}
//           disabled={loading}>
//           {loading ? (
//             <ActivityIndicator color="#fff" />
//           ) : (
//             <Text style={styles.buttonText}>Add Quran Tasbih</Text>
//           )}
//         </TouchableOpacity>
//       </View>

//       <ScrollView contentContainerStyle={styles.tasbihList}>
//         {tasbihData.map(item => (
//           <View key={item.id} style={styles.tasbihItem}>
//             <Text style={styles.tasbihText}>{item.text}</Text>
//             <View style={styles.counterContainer}>
//               <Text style={styles.counterText}>
//                 {item.count}/{item.limit}
//               </Text>
//               <TouchableOpacity
//                 onPress={() => incrementCount(item.id)}
//                 style={[
//                   styles.counterButton,
//                   item.count >= item.limit && styles.disabledButton,
//                 ]}
//                 disabled={item.count >= item.limit}>
//                 <Text style={styles.buttonText}>+</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 onPress={() => resetCount(item.id)}
//                 style={styles.resetButton}>
//                 <Text style={styles.buttonText}>Reset</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         ))}
//       </ScrollView>

//       <TouchableOpacity
//         onPress={resetAllCounts}
//         style={styles.globalResetButton}>
//         <Text style={styles.globalResetButtonText}>Reset All</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {flex: 1, backgroundColor: '#0f172a'},
//   headerContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 15,
//     marginBottom: 15,
//   },
//   backButton: {marginRight: 15},
//   header: {fontSize: 24, fontWeight: 'bold', color: '#fff', flex: 1},
//   headerTablet: {fontSize: 32},
//   totalCountContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 15,
//     backgroundColor: APP_BACKGROUND,
//   },
//   totalCountText: {fontSize: 18, fontWeight: 'bold', color: '#fff'},
//   submitButton: {
//     backgroundColor: '#2E7D32',
//     paddingVertical: 8,
//     paddingHorizontal: 15,
//     borderRadius: 5,
//   },
//   submitButtonText: {color: 'white', fontWeight: 'bold'},
//   tasbihList: {paddingBottom: 80},
//   tasbihItem: {
//     backgroundColor: 'white',
//     margin: 10,
//     padding: 15,
//     borderRadius: 8,
//   },
//   tasbihText: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#0f172a',
//   },
//   counterContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 10,
//   },
//   counterText: {fontSize: 16, marginRight: 10},
//   counterButton: {
//     backgroundColor: APP_BACKGROUND,
//     padding: 8,
//     marginRight: 10,
//     borderRadius: 5,
//   },
//   resetButton: {
//     backgroundColor: '#b71c1c',
//     padding: 8,
//     borderRadius: 5,
//   },
//   disabledButton: {backgroundColor: '#888'},
//   buttonText: {color: 'white', fontWeight: 'bold', fontSize: 18},
//   inputContainer: {
//     flexDirection: 'row',
//     paddingHorizontal: 10,
//     marginBottom: 10,
//   },
//   input: {
//     flex: 1,
//     borderColor: '#555',
//     borderWidth: 1,
//     borderRadius: 8,
//     paddingHorizontal: 10,
//     color: 'white',
//     height: 40,
//   },
//   addButton: {
//     backgroundColor: APP_BACKGROUND,
//     borderColor: '#0f172a',
//     borderWidth: 1,
//     paddingHorizontal: 15,
//     justifyContent: 'center',
//     marginLeft: 10,
//     borderRadius: 8,
//   },
//   globalResetButton: {
//     backgroundColor: '#b71c1c',
//     margin: 15,
//     paddingVertical: 12,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   globalResetButtonText: {
//     color: 'white',
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
// });

// export default Tasbih;

import {useNavigation} from '@react-navigation/native';
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  BackHandler,
  Alert,
  TextInput,
  Dimensions,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import {APP_BACKGROUND} from '../../styles/screenStyles';

const TOTAL_SURAH = 114;

const surahAyahCount = {
  1: 7,
  2: 286,
  3: 200,
  4: 176,
  5: 120,
  6: 165,
  7: 206,
  8: 75,
  9: 129,
  10: 109,
  114: 6,
};

const Tasbih = () => {
  const navigation = useNavigation();
  const isTablet = Dimensions.get('window').width >= 768;

  // Initial tasbih data with only Arabic text; english meaning empty for those
  const [tasbihData, setTasbihData] = useState([
    {
      id: 1,
      arabic: 'سُبْحَانَ اللَّه',
      english: 'Glory be to Allah',
      count: 0,
      limit: 33,
      read: false,
    },
    {
      id: 2,
      arabic: 'الْحَمْدُ لِلَّه',
      english: 'Praise be to Allah',
      count: 0,
      limit: 33,
      read: false,
    },
    {
      id: 3,
      arabic: 'اللَّهُ أَكْبَر',
      english: 'Allah is the Greatest',
      count: 0,
      limit: 33,
      read: false,
    },
    {
      id: 4,
      arabic: 'لَا إِلٰهَ إِلَّا اللَّه',
      english: 'There is no god but Allah',
      count: 0,
      limit: 33,
      read: false,
    },
  ]);
  const [totalCount, setTotalCount] = useState(0);
  const [submitEnabled, setSubmitEnabled] = useState(false);
  const [newTasbih, setNewTasbih] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const backAction = () => {
      if (navigation.canGoBack()) {
        navigation.goBack();
        return true;
      }
      return false;
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, [navigation]);

  useEffect(() => {
    const newTotal = tasbihData.reduce((sum, item) => sum + item.count, 0);
    setTotalCount(newTotal);
    setSubmitEnabled(newTotal > 0);
  }, [tasbihData]);

  const incrementCount = id => {
    setTasbihData(prevData =>
      prevData.map(item =>
        item.id === id && item.count < item.limit
          ? {...item, count: item.count + 1}
          : item,
      ),
    );
  };

  const resetCount = id => {
    setTasbihData(prevData =>
      prevData.map(item => (item.id === id ? {...item, count: 0} : item)),
    );
  };

  const resetAllCounts = () => {
    setTasbihData(prevData => prevData.map(item => ({...item, count: 0})));
  };

  const handleSubmit = async () => {
    const completedTasbih = tasbihData.filter(item => item.count > 0);
    console.log('Submitting to API:', completedTasbih);
    try {
      Alert.alert('Success', 'Your tasbih have been marked as read!');
      resetAllCounts();
    } catch (error) {
      Alert.alert('Error', 'Failed to submit tasbih. Please try again.');
      console.error('API Error:', error);
    }
  };

  const addCustomTasbih = () => {
    if (newTasbih.trim() !== '') {
      setTasbihData(prevData => [
        ...prevData,
        {
          id: Date.now(),
          arabic: newTasbih,
          english: '',
          count: 0,
          limit: 33,
          read: false,
        },
      ]);
      setNewTasbih('');
    } else {
      Alert.alert('Error', 'Please enter a valid tasbih word');
    }
  };

  const getRandomSurahAndAyah = () => {
    const randomSurah = Math.floor(Math.random() * TOTAL_SURAH) + 1;
    const ayahCount = surahAyahCount[randomSurah] || 10;
    const randomAyah = Math.floor(Math.random() * ayahCount) + 1;
    return {randomSurah, randomAyah};
  };

  const addQuranTasbih = async () => {
    setLoading(true);
    try {
      const {randomSurah, randomAyah} = getRandomSurahAndAyah();

      const response = await fetch(
        `https://api.alquran.cloud/v1/ayah/${randomSurah}:${randomAyah}/editions/ar.alafasy,en.sahih`,
      );
      const data = await response.json();

      if (data.code === 200 && data.data && data.data.length > 1) {
        // data.data[0] is Arabic edition, data.data[1] is English edition
        const arabicText = data.data[0].text;
        const englishText = data.data[1].text;

        const exists = tasbihData.some(item => item.arabic === arabicText);
        if (exists) {
          Alert.alert('Info', 'This Tasbih already exists.');
        } else {
          setTasbihData(prevData => [
            ...prevData,
            {
              id: Date.now(),
              arabic: arabicText,
              english: englishText,
              count: 0,
              limit: 33,
              read: false,
            },
          ]);
        }
      } else {
        Alert.alert('Error', 'Failed to fetch Quran ayah.');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong while fetching Quran ayah.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

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
          <Text
            style={[styles.headerText, isTablet && styles.headerTextTablet]}>
            Tasbih
          </Text>
          <Text style={styles.headerSubtitle}>
            {tasbihData.length} phrases · Total {totalCount}
          </Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.totalCountContainer}>
        {submitEnabled ? (
          <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
            <Text style={styles.submitButtonText}>Submit progress</Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.totalCountHint}>
            Tap + on each phrase to count your dhikr
          </Text>
        )}
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add your custom Tasbih"
          placeholderTextColor="#94a3b8"
          value={newTasbih}
          onChangeText={setNewTasbih}
        />
        <TouchableOpacity onPress={addCustomTasbih} style={styles.addButton}>
          <Text style={styles.buttonText}>Add</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.quranButtonWrap}>
        <TouchableOpacity
          onPress={addQuranTasbih}
          style={styles.quranButton}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Add Quran Ayah</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.tasbihList}
        showsVerticalScrollIndicator={false}>
        {tasbihData.map(item => (
          <View
            key={item.id}
            style={[styles.tasbihItem, isTablet && styles.tasbihItemTablet]}>
            <Text
              style={[styles.tasbihText, isTablet && styles.tasbihTextTablet]}>
              {item.arabic}
            </Text>
            {item.english ? (
              <Text style={styles.englishText}>{item.english}</Text>
            ) : null}
            <View style={styles.counterContainer}>
              <Text style={styles.counterText}>
                {item.count}/{item.limit}
              </Text>
              <TouchableOpacity
                onPress={() => incrementCount(item.id)}
                style={[
                  styles.counterButton,
                  item.count >= item.limit && styles.disabledButton,
                ]}
                disabled={item.count >= item.limit}>
                <Text style={styles.buttonText}>+</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => resetCount(item.id)}
                style={styles.resetButton}>
                <Text style={styles.buttonText}>Reset</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <TouchableOpacity
          onPress={resetAllCounts}
          style={styles.globalResetButton}>
          <Text style={styles.globalResetButtonText}>Reset All</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: APP_BACKGROUND,
  },
  scrollView: {
    flex: 1,
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
  headerTextTablet: {
    fontSize: 28,
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
  totalCountContainer: {
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  totalCountHint: {
    fontSize: 14,
    color: '#a7f3d0',
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: '#059669',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  input: {
    flex: 1,
    borderColor: '#0d4236',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    color: '#fff',
    backgroundColor: '#0d4236',
    height: 44,
  },
  addButton: {
    backgroundColor: '#0d4236',
    paddingHorizontal: 16,
    marginLeft: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
  },
  quranButtonWrap: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  quranButton: {
    backgroundColor: '#0d4236',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  tasbihList: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  tasbihItem: {
    backgroundColor: '#0d4236',
    marginBottom: 12,
    borderRadius: 12,
    padding: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 2},
  },
  tasbihItemTablet: {
    padding: 20,
  },
  tasbihText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#f59e0b',
    textAlign: 'right',
  },
  tasbihTextTablet: {
    fontSize: 28,
  },
  englishText: {
    fontSize: 14,
    color: '#d1fae5',
    marginTop: 6,
    marginBottom: 8,
    lineHeight: 20,
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  counterText: {
    fontSize: 16,
    marginRight: 10,
    color: '#fff',
    fontWeight: '600',
  },
  counterButton: {
    backgroundColor: APP_BACKGROUND,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 10,
    borderRadius: 8,
  },
  resetButton: {
    backgroundColor: '#b91c1c',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  disabledButton: {
    backgroundColor: '#64748b',
  },
  globalResetButton: {
    backgroundColor: '#b91c1c',
    marginTop: 8,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  globalResetButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default Tasbih;
