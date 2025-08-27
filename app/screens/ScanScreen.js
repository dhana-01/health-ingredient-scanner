import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/theme';

export default function ScanScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Scan Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: 'bold',
  },
});
