import React, { useState } from 'react';
import { ScrollView, Text, StyleSheet, TouchableOpacity } from 'react-native';

const ZakatInfoScreen = () => {
  const [showMore, setShowMore] = useState(false);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>About Zakat</Text>
      
      <Text style={styles.sectionTitle}>What is Zakat?</Text>
      <Text style={styles.text}>
        Zakat is the third pillar of Islam and an obligatory act of worship. It requires Muslims to donate a portion of their wealth to those in need.
      </Text>
      
      <Text style={styles.sectionTitle}>Zakat Rules</Text>
      <Text style={styles.text}>
        • You must pay Zakat if your wealth exceeds the Nisab threshold for one lunar year
        {'\n'}• The current rate is 2.5% of your total eligible wealth
        {'\n'}• Zakat is payable on gold, silver, cash, investments, and business assets
        {'\n'}• Debts can be deducted from your total wealth
      </Text>
      
      <Text style={styles.sectionTitle}>Who Receives Zakat?</Text>
      <Text style={styles.text}>
        Zakat can be given to 8 categories of people mentioned in the Quran (9:60):
        {'\n'}1. The poor
        {'\n'}2. The needy
        {'\n'}3. Those employed to administer Zakat
        {'\n'}4. Those whose hearts are to be reconciled
        {'\n'}5. Those in bondage
        {'\n'}6. The debt-ridden
        {'\n'}7. In the cause of Allah
        {'\n'}8. The wayfarer
      </Text>

      {/* Button to toggle more details */}
      <TouchableOpacity 
        style={styles.linkButton}
        onPress={() => setShowMore(!showMore)}
      >
        <Text style={styles.linkText}>
          {showMore ? 'Hide Details' : 'Learn More About Zakat'}
        </Text>
      </TouchableOpacity>

      {/* Conditional rendering of detailed content */}
      {showMore && (
        <Text style={styles.text}>
          {'\n'}Zakat is not just a charity—it’s a means of redistributing wealth and maintaining social justice.
          {'\n\n'}📌 **Key Additional Details:**
          {'\n'}• Nisab is roughly equal to the value of 87.48 grams of gold or 612.36 grams of silver.
          {'\n'}• Zakat is calculated after subtracting immediate debts and essential needs.
          {'\n'}• You can give Zakat directly to recipients or through trusted organizations.
          {'\n\n'}💡 Tip: Keep a Zakat journal to track your assets, liabilities, and annual due dates.
        </Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#0f172a',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ccc',
    marginTop: 15,
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    color: '#ccc',
    marginBottom: 10,
  },
  linkButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#27ae60',
    borderRadius: 5,
    alignItems: 'center',
  },
  linkText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ZakatInfoScreen;
