import React, {useState} from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import RandomAyahOfTheDay from './RandomAyahOfTheDay';
import HadithOfTheDay from './HadithOfTheDaym';
import {useNavigation} from '@react-navigation/native';

const {width} = Dimensions.get('window');
const isTablet = width >= 768;

const Charity = ({
  visible,
  onClose,
  hadithText,
  narrator,
  source,
  variant,
  onShare,
}) => {
  const navigation = useNavigation();
  const charityCampaigns = [
    {id: 1, title: 'Feed 10 families', fundedPercentage: 42},
    {id: 2, title: 'Feed 10 families', fundedPercentage: 75},
    {id: 3, title: 'Feed 10 families', fundedPercentage: 26},
  ];

  const handleDonate = id => {
    console.log(`Donate to campaign ${id}`);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <View style={styles.container}>
        {/* BACK BUTTON (You can implement your own) */}
        {/* <View style={styles.header}>
          <Text style={styles.headerText}>Charity</Text>
        </View> */}
        <View style={styles.headerContainer}>
          <TouchableOpacity style={styles.backButton} onPress={onClose}>
            <Text style={{fontSize: 16, fontWeight: '600', color: '#fff'}}>
              ❌
            </Text>
          </TouchableOpacity>
          <Text style={[styles.header, isTablet && styles.headerTablet]}>
            Charity
          </Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Ayah of the Day */}
          <View style={styles.section}>
            <Text style={styles.title}>Ayah Of The Day</Text>
            <View style={styles.card}>
              <RandomAyahOfTheDay variant="dark" />
            </View>
          </View>

          {/* Support a Cause */}
          <View style={styles.section}>
            <Text style={styles.title}>Support a cause</Text>

            <View style={styles.card}>
              <Text style={styles.campaignTitle}>
                {charityCampaigns[0].title}
              </Text>
              <Text style={styles.campaignInfo}>
                {charityCampaigns[0].fundedPercentage}% funded
              </Text>
              <TouchableOpacity
                style={styles.donateButton}
                onPress={() => handleDonate(charityCampaigns[0].id)}>
                <Text style={styles.donateButtonText}>Donate</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.grid}>
              {charityCampaigns.slice(1).map(campaign => (
                <View key={campaign.id} style={styles.cardSmall}>
                  <Text style={styles.campaignTitle}>{campaign.title}</Text>
                  <Text style={styles.campaignInfo}>
                    {campaign.fundedPercentage}% funded
                  </Text>
                  <TouchableOpacity
                    style={styles.donateButtonSmall}
                    onPress={() => handleDonate(campaign.id)}>
                    <Text style={styles.donateButtonTextSmall}>Donate</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>

          {/* Hadith of the Day */}
          <View style={styles.section}>
            <Text style={styles.title}>Hadith Of The Day</Text>
            <View style={styles.card}>
              <Text style={styles.cardText}>
                <HadithOfTheDay
                  hadithText={hadithText}
                  narrator={narrator}
                  source={source}
                  variant={variant}
                  onShare={onShare}
                />
              </Text>
            </View>
          </View>

          {/* Questions & Guidance */}
          <View style={styles.section}>
            <Text style={styles.title}>Questions & Guidance</Text>
            <View style={styles.grid}>
              {[1, 2].map(item => (
                <View key={item} style={styles.guidanceBox}>
                  <Text style={styles.guidanceText}>How to perform</Text>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  //   header: {
  //     padding: 16,
  //     borderBottomWidth: 1,
  //     borderColor: '#1e293b',
  //   },
  //   headerText: {
  //     fontSize: isTablet ? 24 : 18,
  //     fontWeight: '600',
  //     color: '#fff',
  //   },
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
  scrollContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 24,
  },
  title: {
    fontSize: isTablet ? 20 : 16,
    color: '#fff',
    marginBottom: 12,
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  cardSmall: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 12,
    width: '48%',
    marginBottom: 12,
  },
  cardText: {
    color: '#fff',
    fontSize: isTablet ? 16 : 14,
  },
  campaignTitle: {
    color: '#fff',
    fontSize: isTablet ? 16 : 14,
    fontWeight: '600',
  },
  campaignInfo: {
    color: '#f59e0b',
    fontSize: isTablet ? 14 : 12,
    marginVertical: 4,
  },
  donateButton: {
    backgroundColor: '#f59e0b',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 20,
    alignSelf: 'flex-start',
  },
  donateButtonSmall: {
    backgroundColor: '#f59e0b',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  donateButtonText: {
    color: '#000',
    fontWeight: '600',
  },
  donateButtonTextSmall: {
    color: '#000',
    fontSize: 12,
    fontWeight: '600',
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  guidanceBox: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    width: '48%',
    alignItems: 'center',
    marginBottom: 12,
  },
  guidanceText: {
    color: '#fff',
    fontSize: isTablet ? 14 : 12,
    textAlign: 'center',
  },
});

export default Charity;
