import React, { useEffect, useRef } from 'react';
import { View, Image, Text, StyleSheet, Animated } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import { COLORS, SPACING } from '../constants/theme';

export default function SplashScreen() {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const progressWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '50%'],
  });

  return (
    <ScreenContainer style={styles.screen}>
      <View style={styles.content}>
        <Image
          source={require('../assets/logo.png')}
          style={styles.logo}
        />
        <Text style={styles.title}>INGREDIA</Text>
        <Text style={styles.tagline}>Scan Smart, Eat Healthy</Text>
      </View>

      <View style={styles.progressBarContainer}>
        <View style={styles.progressBarTrack}>
          <Animated.View style={[styles.progressBarFill, { width: progressWidth }]} />
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  screen: {
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
    marginBottom: SPACING.md,
  },
  title: {
    color: COLORS.text,
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 6,
  },
  tagline: {
    color: COLORS.secondaryText,
    fontSize: 14,
  },
  progressBarContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  progressBarTrack: {
    width: '40%',
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.inputBackground,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
  },
});
