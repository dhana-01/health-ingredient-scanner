import React from 'react';
import { TouchableOpacity, View, Image, Text, StyleSheet } from 'react-native';

const CARD_RADIUS = 16;

const ScanCard = ({
  imageSource,
  productName,
  timestamp,
  healthScore,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.9} onPress={onPress}>
      <Image
        source={imageSource}
        style={styles.image}
        resizeMode="cover"
      />

      <View style={styles.content}>
        <Text style={styles.productName} numberOfLines={2}>
          {productName}
        </Text>

        <Text style={styles.timestamp}>{timestamp}</Text>

        <View style={styles.healthScoreContainer}>
          <Text style={styles.healthScoreNumber}>{healthScore}</Text>
          <Text style={styles.healthScoreLabel}>Health Score</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#2C2C2E',
    borderRadius: CARD_RADIUS,
    marginRight: 12,
    marginBottom: 12,
    width: 180,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: CARD_RADIUS,
    borderTopRightRadius: CARD_RADIUS,
  },
  content: {
    padding: 12,
  },
  productName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  timestamp: {
    color: '#A9A9A9',
    fontSize: 12,
  },
  healthScoreContainer: {
    backgroundColor: '#1C1C1E',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  healthScoreNumber: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 22,
  },
  healthScoreLabel: {
    color: '#FFFFFF',
    fontSize: 10,
    marginTop: 2,
  },
});

export default ScanCard;
