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
  SafeAreaView,
} from 'react-native';
import ZakatInfoContent from '../../components/dashboard/ZakatInfoScreen';
import {APP_BACKGROUND} from '../../styles/screenStyles';

const ZakatScreen = () => {
  const isTablet = Dimensions.get('window').width >= 768;
  const navigation = useNavigation();

  const [inputs, setInputs] = useState({
    gold: '',
    silver: '',
    cash: '',
    investments: '',
    businessAssets: '',
    debts: '',
    nisabMethod: 'gold',
  });

  const zakatRates = {
    goldRate: 230000,
    silverRate: 2600,
    goldNisab: 7.5,
    silverNisab: 52.5,
    zakatPercentage: 2.5,
  };

  const handleInputChange = (name, value) => {
    const numericValue = value.replace(/[^0-9.]/g, '');
    setInputs(prev => ({...prev, [name]: numericValue}));
  };

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

  const meetsNisab = () => {
    const totalWealth = calculateTotalWealth();
    const {goldNisab, silverNisab, goldRate, silverRate} = zakatRates;

    if (inputs.nisabMethod === 'gold') {
      return totalWealth >= goldNisab * goldRate;
    }
    return totalWealth >= silverNisab * silverRate;
  };

  const calculateZakat = () => {
    if (!meetsNisab()) return 0;
    return (calculateTotalWealth() * zakatRates.zakatPercentage) / 100;
  };

  const formatCurrency = amount => {
    return amount.toLocaleString('en-PK', {
      style: 'currency',
      currency: 'PKR',
      maximumFractionDigits: 0,
    });
  };

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
      [{text: 'OK'}],
    );
  };

  const InputField = ({label, name, placeholder}) => (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={inputs[name]}
        onChangeText={text => handleInputChange(name, text)}
        keyboardType="numeric"
        placeholderTextColor="#64748b"
      />
    </View>
  );

  const nisabThreshold =
    inputs.nisabMethod === 'gold'
      ? formatCurrency(zakatRates.goldNisab * zakatRates.goldRate)
      : formatCurrency(zakatRates.silverNisab * zakatRates.silverRate);

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
          <Text style={[styles.headerText, isTablet && styles.headerTextTablet]}>
            Zakat Calculator
          </Text>
          <Text style={styles.headerSubtitle}>
            2.5% on eligible wealth above Nisab
          </Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}>
        <View style={[styles.card, isTablet && styles.cardTablet]}>
          <Text style={styles.cardTitle}>Your Assets</Text>
          <InputField
            label="Gold (tola)"
            name="gold"
            placeholder="e.g. 10"
          />
          <InputField
            label="Silver (tola)"
            name="silver"
            placeholder="e.g. 50"
          />
          <InputField
            label="Cash (PKR)"
            name="cash"
            placeholder="e.g. 500000"
          />
          <InputField
            label="Investments (PKR)"
            name="investments"
            placeholder="e.g. 200000"
          />
          <InputField
            label="Business Assets (PKR)"
            name="businessAssets"
            placeholder="e.g. 100000"
          />
          <InputField
            label="Debts to Deduct (PKR)"
            name="debts"
            placeholder="e.g. 50000"
          />
        </View>

        <View style={[styles.card, isTablet && styles.cardTablet]}>
          <Text style={styles.cardTitle}>Nisab Method</Text>
          <View style={styles.radioContainer}>
            {['gold', 'silver'].map(method => (
              <TouchableOpacity
                key={method}
                style={styles.radioButton}
                onPress={() =>
                  setInputs(prev => ({...prev, nisabMethod: method}))
                }>
                <View style={styles.radioCircle}>
                  {inputs.nisabMethod === method && (
                    <View style={styles.selectedRb} />
                  )}
                </View>
                <Text style={styles.radioText}>
                  {method === 'gold' ? 'Gold Nisab (7.5 tola)' : 'Silver Nisab (52.5 tola)'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.nisabInfo}>
            Current threshold: {nisabThreshold}
          </Text>
        </View>

        <TouchableOpacity style={styles.calculateButton} onPress={handleCalculate}>
          <Text style={styles.calculateButtonText}>Calculate Zakat</Text>
        </TouchableOpacity>

        <View style={[styles.card, isTablet && styles.cardTablet]}>
          <Text style={styles.cardTitle}>About Zakat</Text>
          <ZakatInfoContent />
        </View>
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
  scrollContainer: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: '#0d4236',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  cardTablet: {
    padding: 20,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#a7f3d0',
    marginBottom: 14,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(167, 243, 208, 0.2)',
  },
  inputContainer: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#f8fafc',
    backgroundColor: 'rgba(15, 23, 42, 0.35)',
  },
  radioContainer: {
    marginBottom: 8,
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
    borderColor: '#10b981',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  selectedRb: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#10b981',
  },
  radioText: {
    fontSize: 15,
    color: '#e2e8f0',
  },
  nisabInfo: {
    fontSize: 14,
    color: '#6ee7b7',
    fontStyle: 'italic',
    marginTop: 4,
  },
  calculateButton: {
    backgroundColor: '#10b981',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 12,
  },
  calculateButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
});

export default ZakatScreen;
