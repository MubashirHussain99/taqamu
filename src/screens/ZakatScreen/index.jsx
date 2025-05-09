import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  View,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions,
} from 'react-native';
import ZakatInfoScreen from '../../components/dashboard/ZakatInfoScreen';

const ZakatScreen = () => {
  const isTablet = Dimensions.get('window').width >= 768;
  const navigation = useNavigation();
  // State for all input values
  const [inputs, setInputs] = useState({
    gold: '',
    silver: '',
    cash: '',
    investments: '',
    businessAssets: '',
    debts: '',
    nisabMethod: 'gold', // 'gold' or 'silver'
  });

  // Zakat rates and nisab values
  const zakatRates = {
    goldRate: 230000, // Current gold rate per tola (update this)
    silverRate: 2600, // Current silver rate per tola (update this)
    goldNisab: 7.5, // 7.5 tola gold
    silverNisab: 52.5, // 52.5 tola silver
    zakatPercentage: 2.5, // 2.5%
  };

  // Handle input changes
  const handleInputChange = (name, value) => {
    // Remove non-numeric characters except decimal point
    const numericValue = value.replace(/[^0-9.]/g, '');
    setInputs({
      ...inputs,
      [name]: numericValue,
    });
  };

  // Calculate total wealth
  const calculateTotalWealth = () => {
    const {gold, silver, cash, investments, businessAssets, debts} = inputs;

    const totalAssets =
      parseFloat(gold || 0) * zakatRates.goldRate +
      parseFloat(silver || 0) * zakatRates.silverRate +
      parseFloat(cash || 0) +
      parseFloat(investments || 0) +
      parseFloat(businessAssets || 0);

    const totalDebts = parseFloat(debts || 0);
    return Math.max(0, totalAssets - totalDebts);
  };

  // Check if wealth meets nisab
  const meetsNisab = () => {
    const totalWealth = calculateTotalWealth();
    const {goldNisab, silverNisab, goldRate, silverRate} = zakatRates;

    if (inputs.nisabMethod === 'gold') {
      return totalWealth >= goldNisab * goldRate;
    } else {
      return totalWealth >= silverNisab * silverRate;
    }
  };

  // Calculate zakat amount
  const calculateZakat = () => {
    if (!meetsNisab()) return 0;
    return (calculateTotalWealth() * zakatRates.zakatPercentage) / 100;
  };

  // Format currency
  const formatCurrency = amount => {
    return amount.toLocaleString('en-PK', {
      style: 'currency',
      currency: 'PKR',
      maximumFractionDigits: 0,
    });
  };

  // Handle calculate button press
  const handleCalculate = () => {
    if (!calculateTotalWealth()) {
      Alert.alert('Error', 'Please enter at least one asset value');
      return;
    }

    const zakatAmount = calculateZakat();
    const nisabMet = meetsNisab();

    Alert.alert(
      'Zakat Calculation',
      `Total Wealth: ${formatCurrency(calculateTotalWealth())}\n` +
        `Meets Nisab: ${nisabMet ? 'Yes' : 'No'}\n` +
        (nisabMet
          ? `Zakat Due: ${formatCurrency(zakatAmount)}`
          : 'You are not required to pay Zakat as your wealth does not meet the Nisab threshold.'),
      [
        {text: 'OK', onPress: () => console.log('OK Pressed')},
        {text: 'Learn More', onPress: () => navigation.navigate('ZakatInfo')},
      ],
    );
  };

  // Input field component
  const InputField = ({label, name, placeholder}) => (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={inputs[name]}
        onChangeText={text => handleInputChange(name, text)}
        keyboardType="numeric"
        placeholderTextColor="#999"
      />
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Text style={{fontSize: 16, fontWeight: '600', color: '#fff'}}>
            ❌
          </Text>
        </TouchableOpacity>
        <Text style={[styles.header, isTablet && styles.headerTablet]}>
          Zakat
        </Text>
      </View>
      <ZakatInfoScreen />
      
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#0f172a',
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
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3498db',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 5,
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    color: '#2c3e50',
  },
  radioContainer: {
    marginBottom: 15,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#3498db',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  selectedRb: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#3498db',
  },
  radioText: {
    fontSize: 16,
    color: '#2c3e50',
  },
  nisabInfo: {
    fontSize: 14,
    color: '#27ae60',
    fontStyle: 'italic',
    marginTop: 5,
  },
  calculateButton: {
    backgroundColor: '#27ae60',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 15,
  },
  calculateButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoButton: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  infoButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ZakatScreen;
