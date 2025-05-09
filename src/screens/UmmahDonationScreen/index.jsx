// import { useNavigation } from '@react-navigation/native';
// import React, { useState } from 'react';
// import {
//   View,
//   ScrollView,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   Alert,
//   Image,
// } from 'react-native';
// // import { CardField, useStripe } from '@stripe/stripe-react-native';

// const UmmahDonationScreen = () => {
//   const navigation = useNavigation();
// //   const { confirmPayment } = useStripe();
//   const [amount, setAmount] = useState('');
//   const [cardDetails, setCardDetails] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');

//   const donationCauses = [
//     { id: 'education', title: 'Education for Muslim Youth' },
//     { id: 'orphans', title: 'Support for Orphans' },
//     { id: 'refugees', title: 'Refugee Assistance' },
//     { id: 'mosques', title: 'Mosque Development' },
//     { id: 'dawah', title: 'Dawah Programs' },
//     { id: 'general', title: 'General Ummah Fund' },
//   ];

//   const [selectedCause, setSelectedCause] = useState('general');

// //   const handlePayment = async () => {
// //     if (!amount) {
// //       Alert.alert('Error', 'Please enter an amount');
// //       return;
// //     }

// //     if (!cardDetails?.complete) {
// //       Alert.alert('Error', 'Please enter complete card details');
// //       return;
// //     }

// //     if (!name || !email) {
// //       Alert.alert('Error', 'Please enter your name and email');
// //       return;
// //     }

// //     setLoading(true);

// //     try {
// //       // In a real app, you would call your backend here
// //       const paymentIntent = await createPaymentIntent(amount, selectedCause);

// //       const { error } = await confirmPayment(paymentIntent.clientSecret, {
// //         type: 'Card',
// //         billingDetails: {
// //           name,
// //           email,
// //         },
// //       });

// //       if (error) {
// //         Alert.alert('Payment failed', error.message);
// //       } else {
// //         Alert.alert('Success', 'Your donation to the Ummah has been processed. JazakAllah Khair!');
// //         setAmount('');
// //         setName('');
// //         setEmail('');
// //       }
// //     } catch (e) {
// //       Alert.alert('Error', 'Payment failed. Please try again.');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

//   // Mock function - replace with actual backend call
//   const createPaymentIntent = async (amount, cause) => {
//     return {
//       clientSecret: 'mock_client_secret_' + Math.random().toString(36).substring(7),
//       amount: parseFloat(amount) * 100,
//       currency: 'usd',
//       metadata: { cause },
//     };
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
//         <Text style={{fontSize:16,fontWeight:"600",color:"#fff"}}>❌</Text>
//       </TouchableOpacity>

//       {/* <Image
//         source={require('../../assets/ummah-banner.jpg')}
//         style={styles.bannerImage}
//         resizeMode="cover"
//       /> */}

//       <Text style={styles.header}>Support Our Global Ummah</Text>

//       <Text style={styles.subHeader}>
//         Your donation helps strengthen the Muslim community worldwide, supporting education,
//         humanitarian aid, and Islamic development projects across diverse cultures and nations.
//       </Text>

//       <View style={styles.card}>
//         <Text style={styles.cardTitle}>Donation Information</Text>

//         <View style={styles.inputContainer}>
//           <Text style={styles.inputLabel}>Your Name</Text>
//           <TextInput
//             style={styles.input}
//             placeholder="Enter your name"
//             value={name}
//             onChangeText={setName}
//             placeholderTextColor="#999"
//           />
//         </View>

//         <View style={styles.inputContainer}>
//           <Text style={styles.inputLabel}>Email Address</Text>
//           <TextInput
//             style={styles.input}
//             placeholder="Enter your email"
//             value={email}
//             onChangeText={setEmail}
//             keyboardType="email-address"
//             placeholderTextColor="#999"
//           />
//         </View>

//         <View style={styles.inputContainer}>
//           <Text style={styles.inputLabel}>Donation Amount (USD)</Text>
//           <TextInput
//             style={styles.input}
//             placeholder="Enter amount"
//             value={amount}
//             onChangeText={setAmount}
//             keyboardType="numeric"
//             placeholderTextColor="#999"
//           />
//         </View>

//         <Text style={styles.inputLabel}>Select Donation Cause</Text>
//         <View style={styles.causeContainer}>
//           {donationCauses.map((cause) => (
//             <TouchableOpacity
//               key={cause.id}
//               style={[
//                 styles.causeButton,
//                 selectedCause === cause.id && styles.selectedCause,
//               ]}
//               onPress={() => setSelectedCause(cause.id)}
//             >
//               <Text style={[
//                 styles.causeText,
//                 selectedCause === cause.id && styles.selectedCauseText
//               ]}>
//                 {cause.title}
//               </Text>
//             </TouchableOpacity>
//           ))}
//         </View>
//       </View>

//       {/* <View style={styles.card}>
//         <Text style={styles.cardTitle}>Payment Details</Text>
//         <CardField
//           postalCodeEnabled={true}
//           placeholders={{
//             number: '4242 4242 4242 4242',
//           }}
//           cardStyle={styles.cardField}
//           style={styles.cardFieldContainer}
//           onCardChange={setCardDetails}
//         />
//       </View> */}

//       <TouchableOpacity
//         style={[styles.donateButton, loading && styles.disabledButton]}
//         // onPress={handlePayment}
//         disabled={loading}
//       >
//         <Text style={styles.donateButtonText}>
//           {loading ? 'Processing Donation...' : 'Donate to Ummah'}
//         </Text>
//       </TouchableOpacity>

//       <Text style={styles.footerText}>
//         "The believers in their mutual kindness, compassion and sympathy are just like one body.
//         When one of the limbs suffers, the whole body responds to it with wakefulness and fever."
//         (Sahih al-Bukhari)
//       </Text>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     padding: 20,
//     backgroundColor: '#f8f8f8',
//   },
//   backButton: {
//     alignSelf: 'flex-start',
//     marginBottom: 10,
//   },
//   backText: {
//     fontSize: 16,
//     color: '#3498db',
//   },
//   bannerImage: {
//     width: '100%',
//     height: 150,
//     borderRadius: 8,
//     marginBottom: 20,
//   },
//   header: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#2c3e50',
//     marginBottom: 10,
//     textAlign: 'center',
//   },
//   subHeader: {
//     fontSize: 14,
//     color: '#7f8c8d',
//     marginBottom: 20,
//     textAlign: 'center',
//     lineHeight: 20,
//   },
//   card: {
//     backgroundColor: 'white',
//     borderRadius: 10,
//     padding: 15,
//     marginBottom: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   cardTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#3498db',
//     marginBottom: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//     paddingBottom: 5,
//   },
//   inputContainer: {
//     marginBottom: 15,
//   },
//   inputLabel: {
//     fontSize: 14,
//     color: '#7f8c8d',
//     marginBottom: 5,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 5,
//     padding: 10,
//     fontSize: 16,
//     color: '#2c3e50',
//   },
//   causeContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//     marginTop: 10,
//   },
//   causeButton: {
//     padding: 10,
//     borderRadius: 5,
//     borderWidth: 1,
//     borderColor: '#ddd',
//     marginBottom: 10,
//     width: '48%',
//   },
//   selectedCause: {
//     backgroundColor: '#3498db',
//     borderColor: '#3498db',
//   },
//   causeText: {
//     fontSize: 12,
//     color: '#2c3e50',
//     textAlign: 'center',
//   },
//   selectedCauseText: {
//     color: 'white',
//   },
//   cardField: {
//     backgroundColor: '#ffffff',
//     borderColor: '#000000',
//     borderWidth: 1,
//     borderRadius: 5,
//     fontSize: 16,
//     placeholderColor: '#999999',
//   },
//   cardFieldContainer: {
//     height: 50,
//     marginVertical: 10,
//   },
//   donateButton: {
//     backgroundColor: '#27ae60',
//     padding: 15,
//     borderRadius: 5,
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   disabledButton: {
//     backgroundColor: '#95a5a6',
//   },
//   donateButtonText: {
//     color: 'white',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   footerText: {
//     fontSize: 12,
//     color: '#7f8c8d',
//     fontStyle: 'italic',
//     textAlign: 'center',
//     marginTop: 10,
//     lineHeight: 18,
//   },
// });

// export default UmmahDonationScreen;

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const UmmahDonationScreen = () => {
  const isTablet = Dimensions.get('window').width >= 768;
  const navigation = useNavigation();

  // Handle back button click
  const handleBackClick = () => {
    navigation.goBack(); // Go back to the previous screen
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={{uri: 'https://your-image-url.com'}} // Optional: Add a background image
        style={styles.backgroundImage}>
        <ScrollView contentContainerStyle={styles.contentContainer}>
          <View style={styles.headerContainer}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}>
              <Text style={{fontSize: 16, fontWeight: '600', color: '#fff'}}>
                ❌
              </Text>
            </TouchableOpacity>
            <Text style={[styles.header, isTablet && styles.headerTablet]}>
              Ummah
            </Text>
          </View>

          <View style={styles.body}>
            <Text style={styles.sectionTitle}>What is Ummah?</Text>
            <Text style={styles.description}>
              Ummah is a term used in Islam to describe the community of Muslims
              worldwide, who are united by their belief in one God (Allah) and
              the teachings of the Prophet Muhammad (PBUH). The concept of Ummah
              transcends geographical, cultural, and ethnic boundaries,
              emphasizing the importance of unity, mutual support, and
              compassion among Muslims. The Quran and Hadiths encourage
              believers to work together for the common good, help those in
              need, and promote peace and justice in society.
            </Text>

            <Text style={styles.sectionTitle}>
              The Importance of Unity in Ummah
            </Text>
            <Text style={styles.description}>
              The unity of the Ummah is a fundamental principle in Islam. The
              Quran emphasizes the need for Muslims to remain united, to support
              one another, and to work together to promote good and prevent
              evil. The Prophet Muhammad (PBUH) said: "The believers are like a
              body: when one part of the body suffers, the whole body feels the
              pain." (Sahih Muslim)
            </Text>

            <Text style={styles.sectionTitle}>Challenges Facing the Ummah</Text>
            <Text style={styles.description}>
              Despite the ideals of unity, the Ummah faces many challenges,
              including sectarian divisions, political conflicts, and social
              inequalities. These challenges threaten the strength and cohesion
              of the community. However, Muslims are encouraged to work together
              in solidarity to address these issues and to seek peaceful
              resolutions to conflicts.
            </Text>

            <Text style={styles.sectionTitle}>Quranic Verses on Unity</Text>
            <Text style={styles.verse}>
              {`Quran (49:10): "The believers are but brothers, so make settlement between your brothers. And fear Allah that you may receive mercy."`}
            </Text>

            <Text style={styles.verse}>
              {`Quran (3:103): "And hold firmly to the rope of Allah all together and do not become divided."`}
            </Text>

            <Text style={styles.sectionTitle}>
              The Role of Muslims in the Ummah
            </Text>
            <Text style={styles.description}>
              Every Muslim has a role to play in strengthening the Ummah. This
              includes acts of charity, spreading knowledge, offering help to
              those in need, and standing up for justice. By embodying the
              values of Islam and working together, Muslims can ensure that the
              Ummah remains strong and resilient in the face of adversity.
            </Text>

            <Text style={styles.sectionTitle}>Global Unity and Solidarity</Text>
            <Text style={styles.description}>
              The Ummah is not limited to any specific country or region.
              Muslims from all over the world are part of the same community,
              united by their faith. In times of crisis, the global Ummah comes
              together to provide aid and support to those in need. Whether it's
              in the form of humanitarian aid, financial support, or moral
              encouragement, the concept of Ummah emphasizes the importance of
              solidarity among Muslims.
            </Text>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              "The strength of the Ummah lies in its unity, and through our
              faith, we can overcome any obstacle together."
            </Text>
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 30,
    backgroundColor: '#0f172a', // Slate color
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  backButton: {
    marginRight: 15,
  },
  scrollContainer: {
    paddingBottom: 30,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
  },
  headerTablet: {
    fontSize: 32,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  body: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    marginVertical: 10,
    textAlign: 'left',
  },
  description: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'left',
    lineHeight: 22,
    marginBottom: 15,
  },
  verse: {
    fontSize: 14,
    color: '#fff',
    fontStyle: 'italic',
    textAlign: 'center',
    marginVertical: 10,
  },
  footer: {
    paddingTop: 20,
  },
  footerText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
});

export default UmmahDonationScreen;
