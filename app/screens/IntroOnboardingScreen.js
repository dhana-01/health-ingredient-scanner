import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, Image } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import StyledButton from '../components/StyledButton';
import { COLORS, SPACING } from '../constants/theme';
import { supabase } from '../lib/supabase';

const { width } = Dimensions.get('window');

export default function IntroOnboardingScreen({ navigation }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollViewRef = useRef(null);

  const slides = [
    {
      id: 1,
      title: 'Scan your food instantly',
      description: 'Discover a smarter way to understand your food. Ingredia helps you make informed choices effortlessly.',
      image: require('../assets/splash-icon.png'),
    },
    {
      id: 2,
      title: 'Get ingredient insights',
      description: 'AI-powered analysis reveals hidden ingredients, nutritional values, and potential allergens in your food.',
      image: require('../assets/icon.png'),
    },
    {
      id: 3,
      title: 'Shop smarter, live healthier',
      description: 'Make better grocery choices with personalized recommendations based on your dietary preferences and goals.',
      image: require('../assets/adaptive-icon.png'),
    },
  ];

  const handleScroll = (event) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentSlide(slideIndex);
  };

  const handleGetStarted = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;
    if (!userId) return;
    await supabase
      .from('profiles')
      .update({ has_completed_onboarding: true })
      .eq('id', userId);
    // Let AppNavigator react to the state change via onAuthStateChange/profile fetch
  };

  return (
    <ScreenContainer>
      <View style={styles.content}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          style={styles.scrollView}
        >
          {slides.map((slide, index) => (
            <View key={slide.id} style={styles.slide}>
              <Image source={slide.image} style={styles.image} />
              <Text style={styles.title}>{slide.title}</Text>
              <Text style={styles.description}>{slide.description}</Text>
            </View>
          ))}
        </ScrollView>

        <View style={styles.pagination}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                index === currentSlide && styles.paginationDotActive,
              ]}
            />
          ))}
        </View>

        <View style={styles.buttonContainer}>
          <StyledButton
            title="Get Started"
            variant="primary"
            onPress={handleGetStarted}
          />
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    width: '100%',
  },
  scrollView: {
    flex: 1,
  },
  slide: {
    width,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.lg,
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginBottom: SPACING.xl,
  },
  title: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  description: {
    color: COLORS.text,
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: SPACING.md,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: SPACING.lg,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#666',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: COLORS.primary,
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  buttonContainer: {
    marginBottom: SPACING.lg,
  },
});
