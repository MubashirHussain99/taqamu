import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import ProgressBar from 'react-native-progress/Bar';

const CharityCampaign = ({
  title,
  fundedPercentage,
  imagePath,
  variant = 'card',
  onDonate,
}) => {

  const renderImage = (size) => (
    imagePath ? (
      <Image
        source={{ uri: imagePath }}
        style={{ width: size, height: size, borderRadius: 8 }}
        resizeMode="cover"
      />
    ) : (
      <View style={[styles.placeholder, { width: size, height: size, borderRadius: 8 }]}>
        <Text style={styles.heartIcon}>❤️</Text>
      </View>
    )
  );

  const renderCompact = () => (
    <View style={styles.compactContainer}>
      <View style={styles.row}>
        {renderImage(40)}
        <View style={styles.flexGrow}>
          <Text style={styles.titleSmall}>{title}</Text>
          <View style={styles.progressBar}>
            <ProgressBar progress={fundedPercentage / 100} width={null} height={4} color="#f59e0b" />
          </View>
          <Text style={styles.fundedTextSmall}>{fundedPercentage}% funded</Text>
        </View>
      </View>
    </View>
  );

  const renderFull = () => (
    <View style={styles.fullContainer}>
      <View style={styles.rowBetween}>
        <View style={styles.row}>
          {renderImage(56)}
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.fundedText}>{fundedPercentage}% funded</Text>
            <View style={{ marginTop: 6 }}>
              <ProgressBar progress={fundedPercentage / 100} width={200} height={4} color="#f59e0b" />
            </View>
          </View>
        </View>
        {onDonate && (
          <TouchableOpacity onPress={onDonate} style={styles.donateButton}>
            <Text style={styles.donateButtonText}>Donate</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderCard = () => (
    <View style={styles.cardContainer}>
      {renderImage(100)}
      <View style={styles.cardContent}>
        <Text style={styles.titleSmall}>{title}</Text>
        <View style={styles.progressBar}>
          <ProgressBar progress={fundedPercentage / 100} width={null} height={4} color="#f59e0b" />
        </View>
        <View style={styles.rowBetween}>
          <Text style={styles.fundedTextSmall}>{fundedPercentage}% funded</Text>
          {onDonate && (
            <TouchableOpacity onPress={onDonate}>
              <Text style={styles.donateLink}>Donate</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );

  if (variant === 'compact') return renderCompact();
  if (variant === 'full') return renderFull();
  return renderCard();
};

const styles = StyleSheet.create({
  compactContainer: {
    backgroundColor: '#1e293b',
    borderColor: '#334155',
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    width: '50%',
  },
  fullContainer: {
    backgroundColor: '#1e293b',
    borderColor: '#334155',
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 10
  },
  cardContainer: {
    backgroundColor: '#1e293b',
    borderColor: '#334155',
    borderWidth: 1,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 10
  },
  cardContent: {
    padding: 12
  },
  placeholder: {
    backgroundColor: '#334155',
    justifyContent: 'center',
    alignItems: 'center'
  },
  heartIcon: {
    fontSize: 20,
    color: '#f59e0b'
  },
  title: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  },
  titleSmall: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500'
  },
  fundedText: {
    color: '#cbd5e1',
    fontSize: 12,
    marginTop: 4
  },
  fundedTextSmall: {
    color: '#94a3b8',
    fontSize: 11,
    marginTop: 4
  },
  progressBar: {
    marginTop: 4
  },
  donateButton: {
    backgroundColor: '#f59e0b',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8
  },
  donateButtonText: {
    color: '#0f172a',
    fontSize: 14,
    fontWeight: '500'
  },
  donateLink: {
    color: '#f59e0b',
    fontSize: 12,
    fontWeight: '500'
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  flexGrow: {
    flex: 1,
    marginLeft: 12
  }
});

export default CharityCampaign;
