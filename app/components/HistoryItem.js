import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS } from '../constants/theme';

export default function HistoryItem({ item, onPress }) {
  const [imageError, setImageError] = useState(false);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'beneficial':
        return { name: 'checkmark-circle', color: COLORS.primary };
      case 'neutral':
        return { name: 'information-circle', color: COLORS.secondaryText };
      case 'harmful':
        return { name: 'close-circle', color: '#D9534F' };
      default:
        return { name: 'information-circle', color: COLORS.secondaryText };
    }
  };

  const statusIcon = getStatusIcon(item.status);

  // Use the image from Supabase storage or fallback to a placeholder
  const imageSource = item.image_url && !imageError
    ? { uri: item.image_url }
    : require('../assets/icon.png'); // Fallback image

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Image 
        source={imageSource} 
        style={styles.image}
        resizeMode="cover"
        onError={handleImageError}
      />
      
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={2}>
          {item.product_name || 'Unknown Product'}
        </Text>
        <Text style={styles.date}>
          {item.formattedDate || 'Unknown Date'}
        </Text>
      </View>
      
      <Ionicons 
        name={statusIcon.name} 
        size={24} 
        color={statusIcon.color} 
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.inputBackground,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    marginHorizontal: SPACING.lg,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: RADIUS.md,
    marginRight: SPACING.md,
  },
  content: {
    flex: 1,
  },
  name: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  date: {
    color: COLORS.secondaryText,
    fontSize: 14,
  },
});
