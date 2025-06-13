// import React, {useState} from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TextInput,
//   TouchableOpacity,
//   Alert,
//   Dimensions,
// } from 'react-native';
// import {useStripe} from '@stripe/stripe-react-native';
// import {useNavigation} from '@react-navigation/native';

// const DonateScreen = ({route}) => {
//   const isTablet = Dimensions.get('window').width >= 768;
//   const navigation = useNavigation();
//   const title = route?.params?.title ?? 'Donation';
//   const {initPaymentSheet, presentPaymentSheet} = useStripe();

//   const [amount, setAmount] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleDonate = async () => {
//     if (!amount || isNaN(amount)) {
//       Alert.alert('Invalid Amount', 'Please enter a valid amount.');
//       return;
//     }

//     setLoading(true);

//     try {
//       // Step 1: Fetch client secret
//       const response = await fetch(
//         'https://taqamu-backend.vercel.app/api/create-payment-intent',
//         {
//           method: 'POST',
//           headers: {'Content-Type': 'application/json'},
//           body: JSON.stringify({
//             amount: parseInt(amount) * 100, // in cents
//           }),
//         },
//       );

//       const {clientSecret} = await response.json();

//       if (!clientSecret) {
//         throw new Error('No client secret received from server.');
//       }

//       // Step 2: Init payment sheet
//       const {error: initError} = await initPaymentSheet({
//         paymentIntentClientSecret: clientSecret,
//         merchantDisplayName: 'Your Organization Name',
//         allowsDelayedPaymentMethods: true,
//         defaultBillingDetails: {
//           name: 'Anonymous Donor',
//         },
//       });

//       if (initError) {
//         throw initError;
//       }

//       // Step 3: Present payment sheet
//       const {error: presentError} = await presentPaymentSheet();

//       if (presentError) {
//         throw presentError;
//       }

//       Alert.alert('Thank You!', 'Donation successful.');
//       navigation.goBack();
//       setAmount('');
//     } catch (error) {
//       Alert.alert('Payment Error', error.message || 'Something went wrong.');
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
//           Donate
//         </Text>
//       </View>

//       <TextInput
//         placeholder="Enter amount"
//         placeholderTextColor="#ccc"
//         style={styles.input}
//         keyboardType="numeric"
//         value={amount}
//         onChangeText={setAmount}
//       />

//       {amount ? (
//         <TouchableOpacity
//           style={[styles.button, loading && {opacity: 0.6}]}
//           onPress={handleDonate}
//           disabled={loading}>
//           <Text style={styles.buttonText}>
//             {loading ? 'Loading...' : 'Get Payment Option'}
//           </Text>
//         </TouchableOpacity>
//       ) : null}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     padding: 20,
//     backgroundColor: '#0f172a',
//     flex: 1,
//   },
//   header: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#fff',
//     flex: 1,
//   },
//   headerTablet: {
//     fontSize: 32,
//   },
//   headerContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 15,
//     marginBottom: 15,
//   },
//   backButton: {
//     marginRight: 15,
//   },
//   input: {
//     backgroundColor: '#fff',
//     padding: 10,
//     borderRadius: 8,
//     marginBottom: 20,
//     fontSize: 16,
//   },
//   button: {
//     backgroundColor: '#f59e0b',
//     padding: 16,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginBottom: 15,
//   },
//   buttonText: {
//     fontWeight: 'bold',
//     fontSize: 16,
//     color: '#0f172a',
//   },
// });

// export default DonateScreen;


import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  Dimensions,
  ScrollView,
} from 'react-native';
import {useStripe} from '@stripe/stripe-react-native';
import {useNavigation} from '@react-navigation/native';

const DonateScreen = ({route}) => {
  const isTablet = Dimensions.get('window').width >= 768;
  const navigation = useNavigation();
  const {initPaymentSheet, presentPaymentSheet} = useStripe();

  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [showInput, setShowInput] = useState(false);

  const handleDonate = async () => {
    if (!amount || isNaN(amount)) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        'https://taqamu-backend.vercel.app/api/create-payment-intent',
        {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            amount: parseInt(amount) * 100,
          }),
        },
      );

      const {clientSecret} = await response.json();
      if (!clientSecret) throw new Error('No client secret received');

      const {error: initError} = await initPaymentSheet({
        paymentIntentClientSecret: clientSecret,
        merchantDisplayName: 'Taqamu',
        allowsDelayedPaymentMethods: true,
        defaultBillingDetails: {
          name: 'Anonymous Donor',
        },
      });

      if (initError) throw initError;

      const {error: presentError} = await presentPaymentSheet();
      if (presentError) throw presentError;

      Alert.alert('Thank You!', 'Your donation has helped someone eat today.');
      navigation.goBack();
      setAmount('');
      setShowInput(false);
    } catch (error) {
      Alert.alert('Payment Error', error.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>❌</Text>
        </TouchableOpacity>
        <Text style={[styles.header, isTablet && styles.headerTablet]}>
          Make a Difference
        </Text>
      </View>

      {/* Section: Campaign Summary */}
      <View style={styles.section}>
        <Text style={styles.title}>🍛 Feed 10 Families Today</Text>
        <Text style={styles.description}>
          Every donation helps us provide warm, nutritious meals to underprivileged families. 
          Even a small amount can make a big difference in someone’s life.
        </Text>
      </View>

      {/* Section: Why this matters */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>💔 The Need is Real</Text>
        <Text style={styles.paragraph}>
          In our community, over 30% of families go to bed hungry. Many children can’t focus in school 
          because their stomachs are empty. With your donation, we ensure they have at least one full meal a day.
        </Text>
      </View>

      {/* Section: Real Story */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🌟 Impact Story</Text>
        <Text style={styles.paragraph}>
          *“Before this program, we barely ate once a day,”* says Ahmed, a father of 4. 
          *“Now, my children smile again. We are truly grateful to the donors who made this possible.”*
        </Text>
      </View>

      {/* Donate Action */}
      {!showInput ? (
        <TouchableOpacity
          style={styles.button}
          onPress={() => setShowInput(true)}>
          <Text style={styles.buttonText}>❤️ I Want to Help</Text>
        </TouchableOpacity>
      ) : (
        <>
          <Text style={styles.inputLabel}>💸 Enter your donation amount (PKR):</Text>
          <TextInput
            placeholder="e.g. 500"
            placeholderTextColor="#ccc"
            style={styles.input}
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />
          <TouchableOpacity
            style={[styles.button, loading && {opacity: 0.6}]}
            onPress={handleDonate}
            disabled={loading}>
            <Text style={styles.buttonText}>
              {loading ? 'Processing...' : 'Donate via Stripe 💳'}
            </Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#0f172a',
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  backButton: {
    marginRight: 15,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
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
  section: {
    marginBottom: 25,
  },
  title: {
    color: '#fbbf24',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    color: '#e2e8f0',
    fontSize: 16,
  },
  sectionTitle: {
    color: '#38bdf8',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  paragraph: {
    color: '#cbd5e1',
    fontSize: 15,
    lineHeight: 22,
  },
  inputLabel: {
    color: '#fff',
    marginBottom: 8,
    fontSize: 16,
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#22c55e',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 25,
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#0f172a',
  },
});

export default DonateScreen;
