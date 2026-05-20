import React from 'react';
import {View, Text, StyleSheet, Linking, TouchableOpacity} from 'react-native';

const ZakatInfoContent = () => {
  return (
    <View style={styles.infoSection}>
      <Text style={styles.sectionTitle}>What is Zakat?</Text>
      <Text style={styles.text}>
        Zakat is the third pillar of Islam and an obligatory act of worship. It
        requires Muslims to donate a portion of their wealth to those in need.
      </Text>

      <Text style={styles.sectionTitle}>Zakat Rules</Text>
      <Text style={styles.text}>
        • You must pay Zakat if your wealth exceeds the Nisab threshold for one
        lunar year
        {'\n'}• The current rate is 2.5% of your total eligible wealth
        {'\n'}• Zakat is payable on gold, silver, cash, investments, and
        business assets
        {'\n'}• Debts can be deducted from your total wealth
      </Text>

      <Text style={styles.sectionTitle}>Who Receives Zakat?</Text>
      <Text style={styles.text}>
        Zakat can be given to 8 categories of people mentioned in the Quran
        (9:60):
        {'\n'}1. The poor
        {'\n'}2. The needy
        {'\n'}3. Those employed to administer Zakat
        {'\n'}4. Those whose hearts are to be reconciled
        {'\n'}5. Those in bondage
        {'\n'}6. The debt-ridden
        {'\n'}7. In the cause of Allah
        {'\n'}8. The wayfarer
      </Text>

      <TouchableOpacity
        style={styles.linkButton}
        onPress={() => Linking.openURL('https://islamic-relief.org/zakat/')}>
        <Text style={styles.linkText}>Learn More About Zakat</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  infoSection: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#a7f3d0',
    marginTop: 16,
    marginBottom: 8,
  },
  text: {
    fontSize: 15,
    lineHeight: 22,
    color: '#cbd5e1',
  },
  linkButton: {
    marginTop: 20,
    padding: 14,
    backgroundColor: '#10b981',
    borderRadius: 10,
    alignItems: 'center',
  },
  linkText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ZakatInfoContent;
