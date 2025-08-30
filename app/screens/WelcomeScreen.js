import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import StyledButton from '../components/StyledButton';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import ScreenContainer from '../components/ScreenContainer';

export default function WelcomeScreen({ navigation }) {
  return (
    <ScreenContainer>
      <View style={styles.contentContainer}>
        <Image source={require('../assets/logo_wel.png')} style={styles.logo} />
        <Text style={styles.subtitle}>Welcome to Ingredia</Text>
        <Text style={styles.title}>Your Culinary{"\n"}Journey Begins{"\n"}Here</Text>
        <View style={styles.circle}>
          <Image source={require('../assets/welcome_image.png')} style={styles.circleImage} />
        </View>
        <View style={styles.buttons}>
          <StyledButton title="Login" variant="secondary" onPress={() => navigation.navigate('Login')} />
          <View style={styles.buttonSpacer} />
          <StyledButton title="Sign Up" variant="primary" onPress={() => navigation.navigate('SignUp')} />
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    alignItems: 'center',
    padding: SPACING.lg,
  },
  logo: {
    width: 80,
    height: 80,
    marginTop: SPACING.lg,
    marginBottom: SPACING.md,
    resizeMode: 'contain',
  },
  subtitle: {
    color: COLORS.primary,
    marginBottom: SPACING.sm,
  },
  title: {
    color: COLORS.text,
    textAlign: 'center',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: SPACING.lg,
  },
  circle: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#ffffff10',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  circleImage: {
    width: 180,
    height: 180,
    borderRadius: 90,
    resizeMode: 'contain',
  },
  buttons: {
    width: '100%',
    marginTop: SPACING.md,
  },
  buttonSpacer: {
    height: SPACING.md,
  },
});


