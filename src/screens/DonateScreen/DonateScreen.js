// import React, {useState} from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TextInput,
//   TouchableOpacity,
//   Alert,
// } from 'react-native';
// import {CardField, CardForm, useStripe} from '@stripe/stripe-react-native';

// const DonateScreen = ({route}) => {
//   const title = route?.params?.title ?? 'Donation';
//   const {confirmPayment} = useStripe();

//   const [amount, setAmount] = useState('');
//   const [cardDetails, setCardDetails] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const fetchPaymentIntentClientSecret = async () => {
//     // Replace this with your backend endpoint
//     const response = await fetch(
//       'http://192.168.18.52:5000/create-payment-intent',
//       {
//         method: 'POST',
//         headers: {'Content-Type': 'application/json'},
//         body: JSON.stringify({
//           amount: parseInt(amount) * 100, // Stripe needs amount in paise or cents
//         }),
//       },
//     );

//     const {clientSecret} = await response.json();
//     return clientSecret;
//   };

//   const handleDonate = async () => {
//     if (!amount || isNaN(amount)) {
//       Alert.alert('Invalid Amount', 'Please enter a valid amount.');
//       return;
//     }

//     if (!cardDetails?.complete) {
//       Alert.alert('Incomplete Card', 'Please enter complete card details.');
//       return;
//     }

//     setLoading(true);

//     try {
//       const clientSecret = await fetchPaymentIntentClientSecret();

//       const {paymentIntent, error} = await confirmPayment(clientSecret, {
//         paymentMethodType: 'Card',
//       });

//       if (error) {
//         Alert.alert('Payment failed', error.message);
//       } else if (paymentIntent) {
//         Alert.alert('Thank You!', 'Donation successful.');
//         setAmount('');
//       }
//     } catch (e) {
//       Alert.alert('Error', 'Payment process failed.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>Donate to: {title}</Text>

//       <TextInput
//         placeholder="Enter amount"
//         placeholderTextColor="#ccc"
//         style={styles.input}
//         keyboardType="numeric"
//         value={amount}
//         onChangeText={setAmount}
//       />

//       {/* <CardForm
//         onFormComplete={card => setCardDetails(card)}
//         style={styles.cardForm}
//       /> */}
//       {/* <CardField
//         postalCodeEnabled={false}
//         style={styles.cardField}
//         // cardStyle={{
//         //   backgroundColor: '#000',
//         //   textColor: '#fff',
//         //   placeholderColor: '#ccc',
//         // }}
//         onCardChange={card => setCardDetails(card)}
//       /> */}
//       <View style={styles.cardContainer}>
//         <CardField
//           postalCodeEnabled={false}
//           style={styles.cardField}
//           cardStyle={{
//             textColor: '#fff',
//             placeholderColor: '#888',
//             borderRadius: 8,
//           }}
//           onCardChange={cardDetails => {
//             setCardDetails(cardDetails);
//           }}
//         />
//       </View>

//       <TouchableOpacity
//         style={[styles.button, loading && {opacity: 0.6}]}
//         onPress={handleDonate}
//         disabled={loading}>
//         <Text style={styles.buttonText}>
//           {loading ? 'Processing...' : 'Donate'}
//         </Text>
//       </TouchableOpacity>
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
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: '#fff',
//     marginBottom: 20,
//   },
//   input: {
//     backgroundColor: '#fff',
//     padding: 10,
//     borderRadius: 8,
//     marginBottom: 20,
//     fontSize: 16,
//   },
//   //   cardField: {
//   //     height: 50,
//   //     marginVertical: 20,
//   //     borderWidth: 1,
//   //     borderColor: '#ccc',
//   //     borderRadius: 8,
//   //     backgroundColor: '#fff',
//   //   },
//   cardContainer: {
//     backgroundColor: '#222',
//     padding: 10,
//     borderRadius: 10,
//   },
//   cardField: {
//     height: 50,
//   },
//   button: {
//     backgroundColor: '#f59e0b',
//     padding: 16,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   buttonText: {
//     fontWeight: 'bold',
//     fontSize: 16,
//     color: '#0f172a',
//   },
// });

// export default DonateScreen;

import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import {useStripe} from '@stripe/stripe-react-native';
import {useNavigation} from '@react-navigation/native';

const DonateScreen = ({route}) => {
  const isTablet = Dimensions.get('window').width >= 768;
  const navigation = useNavigation();
  const title = route?.params?.title ?? 'Donation';
  const {initPaymentSheet, presentPaymentSheet} = useStripe();

  const [amount, setAmount] = useState('');
  const [clientSecret, setClientSecret] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch client secret from backend
  const fetchPaymentIntentClientSecret = async () => {
    try {
      const response = await fetch(
        'https://taqamu-backend.vercel.app/api/create-payment-intent',
        {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            amount: parseInt(amount) * 100, // Convert to cents
          }),
        },
      );

      const {clientSecret} = await response.json();
      setClientSecret(clientSecret);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch payment intent');
    }
  };

  // Initialize Payment Sheet
  const setupPaymentSheet = async () => {
    if (!clientSecret) return;

    const {error} = await initPaymentSheet({
      paymentIntentClientSecret: clientSecret,
      merchantDisplayName: 'Your Organization Name',
      allowsDelayedPaymentMethods: true,
      defaultBillingDetails: {
        name: 'Anonymous Donor',
      },
    });

    if (error) {
      Alert.alert('Payment Error', error.message);
    }
  };

  useEffect(() => {
    if (clientSecret) {
      setupPaymentSheet();
    }
  }, [clientSecret]);

  const handleDonate = async () => {
    if (!amount || isNaN(amount)) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount.');
      return;
    }

    setLoading(true);
    await fetchPaymentIntentClientSecret();
    setLoading(false);
  };

  const openStripePaymentSheet = async () => {
    if (!clientSecret) {
      Alert.alert('No Payment Found', 'Please enter an amount first.');
      return;
    }

    const {error} = await presentPaymentSheet();

    if (error) {
      Alert.alert(`Error`, error.message);
    } else {
      Alert.alert('Thank You!', 'Donation successful.');
      navigation.goBack()
      setAmount('');
      setClientSecret(null);
    }
  };

  return (
    <View style={styles.container}>
      {/* <Text style={styles.header}>Donate to: {title}</Text> */}
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Text style={{fontSize: 16, fontWeight: '600', color: '#fff'}}>
            ❌
          </Text>
        </TouchableOpacity>
        <Text style={[styles.header, isTablet && styles.headerTablet]}>
          Donate
        </Text>
      </View>
      <TextInput
        placeholder="Enter amount"
        placeholderTextColor="#ccc"
        style={styles.input}
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />

      {/* Show Pay Button Only After Entering Amount */}
      {amount && !clientSecret ? (
        <TouchableOpacity
          style={[styles.button, loading && {opacity: 0.6}]}
          onPress={handleDonate}
          disabled={loading}>
          <Text style={styles.buttonText}>
            {loading ? 'Loading...' : 'Get Payment Option'}
          </Text>
        </TouchableOpacity>
      ) : null}

      {/* Stripe Payment Button */}
      {clientSecret && (
        <TouchableOpacity
          style={styles.stripeButton}
          onPress={openStripePaymentSheet}
          disabled={loading}>
          <Text style={styles.stripeButtonText}>💳 Pay with Stripe</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#0f172a',
    flex: 1,
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
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  backButton: {
    marginRight: 15,
  },
  input: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#f59e0b',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#0f172a',
  },
  stripeButton: {
    backgroundColor: '#0570de',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  stripeButtonText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#fff',
  },
});

export default DonateScreen;
