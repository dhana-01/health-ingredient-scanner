import React, { useState } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import StyledTextInput from '../components/StyledTextInput';
import StyledButton from '../components/StyledButton';
import SocialButton from '../components/SocialButton';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import ScreenContainer from '../components/ScreenContainer';
import { supabase } from '../lib/supabase';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        Alert.alert('Error', error.message);
      } else {
        Alert.alert('Success', 'Logged in successfully!');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
    }
  };

  return (
    <ScreenContainer>
      <ScrollView 
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <StyledTextInput
          label="Email"
          placeholder="name@example.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <StyledTextInput
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        
        <StyledButton 
          title="Login" 
          variant="primary" 
          onPress={handleLogin} 
        />
        
        <View style={styles.divider} />
        
        <SocialButton 
          title="Continue with Google" 
          activeOpacity={0.8}
        />
        <SocialButton 
          title="Continue with Apple" 
          activeOpacity={0.8}
        />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xl * 2, // Extra padding for bottom nav
  },
  divider: {
    height: SPACING.lg,
  },
});


